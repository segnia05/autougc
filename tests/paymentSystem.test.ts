import { fetchPolarPlans, createPolarCheckoutSession, processPolarWebhook } from "../src/lib/billing/polarProvider";
import { fetchPaddlePlans, createPaddleCheckoutSession, processPaddleWebhook } from "../src/lib/billing/paddleProvider";
import {
  getActivePaymentProviderName,
  fetchActiveBillingPlans,
  createActiveCheckoutSession,
} from "../src/lib/billing/paymentProvider";
import { grantCredits, getOrganizationCredits } from "../src/lib/billing/credits";

async function runTests() {
  console.log("===============================================================================");
  console.log("🧪 RUNNING COMPREHENSIVE PAYMENT SYSTEM AUDIT (POLAR & PADDLE DUAL MoR)");
  console.log("===============================================================================\n");

  let passed = 0;
  let total = 0;

  function assert(condition: boolean, testName: string) {
    total++;
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName}`);
      process.exitCode = 1;
    }
  }

  // -------------------------------------------------------------------------
  // TEST 1: Default Provider Resolution
  // -------------------------------------------------------------------------
  delete process.env.PAYMENT_PROVIDER;
  const defaultProvider = getActivePaymentProviderName();
  assert(defaultProvider === "polar", "Default payment provider is strictly 'polar'");

  process.env.PAYMENT_PROVIDER = "paddle";
  const switchedProvider = getActivePaymentProviderName();
  assert(switchedProvider === "paddle", "Provider toggles cleanly to 'paddle' via PAYMENT_PROVIDER=paddle");

  process.env.PAYMENT_PROVIDER = "polar";
  assert(getActivePaymentProviderName() === "polar", "Provider toggles back to 'polar'");

  // -------------------------------------------------------------------------
  // TEST 2: Dynamic Plan Fetching & Normalization (Polar)
  // -------------------------------------------------------------------------
  const polarPlans = await fetchPolarPlans();
  assert(polarPlans.length === 3, "Polar returns exactly 3 normalized tier plans (Starter, Growth, Scale)");
  
  const polarStarter = polarPlans.find((p) => p.planTier === "starter");
  assert(!!polarStarter, "Polar Starter plan exists in catalog");
  assert(polarStarter?.amountCents === 4900, "Polar Starter plan normalized price is 4900 cents ($49)");
  assert(polarStarter?.creditsMonthlyAllowance === 20, "Polar Starter allowance is 20 credits/mo");
  assert(polarStarter?.provider === "polar", "Plan provider tag is 'polar'");

  const polarGrowth = polarPlans.find((p) => p.planTier === "growth");
  assert(polarGrowth?.amountCents === 8900, "Polar Growth plan price is 8900 cents ($89)");
  assert(polarGrowth?.popular === true, "Polar Growth plan flagged as popular");

  // -------------------------------------------------------------------------
  // TEST 3: Dynamic Plan Fetching & Normalization (Paddle)
  // -------------------------------------------------------------------------
  const paddlePlans = await fetchPaddlePlans();
  assert(paddlePlans.length === 3, "Paddle returns exactly 3 normalized tier plans (Starter, Growth, Scale)");
  
  const paddleScale = paddlePlans.find((p) => p.planTier === "scale");
  assert(!!paddleScale, "Paddle Scale plan exists in catalog");
  assert(paddleScale?.amountCents === 19900, "Paddle Scale plan normalized price is 19900 cents ($199)");
  assert(paddleScale?.creditsMonthlyAllowance === 150, "Paddle Scale allowance is 150 credits/mo");
  assert(paddleScale?.provider === "paddle", "Plan provider tag is 'paddle'");

  // -------------------------------------------------------------------------
  // TEST 4: Unified Active Billing Plans API Dispatcher
  // -------------------------------------------------------------------------
  process.env.PAYMENT_PROVIDER = "polar";
  const activePolar = await fetchActiveBillingPlans();
  assert(activePolar.provider === "polar", "fetchActiveBillingPlans returns active 'polar' provider");
  assert(activePolar.plans.length === 3, "fetchActiveBillingPlans returns 3 plans for Polar");

  process.env.PAYMENT_PROVIDER = "paddle";
  const activePaddle = await fetchActiveBillingPlans();
  assert(activePaddle.provider === "paddle", "fetchActiveBillingPlans returns active 'paddle' provider");
  assert(activePaddle.plans.length === 3, "fetchActiveBillingPlans returns 3 plans for Paddle");

  // Reset to default Polar
  process.env.PAYMENT_PROVIDER = "polar";

  // -------------------------------------------------------------------------
  // TEST 5: Checkout Session Generation (Polar)
  // -------------------------------------------------------------------------
  const testOrgId = `org_test_${Date.now()}`;
  const polarCheckout = await createPolarCheckoutSession({
    orgId: testOrgId,
    userId: "usr_tester_01",
    email: "founder@example.com",
    planTier: "growth",
  });
  assert(polarCheckout.provider === "polar", "Polar checkout returns provider='polar'");
  assert(typeof polarCheckout.checkoutUrl === "string" && polarCheckout.checkoutUrl.length > 0, "Polar checkout returns valid checkout URL");

  // -------------------------------------------------------------------------
  // TEST 6: Checkout Session Generation (Paddle)
  // -------------------------------------------------------------------------
  const paddleCheckout = await createPaddleCheckoutSession({
    orgId: testOrgId,
    userId: "usr_tester_01",
    email: "founder@example.com",
    planTier: "scale",
  });
  assert(paddleCheckout.provider === "paddle", "Paddle checkout returns provider='paddle'");
  assert(typeof paddleCheckout.checkoutUrl === "string" && paddleCheckout.checkoutUrl.length > 0, "Paddle checkout returns valid checkout URL");

  // -------------------------------------------------------------------------
  // TEST 7: Polar Webhook Ingestion & Atomic Credit Grant
  // -------------------------------------------------------------------------
  const testEventId = `evt_test_polar_${Date.now()}`;
  const polarPayload = JSON.stringify({
    type: "order.paid",
    data: {
      id: "ord_polar_123",
      customer: { external_id: testOrgId },
      metadata: { organizationId: testOrgId, planTier: "growth" },
    },
  });

  const webhookResult = await processPolarWebhook(polarPayload, {
    "webhook-id": testEventId,
    "webhook-timestamp": `${Math.floor(Date.now() / 1000)}`,
    "webhook-signature": "v1,mock_signature",
  });

  assert(webhookResult.handled === true, "Polar webhook handled successfully");
  assert(webhookResult.creditsGranted === 60, "Polar order.paid grants 60 credits for Growth tier");

  // Test idempotency: Resending the exact same webhook must be deduplicated
  const duplicateResult = await processPolarWebhook(polarPayload, {
    "webhook-id": testEventId,
    "webhook-timestamp": `${Math.floor(Date.now() / 1000)}`,
    "webhook-signature": "v1,mock_signature",
  });
  assert(duplicateResult.handled === true, "Duplicate Polar webhook handled safely via idempotency cache");
  assert(!duplicateResult.creditsGranted, "Duplicate webhook does not double-grant credits");

  // -------------------------------------------------------------------------
  // TEST 8: Paddle Webhook Ingestion & Idempotency
  // -------------------------------------------------------------------------
  const paddleEventId = `evt_test_paddle_${Date.now()}`;
  const paddlePayload = JSON.stringify({
    event_id: paddleEventId,
    event_type: "transaction.completed",
    data: {
      id: "txn_paddle_999",
      custom_data: { organizationId: testOrgId, planTier: "scale" },
    },
  });

  const paddleWebhookResult = await processPaddleWebhook(
    paddlePayload,
    `ts=${Math.floor(Date.now() / 1000)};h1=mock_hash`
  );

  assert(paddleWebhookResult.handled === true, "Paddle webhook handled successfully");
  assert(paddleWebhookResult.creditsGranted === 150, "Paddle transaction.completed grants 150 credits for Scale tier");

  // -------------------------------------------------------------------------
  // TEST 9: Credit Ledger Query
  // -------------------------------------------------------------------------
  const creditsState = await getOrganizationCredits(testOrgId);
  assert(creditsState.creditsRemaining >= 150, "Organization credit ledger reflects cumulative grants");

  console.log("\n===============================================================================");
  console.log(`📊 PAYMENT AUDIT COMPLETE: ${passed} / ${total} CHECKS PASSED`);
  console.log("===============================================================================\n");

  if (passed !== total) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Payment test runner fatal error:", err);
  process.exit(1);
});

