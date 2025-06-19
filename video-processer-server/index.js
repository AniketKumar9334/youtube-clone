// Express server upload route
import express from "express";
import fileUpload from "express-fileupload";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(fileUpload());
app.use("/static", express.static(path.join(__dirname, "public")));

app.post("/upload/hls", (req, res) => {
  const { videoKey, filePath } = req.body;
  const file = req.files?.file;
  
  if (!file || !videoKey || !filePath) {
    return res.status(400).send("Missing file or fields");
  }

  const savePath = path.join(__dirname, "uploads", videoKey, filePath);
  const saveDir = path.dirname(savePath);

  try {
    fs.mkdirSync(saveDir, { recursive: true });
    file.mv(savePath, (err) => {
      if (err) {
        console.error("File save error:", err);
        return res.status(500).send("Failed to save file");
      }
      res.send("Uploaded");
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).send("Error uploading file");
  }
});

app.listen(3000, () => console.log("Uploader server on port 3000"));
