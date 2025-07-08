const { uploadHLSFolder } = require("./uploadToNodeServer");
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const path = require("path");


exports.convertToHLS = async (videoKey, inputPath) => {
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