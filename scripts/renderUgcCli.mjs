import path from "path";
import fs from "fs";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";

let cachedBundleLocation = null;

async function getOrBuildBundle() {
  if (cachedBundleLocation && fs.existsSync(cachedBundleLocation)) {
    return cachedBundleLocation;
  }
  const entryPoint = path.join(process.cwd(), "src/remotion/index.ts");
  const publicDir = path.join(process.cwd(), "public");

  const bundleLocation = await bundle({
    entryPoint,
    publicDir,
    webpackOverride: (config) => config,
  });
  cachedBundleLocation = bundleLocation;
  return bundleLocation;
}

async function main() {
  const payloadArg = process.argv[2];
  if (!payloadArg) {
    console.error(JSON.stringify({ error: "Missing JSON payload argument" }));
    process.exit(1);
  }

  let payload;
  try {
    payload = JSON.parse(payloadArg);
  } catch {
    console.error(JSON.stringify({ error: "Invalid JSON payload" }));
    process.exit(1);
  }

  const { videoId, inputProps, framesToRender = 90 } = payload;
  const outputDir = path.join(process.cwd(), "public/renders");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, `${videoId}.mp4`);

  const resolvedProps = {
    ...inputProps,
    productImageUrl: inputProps.productImageUrl?.startsWith("http")
      ? inputProps.productImageUrl
      : `http://localhost:3000${inputProps.productImageUrl?.startsWith("/") ? "" : "/"}${inputProps.productImageUrl || "images/creator-glasses.jpg"}`,
    videoUrl: inputProps.videoUrl
      ? inputProps.videoUrl.startsWith("http")
        ? inputProps.videoUrl
        : `http://localhost:3000${inputProps.videoUrl.startsWith("/") ? "" : "/"}${inputProps.videoUrl}`
      : undefined,
  };

  const bundleLocation = await getOrBuildBundle();

  const composition = await selectComposition({
    serveUrl: bundleLocation,
    id: "UgcAd",
    inputProps: resolvedProps,
    port: 8421,
    timeoutInMilliseconds: 60000,
  });

  const duration = Math.min(composition.durationInFrames, framesToRender);

  await renderMedia({
    composition: {
      ...composition,
      durationInFrames: duration,
    },
    serveUrl: bundleLocation,
    port: 8421,
    codec: "h264",
    outputLocation: outputPath,
    inputProps: resolvedProps,
    concurrency: 1,
    timeoutInMilliseconds: 60000,
    logLevel: "warn",
  });

  console.log(
    JSON.stringify({
      success: true,
      outputPath,
      publicUrl: `/renders/${videoId}.mp4`,
      durationSeconds: Number((duration / 30).toFixed(1)),
    })
  );
}

main().catch((err) => {
  console.error(JSON.stringify({ error: err.message || String(err) }));
  process.exit(1);
});
