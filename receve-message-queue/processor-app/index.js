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

// const receiveMessage = async () => {
//   const params = {
//     QueueUrl: queueUrl,
//     MaxNumberOfMessages: 1,
//     WaitTimeSeconds: 20,
//   };

//   try {
//     const data = await sqs.receiveMessage(params).promise();
//     if (data.Messages) {
//       for (const message of data.Messages) {
//         const { Body } = message;

//         if (Body) {
//           const event = JSON.parse(Body);
//           if ("Service" in event && event.Event === "s3:TestEvent") {
//             await sqs
//               .deleteMessage({
//                 QueueUrl: queueUrl,
//                 ReceiptHandle: message.ReceiptHandle,
//               })
//               .promise();
//             process.exit(0); // exit gracefully
//           }

//           for (const record of event.Records) {
//             const {
//               object: { key },
//             } = record.s3;
//             console.log(`Processing video: ${key}`);
//             await processVideo(key);
//           }

//           await sqs
//             .deleteMessage({
//               QueueUrl: queueUrl,
//               ReceiptHandle: message.ReceiptHandle,
//             })
//             .promise();

//           process.exit(0); // ✅ EXIT container after 1 message is processed
//         }
//       }
//     } else {
//       console.log("No messages received. Exiting.");
//       process.exit(0); // Exit if no messages in queue
//     }
//   } catch (error) {
//     console.error("Error receiving message:", error);
//     process.exit(1);
//   }
// };

const processVideo = async (videoKey) => {
  const videoPath = path.join(__dirname, videoKey);
  console.log(videoKey);

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
    { name: "1440p", width: 2560, height: 1440, bitrate: 8000 },
    { name: "2160p", width: 3840, height: 2160, bitrate: 16000 },
  ];

  const baseOutputDir = path.join(
    __dirname,
    "hls",
    path.basename(videoKey, ".mp4")
  );
  fs.mkdirSync(baseOutputDir, { recursive: true });

  const masterPlaylist = [];

  // Launch all ffmpeg jobs concurrently
  await Promise.all(
    resolutions.map((res) => {
      return new Promise((resolve, reject) => {
        const variantDir = path.join(baseOutputDir, res.name);
        fs.mkdirSync(variantDir, { recursive: true });

        ffmpeg(inputPath)
          .videoCodec("libx264")
          .audioCodec("aac")
          .addOptions([
            "-preset veryfast",
            `-b:v ${res.bitrate}k`,
            `-maxrate ${Math.floor(res.bitrate * 1.07)}k`,
            `-bufsize ${res.bitrate * 2}k`,
            "-crf 20",
            "-profile:v main",
            "-level 4.1",
            "-g 48",
            "-keyint_min 48",
            "-sc_threshold 0",
            "-hls_time 4",
            "-hls_playlist_type vod",
            "-hls_segment_type mpegts",
            "-hls_list_size 0",
            "-hls_flags independent_segments",
            "-force_key_frames expr:gte(t,n_forced*4)",
            "-movflags +faststart",
            "-y",
            "-threads 4",
            "-hls_segment_filename",
            `${variantDir}/segment_%03d.ts`,
          ])
          .size(`${res.width}x${res.height}`)
          .output(path.join(variantDir, "index.m3u8"))
          .on("end", () => {
            console.log(`✅ Finished ${res.name}`);
            masterPlaylist.push({
              resolution: `${res.width}x${res.height}`,
              bandwidth: res.bitrate * 1024,
              uri: `${res.name}/index.m3u8`,
            });
            resolve();
          })
          .on("error", (err) => {
            console.error(`❌ Error processing ${res.name}:`, err.message);
            reject(err);
          })
          .run();
      });
    })
  );

  // Create master playlist
  const masterPath = path.join(baseOutputDir, "master.m3u8");
  let masterContent = "#EXTM3U\n";
  for (const stream of masterPlaylist) {
    masterContent += `#EXT-X-STREAM-INF:BANDWIDTH=${stream.bandwidth},RESOLUTION=${stream.resolution}\n${stream.uri}\n`;
  }

  fs.writeFileSync(masterPath, masterContent);
  console.log("✅ Master playlist created.");

  await uploadHLSFolder(videoKey, baseOutputDir);
  await new Promise((resolve) => setTimeout(resolve, 500));
  deleteFolder(baseOutputDir);
};

const uploadHLSFolder = async (videoKey, dirPath) => {
  const serverUrl = "http://192.168.31.147:3000/upload/hls";

  const uploadRecursive = (folder) => {
    const files = fs.readdirSync(folder);

    return Promise.all(
      files.map(async (file) => {
        const fullPath = path.join(folder, file);

        if (fs.statSync(fullPath).isDirectory()) {
          return uploadRecursive(fullPath);
        } else {
          const relFilePath = path.relative(dirPath, fullPath); // 👈 must be RELATIVE

          const formData = new FormData();
          formData.append("file", fs.createReadStream(fullPath));
          formData.append("videoKey", path.basename(videoKey)); // ✅ get just folder name
          formData.append("filePath", relFilePath);

          try {
            await axios.post(serverUrl, formData, {
              headers: formData.getHeaders(),
            });
            console.log(`✅ Uploaded ${relFilePath}`);
          } catch (err) {
            console.error(`❌ Failed to upload ${relFilePath}:`, err.message);
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
      await new Promise((res) => setTimeout(res, 500)); // wait before retry
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
// receiveMessage();

const videoKey = process.env.VIDEO_KEY;
// const videoKey = "b35de032-f642-42db-9d65-8974dd7aad90.mp4";

if (!videoKey) {
  console.error("❌ No VIDEO_KEY provided");
  process.exit(1);
}

processVideo(videoKey);
