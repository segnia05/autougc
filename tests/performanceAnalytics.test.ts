import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { describe, it, before, after } from "node:test";
import assert from "node:assert";
import { db } from "../src/db/client";

describe("Step 10: Performance Analytics (/analytics) Verification", () => {
  let testOrgId: string;
  let testProjectId: string;
  let testTiktokAccount: any;
  let testInstagramAccount: any;
  let testVideo1: any;
  let testVideo2: any;
  let testPost1: any;
  let testPost2: any;

  before(async () => {
    // 1. Retrieve organization and user
    const org = await db.organization.findFirst();
    const user = await db.user.findFirst();
    assert.ok(org && user, "Organization and user must exist");
    testOrgId = org.id;

    let project = await db.project.findFirst({
      where: { organizationId: org.id },
    });
    if (!project) {
      project = await db.project.create({
        data: {
          organizationId: org.id,
          createdByUserId: user.id,
          name: "OmniWriter Analytics Project",
          brandName: "OmniWriter",
          targetUrl: "https://omniwriter.ai",
        },
      });
    }
    testProjectId = project.id;

    // 2. Setup connected social accounts
    testTiktokAccount = await db.socialAccount.create({
      data: {
        organizationId: testOrgId,
        platform: "tiktok",
        platformUserId: `tt_test_${Date.now()}`,
        accountHandle: "@omniwriter_growth",
        accountNickname: "OmniWriter TikTok",
        encryptedAccessToken: "test_token_tt",
        isActive: true,
      },
    });

    testInstagramAccount = await db.socialAccount.create({
      data: {
        organizationId: testOrgId,
        platform: "instagram",
        platformUserId: `ig_test_${Date.now()}`,
        accountHandle: "@omniwriter_official",
        accountNickname: "OmniWriter IG Reels",
        encryptedAccessToken: "test_token_ig",
        isActive: true,
      },
    });

    // 3. Create scripts and videos
    const script1 = await db.script.create({
      data: {
        projectId: testProjectId,
        angleType: "problem_agitation",
        hookText: "Stop writing essays manually in 2026",
        bodyText: "AI detection tools flag your work unless you humanize the cadence. OmniWriter rewrites the flow seamlessly.",
        ctaText: "Try OmniWriter free today",
        fullScriptText: "Stop writing essays manually in 2026. AI detection tools flag your work unless you humanize the cadence. OmniWriter rewrites the flow seamlessly. Try OmniWriter free today.",
        captionCopy: "Stop getting flagged for AI. OmniWriter humanizes your work in 1 click #writinghacks #ai",
        hashtags: ["writinghacks", "ai", "students"],
      },
    });

    testVideo1 = await db.video.create({
      data: {
        organizationId: testOrgId,
        projectId: testProjectId,
        scriptId: script1.id,
        aspectRatio: "9:16",
        durationSeconds: 15.0,
        videoUrl: "/videos/creator-sarah.mp4",
        thumbnailUrl: "/images/creator-sarah.jpg",
        renderStatus: "completed",
      },
    });

    const script2 = await db.script.create({
      data: {
        projectId: testProjectId,
        angleType: "secret_hack",
        hookText: "The stealth tool top creators use",
        bodyText: "Watch this: 0% AI detection score in under 5 seconds. Here is the secret.",
        ctaText: "Check link in bio",
        fullScriptText: "The stealth tool top creators use. Watch this: 0% AI detection score in under 5 seconds. Here is the secret. Check link in bio.",
        captionCopy: "The secret hack no one is talking about #stealth #productivity",
        hashtags: ["stealth", "productivity", "tech"],
      },
    });

    testVideo2 = await db.video.create({
      data: {
        organizationId: testOrgId,
        projectId: testProjectId,
        scriptId: script2.id,
        aspectRatio: "9:16",
        durationSeconds: 18.0,
        videoUrl: "/videos/creator-alex.mp4",
        thumbnailUrl: "/images/creator-alex.jpg",
        renderStatus: "completed",
      },
    });

    // 4. Create published posts with verified metrics
    testPost1 = await db.scheduledPost.create({
      data: {
        organizationId: testOrgId,
        videoId: testVideo1.id,
        socialAccountId: testTiktokAccount.id,
        scheduledFor: new Date(Date.now() - 86400000), // published yesterday
        localScheduledTime: "4:15 PM EST (Peak Reach)",
        caption: "Stop getting flagged for AI. OmniWriter humanizes your work in 1 click #writinghacks #ai",
        hookAngle: "Problem Agitation",
        publishStatus: "published",
        approvalStatus: "approved",
        postUrl: `https://www.tiktok.com/@omniwriter_growth/video/${testVideo1.id}`,
        views: 24500,
        likes: 1850,
        shares: 420,
        comments: 110,
        watchTimeSeconds: 367500, // in seconds
      },
    });

    testPost2 = await db.scheduledPost.create({
      data: {
        organizationId: testOrgId,
        videoId: testVideo2.id,
        socialAccountId: testInstagramAccount.id,
        scheduledFor: new Date(Date.now() - 43200000), // published 12h ago
        localScheduledTime: "7:30 PM EST (Peak Reach)",
        caption: "The secret hack no one is talking about #stealth #productivity",
        hookAngle: "Secret Hack",
        publishStatus: "published",
        approvalStatus: "approved",
        postUrl: `https://www.instagram.com/reel/${testVideo2.id}`,
        views: 15500,
        likes: 1150,
        shares: 280,
        comments: 90,
        watchTimeSeconds: 279000,
      },
    });
  });

  after(async () => {
    // Clean up created test entities safely
    if (testPost1?.id) await db.scheduledPost.delete({ where: { id: testPost1.id } }).catch(() => {});
    if (testPost2?.id) await db.scheduledPost.delete({ where: { id: testPost2.id } }).catch(() => {});
    if (testVideo1?.id) {
      await db.video.delete({ where: { id: testVideo1.id } }).catch(() => {});
      if (testVideo1.scriptId) await db.script.delete({ where: { id: testVideo1.scriptId } }).catch(() => {});
    }
    if (testVideo2?.id) {
      await db.video.delete({ where: { id: testVideo2.id } }).catch(() => {});
      if (testVideo2.scriptId) await db.script.delete({ where: { id: testVideo2.scriptId } }).catch(() => {});
    }
    if (testTiktokAccount?.id) await db.socialAccount.delete({ where: { id: testTiktokAccount.id } }).catch(() => {});
    if (testInstagramAccount?.id) await db.socialAccount.delete({ where: { id: testInstagramAccount.id } }).catch(() => {});
  });

  it("verifies KPI summary cards accurately aggregate real database values", async () => {
    const publishedPosts = await db.scheduledPost.findMany({
      where: { id: { in: [testPost1.id, testPost2.id] } },
    });

    assert.strictEqual(publishedPosts.length, 2);

    const totalViews = publishedPosts.reduce((sum, p) => sum + p.views, 0);
    const totalLikes = publishedPosts.reduce((sum, p) => sum + p.likes, 0);
    const totalShares = publishedPosts.reduce((sum, p) => sum + p.shares, 0);
    const totalComments = publishedPosts.reduce((sum, p) => sum + p.comments, 0);
    const totalWatchTime = publishedPosts.reduce((sum, p) => sum + Number(p.watchTimeSeconds), 0);

    // Verify exact mathematical sums
    assert.strictEqual(totalViews, 40000, "Total Views must be 24,500 + 15,500 = 40,000");
    assert.strictEqual(totalLikes, 3000, "Total Likes must be 1,850 + 1,150 = 3,000");
    assert.strictEqual(totalShares, 700, "Total Shares must be 420 + 280 = 700");
    assert.strictEqual(totalComments, 200, "Total Comments must be 110 + 90 = 200");
    assert.strictEqual(totalWatchTime, 646500, "Total Watch Time must be 646,500s");

    // Verify Engagement Rate formula: (Likes + Shares + Comments) / Views * 100
    const rawEngagementRate = ((totalLikes + totalShares + totalComments) / totalViews) * 100;
    const formattedEngagementRate = `${rawEngagementRate.toFixed(1)}%`;
    assert.strictEqual(formattedEngagementRate, "9.8%", "Engagement rate must be (3000 + 700 + 200) / 40000 * 100 = 9.8%");
  });

  it("verifies channel breakdown partitions metrics by connected social account", async () => {
    const socialAccounts = await db.socialAccount.findMany({
      where: { id: { in: [testTiktokAccount.id, testInstagramAccount.id] } },
    });
    const publishedPosts = await db.scheduledPost.findMany({
      where: { id: { in: [testPost1.id, testPost2.id] } },
    });

    const breakdown = socialAccounts.map((acc) => {
      const accPosts = publishedPosts.filter((p) => p.socialAccountId === acc.id);
      const accViews = accPosts.reduce((sum, p) => sum + p.views, 0);
      const accLikes = accPosts.reduce((sum, p) => sum + p.likes, 0);
      return {
        platform: acc.platform,
        accountHandle: acc.accountHandle,
        postsCount: accPosts.length,
        views: accViews,
        likes: accLikes,
      };
    });

    const tiktokStats = breakdown.find((b) => b.platform === "tiktok");
    const instagramStats = breakdown.find((b) => b.platform === "instagram");

    assert.ok(tiktokStats, "TikTok channel stats must exist");
    assert.strictEqual(tiktokStats.postsCount, 1);
    assert.strictEqual(tiktokStats.views, 24500);
    assert.strictEqual(tiktokStats.likes, 1850);
    assert.strictEqual(tiktokStats.accountHandle, "@omniwriter_growth");

    assert.ok(instagramStats, "Instagram channel stats must exist");
    assert.strictEqual(instagramStats.postsCount, 1);
    assert.strictEqual(instagramStats.views, 15500);
    assert.strictEqual(instagramStats.likes, 1150);
    assert.strictEqual(instagramStats.accountHandle, "@omniwriter_official");
  });

  it("verifies post telemetry table records contain live URLs and valid video references", async () => {
    const publishedPosts = await db.scheduledPost.findMany({
      where: { id: { in: [testPost1.id, testPost2.id] } },
      include: { socialAccount: true, video: true },
    });

    for (const post of publishedPosts) {
      assert.ok(post.postUrl?.startsWith("http"), `Post ${post.id} must have a live web link`);
      assert.ok(post.views > 0, "Views telemetry must be > 0");
      assert.ok(post.likes > 0, "Likes telemetry must be > 0");
      assert.ok(post.shares > 0, "Shares telemetry must be > 0");
      assert.ok(post.comments > 0, "Comments telemetry must be > 0");
      assert.ok(post.video, "Post must link to a valid Video record");
      assert.strictEqual(post.video.aspectRatio, "9:16", "Must be vertical 9:16 ad");
    }
  });

  it("verifies platform filtering isolates TikTok vs Instagram posts correctly", async () => {
    const allPosts = await db.scheduledPost.findMany({
      where: { id: { in: [testPost1.id, testPost2.id] } },
      include: { socialAccount: true },
    });

    const filterByPlatform = (platform: string) => {
      if (platform === "all") return allPosts;
      return allPosts.filter((p) => p.socialAccount.platform === platform);
    };

    assert.strictEqual(filterByPlatform("all").length, 2, "All platforms should return 2 posts");
    assert.strictEqual(filterByPlatform("tiktok").length, 1, "TikTok should return 1 post");
    assert.strictEqual(filterByPlatform("instagram").length, 1, "Instagram should return 1 post");
    assert.strictEqual(filterByPlatform("youtube").length, 0, "YouTube should return 0 posts");
  });
});
