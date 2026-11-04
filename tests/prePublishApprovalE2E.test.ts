import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();

import { describe, it } from "node:test";
import assert from "node:assert";
import { prisma } from "../src/db/client";
import { dispatchApprovalNotification } from "../src/lib/email/approvalEmailDispatcher";

describe("Step 6: The 1-Hour Pre-Publish Approval Workflow", () => {
  const testOrgId = `org_test_step6_${Date.now()}`;
  const testUserId = `usr_test_step6_${Date.now()}`;
  let scheduledPostId = "";
  let generatedTokenUrl = "";

  it("1. Creates scheduled post due in 1 hour with requireApproval: true", async () => {
    const org = await prisma.organization.create({
      data: {
        id: testOrgId,
        name: "Acme SaaS",
        slug: testOrgId,
        billingEmail: "founder@acmesaas.com",
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
        name: "Acme SaaS",
        targetUrl: "https://acmesaas.com",
        brandName: "AcmeSaaS",
      },
    });

    const script = await prisma.script.create({
      data: {
        projectId: project.id,
        angleType: "problem_agitation",
        hookText: "Stop wasting hours on manual ad creation.",
        bodyText: "AutoUGC generates authentic UGC video ads in 60 seconds.",
        ctaText: "Check out the link in bio.",
        fullScriptText: "Stop wasting hours on manual ad creation. AutoUGC does it in 60 seconds.",
        captionCopy: "Stop wasting hours on manual ad creative. 🚀 #UGC #SaaS #Marketing",
      },
    });

    const video = await prisma.video.create({
      data: {
        projectId: project.id,
        organizationId: org.id,
        scriptId: script.id,
        renderStatus: "completed",
        voiceId: "alex_casual_dtc",
        durationSeconds: 22.0,
        thumbnailUrl: "/images/creator-sarah.jpg",
        videoUrl: "/videos/creator-sarah.mp4",
      },
    });

    const socialAccount = await prisma.socialAccount.create({
      data: {
        organizationId: org.id,
        platform: "tiktok",
        accountHandle: "@acmesaas_tiktok",
        platformUserId: "act_tiktok_step6_01",
        accountNickname: "AcmeSaaS TikTok Fleet",
        encryptedAccessToken: "mock_token_step6",
        isActive: true,
      },
    });

    const post = await prisma.scheduledPost.create({
      data: {
        videoId: video.id,
        organizationId: org.id,
        socialAccountId: socialAccount.id,
        caption: "Stop wasting hours on manual ad creative. 🚀 #UGC #SaaS #Marketing",
        scheduledFor: new Date(Date.now() + 3600000), // Exactly 1 hour from now
        localScheduledTime: "4:15 PM EST",
        requireApproval: true,
        approvalStatus: "none",
      },
    });

    scheduledPostId = post.id;
    assert.ok(scheduledPostId, "Scheduled post must be created");
  });

  it("2. Dispatches 1-hour pre-publish email notification with required subject and buttons", async () => {
    const dispatchResult = await dispatchApprovalNotification({ postId: scheduledPostId });

    assert.strictEqual(dispatchResult.success, true);
    assert.ok(dispatchResult.tokenUrl, "Token URL must be generated");
    generatedTokenUrl = dispatchResult.tokenUrl;

    // Verify subject line format: [Action Required] Approve your video ad publishing in 1 hour (4:15 PM EST)
    assert.strictEqual(
      dispatchResult.subject,
      "[Action Required] Approve your video ad publishing in 1 hour (4:15 PM EST)"
    );

    // Verify post status was updated to awaiting_approval
    const updated = await prisma.scheduledPost.findUnique({
      where: { id: scheduledPostId },
    });
    assert.strictEqual(updated?.approvalStatus, "awaiting_approval");
  });

  it("3. User clicks '✓ 1-Click Approve': verifies green banner and full Drop Concierge package", async () => {
    assert.ok(generatedTokenUrl, "Must have valid generatedTokenUrl");

    // Extract token param from tokenUrl
    const urlObj = new URL(generatedTokenUrl);
    const token = urlObj.searchParams.get("token");
    assert.ok(token, "Token must be present in tokenUrl");

    // Query GET /api/v1/campaigns/approve?token=...
    const res = await fetch(`http://localhost:3000/api/v1/campaigns/approve?token=${token}`);
    assert.strictEqual(res.status, 200, "Approval endpoint must return HTTP 200");

    const html = await res.text();

    // 1. Check for the green confirmation banner: "✓ Approved & Queued for Publish"
    assert.ok(
      html.includes("Approved &amp; Queued for Publish") || html.includes("Approved & Queued for Publish"),
      "Must render the green confirmation banner '✓ Approved & Queued for Publish'"
    );

    // 2. Check for the full Drop Concierge package ready to download
    assert.ok(html.includes("Ready to Drop on Socials"), "Must display Ready to Drop on Socials headline");
    assert.ok(html.includes("Download Vertical MP4"), "Must have Download MP4 button");
    assert.ok(html.includes("Copy Caption &amp; Hashtags") || html.includes("Copy Caption & Hashtags"), "Must have Copy Caption button");
    assert.ok(html.includes("@acmesaas_tiktok"), "Must display target social account");

    // 3. Verify post status in DB is now 'approved'
    const finalPost = await prisma.scheduledPost.findUnique({
      where: { id: scheduledPostId },
    });
    assert.strictEqual(finalPost?.approvalStatus, "approved");
    assert.ok(finalPost?.approvedAt, "approvedAt timestamp must be recorded");
  });
});
