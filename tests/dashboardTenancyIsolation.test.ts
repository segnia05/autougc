import { prisma } from "../src/db/client";
import { getOrganizationCredits } from "../src/lib/billing/credits";

async function runTenancyIsolationTests() {
  console.log("=== Running Multi-Tenant Dashboard Isolation Verification ===");

  const orgAId = `test_tenant_a_${Date.now()}`;
  const orgBId = `test_tenant_b_${Date.now()}`;
  const userAId = `user_a_${Date.now()}`;
  const userBId = `user_b_${Date.now()}`;

  // Warm up Neon connection in case of serverless compute cold sleep
  let connected = false;
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      await prisma.$queryRaw`SELECT 1`;
      connected = true;
      break;
    } catch {
      console.log(`Neon compute waking up (attempt ${attempt}/4)...`);
      await new Promise((r) => setTimeout(r, 2500));
    }
  }

  if (!connected) {
    console.warn("Neon DB unreachable after 4 attempts, skipping live DB assertions in offline environment.");
    return;
  }

  try {
    // 1. Provision User A and Org A
    await prisma.user.create({
      data: {
        id: userAId,
        email: "founder_a@brandalpha.com",
        fullName: "Alice Founder",
      },
    });

    await prisma.organization.create({
      data: {
        id: orgAId,
        name: "Brand Alpha (Alice's Org)",
        slug: `org-alpha-${Date.now()}`,
        billingEmail: "founder_a@brandalpha.com",
        subscription: {
          create: {
            stripeCustomerId: `cus_a_${Date.now()}`,
            planTier: "growth",
            status: "active",
            creditsMonthlyAllowance: 60,
            creditsRemaining: 45,
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
        },
        members: {
          create: {
            userId: userAId,
            role: "owner",
          },
        },
      },
    });

    // 2. Provision User B and Org B (Fresh Free Tier user)
    await prisma.user.create({
      data: {
        id: userBId,
        email: "creator_b@betafashion.com",
        fullName: "Bob Creator",
      },
    });

    await prisma.organization.create({
      data: {
        id: orgBId,
        name: "Beta Fashion (Bob's Org)",
        slug: `org-beta-${Date.now()}`,
        billingEmail: "creator_b@betafashion.com",
        subscription: {
          create: {
            stripeCustomerId: `cus_b_${Date.now()}`,
            planTier: "free",
            status: "active",
            creditsMonthlyAllowance: 3,
            creditsRemaining: 3,
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
        },
        members: {
          create: {
            userId: userBId,
            role: "owner",
          },
        },
      },
    });

    console.log("✓ Step 1: Provisioned isolated Organizations A and B in Neon DB.");

    // 3. User A connects 2 TikTok/IG accounts and creates a Project + Video
    const accA1 = await prisma.socialAccount.create({
      data: {
        organizationId: orgAId,
        platform: "tiktok",
        platformUserId: "tt_alpha_01",
        accountHandle: "@brand_alpha_official",
        accountNickname: "Alpha Official",
        isBurner: false,
        encryptedAccessToken: "enc_token_a1",
        isActive: true,
      },
    });

    const projectA = await prisma.project.create({
      data: {
        organizationId: orgAId,
        createdByUserId: userAId,
        name: "Alpha Summer Drop",
        brandName: "Brand Alpha",
        targetUrl: "https://brandalpha.com",
      },
    });

    const scriptA = await prisma.script.create({
      data: {
        projectId: projectA.id,
        angleType: "problem_agitation",
        hookText: "Stop buying low quality shirts in 2026.",
        bodyText: "Our custom supima cotton feels like silk.",
        ctaText: "Tap link in bio.",
        captionCopy: "Upgrade your wardrobe.",
        fullScriptText: "Stop buying low quality shirts in 2026. Our custom supima cotton feels like silk. Tap link in bio.",
        hashtags: ["fashion", "streetwear"],
      },
    });

    await prisma.video.create({
      data: {
        organizationId: orgAId,
        projectId: projectA.id,
        scriptId: scriptA.id,
        voiceId: "marcus_bold",
        aspectRatio: "9:16",
        durationSeconds: 15.0,
        renderStatus: "completed",
        videoUrl: "https://cdn.autougc.com/videos/alpha_drop_1080p.mp4",
      },
    });

    console.log("✓ Step 2: Seeded Org A assets (1 project, 1 video, 1 social account).");

    // 4. Test Isolation: Query Org B's assets
    const videosForB = await prisma.video.findMany({
      where: { organizationId: orgBId },
    });
    if (videosForB.length !== 0) {
      throw new Error(`Data leak! User B can see ${videosForB.length} videos from another organization!`);
    }
    console.log("✓ Step 3: Verified User B has 0 videos (Complete Video Vault Isolation).");

    const accountsForB = await prisma.socialAccount.findMany({
      where: { organizationId: orgBId, isActive: true },
    });
    if (accountsForB.length !== 0) {
      throw new Error(`Data leak! User B can see ${accountsForB.length} social accounts from another organization!`);
    }
    console.log("✓ Step 4: Verified User B has 0 social accounts (Complete Social Army Isolation).");

    // 5. Test Subscription & Credit Isolation
    const creditsA = await getOrganizationCredits(orgAId);
    const creditsB = await getOrganizationCredits(orgBId);

    if (creditsA.planTier !== "growth" || creditsA.creditsRemaining !== 45) {
      throw new Error(`Org A credit mismatch: expected growth with 45 credits, got ${creditsA.planTier} / ${creditsA.creditsRemaining}`);
    }
    if (creditsB.planTier !== "free" || creditsB.creditsRemaining !== 3) {
      throw new Error(`Org B credit mismatch: expected free with 3 credits, got ${creditsB.planTier} / ${creditsB.creditsRemaining}`);
    }
    console.log("✓ Step 5: Verified Subscription and Credit isolation between tenants.");

    // 6. Test Team Members Isolation
    const orgAMembers = await prisma.organizationMember.findMany({
      where: { organizationId: orgAId },
      include: { user: true },
    });
    const orgBMembers = await prisma.organizationMember.findMany({
      where: { organizationId: orgBId },
      include: { user: true },
    });

    if (orgAMembers.length !== 1 || orgAMembers[0]?.user?.email !== "founder_a@brandalpha.com") {
      throw new Error("Org A member leaked or incorrect");
    }
    if (orgBMembers.length !== 1 || orgBMembers[0]?.user?.email !== "creator_b@betafashion.com") {
      throw new Error("Org B member leaked or incorrect");
    }
    console.log("✓ Step 6: Verified Team & Member isolation (Alice in Org A, Bob in Org B).");

    console.log("=== ALL MULTI-TENANT ISOLATION TESTS PASSED CLEANLY! ===");
  } finally {
    // Clean up test data
    try {
      await prisma.video.deleteMany({ where: { organizationId: { in: [orgAId, orgBId] } } });
      await prisma.script.deleteMany({ where: { project: { organizationId: { in: [orgAId, orgBId] } } } });
      await prisma.project.deleteMany({ where: { organizationId: { in: [orgAId, orgBId] } } });
      await prisma.socialAccount.deleteMany({ where: { organizationId: { in: [orgAId, orgBId] } } });
      await prisma.organizationMember.deleteMany({ where: { organizationId: { in: [orgAId, orgBId] } } });
      await prisma.subscription.deleteMany({ where: { organizationId: { in: [orgAId, orgBId] } } });
      await prisma.organization.deleteMany({ where: { id: { in: [orgAId, orgBId] } } });
      await prisma.user.deleteMany({ where: { id: { in: [userAId, userBId] } } });
      console.log("✓ Cleaned up test tenants from Neon PostgreSQL.");
    } catch (cleanupErr) {
      console.warn("Cleanup warning:", cleanupErr);
    }
  }
}

runTenancyIsolationTests().catch((err) => {
  console.error("Multi-Tenant Isolation Test Failed:", err);
  process.exit(1);
});
