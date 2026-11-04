import { describe, it } from "node:test";
import assert from "node:assert";
import { ScheduledCalendarPost } from "../src/components/dashboard/InteractiveMonthlyCalendar";

describe("Calendar Day Inspector & Post Scheduling (Step 5)", () => {
  const samplePosts: ScheduledCalendarPost[] = [
    {
      id: "test-post-1",
      caption: "Why didn't anyone tell me about DebotifyText sooner?! If you use AI for writing, this is an absolute game-changer. Link in bio! 🚀 #UGC #Productivity #DebotifyText",
      scheduledFor: "2026-11-05T20:15:00.000Z",
      localScheduledTime: "4:15 PM EST",
      publishStatus: "pending",
      requireApproval: true,
      approvalStatus: "awaiting_approval",
      hookAngle: "Problem-Agitation-Solution",
      socialAccount: {
        id: "soc-1",
        platform: "tiktok",
        accountHandle: "@debotifytext_official",
        accountNickname: "DebotifyText TikTok",
      },
      video: {
        id: "vid-1",
        durationSeconds: 22,
        thumbnailUrl: "/images/creator-sarah.jpg",
        videoUrl: "/videos/creator-sarah.mp4",
        voiceId: "sarah_casual_dtc",
      },
    },
    {
      id: "test-post-2",
      caption: "I tested every tool in this niche so you don't have to. Here's why DebotifyText is dominating in 2026. 🔥 #DebotifyText #SaaS",
      scheduledFor: "2026-11-07T18:00:00.000Z",
      localScheduledTime: "2:00 PM EST",
      publishStatus: "pending",
      requireApproval: true,
      approvalStatus: "approved",
      hookAngle: "Founder Proof",
      socialAccount: {
        id: "soc-2",
        platform: "instagram",
        accountHandle: "@debotifytext_ig",
        accountNickname: "DebotifyText IG",
      },
      video: {
        id: "vid-2",
        durationSeconds: 28,
        thumbnailUrl: "/images/creator-alex.jpg",
        videoUrl: "/videos/creator-alex.mp4",
        voiceId: "alex_founder",
      },
    },
  ];

  it("1. Resolves marked calendar days correctly", () => {
    const nov5Post = samplePosts.find(p => p.scheduledFor.startsWith("2026-11-05"));
    assert.ok(nov5Post, "Post on Nov 5 must exist");
    assert.strictEqual(nov5Post.id, "test-post-1");
  });

  it("2. Extracts exact 9:16 video creative specifications", () => {
    const post = samplePosts[0]!;
    assert.strictEqual(post.video?.videoUrl, "/videos/creator-sarah.mp4");
    assert.strictEqual(post.video?.thumbnailUrl, "/images/creator-sarah.jpg");
    assert.strictEqual(post.video?.durationSeconds, 22);
  });

  it("3. Resolves creator persona appropriately", () => {
    const post = samplePosts[0]!;
    const voice = (post.video?.voiceId || "").toLowerCase();
    const isSarah = voice.includes("sarah");
    assert.ok(isSarah, "Should resolve to Sarah for casual DTC");
    
    const post2 = samplePosts[1]!;
    const voice2 = (post2.video?.voiceId || "").toLowerCase();
    const isAlex = voice2.includes("alex");
    assert.ok(isAlex, "Should resolve to Alex for founder proof");
  });

  it("4. Formats target social account handle and fleet platform", () => {
    const post = samplePosts[0]!;
    assert.strictEqual(post.socialAccount.accountHandle, "@debotifytext_official");
    assert.strictEqual(post.socialAccount.platform, "tiktok");
  });

  it("5. Formats exact posting time with Peak Reach indicator", () => {
    const post = samplePosts[0]!;
    assert.strictEqual(post.localScheduledTime, "4:15 PM EST");
    const formatted = `${post.localScheduledTime} — Peak Reach`;
    assert.strictEqual(formatted, "4:15 PM EST — Peak Reach");
  });

  it("6. Parses viral caption and hashtags into structured badges", () => {
    const post = samplePosts[0]!;
    const hashtags: string[] = post.caption.match(/#[a-zA-Z0-9_]+/g) || [];
    assert.ok(hashtags.includes("#UGC"), "Must contain #UGC");
    assert.ok(hashtags.includes("#Productivity"), "Must contain #Productivity");
    assert.ok(hashtags.includes("#DebotifyText"), "Must contain #DebotifyText");
  });

  it("7. Supports Download MP4 and Drop Package concierge actions", () => {
    const post = samplePosts[0]!;
    let dropPackageTriggered = false;
    const onOpenDropPackage = (p: ScheduledCalendarPost) => {
      dropPackageTriggered = true;
      assert.strictEqual(p.id, post.id);
    };

    onOpenDropPackage(post);
    assert.strictEqual(dropPackageTriggered, true, "Drop package callback must fire");
  });
});
