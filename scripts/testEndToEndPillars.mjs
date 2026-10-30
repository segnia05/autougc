import fetch from "node-fetch";
import fs from "fs";
import path from "path";

async function testPipeline() {
  console.log("=== STEP 1: Testing Website Scraping & Automated Screenshot for Linear.app ===");
  const scrapeRes = await fetch("http://localhost:3000/api/v1/projects/scrape", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: "http://localhost:3000",
    },
    body: JSON.stringify({ url: "https://linear.app" }),
  });

  const scrapeData = await scrapeRes.json();
  console.log("Scrape response status:", scrapeRes.status);
  console.log("Scrape success:", scrapeData.success);
  console.log("Brand Name:", scrapeData.data?.brandName);
  console.log("Screenshot URL:", scrapeData.data?.screenshotUrl);

  const screenshotUrl = scrapeData.data?.screenshotUrl || "/uploads/screenshots/screen_d8f566a7b705.png";
  console.log("Using Screenshot:", screenshotUrl);

  console.log("\n=== STEP 2: Testing Async Cloud Video Rendering (Zero Vercel Timeouts) ===");
  const renderRes = await fetch("http://localhost:3000/api/v1/videos/render", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: "http://localhost:3000",
      "x-organization-id": "org_saas_scale",
      "x-user-id": "usr_founder_01",
      "x-plan-tier": "scale",
    },
    body: JSON.stringify({
      brandName: "Linear",
      hookText: "Stop drowning in messy Jira tickets in 2026.",
      bodyText: "Linear is built for high-speed software teams. Look at this interface.",
      ctaText: "Switch to Linear today at the link below.",
      voiceId: "sarah_dtc_founder",
      videoUrl: "/videos/creator-sarah.mp4",
      productImageUrl: screenshotUrl,
      hookStickerType: "tiktok_question",
      showHookSticker: true,
      showCtaSticker: true,
      async: true,
    }),
  });

  const renderData = await renderRes.json();
  console.log("Render response status:", renderRes.status);
  console.log("Initial render response:", renderData);

  if (!renderData.success || !renderData.jobId) {
    throw new Error("Render enqueue failed");
  }

  const jobId = renderData.jobId;
  const videoId = renderData.videoId;

  console.log(`\n=== STEP 3: Polling Render Status for Job ${jobId} ===`);
  let completed = false;
  let attempts = 0;

  while (!completed && attempts < 40) {
    attempts++;
    await new Promise((r) => setTimeout(r, 1200));

    const statusRes = await fetch(
      `http://localhost:3000/api/v1/videos/render/status?jobId=${jobId}&videoId=${videoId}`,
      {
        headers: {
          "x-organization-id": "org_saas_scale",
          "x-user-id": "usr_founder_01",
        },
      }
    );
    const statusData = await statusRes.json();
    console.log(`Attempt ${attempts}: status = ${statusData.status}, progress = ${statusData.progress}%`);

    if (statusData.status === "completed") {
      completed = true;
      console.log("\n🎉 Video Render Successfully Completed!");
      console.log("Render Result:", statusData.result);
      break;
    }

    if (statusData.status === "failed") {
      throw new Error("Render job failed: " + statusData.error);
    }
  }

  if (!completed) {
    console.log("Polling timed out, checking file on disk...");
    const diskPath = path.join(process.cwd(), "public/renders", `${videoId}.mp4`);
    console.log("File exists on disk:", fs.existsSync(diskPath));
  }
}

testPipeline().catch(console.error);
