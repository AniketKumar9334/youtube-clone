require("dotenv").config();
const AWS = require("aws-sdk");
const { downloadFromS3 } = require("./utils/downloadFromS3");
const { convertToHLS } = require("./utils/convertToHLS");
const { uploadToNodeServer } = require("./utils/uploadToNodeServer");
const path = require("path");

const s3 = new AWS.S3();
const bucketName = process.env.BUCKET_NAME;

const deleteFromS3 = async (videoKey) => {
  const deleteParams = {
    Bucket: bucketName,
    Key: videoKey,
  };

  try {
    await s3.deleteObject(deleteParams).promise();
    console.log(`🗑️ Deleted video from S3: ${videoKey}`);
  } catch (error) {
    console.error("❌ Error deleting video from S3:", error);
  }
};

exports.processVideo = async (videoKey) => {
  try {
    console.log(`🚀 Starting process for ${videoKey}`);
    const inputPath = await downloadFromS3(videoKey);
    const outputDir = path.join("/tmp", "hls-output");

    await convertToHLS(inputPath, outputDir);
    // await uploadToNodeServer(outputDir, videoKey);
    await deleteFromS3(videoKey);

    console.log("✅ Processing complete.");
  } catch (err) {
    console.error("❌ Processing failed:", err.message);
    throw err;
  }
};
