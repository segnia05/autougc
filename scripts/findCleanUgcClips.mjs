import fs from "fs";
import path from "path";
import { pipeline } from "stream/promises";
import { getVideoMetadata } from "@remotion/renderer";

const idsToTest = [
  "41272", // female vlogger
  "42313", // male selfie
  "34487", // influencer
  "41481", // girl selfie
  "41485", // man selfie talking
  "42861", // young woman talking video call
  "42862", // woman recording herself phone
  "42857", // man video call
  "41275", // vlogger talking
  "41274",
  "42858",
];

async function checkAndDownload(id) {
  const url = `https://assets.mixkit.co/videos/${id}/${id}-720.mp4`;
  try {
    const res = await fetch(url);
    if (res.ok) {
      const dest = path.join(process.cwd(), `public/videos/test-${id}.mp4`);
      const fileStream = fs.createWriteStream(dest);
      // @ts-expect-error stream typing
      await pipeline(res.body, fileStream);
      const meta = await getVideoMetadata(dest);
      console.log(`FOUND ${id}: ${meta.width}x${meta.height}, ${meta.durationInSeconds}s`);
      return { id, width: meta.width, height: meta.height, duration: meta.durationInSeconds };
    }
  } catch (err) {
    // skip
  }
  return null;
}

async function main() {
  for (const id of idsToTest) {
    await checkAndDownload(id);
  }
}

main().catch(console.error);
