import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import cors from "cors";
dotenv.config();
const app = express();
app.use(express.json());

const upload = multer({ dest: "uploads/" });
app.post("/upload", upload.single("file"), (req, res) => {
  const { resolution, videoKey } = req.body;
  const file = req.file;

  if (!file || !resolution || !videoKey) {
    return res.status(400).send("Missing required fields");
  }

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  let folderName = videoKey.split(".")[0];

  const uploadDir = path.join(__dirname, "video", folderName);
  const outputPath = path.join(uploadDir, `${resolution}.mp4`);

  // Create the directory if it doesn't exist
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Move the file to the desired location
  fs.rename(file.path, outputPath, (err) => {
    if (err) {
      return res.status(500).json({
        message: "Error uploading file",
        error: err.message,
      });
    }

    res.json({
      message: "File uploaded successfully",
      path: outputPath,
    });
  });
});

app.post("/video", (req, res) => {
  try {
    const { videoFile } = req?.body;
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const folderName = videoFile?.toString();
    const uploadDir = path.join(__dirname, "video", folderName);

    if (fs.existsSync(uploadDir)) {
      fs.rmdirSync(uploadDir, { recursive: true });
      res.json({
        message: "Video deleted successfully",
      });
    } else {
      res.status(404).json({
        message: "Video not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error deleting video",
      error: error.message,
    });
  }
});

app.get("/video/:videoKey", (req, res) => {
  try {
    const { videoKey } = req.params;
    const { resolution } = req.body;

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const folderName = videoKey;
    const uploadDir = path.join(__dirname, "video", folderName);
    const videoPath = path.join(uploadDir, `${resolution}.mp4`);

    if (fs.existsSync(videoPath)) {
      const stat = fs.statSync(videoPath);
      const fileSize = stat.size;
      const range = req.headers.range;

      if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

        if (start >= fileSize) {
          res
            .status(416)
            .send(
              "Requested range not satisfiable\n" + start + " >= " + fileSize
            );
          return;
        }

        const chunksize = end - start + 1;
        const file = fs.createReadStream(videoPath, { start, end });
        const head = {
          "Content-Range": `bytes ${start}-${end}/${fileSize}`,
          "Accept-Ranges": "bytes",
          "Content-Length": chunksize,
          "Content-Type": "video/mp4",
        };

        res.writeHead(206, head);
        file.pipe(res);
      } else {
        const head = {
          "Content-Length": fileSize,
          "Content-Type": "video/mp4",
        };
        res.writeHead(206, head);
        fs.createReadStream(videoPath).pipe(res);
      }
    } else {
      res.status(404).json({
        message: "Video not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error fetching video",
      error: error.message,
    });
  }
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server listening on port ${process.env.PORT || 3000}`);
});
