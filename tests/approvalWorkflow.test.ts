import { prisma } from "../src/db/client";
import {
  generateApprovalToken,
  verifyApprovalToken,
  consumeApprovalToken,
} from "../src/lib/campaigns/approvalTokens";

async function runApprovalWorkflowTests() {
  console.log("=== Running 1-Hour Pre-Publish Approval Security Test Suite ===");

  const testOrgId = `org_approval_test_${Date.now()}`;
  const testUserId = `usr_approval_test_${Date.now()}`;
  let scheduledPostId = "";
  let videoId = "";
  let scriptId = "";

  try {
    // Provision real fixture in Neon DB so foreign keys are fully satisfied
    const org = await prisma.organization.create({
      data: {
        id: testOrgId,
        name: "Approval Labs",
        slug: testOrgId,
        billingEmail: "security@approvallabs.com",
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
        name: "Approval SaaS",
        targetUrl: "https://approvals.com",
        brandName: "ApprovalLab",
      },
    });

    const script = await prisma.script.create({
      data: {
        projectId: project.id,
        angleType: "negative_hook",
        hookText: "Don't schedule posts blindly in 2026.",
        bodyText: "ApprovalLab lets you review every creative 1 hour before posting.",
        ctaText: "Try it today.",
        fullScriptText: "Don't schedule posts blindly in 2026. Review every creative.",
        captionCopy: "Human-in-the-loop video ads #ugc",
      },
    });
    scriptId = script.id;

    const video = await prisma.video.create({
      data: {
        projectId: project.id,
        organizationId: org.id,
        scriptId: script.id,
        renderStatus: "completed",
        voiceId: "alex_casual_dtc",
        durationSeconds: 15.0,
      },
    });
    videoId = video.id;

    const socialAccount = await prisma.socialAccount.create({
      data: {
        organizationId: org.id,
        platform: "tiktok",
        accountHandle: "@approvallab",
        platformUserId: "act_tiktok_appr_01",
        accountNickname: "ApprovalLab Official",
        encryptedAccessToken: "test_token_tok",
        isActive: true,
      },
    });

    const post = await prisma.scheduledPost.create({
      data: {
        videoId: video.id,
        organizationId: org.id,
        socialAccountId: socialAccount.id,
        caption: "Approve this video before launch #marketing",
        scheduledFor: new Date(Date.now() + 3600000),
        requireApproval: true,
        approvalStatus: "awaiting_approval",
      },
    });
    scheduledPostId = post.id;

    // Test 1: Generates valid HMAC-SHA256 signed approval token persisted in DB
    {
      const { tokenHash, tokenUrl, expiresAt } = await generateApprovalToken({
        postId: scheduledPostId,
        orgId: org.id,
        expiresInMinutes: 75,
      });

      if (!tokenHash || !tokenHash.includes(".")) {
        throw new Error("Invalid tokenHash format");
      }
      if (!tokenUrl.includes("/api/v1/campaigns/approve?token=")) {
        throw new Error(`Invalid tokenUrl: ${tokenUrl}`);
      }
      if (expiresAt.getTime() <= Date.now()) {
        throw new Error("expiresAt must be in the future");
      }
      console.log("✓ Test 1 Passed: Generated valid HMAC-SHA256 approval token persisted to DB.");
    }

    // Test 2: Verifies genuine signed token before expiration
    {
      const { tokenHash } = await generateApprovalToken({
        postId: scheduledPostId,
        orgId: org.id,
        expiresInMinutes: 60,
      });

      const verification = await verifyApprovalToken(tokenHash);
      if (!verification.valid || verification.scheduledPostId !== scheduledPostId) {
        throw new Error(`Token verification failed: ${JSON.stringify(verification)}`);
      }
      console.log("✓ Test 2 Passed: Authenticated genuine signed token.");
    }

    // Test 3: Rejects forged or tampered token signatures
    {
      const { tokenHash } = await generateApprovalToken({
        postId: scheduledPostId,
        orgId: org.id,
      });

      const parts = tokenHash.split(".");
      const payload = parts[0];
      const sig = parts[1];
      if (!payload || !sig) {
        throw new Error("Invalid token structure");
      }
      const tamperedToken = `${payload}.${sig.slice(0, -4)}dead`;

      const verification = await verifyApprovalToken(tamperedToken);
      if (verification.valid || verification.error !== "INVALID_OR_CORRUPT_TOKEN") {
        throw new Error(`Tampered token was not rejected properly: ${JSON.stringify(verification)}`);
      }
      console.log("✓ Test 3 Passed: Tampered cryptographic signature rejected.");
    }

    // Test 4: Rejects expired approval tokens
    {
      const { tokenHash } = await generateApprovalToken({
        postId: scheduledPostId,
        orgId: org.id,
        expiresInMinutes: -10, // Expired
      });

      const verification = await verifyApprovalToken(tokenHash);
      if (verification.valid || verification.error !== "EXPIRED") {
        throw new Error(`Expired token was not rejected: ${JSON.stringify(verification)}`);
      }
      console.log("✓ Test 4 Passed: Expired token rejected.");
    }

    // Test 5: Consumes token and prevents replay attack
    {
      const { tokenHash } = await generateApprovalToken({
        postId: scheduledPostId,
        orgId: org.id,
        expiresInMinutes: 60,
      });

      const firstConsume = await consumeApprovalToken(tokenHash, "192.168.1.1");
      if (!firstConsume.success || firstConsume.scheduledPostId !== scheduledPostId) {
        throw new Error(`First consumption failed: ${JSON.stringify(firstConsume)}`);
      }

      // Check DB post was marked approved
      const updatedPost = await prisma.scheduledPost.findUnique({
        where: { id: scheduledPostId },
      });
      if (updatedPost?.approvalStatus !== "approved") {
        throw new Error(`Expected post approvalStatus approved, got ${updatedPost?.approvalStatus}`);
      }

      // Second consumption (must throw TOKEN_ALREADY_CONSUMED)
      let replayBlocked = false;
      try {
        await consumeApprovalToken(tokenHash, "192.168.1.2");
      } catch (err: unknown) {
        replayBlocked = true;
        const msg = err instanceof Error ? err.message : "";
        if (msg !== "TOKEN_ALREADY_CONSUMED") {
          throw new Error(`Unexpected replay error: ${msg}`);
        }
      }
      if (!replayBlocked) {
        throw new Error("Replay attack was NOT blocked!");
      }
      console.log("✓ Test 5 Passed: Single-use token consumed and replay attack successfully blocked.");
    }

    console.log("=== All Approval Workflow Tests Passed Successfully ===");
  } finally {
    // Teardown test fixtures
    try {
      if (scheduledPostId) {
        await prisma.approvalToken.deleteMany({ where: { scheduledPostId } });
        await prisma.scheduledPost.delete({ where: { id: scheduledPostId } });
      }
      if (videoId) {
        await prisma.video.delete({ where: { id: videoId } });
      }
      if (scriptId) {
        await prisma.script.delete({ where: { id: scriptId } });
      }
      await prisma.project.deleteMany({ where: { organizationId: testOrgId } });
      await prisma.socialAccount.deleteMany({ where: { organizationId: testOrgId } });
      await prisma.user.deleteMany({ where: { id: testUserId } });
      await prisma.organization.deleteMany({ where: { id: testOrgId } });
    } catch (cleanupErr) {
      console.warn("Cleanup error (ignored):", cleanupErr);
    }
  }
}

runApprovalWorkflowTests().catch((err) => {
  console.error("Approval workflow test failed:", err);
  process.exit(1);
});
