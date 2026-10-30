import path from "path";
import fs from "fs";
import { bundle } from "@remotion/bundler";
import { renderMedia, renderStill, selectComposition } from "@remotion/renderer";

async function main() {
  console.log("▶ [1/4] Bundling Remotion video composition with Real Motion Creator Video...");
  const entryPoint = path.join(process.cwd(), "src/remotion/index.ts");
  const publicDir = path.join(process.cwd(), "public");

  const bundleLocation = await bundle({
    entryPoint,
    publicDir,
    webpackOverride: (config) => config,
  });

  const outputDir = path.join(process.cwd(), "public/renders");
  const videoOutputPath = path.join(outputDir, "sarah_motion_ugc.mp4");

  const inputProps = {
    brandName: "Lumina",
    hookText: "Stop coding under harsh fluorescent lights in 2026.",
    bodyText: "Lumina auto-matches natural daylight so your eyes feel rested even after 10-hour deep work sprints.",
    ctaText: "Click the link below and get $30 off your setup today.",
    brandColor: "#1F3824",
    videoUrl: "http://localhost:3000/videos/creator-sarah.mp4",
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

  console.log("▶ [4/4] Rendering still snapshots of real creator motion frames...");
  const frame10Path = path.join(outputDir, "sarah_frame_10.jpg");
  const frame35Path = path.join(outputDir, "sarah_frame_35.jpg");
  const frame65Path = path.join(outputDir, "sarah_frame_65.jpg");

  await renderStill({
    composition,
    serveUrl: bundleLocation,
    output: frame10Path,
    frame: 10,
    imageFormat: "jpeg",
    port: 8421,
    inputProps,
  });

  await renderStill({
    composition,
    serveUrl: bundleLocation,
    output: frame35Path,
    frame: 35,
    imageFormat: "jpeg",
    port: 8421,
    inputProps,
  });

  await renderStill({
    composition,
    serveUrl: bundleLocation,
    output: frame65Path,
    frame: 65,
    imageFormat: "jpeg",
    port: 8421,
    inputProps,
  });

  // Copy to Artifacts directory
  const artifactDir = "C:\\Users\\Hello\\.gemini\\antigravity\\brain\\758e4408-6bef-43ea-82b4-966b63d084fe";
  if (fs.existsSync(artifactDir)) {
    fs.copyFileSync(videoOutputPath, path.join(artifactDir, "sarah_motion_ugc.mp4"));
    fs.copyFileSync(frame10Path, path.join(artifactDir, "sarah_frame_10.jpg"));
    fs.copyFileSync(frame35Path, path.join(artifactDir, "sarah_frame_35.jpg"));
    fs.copyFileSync(frame65Path, path.join(artifactDir, "sarah_frame_65.jpg"));
  }

  console.log("✔ SUCCESS: Real motion UGC video successfully rendered and saved!");
}

main().catch((err) => {
  console.error("Render failed:", err);
  process.exit(1);
});

