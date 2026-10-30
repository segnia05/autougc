import path from "path";
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";

async function main() {
  const entryPoint = path.join(process.cwd(), "src/remotion/index.ts");
  const publicDir = path.join(process.cwd(), "public");

  const bundleLocation = await bundle({
    entryPoint,
    publicDir,
    webpackOverride: (config) => config,
  });

  const videos = [
    { name: "sarah", file: "creator-sarah.mp4" },
    { name: "alex", file: "creator-alex.mp4" },
    { name: "emma", file: "creator-emma.mp4" },
    { name: "workspace", file: "creator-workspace.mp4" },
    { name: "sample", file: "creator-sample.mp4" },
  ];

  for (const v of videos) {
    const inputProps = {
      brandName: "Lumina",
      hookText: "Stop coding under harsh lights.",
      bodyText: "Auto-matches natural daylight.",
      ctaText: "Try it today.",
      brandColor: "#1F3824",
      videoUrl: `http://localhost:3000/videos/${v.file}`,
      words: [{ word: "TEST", start: 0.1, end: 1.0 }],
    };

    const comp = await selectComposition({
      serveUrl: bundleLocation,
      id: "UgcAd",
      inputProps,
      port: 8421,
    });

    const out = path.join(process.cwd(), `public/renders/thumb_${v.name}.jpg`);
    await renderStill({
      composition: comp,
      serveUrl: bundleLocation,
      output: out,
      frame: 15,
      imageFormat: "jpeg",
      port: 8421,
      inputProps,
    });

    console.log(`Rendered thumb_${v.name}.jpg`);
  }
}

main().catch(console.error);
