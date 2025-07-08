const AWS = require("aws-sdk");
const fs = require("fs");
const path = require("path");

const s3 = new AWS.S3();

exports.downloadFromS3 = async (key) => {
  const filePath = `/tmp/${path.basename(key)}`;
  const file = fs.createWriteStream(filePath);

  return new Promise((resolve, reject) => {
    s3.getObject({
      Bucket: process.env.BUCKET_NAME,
      Key: key
    })
    .createReadStream()
    .pipe(file)
    .on("finish", () => resolve(filePath))
    .on("error", reject);
  });
};
