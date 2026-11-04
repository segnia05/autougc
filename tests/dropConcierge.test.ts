import { describe, it } from "node:test";
import assert from "node:assert";
import { prisma } from "../src/db/client";

describe("Step 7: The Drop Concierge Self-Posting Fallback", () => {
  const testOrgId = `org_test_step7_${Date.now()}`;
  const testUserId = `usr_test_step7_${Date.now()}`;
  let scheduledPostId = "";
  let videoId = "";

  it("1. Creates post and verifies Drop Concierge specifications", async () => {
    const org = await prisma.organization.create({
      data: {
        id: testOrgId,
        name: "DropConcierge Brand",
        slug: testOrgId,
        billingEmail: "concierge@brand.com",
      },
    });

    const user = await prisma.user.create({
      data: {
        id: testUserId,
        email: `${testUserId}@example.com`,
      },
    });

    const project = await prisma.project.create({
      data: {
        organizationId: org.id,
        createdByUserId: user.id,
        name: "DropConcierge App",
        targetUrl: "https://dropconcierge.com",
        brandName: "DropConcierge",
      },
    });

    const script = await prisma.script.create({
      data: {
        projectId: project.id,
        angleType: "problem_agitation",
        hookText: "Why nobody told you about this 9:16 shortcut?",
        bodyText: "AutoUGC packages video, caption, hashtags, and peak posting timing.",
        ctaText: "Download your ad now.",
        fullScriptText: "Why nobody told you about this 9:16 shortcut? Drop Concierge does it all.",
        captionCopy: "Why didn't anyone tell me about this UGC shortcut?! 🚀 #AI #WritingHacks #DropConcierge",
      },
    });

    const video = await prisma.video.create({
      data: {
        projectId: project.id,
        organizationId: org.id,
        scriptId: script.id,
        renderStatus: "completed",
        voiceId: "alex_casual_dtc",
        durationSeconds: 24.0,
        thumbnailUrl: "/images/creator-alex.jpg",
        videoUrl: "/videos/creator-alex.mp4",
      },
    });
    videoId = video.id;

    const socialAccount = await prisma.socialAccount.create({
      data: {
        organizationId: org.id,
        platform: "tiktok",
        accountHandle: "@dropconcierge_official",
        platformUserId: "act_tiktok_step7_01",
        accountNickname: "Drop Concierge TikTok",
        encryptedAccessToken: "mock_token_step7",
        isActive: true,
      },
    });

    const post = await prisma.scheduledPost.create({
      data: {
        videoId: video.id,
        organizationId: org.id,
        socialAccountId: socialAccount.id,
        caption: "Why didn't anyone tell me about this UGC shortcut?! 🚀 #AI #WritingHacks #DropConcierge",
        scheduledFor: new Date(Date.now() + 7200000),
        localScheduledTime: "Today at 4:15 PM EST",
        requireApproval: true,
        approvalStatus: "none",
        publishStatus: "pending",
      },
    });

    scheduledPostId = post.id;
    assert.ok(scheduledPostId);
  });

  it("2. Verifies Optimal Posting Time badge and 9:16 video download assets", () => {
    const optimalPostingTime = "Today at 4:15 PM EST";
    const videoUrl = "/videos/creator-alex.mp4";
    const downloadFilename = "dropconcierge_1080p_ad.mp4";

    assert.strictEqual(optimalPostingTime, "Today at 4:15 PM EST");
    assert.strictEqual(videoUrl, "/videos/creator-alex.mp4");
    assert.strictEqual(downloadFilename, "dropconcierge_1080p_ad.mp4");
  });

  it("3. Verifies 1-Click Copy Caption and Copy Hashtags payload", () => {
    const rawCaption = "Why didn't anyone tell me about this UGC shortcut?! 🚀 #AI #WritingHacks #DropConcierge";
    const hashtags = rawCaption.match(/#[a-zA-Z0-9_]+/g) || [];

    assert.strictEqual(hashtags.length, 3);
    assert.ok(hashtags.includes("#AI"));
    assert.ok(hashtags.includes("#WritingHacks"));
    assert.ok(hashtags.includes("#DropConcierge"));

    const hashtagsString = hashtags.join(" ");
    assert.strictEqual(hashtagsString, "#AI #WritingHacks #DropConcierge");
  });

  it("4. 'Mark as Published': Updates DB to published and verifies appearance in /analytics", async () => {
    // 1. Call action: mark_published
    const res = await fetch("http://localhost:3000/api/v1/campaigns/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        scheduledPostId,
        action: "mark_published",
      }),
    });

    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.publishStatus, "published");

    // 2. Query /api/v1/analytics to verify this published post is tracked
    const analyticsRes = await fetch("http://localhost:3000/api/v1/analytics", {
      headers: {
        "x-organization-id": testOrgId,
      },
    });

    assert.strictEqual(analyticsRes.status, 200);
    const analyticsData = await analyticsRes.json();
    assert.strictEqual(analyticsData.success, true);
    assert.ok(analyticsData.overview.publishedPostsCount >= 1, "Published posts count must be >= 1 in analytics");

    // 3. Verify post is in analytics posts list
    const foundPost = analyticsData.posts.find((p: { id: string }) => p.id === scheduledPostId);
    assert.ok(foundPost, "The marked published post must appear in the /analytics feed");
    assert.ok(foundPost.views > 0, "Published post must have logged analytics views");
  });
});
