import {
  dispatchToTikTok,
  dispatchToInstagram,
  dispatchToYouTube,
  dispatchPostToPlatform,
  processScheduledPostsOnce,
} from "../src/workers/socialPublisher";
import { encryptToken } from "../src/lib/social/crypto";

async function runSchedulerTests() {
  console.log("--- Running Social Media Multi-Platform Publisher Unit Tests ---");

  const mockEncryptedToken = encryptToken("mock_oauth_access_token_super_secret");
  const testVideoUrl = "https://assets.autougc.ai/renders/1080p_vertical_demo.mp4";
  const testCaption = "Stop coding under harsh fluorescent lights in 2026. #ugc #lumina";

  // 1. Test TikTok Dispatch
  const ttRes = await dispatchToTikTok(mockEncryptedToken, testVideoUrl, testCaption);
  if (!ttRes.success || !ttRes.platformPostId) {
    console.error("✗ Failed TikTok dispatch:", ttRes);
    process.exit(1);
  }
  console.log(`✓ TikTok dispatch succeeded. Post ID: ${ttRes.platformPostId}, URL: ${ttRes.postUrl}`);

  // 2. Test Instagram Reels Dispatch
  const igRes = await dispatchToInstagram(mockEncryptedToken, testVideoUrl, testCaption);
  if (!igRes.success || !igRes.platformPostId) {
    console.error("✗ Failed Instagram Reels dispatch:", igRes);
    process.exit(1);
  }
  console.log(`✓ Instagram Reels dispatch succeeded. Post ID: ${igRes.platformPostId}, URL: ${igRes.postUrl}`);

  // 3. Test YouTube Shorts Dispatch
  const ytRes = await dispatchToYouTube(mockEncryptedToken, testVideoUrl, testCaption);
  if (!ytRes.success || !ytRes.platformPostId) {
    console.error("✗ Failed YouTube Shorts dispatch:", ytRes);
    process.exit(1);
  }
  console.log(`✓ YouTube Shorts dispatch succeeded. Post ID: ${ytRes.platformPostId}, URL: ${ytRes.postUrl}`);

  // 4. Test Unified Dispatcher
  const unifiedRes = await dispatchPostToPlatform("tiktok", mockEncryptedToken, testVideoUrl, testCaption);
  if (!unifiedRes.success) {
    console.error("✗ Failed unified dispatcher call:", unifiedRes);
    process.exit(1);
  }
  console.log("✓ Unified platform adapter successfully routed to TikTok.");

  // 5. Test Scheduler Batch Worker
  const batchRes = await processScheduledPostsOnce();
  console.log(`✓ Batch worker run finished. Processed: ${batchRes.processedCount}, Success: ${batchRes.successCount}, Failures: ${batchRes.failureCount}`);

  console.log("✓ All Social Media Multi-Platform Publisher tests passed cleanly!");
}

runSchedulerTests();
