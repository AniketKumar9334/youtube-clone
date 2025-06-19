const AWS = require("aws-sdk");
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const FormData = require("form-data");
require("dotenv").config();
// Configure AWS SDK

AWS.config.update({
  region: "ap-south-1",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const sqs = new AWS.SQS();
const s3 = new AWS.S3();

const queueUrl = process.env.QUE_URL;
const bucketName = process.env.BUCKET_NAME;

const receiveMessage = async () => {
  const params = {
    QueueUrl: queueUrl,
    MaxNumberOfMessages: 1,
    WaitTimeSeconds: 20,
  };

  while (true) {
    try {
      const data = await sqs.receiveMessage(params).promise();
      if (data.Messages) {
        for (const message of data.Messages) {
          const { MessageId, Body } = message;
          

          if (Body) {
            const event = JSON.parse(Body);
            if ("Service" in event && "Event" in event) {
              if (event.Event === "s3:TestEvent") {
                let deleteTestEvent = {
                  QueueUrl: queueUrl,
                  ReceiptHandle: message.ReceiptHandle,
                };
                await sqs.deleteMessage(deleteTestEvent).promise();
                continue;
              }
            }

            for (const record of event.Records) {
              const { eventName, s3 } = record;
              const {
                bucket,
                object: { key },
              } = s3;

              // Process the video
              console.log(`Processing video: ${key}`);
              await processVideo(key);
            }

            // Delete the message from the queue
            const deleteParams = {
              QueueUrl: queueUrl,
              ReceiptHandle: message.ReceiptHandle,
            };
            await sqs.deleteMessage(deleteParams).promise();
          }
        }
      }
    } catch (error) {
      continue;
      //   console.error("Error receiving message:", error);
    }
  }
};

const processVideo = async (videoKey) => {
  const videoPath = path.join(__dirname, videoKey);

  const downloadParams = {
    Bucket: bucketName,
    Key: videoKey,
  };

  const videoStream = s3.getObject(downloadParams).createReadStream();
  const writeStream = fs.createWriteStream(videoPath);
  videoStream.pipe(writeStream);

  writeStream.on("finish", async () => {
    const baseOutputDir = path.join(
      __dirname,
      "hls",
      path.basename(videoKey, ".mp4")
    );

    try {
      await generateHLS(baseOutputDir, videoPath); // ✅ Generate HLS variants
      await deleteFromS3(videoKey); // delete S3 video
      fs.unlinkSync(videoPath); // delete downloaded original .mp4
    } catch (error) {
      console.error("Error processing video:", error);
    }
  });

  writeStream.on("error", (err) => {
    console.error("Failed to write video from S3:", err);
  });
};

const generateHLS = async (videoKey, inputPath) => {
  const resolutions = [
    { name: "360p", width: 640, height: 360, bitrate: 800 },
    { name: "480p", width: 854, height: 480, bitrate: 1400 },
    { name: "720p", width: 1280, height: 720, bitrate: 2800 },
    { name: "1080p", width: 1920, height: 1080, bitrate: 5000 },
  ];

  const baseOutputDir = path.join(
    __dirname,
    "hls",
    path.basename(videoKey, ".mp4")
  );
  fs.mkdirSync(baseOutputDir, { recursive: true });

  const masterPlaylist = [];

  for (const res of resolutions) {
    const variantDir = path.join(baseOutputDir, res.name);
    fs.mkdirSync(variantDir, { recursive: true });

    await new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .videoCodec("libx264")
        .audioCodec("aac")
        .addOptions([
          "-preset veryfast",
          `-b:v ${res.bitrate}k`,
          `-maxrate ${res.bitrate}k`,
          `-bufsize ${res.bitrate * 2}k`,
          "-hls_time 10",
          "-hls_list_size 0",
          "-hls_segment_type mpegts",
          "-hls_segment_filename",
          `${variantDir}/segment_%03d.ts`,
        ])
        .size(`${res.width}x${res.height}`)
        .output(path.join(variantDir, "index.m3u8"))
        .on("end", () => {
          console.log(`Finished ${res.name}`);
          masterPlaylist.push({
            resolution: `${res.width}x${res.height}`,
            bandwidth: res.bitrate * 1024,
            uri: `${res.name}/index.m3u8`,
          });
          resolve();
        })
        .on("error", (err) => {
          console.error(`Error processing ${res.name}:`, err.message);
          reject(err);
        })
        .run();
    });
  }

  // Create master playlist
  const masterPath = path.join(baseOutputDir, "master.m3u8");
  let masterContent = "#EXTM3U\n";
  for (const stream of masterPlaylist) {
    masterContent += `#EXT-X-STREAM-INF:BANDWIDTH=${stream.bandwidth},RESOLUTION=${stream.resolution}\n${stream.uri}\n`;
  }

  fs.writeFileSync(masterPath, masterContent);
  console.log("Master playlist created.");

  await uploadHLSFolder(videoKey, baseOutputDir); // Upload to server
  // Wait briefly to ensure all file handles are closed before deletion
  await new Promise((resolve) => setTimeout(resolve, 500));
 
  deleteFolder(baseOutputDir); // Clean it up manually
};

const uploadHLSFolder = async (videoKey, dirPath) => {
  const serverUrl = "http://localhost:3000/upload/hls";

  const uploadRecursive = (folder, relPath = "") => {
    const files = fs.readdirSync(folder);

    return Promise.all(
      files.map(async (file) => {
        const fullPath = path.join(folder, file);
        const relFilePath = path.join(relPath, file);

        if (fs.statSync(fullPath).isDirectory()) {
          return uploadRecursive(fullPath, relFilePath);
        } else {
          const formData = new FormData();
          formData.append("file", fs.createReadStream(fullPath));
          formData.append("videoKey", videoKey);
          formData.append("filePath", relFilePath);

          try {
            await axios.post(serverUrl, formData, {
              headers: formData.getHeaders(),
            });
            console.log(`Uploaded ${relFilePath}`);
          } catch (err) {
            console.error(`Failed to upload ${relFilePath}:`, err.message);
          }
        }
      })
    );
  };

  await uploadRecursive(dirPath);
};

const deleteFromS3 = async (videoKey) => {
  const deleteParams = {
    Bucket: bucketName,
    Key: videoKey,
  };

  try {
    await s3.deleteObject(deleteParams).promise();
    console.log(`Deleted video from S3: ${videoKey}`);
  } catch (error) {
    console.error("Error deleting video from S3:", error);
  }
};
const deleteFolder = async (folderPath, attempts = 3) => {
  for (let i = 0; i < attempts; i++) {
    try {
      await fs.promises.rm(folderPath, { recursive: true, force: true });
      console.log("Successfully deleted:", folderPath);
      return;
    } catch (err) {
      console.warn(`Attempt ${i + 1} failed: ${err.message}`);
      await new Promise(res => setTimeout(res, 500)); // wait before retry
    }
  }
  console.error("Failed to delete after multiple attempts:", folderPath);
};


const deleteFolderRecursive = (folderPath) => {
  if (fs.existsSync(folderPath)) {
    fs.readdirSync(folderPath).forEach((file) => {
      const curPath = path.join(folderPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath); // Recurse
      } else {
        try {
          fs.unlinkSync(curPath); // Delete file
        } catch (err) {
          console.error("Failed to delete file:", curPath, err.message);
        }
      }
    });
    try {
      fs.rmdirSync(folderPath);
      console.log("Deleted folder:", folderPath);
    } catch (err) {
      console.error("Failed to delete folder:", folderPath, err.message);
    }
  }
};

// Start receiving messages
receiveMessage();
