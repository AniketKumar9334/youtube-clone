// Express server upload route
import express from "express";
import fileUpload from "express-fileupload";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors({
  origin: '*',
  methods: ["GET", "POST", "DELETE", "PUT"],
}))

app.use(fileUpload());
// Force correct MIME types
app.use((req, res, next) => {
  if (req.url.endsWith('.m3u8')) {
    res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
  }
  if (req.url.endsWith('.ts')) {
    res.setHeader('Content-Type', 'video/MP2T');
  }
  next();
});

app.use('/upload/hls', express.static(path.join(__dirname, 'uploads')));

app.post("/upload/hls", (req, res) => {
  const { videoKey, filePath } = req.body;
  const file = req.files?.file;

  if (!file || !videoKey || !filePath) {
    return res.status(400).send("Missing file or fields");
  }

  // Ensure filePath is relative
  const relativePath = path
    .relative(process.cwd(), filePath)
    .replace(/^([A-Z]:)?[\/\\]+/, "");
  const savePath = path.join(__dirname, "uploads", videoKey, relativePath);

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

app.listen(3000, '0.0.0.0', () => console.log("Uploader server running"));

