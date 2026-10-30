import { execSync } from "child_process";

const payload = {
  videoId: "real_sarah_fastlane_ugc",
  framesToRender: 90,
  inputProps: {
    brandName: "Lumina",
    hookText: "3 websites that feel completely illegal to know in 2026.",
    bodyText: "Lumina automates your entire daily video ad production in under 30 seconds.",
    ctaText: "Tap the link below to try Lumina now",
    videoUrl: "http://localhost:3000/videos/creator-sarah.mp4",
    productImageUrl: "http://localhost:3000/images/creator-sarah.jpg",
    hookStickerType: "tiktok_question",
    showHookSticker: true,
    showCtaSticker: true,
    words: [
      { word: "3", start: 0.1, end: 0.35 },
      { word: "websites", start: 0.38, end: 0.8 },
      { word: "that", start: 0.82, end: 1.0 },
      { word: "feel", start: 1.05, end: 1.35 },
      { word: "illegal", start: 1.38, end: 1.85 },
      { word: "to", start: 1.88, end: 2.05 },
      { word: "know", start: 2.08, end: 2.45 },
      { word: "in", start: 2.48, end: 2.65 },
      { word: "2026", start: 2.68, end: 3.0 },
    ],
  },
};

const cmd = `node scripts/renderUgcCli.mjs "${JSON.stringify(payload).replace(/"/g, '\\"')}"`;
console.log("Executing render...");
const output = execSync(cmd, { encoding: "utf-8" });
console.log(output);

