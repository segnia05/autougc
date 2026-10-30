import fs from "fs";
import path from "path";
import { pipeline } from "stream/promises";
import { getVideoMetadata } from "@remotion/renderer";

const ids = [
  "34486", "34488", "34489", "34485",
  "41480", "41482", "41483", "41484",
  "42863", "42864", "42865", "42866",
  "50421", "50423", "50424", "50425"
];

async function check(id) {
  const url = `https://assets.mixkit.co/videos/${id}/${id}-720.mp4`;
  try {
    const res = await fetch(url);
    if (res.ok) {
      const dest = path.join(process.cwd(), `public/videos/batch-${id}.mp4`);
      const fileStream = fs.createWriteStream(dest);
      // @ts-expect-error stream
      await pipeline(res.body, fileStream);
      const meta = await getVideoMetadata(dest);
      if (meta.width === 720 && meta.height === 1280) {
        console.log(`VERTICAL HIT: ${id} (720x1280, ${meta.durationInSeconds}s)`);
      } else {
        fs.unlinkSync(dest);
      }
    }
  } catch (err) {}
}

async function main() {
  for (const id of ids) {
    await check(id);
  }
  console.log("Scan complete");
}

main().catch(console.error);
