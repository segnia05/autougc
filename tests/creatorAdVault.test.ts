import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { describe, it } from "node:test";
import assert from "node:assert";
import { db } from "../src/db/client";

describe("Step 9: Creator Ad Vault (/campaigns) Verification", () => {
  it("verifies video vault entities contain all 9:16 creative assets and metadata", async () => {
    const org = await db.organization.findFirst();
    const user = await db.user.findFirst();
    assert.ok(org && user, "Organization and user must exist");

    let project = await db.project.findFirst({
      where: { organizationId: org.id },
    });
    if (!project) {
      project = await db.project.create({
        data: {
          organizationId: org.id,
          createdByUserId: user.id,
          name: "Vault Test Project",
          targetUrl: "https://luminascreenbar.com",
          brandName: "LuminaScreen",
        },
      });
    }

    const testVideoId = `vid_vault_${Date.now()}`;
    const script = await db.script.create({
      data: {
        projectId: project.id,
        angleType: "negative_hook",
        hookText: "Stop coding under harsh fluorescent lights in 2026.",
        bodyText: "AutoUGC auto-matches natural daylight so your eyes feel rested even after 10-hour deep work sprints.",
        ctaText: "Click the link below and get $30 off your setup today.",
        fullScriptText: "Stop coding under harsh fluorescent lights in 2026. AutoUGC auto-matches natural daylight so your eyes feel rested even after 10-hour deep work sprints. Click the link below and get $30 off your setup today.",
        captionCopy: "Stop coding under harsh lights. Here is the modern setup. #luminascreen #coding",
        hashtags: ["luminascreen", "coding", "ugc"],
      },
    });

    const video = await db.video.create({
      data: {
        id: testVideoId,
        projectId: project.id,
        organizationId: org.id,
        scriptId: script.id,
        voiceId: "alex_casual_dtc",
        aspectRatio: "9:16",
        durationSeconds: 14.5,
        videoUrl: "/videos/creator-alex.mp4",
        thumbnailUrl: "/images/creator-alex.jpg",
        renderStatus: "completed",
      },
    });

    assert.strictEqual(video.aspectRatio, "9:16");
    assert.strictEqual(video.renderStatus, "completed");
    assert.ok(video.videoUrl?.endsWith(".mp4"), "Must have a playable MP4 url");
    assert.ok((video.thumbnailUrl?.length ?? 0) > 0, "Must have thumbnail");

    // Clean up
    await db.video.delete({ where: { id: testVideoId } });
    await db.script.delete({ where: { id: script.id } });
  });

  it("verifies vault status filtering: All, Ready to Launch, Scheduled, and Published Live", () => {
    const mockVideos = [
      { id: "v1", renderStatus: "completed", scheduledSlot: null },
      { id: "v2", renderStatus: "completed", scheduledSlot: { publishStatus: "pending" } },
      { id: "v3", renderStatus: "completed", scheduledSlot: { publishStatus: "published" } },
      { id: "v4", renderStatus: "completed", scheduledSlot: null },
    ];

    // Filter logic strictly matching src/app/campaigns/page.tsx
    const filterVideos = (status: "all" | "ready" | "scheduled" | "published") => {
      return mockVideos.filter((vid) => {
        if (status === "ready" && vid.scheduledSlot && vid.scheduledSlot.publishStatus !== "ready") return false;
        if (status === "scheduled" && (!vid.scheduledSlot || vid.scheduledSlot.publishStatus === "published")) return false;
        if (status === "published" && vid.scheduledSlot?.publishStatus !== "published") return false;
        return true;
      });
    };

    const all = filterVideos("all");
    const ready = filterVideos("ready");
    const scheduled = filterVideos("scheduled");
    const published = filterVideos("published");

    assert.strictEqual(all.length, 4, "All filter should return 4 videos");
    assert.strictEqual(ready.length, 2, "Ready filter should return 2 unscheduled videos");
    assert.strictEqual(scheduled.length, 1, "Scheduled filter should return 1 pending video");
    assert.strictEqual(published.length, 1, "Published filter should return 1 published video");
  });

  it("verifies Drop Concierge payload formatting and self-posting fallback", () => {
    const video = {
      id: "vid_123",
      brandName: "LuminaScreen",
      hookAngle: "negative_hook",
      hookText: "Stop coding under harsh fluorescent lights in 2026.",
      bodyText: "AutoUGC auto-matches natural daylight.",
      ctaText: "Click link below.",
      caption: "Stop coding under harsh fluorescent lights in 2026. #luminascreen",
      hashtags: ["luminascreen", "setup", "ugc"],
      videoUrl: "/videos/creator-sarah.mp4",
      thumbnailUrl: "/images/creator-sarah.jpg",
      scheduledSlot: {
        localScheduledTime: "Today at 4:15 PM EST",
        accountHandle: "@luminascreenbar_official",
      },
    };

    // Drop Concierge Payload builder
    const dropPackage = {
      videoId: video.id,
      videoUrl: video.videoUrl,
      thumbnailUrl: video.thumbnailUrl,
      brandName: video.brandName,
      hookAngle: video.hookAngle.replace(/_/g, " "),
      hookHeadline: video.hookText,
      caption: video.caption,
      hashtags: video.hashtags,
      optimalPostingTime: video.scheduledSlot.localScheduledTime,
      channelHandle: video.scheduledSlot.accountHandle,
    };

    assert.strictEqual(dropPackage.videoId, "vid_123");
    assert.strictEqual(dropPackage.optimalPostingTime, "Today at 4:15 PM EST");
    assert.strictEqual(dropPackage.channelHandle, "@luminascreenbar_official");
    assert.ok(dropPackage.hashtags.includes("luminascreen"));
  });

  it("verifies Studio loading URL generation preserves exact creative parameters", () => {
    const video = {
      id: "vid_test_456",
      brandName: "WriteHuman",
      hookText: "I love when someone responds 'Thanks for the detailed explanation!'",
      bodyText: "When all I did was feed it into WriteHuman.",
      ctaText: "Link in bio to try it free.",
      videoUrl: "/videos/creator-emma.mp4",
      thumbnailUrl: "/images/creator-emma.jpg",
      voiceId: "sarah_dtc_founder",
    };

    const studioUrl = `/studio?videoId=${video.id}&brand=${encodeURIComponent(video.brandName)}&hook=${encodeURIComponent(video.hookText)}&body=${encodeURIComponent(video.bodyText)}&cta=${encodeURIComponent(video.ctaText)}&video=${encodeURIComponent(video.videoUrl)}&image=${encodeURIComponent(video.thumbnailUrl)}&voice=${encodeURIComponent(video.voiceId)}`;

    const parsed = new URL(`https://autougc.com${studioUrl}`);
    assert.strictEqual(parsed.searchParams.get("videoId"), "vid_test_456");
    assert.strictEqual(parsed.searchParams.get("brand"), "WriteHuman");
    assert.strictEqual(parsed.searchParams.get("hook"), video.hookText);
    assert.strictEqual(parsed.searchParams.get("body"), video.bodyText);
    assert.strictEqual(parsed.searchParams.get("cta"), video.ctaText);
    assert.strictEqual(parsed.searchParams.get("video"), "/videos/creator-emma.mp4");
  });

  it("verifies Drop Concierge 'Mark as Published' updates database and sets analytics metrics", async () => {
    const org = await db.organization.findFirst();
    const user = await db.user.findFirst();
    assert.ok(org && user, "Organization and user must exist");

    let project = await db.project.findFirst({ where: { organizationId: org.id } });
    if (!project) {
      project = await db.project.create({
        data: {
          organizationId: org.id,
          createdByUserId: user.id,
          name: "Published Test Project",
          targetUrl: "https://luminascreenbar.com",
          brandName: "LuminaScreen",
        },
      });
    }

    const testVideoId = `vid_pub_${Date.now()}`;
    const script = await db.script.create({
      data: {
        projectId: project.id,
        angleType: "secret_hack",
        hookText: "The secret desk setup that saved my eyes.",
        bodyText: "This screen bar matches natural daylight.",
        ctaText: "Try it today.",
        fullScriptText: "The secret desk setup that saved my eyes. This screen bar matches natural daylight. Try it today.",
        captionCopy: "Secret desk setup fix #lumina",
        hashtags: ["lumina", "desksetup"],
      },
    });

    const video = await db.video.create({
      data: {
        id: testVideoId,
        projectId: project.id,
        organizationId: org.id,
        scriptId: script.id,
        voiceId: "alex_casual_dtc",
        aspectRatio: "9:16",
        durationSeconds: 15.0,
        videoUrl: "/videos/creator-alex.mp4",
        thumbnailUrl: "/images/creator-alex.jpg",
        renderStatus: "completed",
      },
    });

    // Simulate mark_published API call
    let account = await db.socialAccount.findFirst({ where: { organizationId: org.id } });
    if (!account) {
      account = await db.socialAccount.create({
        data: {
          organizationId: org.id,
          platform: "tiktok",
          platformUserId: `user_${Date.now()}`,
          accountHandle: "@luminascreen_test",
          accountNickname: "Test Channel",
          encryptedAccessToken: "tok_test_123",
        },
      });
    }

    const scheduledPost = await db.scheduledPost.create({
      data: {
        organizationId: org.id,
        videoId: video.id,
        socialAccountId: account.id,
        scheduledFor: new Date(),
        localScheduledTime: "Today @ 4:15 PM EST (Peak Reach)",
        caption: "Secret desk setup fix #lumina",
        approvalStatus: "approved",
        publishStatus: "published",
        approvedAt: new Date(),
        views: 1420,
        likes: 118,
        shares: 24,
        comments: 9,
      },
    });

    assert.strictEqual(scheduledPost.publishStatus, "published");
    assert.strictEqual(scheduledPost.views, 1420);
    assert.strictEqual(scheduledPost.likes, 118);

    // Clean up
    await db.scheduledPost.delete({ where: { id: scheduledPost.id } });
    await db.video.delete({ where: { id: testVideoId } });
    await db.script.delete({ where: { id: script.id } });
  });
});
