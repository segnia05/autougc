import { getOrganizationCredits, deductCredit } from "../src/lib/billing/credits";
import { BILLING_PLANS } from "../src/lib/billing/stripe";
import { prisma } from "../src/db/client";

async function runPlanAccessTests() {
  console.log("=== Running Plan Access & Tier Gating Production Verification ===");

  const testOrgId = `org_plan_test_${Date.now()}`;
  const testUserId = `user_plan_test_${Date.now()}`;

  // 1. Verify Free Tier Defaults & Quotas
  console.log("--- Step 1: Free Tier Default Quotas ---");
  const freePlan = BILLING_PLANS.free;
  if (freePlan.monthlyCredits !== 3 || freePlan.maxConnectedAccounts !== 1) {
    console.error("✗ Failed: Free tier configuration invalid:", freePlan);
    process.exit(1);
  }
  console.log(`✓ Free tier verified: ${freePlan.monthlyCredits} video export credits, max ${freePlan.maxConnectedAccounts} account.`);

  // Create test organization on Free tier in Neon
  await prisma.organization.create({
    data: {
      id: testOrgId,
      name: "Plan Gate Test DTC",
      slug: `org-${testOrgId.slice(-10)}`,
      billingEmail: `${testOrgId}@autougc.com`,
      subscription: {
        create: {
          stripeCustomerId: `cus_${testOrgId.slice(-10)}`,
          planTier: "free",
          status: "active",
          creditsMonthlyAllowance: 3,
          creditsRemaining: 3,
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      },
    },
  });

  const initialCredits = await getOrganizationCredits(testOrgId);
  if (initialCredits.planTier !== "free" || initialCredits.creditsRemaining !== 3) {
    console.error("✗ Failed to verify initial free credits in Neon DB:", initialCredits);
    process.exit(1);
  }
  console.log(`✓ Free tier active in Neon: ${initialCredits.creditsRemaining} credits remaining.`);

  // 2. Consume Free Credits
  console.log("--- Step 2: Credit Consumption & Zero-Credit Paywall Trigger ---");
  for (let i = 1; i <= 3; i++) {
    const res = await deductCredit(testOrgId, `render_test_${i}`, 1, testUserId);
    if (!res.success) {
      console.error(`✗ Render #${i} deduction failed unexpectedly:`, res);
      process.exit(1);
    }
    console.log(`✓ Video render #${i} authorized. Remaining credits: ${res.creditsRemaining}`);
  }

  // 4th render must be blocked with insufficient credits
  const blockedRender = await deductCredit(testOrgId, "render_test_blocked", 1, testUserId);
  if (blockedRender.success) {
    console.error("✗ Failed: 4th render was not blocked despite 0 credits remaining!");
    process.exit(1);
  }
  console.log(`✓ 4th render cleanly blocked (0 credits remaining). Error: "${blockedRender.error}"`);

  // 3. Upgrade to Growth Plan ($89/mo)
  console.log("--- Step 3: Atomic Plan Upgrade to Growth ($89/mo) ---");
  const growthPlan = BILLING_PLANS.growth;
  await prisma.subscription.update({
    where: { organizationId: testOrgId },
    data: {
      planTier: "growth",
      creditsMonthlyAllowance: growthPlan.monthlyCredits,
      creditsRemaining: growthPlan.monthlyCredits,
    },
  });

  const upgradedCredits = await getOrganizationCredits(testOrgId);
  if (upgradedCredits.planTier !== "growth" || upgradedCredits.creditsRemaining !== 60) {
    console.error("✗ Upgrade to Growth failed:", upgradedCredits);
    process.exit(1);
  }
  console.log(`✓ Upgraded to Growth! New allowance: ${upgradedCredits.monthlyAllowance}, Remaining: ${upgradedCredits.creditsRemaining}`);

  // 4. Verify Render Now Succeeds
  const postUpgradeRender = await deductCredit(testOrgId, "render_post_upgrade", 1, testUserId);
  if (!postUpgradeRender.success || postUpgradeRender.creditsRemaining !== 59) {
    console.error("✗ Render failed after Growth upgrade:", postUpgradeRender);
    process.exit(1);
  }
  console.log(`✓ Video ad render succeeded on Growth tier! Balance: ${postUpgradeRender.creditsRemaining} credits.`);

  // 5. Account Capacity Limit Checks
  console.log("--- Step 4: Multi-Account Capacity Rules ---");
  const accountLimits = {
    free: BILLING_PLANS.free.maxConnectedAccounts,
    starter: BILLING_PLANS.starter.maxConnectedAccounts,
    growth: BILLING_PLANS.growth.maxConnectedAccounts,
    scale: BILLING_PLANS.scale.maxConnectedAccounts,
  };

  if (
    accountLimits.free !== 1 ||
    accountLimits.starter !== 1 ||
    accountLimits.growth !== 5 ||
    accountLimits.scale !== 15
  ) {
    console.error("✗ Account capacity limits misconfigured:", accountLimits);
    process.exit(1);
  }
  console.log(`✓ Account limits verified: Free (1), Starter (1), Growth (5), Scale (15).`);

  // Clean up test organization
  await prisma.organization.delete({ where: { id: testOrgId } });
  console.log("✓ Cleaned up test organization from Neon DB.");

  console.log("=== ALL PLAN ACCESS & TIER GATING TESTS PASSED CLEANLY! ===");
}

runPlanAccessTests().catch((err) => {
  console.error("Plan access test failure:", err);
  process.exit(1);
});
