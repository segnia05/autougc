import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { describe, it, before, after } from "node:test";
import assert from "node:assert";
import { db } from "../src/db/client";
import { deductCredit } from "../src/lib/billing/credits";

describe("Strict Free-Tier Zero Credits & Paywall Enforcement", () => {
  let testOrgId: string;
  let testUserId: string;

  before(async () => {
    testUserId = `usr_free_tester_${Date.now()}`;
    testOrgId = `org_free_tester_${Date.now()}`;

    // Provision new user and organization with free tier
    await db.user.create({
      data: {
        id: testUserId,
        email: `freetester_${Date.now()}@example.com`,
        fullName: "Free Tier Tester",
      },
    });

    await db.organization.create({
      data: {
        id: testOrgId,
        name: "Free Tester Org",
        slug: `org-free-${Date.now()}`,
        billingEmail: `freetester_${Date.now()}@example.com`,
        subscription: {
          create: {
            stripeCustomerId: `cus_${testOrgId.slice(-12)}`,
            planTier: "free",
            status: "active",
            creditsMonthlyAllowance: 0,
            creditsRemaining: 0,
            currentPeriodEnd: new Date(Date.now() + 30 * 86400000),
          },
        },
      },
    });
  });

  after(async () => {
    if (testOrgId) {
      await db.subscription.deleteMany({ where: { organizationId: testOrgId } }).catch(() => {});
      await db.organizationMember.deleteMany({ where: { organizationId: testOrgId } }).catch(() => {});
      await db.organization.delete({ where: { id: testOrgId } }).catch(() => {});
      await db.user.delete({ where: { id: testUserId } }).catch(() => {});
    }
  });

  it("verifies free tier organizations have exactly 0 video credits and 0 monthly allowance", async () => {
    const sub = await db.subscription.findUnique({
      where: { organizationId: testOrgId },
    });

    assert.ok(sub, "Subscription must exist");
    assert.strictEqual(sub.planTier, "free", "Plan tier must be 'free'");
    assert.strictEqual(sub.creditsRemaining, 0, "Free user must have exactly 0 credits remaining");
    assert.strictEqual(sub.creditsMonthlyAllowance, 0, "Free user must have 0 monthly allowance");
  });

  it("verifies video export deduction is blocked with insufficient credits for free users", async () => {
    const videoId = `vid_test_export_${Date.now()}`;
    const result = await deductCredit(testOrgId, videoId, 1, testUserId);

    assert.strictEqual(result.success, false, "Credit deduction must fail for 0-credit free user");
    assert.strictEqual(result.creditsRemaining, 0, "Credits remaining must remain 0");
    assert.ok(result.error?.includes("Insufficient credits"), "Must return insufficient credits error");
  });
});
