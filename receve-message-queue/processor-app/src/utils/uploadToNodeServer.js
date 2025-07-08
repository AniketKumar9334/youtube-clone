

const fs = require("fs");
const path = require("path");
const axios = require("axios");
const FormData = require("form-data");


exports.uploadHLSFolder = async (videoKey, dirPath) => {
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
