import fs from "fs";
import path from "path";
import { pipeline } from "stream/promises";
import { getVideoMetadata } from "@remotion/renderer";

async function downloadVideo(id, destFileName) {
  const destPath = path.join(process.cwd(), "public/videos", destFileName);
  if (fs.existsSync(destPath) && fs.statSync(destPath).size > 100000) {
    console.log(`Already downloaded ${destFileName}`);
    return destPath;
  }

  // Try 720 first, then 360
  for (const res of ["720", "360"]) {
    const url = `https://assets.mixkit.co/videos/${id}/${id}-${res}.mp4`;
    try {
      console.log(`Downloading ${url} -> ${destFileName}...`);
      const response = await fetch(url);
      if (response.ok) {
        const fileStream = fs.createWriteStream(destPath);
        // @ts-expect-error stream typing
        await pipeline(response.body, fileStream);
        const meta = await getVideoMetadata(destPath);
        console.log(`✔ Downloaded ${destFileName}: ${meta.width}x${meta.height}, ${meta.durationInSeconds}s`);
        return destPath;
      }
    } catch (err) {
      console.warn(`Failed ${res}: ${err.message}`);
    }
  }
  return null;
}

async function main() {
  const dir = path.join(process.cwd(), "public/videos");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  // Curated IDs for our 4 Personas:
  // 41272 / 41273: Female vlogger talking to camera
  // 42313 / 51241: Male selfie creator / builder
  // 50422 / 34487: Female influencer lifestyle
  // 50748 / 46635: Laptop / coding workspace setup
  
  await downloadVideo("41273", "creator-sarah.mp4");
  await downloadVideo("51241", "creator-alex.mp4");
  await downloadVideo("50422", "creator-emma.mp4");
  await downloadVideo("46635", "creator-workspace.mp4");
}

main().catch(console.error);
