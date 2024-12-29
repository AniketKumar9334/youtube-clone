// import {ReceiveMessageCommand, SQSClient} from "@aws-sdk/client-sqs"
// import {S3Event} from 'aws-lambda'
// import dotenv from "dotenv"
// dotenv.config()

// const client = new SQSClient({
//     region: "ap-south-1",
//     credentials:{
//         accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//         secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
//     },
// })

// async function init(){
//     const command = new ReceiveMessageCommand({
//         QueueUrl: process.env.QUE_URL,
//         MaxNumberOfMessages: 1,
//         WaitTimeSeconds: 20,
//     })
//     while(true){
//         try {
//             const {Messages} = await client.send(command);
//         if(!Messages){
//             console.log("No messages to Queue")
//             continue
//         }
//         for(const message of Messages){
//             const {MessageId, Body} = message;
//             console.log(`MessageId: ${MessageId, Body}`)
//         }
//         if(Body){
//             continue
//         }

//         const event = JSON.parse(Body)
//         if('Service' in event && 'Event' in event){
//             if(event.Event === "s3:TestEvent") continue
//         }

//         for (const record of event.Records){
//             const {eventName, s3} = record
//             const {bucket, object: {key}} = s3
//         }

//         } catch (error) {
//             console.log(error)
//             continue
//         }
//     }
// }

// init()

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
          console.log(`MessageId: ${MessageId}, Body: ${Body}`);

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
        continue
    //   console.error("Error receiving message:", error);
    }
  }
};

const processVideo = async (videoKey) => {
  const videoPath = path.join(__dirname, videoKey);

  // Download video from S3
  const downloadParams = {
    Bucket: bucketName,
    Key: videoKey,
  };

  const videoStream = s3.getObject(downloadParams).createReadStream();
  const writeStream = fs.createWriteStream(videoPath);
  videoStream.pipe(writeStream);

  writeStream.on("finish", async () => {
    try {
      await transcodeVideo(videoKey, videoPath, "360p", "640x360");
      await transcodeVideo(videoKey, videoPath, "480p", "854x480");
      await transcodeVideo(videoKey, videoPath, "720p", "1280x720");
      await transcodeVideo(videoKey, videoPath, "1080p", "1920x1080");
      fs.unlinkSync(videoPath); // Delete the original video file
      await deleteFromS3(videoKey); // Delete the video from S3
    } catch (error) {
      console.error("Error processing video:", error);
    }
  });
};

const transcodeVideo = async (videoKey, inputPath, resolution, size) => {
  const outputPath = inputPath.replace(".mp4", `_${resolution}.mp4`);

  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .output(outputPath)
      .withVideoCodec("libx264")
      .withAudioCodec("aac")
      .withSize(size)
      .on("end", async () => {
        try {
          await uploadToLocalServer(videoKey, outputPath, resolution);
          fs.unlinkSync(outputPath); // Delete the transcoded video file
          resolve();
        } catch (error) {
          reject(error);
        }
      })
      .on("error", (error) => {
        reject(error);
      })
      .format("mp4")
      .run();
  });
};

const uploadToLocalServer = async (videoKey, filePath, resolution) => {
  const fileStream = fs.createReadStream(filePath);
  const serverUrl = "http://localhost:3000/upload"; // Replace with your server URL

  const formData = new FormData();
  formData.append("file", fileStream, path.basename(filePath));
  formData.append("resolution", resolution);
  formData.append("videoKey", videoKey);

  try {
    const response = await axios.post(serverUrl, formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });
    console.log(`Uploaded ${resolution} video to server: ${response.data}`);
  } catch (error) {
    console.error("Error uploading to server:", error.message);
  }
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

// Start receiving messages
receiveMessage();
