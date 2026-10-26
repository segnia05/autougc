import {
  getOrganizationCredits,
  deductCredit,
  grantCredits,
} from "../src/lib/billing/credits";
import { BILLING_PLANS } from "../src/lib/billing/stripe";

async function runBillingTests() {
  console.log("--- Running Stripe Billing & Atomic Credit Ledger Unit Tests ---");

  // 1. Verify Plan Configurations
  if (
    BILLING_PLANS.starter.priceUsd !== 49 ||
    BILLING_PLANS.starter.monthlyCredits !== 20
  ) {
    console.error("✗ Failed Starter plan pricing verification:", BILLING_PLANS.starter);
    process.exit(1);
  }
  if (
    BILLING_PLANS.growth.priceUsd !== 89 ||
    BILLING_PLANS.growth.monthlyCredits !== 60
  ) {
    console.error("✗ Failed Growth plan pricing verification:", BILLING_PLANS.growth);
    process.exit(1);
  }
  if (
    BILLING_PLANS.scale.priceUsd !== 199 ||
    BILLING_PLANS.scale.monthlyCredits !== 180
  ) {
    console.error("✗ Failed Scale plan pricing verification:", BILLING_PLANS.scale);
    process.exit(1);
  }
  console.log("✓ Verified Starter ($49), Growth ($89), and Scale ($199) billing configurations.");

  const testOrgId = "org_ledger_test_99";

  // 2. Initial Grant
  const grantRes = await grantCredits(testOrgId, 10, "initial_test_grant");
  console.log(`✓ Granted 10 credits. New balance: ${grantRes.newBalance}`);

  // 3. Deduct 1 credit for video render
  const deductRes = await deductCredit(testOrgId, "video_test_1080p", 1);
  if (!deductRes.success) {
    console.error("✗ Failed credit deduction:", deductRes);
    process.exit(1);
  }
  console.log(`✓ Deducted 1 credit for video ad render. Remaining: ${deductRes.creditsRemaining}`);

  // 4. Over-deduction prevention check
  const overDeductRes = await deductCredit(testOrgId, "video_excess_test", 9999);
  if (overDeductRes.success) {
    console.error("✗ Failed: System allowed over-deduction beyond credit limit!");
    process.exit(1);
  }
  console.log(`✓ Over-deduction blocked cleanly. Error: "${overDeductRes.error}"`);

  // 5. Check balance
  const balance = await getOrganizationCredits(testOrgId);
  console.log(`✓ Final verified organization balance: ${balance.creditsRemaining} credits.`);

  console.log("✓ All Stripe Billing & Atomic Credit Ledger tests passed cleanly!");
}

runBillingTests();
