import path from "path";
import fs from "fs";
import { bundle } from "@remotion/bundler";
import { renderMedia, renderStill, selectComposition } from "@remotion/renderer";

async function main() {
  console.log("▶ [1/4] Bundling Remotion video composition...");
  const entryPoint = path.join(process.cwd(), "src/remotion/index.ts");
  const publicDir = path.join(process.cwd(), "public");

  const bundleLocation = await bundle({
    entryPoint,
    publicDir,
    webpackOverride: (config) => config,
  });

  const outputDir = path.join(process.cwd(), "public/renders");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const videoOutputPath = path.join(outputDir, "demo_ugc_ad.mp4");

  // Word timestamps matching conversational speech
  const inputProps = {
    brandName: "Lumina",
    hookText: "Stop coding under harsh fluorescent lights in 2026.",
    bodyText: "Lumina auto-matches natural daylight so your eyes feel rested even after 10-hour deep work sprints.",
    ctaText: "Click the link below and get $30 off your setup today.",
    brandColor: "#1F3824",
    productImageUrl: "http://localhost:3000/images/creator-glasses.jpg",
    words: [
      { word: "STOP", start: 0.15, end: 0.45 },
      { word: "CODING", start: 0.48, end: 0.85 },
      { word: "UNDER", start: 0.88, end: 1.15 },
      { word: "HARSH", start: 1.18, end: 1.55 },
      { word: "LIGHTS", start: 1.58, end: 2.10 },
      { word: "IN", start: 2.15, end: 2.35 },
      { word: "2026.", start: 2.38, end: 2.95 },
      { word: "LUMINA", start: 3.10, end: 3.55 },
      { word: "MATCHES", start: 3.58, end: 4.10 },
      { word: "DAYLIGHT", start: 4.15, end: 4.80 },
    ],
    subtitleStyle: {
      fontSize: 56,
      primaryColor: "#FFFFFF",
      highlightColor: "#FFE600",
      position: "center",
      backgroundPill: true,
    },
  };

  console.log("▶ [2/4] Selecting composition 'UgcAd'...");
  const composition = await selectComposition({
    serveUrl: bundleLocation,
    id: "UgcAd",
    inputProps,
    port: 8421,
    timeoutInMilliseconds: 60000,
  });

  console.log("▶ [3/4] Rendering 1080x1920 MP4 Video (90 frames @ 30 FPS = 3.0s)...");
  await renderMedia({
    composition: {
      ...composition,
      durationInFrames: 90,
    },
    serveUrl: bundleLocation,
    port: 8421,
    codec: "h264",
    outputLocation: videoOutputPath,
    inputProps,
    concurrency: 1,
    timeoutInMilliseconds: 60000,
    logLevel: "warn",
  });

  console.log("▶ [4/4] Rendering high-definition still snapshots...");
  const frame0Path = path.join(outputDir, "demo_frame_0.jpg");
  const frame30Path = path.join(outputDir, "demo_frame_30.jpg");
  const frame60Path = path.join(outputDir, "demo_frame_60.jpg");

  await renderStill({
    composition,
    serveUrl: bundleLocation,
    output: frame0Path,
    frame: 10,
    imageFormat: "jpeg",
    port: 8421,
    inputProps,
  });

  await renderStill({
    composition,
    serveUrl: bundleLocation,
    output: frame30Path,
    frame: 35,
    imageFormat: "jpeg",
    port: 8421,
    inputProps,
  });

  await renderStill({
    composition,
    serveUrl: bundleLocation,
    output: frame60Path,
    frame: 65,
    imageFormat: "jpeg",
    port: 8421,
    inputProps,
  });

  // Copy to Artifact Directory for instant inline preview
  const artifactDir = "C:\\Users\\Hello\\.gemini\\antigravity\\brain\\758e4408-6bef-43ea-82b4-966b63d084fe";
  if (fs.existsSync(artifactDir)) {
    fs.copyFileSync(videoOutputPath, path.join(artifactDir, "demo_ugc_ad.mp4"));
    fs.copyFileSync(frame0Path, path.join(artifactDir, "demo_frame_0.jpg"));
    fs.copyFileSync(frame30Path, path.join(artifactDir, "demo_frame_30.jpg"));
    fs.copyFileSync(frame60Path, path.join(artifactDir, "demo_frame_60.jpg"));
  }

  console.log("✔ SUCCESS: All assets rendered and synchronized successfully!");
}

main().catch((err) => {
  console.error("Render failed:", err);
  process.exit(1);
});

