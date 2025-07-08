const AWS = require("aws-sdk");
const { exec } = require("child_process");
require("dotenv").config();

AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const sqs = new AWS.SQS();
const queueUrl = process.env.QUE_URL;

const pollMessages = async () => {
  console.log("🔁 Polling for messages...");

  while (true) {
    try {
      const res = await sqs
        .receiveMessage({
          QueueUrl: queueUrl,
          MaxNumberOfMessages: 1,
          WaitTimeSeconds: 20,
        })
        .promise();

      if (res.Messages && res.Messages.length > 0) {
        const msg = res.Messages[0];
        const body = JSON.parse(msg.Body);
        const videoKey = body.Records?.[0]?.s3?.object?.key;

        if (videoKey) {
          console.log(`📦 Received video key: ${videoKey}`);

          // STEP 1: Extend visibility timeout (e.g. 5 minutes)
          await sqs
            .changeMessageVisibility({
              QueueUrl: queueUrl,
              ReceiptHandle: msg.ReceiptHandle,
              VisibilityTimeout: 5600, // in seconds (5 minutes)
            })
            .promise();

          console.log("⏳ Extended visibility timeout to 5 minutes");

          // STEP 2: Run Docker container
          const cmd = `docker run --rm -e VIDEO_KEY="${videoKey}" --env-file ../processor-app/.env video-processor-image`;

          exec(cmd, async (err, stdout, stderr) => {
            if (err) {
              console.error("❌ Docker run failed:", err.message);
            } else {
              console.log("✅ Docker finished processing.");
              console.log(stdout);
            }

            // STEP 3: Delete message after processing
            await sqs
              .deleteMessage({
                QueueUrl: queueUrl,
                ReceiptHandle: msg.ReceiptHandle,
              })
              .promise();

            console.log("🗑️ Deleted SQS message.");

            await new Promise((resolve) => setTimeout(resolve, 5000));
          });
        }
      }
    } catch (error) {
      console.error("💥 Error polling SQS:", error.message);
    }
  }
};

pollMessages();
