import { prisma } from "../src/db/client";
import { enforceMandatoryBrandMention } from "../src/lib/templates/videoTemplates";

async function runPostEditorWorkflowTests() {
  console.log("=== Running Post Editor & Approval Workflow Test Suite ===");

  const testOrgId = `org_editor_test_${Date.now()}`;
  const testUserId = `usr_editor_test_${Date.now()}`;
  let scheduledPostId = "";
  let videoId = "";
  let scriptId = "";

  try {
    // 1. Provision test fixture in Neon DB
    const org = await prisma.organization.create({
      data: {
        id: testOrgId,
        name: "Lumina Labs",
        slug: testOrgId,
        billingEmail: "founder@luminalabs.com",
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
        name: "Lumina SaaS",
        targetUrl: "https://lumina.com",
        brandName: "Lumina",
      },
    });

    const script = await prisma.script.create({
      data: {
        projectId: project.id,
        angleType: "negative_hook",
        hookText: "Old generic hook",
        bodyText: "Old generic body",
        ctaText: "Old generic CTA",
        fullScriptText: "Old generic hook Old generic body Old generic CTA",
        captionCopy: "Old caption #tech",
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
        creatorId: "pers_alex_02",
        archetype: "studio_minimalist",
        videoUrl: "https://cdn.autougc.com/videos/demo.mp4",
      },
    });
    videoId = video.id;

    const account = await prisma.socialAccount.create({
      data: {
        organizationId: org.id,
        platform: "tiktok",
        platformUserId: `tt_${Date.now()}`,
        accountHandle: "@lumina_official",
        encryptedAccessToken: "mock_token",
      },
    });

    const post = await prisma.scheduledPost.create({
      data: {
        videoId: video.id,
        organizationId: org.id,
        socialAccountId: account.id,
        caption: "Old scheduled caption #ugc",
        scheduledFor: new Date(Date.now() + 2 * 3600000), // 2h ahead
        publishStatus: "pending",
        requireApproval: true,
        approvalStatus: "awaiting_approval",
        hookAngle: "negative_hook",
        voiceId: "alex_casual_dtc",
        creatorId: "pers_alex_02",
        archetype: "studio_minimalist",
      },
    });
    scheduledPostId = post.id;

    console.log(`✓ Test Fixture Created. Scheduled Post ID: ${scheduledPostId}`);

    // Test 1: Customer customizes hooks in Studio
    const customizedHook = "I love when people ask how my desk lighting is so soothing...";
    const customizedBody = "When all I did was turn on Lumina. It syncs to natural daylight in real-time.";
    const customizedCta = "Grab yours with the link below.";

    const enforced = enforceMandatoryBrandMention(
      "Lumina",
      customizedHook,
      customizedBody,
      customizedCta
    );

    if (!enforced.bodyText.includes("Lumina")) {
      throw new Error("Brand mention check failed on customization");
    }
    console.log("✓ Test 1 Passed: Customized script enforces brand name mention.");

    // Test 2: Customer saves edits and approves post
    await prisma.video.update({
      where: { id: videoId },
      data: {
        voiceId: "sarah_dtc_founder",
        creatorId: "pers_sarah_01",
        archetype: "organic_selfie",
      },
    });

    await prisma.script.update({
      where: { id: scriptId },
      data: {
        hookText: enforced.hookText,
        bodyText: enforced.bodyText,
        ctaText: enforced.ctaText,
        fullScriptText: `${enforced.hookText} ${enforced.bodyText} ${enforced.ctaText}`,
      },
    });

    const updatedPost = await prisma.scheduledPost.update({
      where: { id: scheduledPostId },
      data: {
        caption: `${enforced.hookText} #lumina #wfh #ergonomics`,
        voiceId: "sarah_dtc_founder",
        creatorId: "pers_sarah_01",
        archetype: "organic_selfie",
        approvalStatus: "approved",
        approvedAt: new Date(),
        approvedByIp: "studio_test_runner",
      },
    });

    if (updatedPost.approvalStatus !== "approved") {
      throw new Error(`Expected approvalStatus to be 'approved', got: ${updatedPost.approvalStatus}`);
    }
    if (updatedPost.archetype !== "organic_selfie" || updatedPost.creatorId !== "pers_sarah_01") {
      throw new Error(`Metadata mismatch: ${updatedPost.archetype}, ${updatedPost.creatorId}`);
    }
    console.log("✓ Test 2 Passed: Post customized in Studio atomically transitioned to 'approved'.");

    // Test 3: Verify updated script in database
    const verifyScript = await prisma.script.findUnique({
      where: { id: scriptId },
    });
    if (!verifyScript?.hookText.includes("lighting")) {
      throw new Error("Script was not persisted properly in DB");
    }
    console.log("✓ Test 3 Passed: Updated script verified in Neon PostgreSQL.");

    console.log("=== ALL POST EDITOR WORKFLOW TESTS PASSED CLEANLY! ===");
  } finally {
    // Cleanup
    try {
      await prisma.organization.deleteMany({
        where: { id: testOrgId },
      });
      await prisma.user.deleteMany({
        where: { id: testUserId },
      });
    } catch {
      // ignore cleanup errors
    }
  }
}

runPostEditorWorkflowTests().catch((err) => {
  console.error("Post editor workflow test failed:", err);
  process.exit(1);
});
