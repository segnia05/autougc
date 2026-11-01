import {
  fetchPolarPlans,
  createPolarCheckoutSession,
  processPolarWebhook,
  getPolarConfigurationStatus,
} from "../src/lib/billing/polarProvider";
import {
  fetchPaddlePlans,
  createPaddleCheckoutSession,
  processPaddleWebhook,
  getPaddleConfigurationStatus,
} from "../src/lib/billing/paddleProvider";
import {
  getActivePaymentProviderName,
  fetchActiveBillingPlans,
  createActiveCheckoutSession,
  getActiveConfigurationStatus,
} from "../src/lib/billing/paymentProvider";
import {
  grantCredits,
  getOrganizationCredits,
  deductCredit,
  refreshSubscriptionAllowance,
} from "../src/lib/billing/credits";

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
  // TEST 1.5: Missing Credentials Error Detection (Zero Static Pricing)
  // -------------------------------------------------------------------------
  delete process.env.POLAR_ACCESS_TOKEN;
  delete process.env.POLAR_PRODUCT_STARTER_ID;
  delete process.env.PADDLE_API_KEY;
  delete process.env.PADDLE_PRODUCT_STARTER_ID;

  const unconfiguredPolar = getPolarConfigurationStatus();
  assert(unconfiguredPolar.isConfigured === false, "Polar correctly reports isConfigured=false when credentials are unset");
  assert(unconfiguredPolar.missing.includes("POLAR_ACCESS_TOKEN"), "Polar reports POLAR_ACCESS_TOKEN in missing keys");
  assert(unconfiguredPolar.missing.includes("POLAR_PRODUCT_STARTER_ID"), "Polar reports POLAR_PRODUCT_STARTER_ID in missing keys");

  const unconfiguredPolarPlans = await fetchPolarPlans();
  assert(unconfiguredPolarPlans.length === 0, "fetchPolarPlans returns [] when unconfigured (no static fallback)");

  const unconfiguredPaddle = getPaddleConfigurationStatus();
  assert(unconfiguredPaddle.isConfigured === false, "Paddle correctly reports isConfigured=false when credentials are unset");
  assert(unconfiguredPaddle.missing.includes("PADDLE_API_KEY"), "Paddle reports PADDLE_API_KEY in missing keys");

  const unconfiguredPaddlePlans = await fetchPaddlePlans();
  assert(unconfiguredPaddlePlans.length === 0, "fetchPaddlePlans returns [] when unconfigured (no static fallback)");

  const unconfiguredActive = await fetchActiveBillingPlans();
  assert(unconfiguredActive.isConfigured === false, "fetchActiveBillingPlans returns isConfigured=false when active provider lacks credentials");
  assert(unconfiguredActive.plans.length === 0, "fetchActiveBillingPlans returns empty plans array when unconfigured");

  let polarCheckoutError = false;
  try {
    await createPolarCheckoutSession({
      orgId: "org_unconfigured_test",
      userId: "usr_test",
      planTier: "starter",
    });
  } catch (err: any) {
    if (err.message.includes("Polar is not configured")) {
      polarCheckoutError = true;
    }
  }
  assert(polarCheckoutError, "createPolarCheckoutSession throws when unconfigured (no fake checkout)");

  let paddleCheckoutError = false;
  try {
    await createPaddleCheckoutSession({
      orgId: "org_unconfigured_test",
      userId: "usr_test",
      planTier: "growth",
    });
  } catch (err: any) {
    if (err.message.includes("Paddle is not configured")) {
      paddleCheckoutError = true;
    }
  }
  assert(paddleCheckoutError, "createPaddleCheckoutSession throws when unconfigured (no fake checkout)");

  // Now set sandbox credentials for full end-to-end integration testing
  process.env.POLAR_ACCESS_TOKEN = "polar_at_sandbox_test_token_12345";
  process.env.POLAR_PRODUCT_STARTER_ID = "prod_polar_starter_123";
  process.env.POLAR_PRODUCT_GROWTH_ID = "prod_polar_growth_123";
  process.env.POLAR_PRODUCT_SCALE_ID = "prod_polar_scale_123";

  process.env.PADDLE_API_KEY = "pdl_nt_sandbox_test_token_12345";
  process.env.PADDLE_PRODUCT_STARTER_ID = "prod_paddle_starter_123";
  process.env.PADDLE_PRODUCT_GROWTH_ID = "prod_paddle_growth_123";
  process.env.PADDLE_PRODUCT_SCALE_ID = "prod_paddle_scale_123";

  const configuredPolar = getPolarConfigurationStatus();
  assert(configuredPolar.isConfigured === true, "Polar reports isConfigured=true when credentials and product IDs are set");

  const configuredPaddle = getPaddleConfigurationStatus();
  assert(configuredPaddle.isConfigured === true, "Paddle reports isConfigured=true when credentials and product IDs are set");

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

  // -------------------------------------------------------------------------
  // TEST 10: Atomic Subscription Cycle Credit Reset (Use-It-or-Lose-It)
  // -------------------------------------------------------------------------
  const renewOrgId = `org_renewal_test_${Date.now()}`;
  // Simulate an active user with 4 leftover credits on Starter
  await refreshSubscriptionAllowance(renewOrgId, "starter", "initial_setup");
  await deductCredit(renewOrgId, "vid_test_16", 16);
  const beforeRenewal = await getOrganizationCredits(renewOrgId);
  assert(beforeRenewal.creditsRemaining === 4, "Verified user has 4 leftover credits before monthly renewal cycle");

  // Execute subscription cycle refresh: must reset strictly to 20 (not 24)
  const refreshRes = await refreshSubscriptionAllowance(renewOrgId, "starter", "monthly_renewal_cycle");
  assert(refreshRes.success === true, "refreshSubscriptionAllowance executed successfully");
  assert(refreshRes.newBalance === 20, "Cycle refresh resets credits strictly to 20 for Starter tier (no stacking)");

  const afterRenewal = await getOrganizationCredits(renewOrgId);
  assert(afterRenewal.creditsRemaining === 20, "Ledger confirms organization balance is reset to 20 credits");

  // -------------------------------------------------------------------------
  // TEST 11: Polar subscription.cycled Webhook Event
  // -------------------------------------------------------------------------
  // Deduct 7 credits, leaving 13
  await deductCredit(renewOrgId, "vid_test_7", 7);
  const midCycle = await getOrganizationCredits(renewOrgId);
  assert(midCycle.creditsRemaining === 13, "Org has 13 credits remaining mid-cycle");

  const polarCycledPayload = JSON.stringify({
    type: "subscription.cycled",
    data: {
      id: `sub_polar_${Date.now()}`,
      customer: { external_id: renewOrgId },
      metadata: { organizationId: renewOrgId, planTier: "starter" },
      current_period_start: new Date().toISOString(),
      current_period_end: new Date(Date.now() + 30 * 86400 * 1000).toISOString(),
    },
  });

  const polarCycledRes = await processPolarWebhook(polarCycledPayload, {
    "webhook-id": `wh_polar_cycled_${Date.now()}`,
    "webhook-timestamp": `${Math.floor(Date.now() / 1000)}`,
    "webhook-signature": "v1,mock_signature",
  });

  assert(polarCycledRes.handled === true, "Polar subscription.cycled webhook handled cleanly");
  assert(polarCycledRes.creditsResetTo === 20, "Polar subscription.cycled webhook explicitly signals creditsResetTo = 20");

  const postPolarCycled = await getOrganizationCredits(renewOrgId);
  assert(postPolarCycled.creditsRemaining === 20, "Post-Polar subscription.cycled credit balance reset to 20");

  // -------------------------------------------------------------------------
  // TEST 12: Polar order.paid with billing_reason === "subscription_cycle"
  // -------------------------------------------------------------------------
  // Deduct 15 credits, leaving 5
  await deductCredit(renewOrgId, "vid_test_15", 15);
  const preOrderCycle = await getOrganizationCredits(renewOrgId);
  assert(preOrderCycle.creditsRemaining === 5, "Org has 5 credits remaining before order renewal");

  const polarRenewalOrderPayload = JSON.stringify({
    type: "order.paid",
    data: {
      id: `ord_renewal_${Date.now()}`,
      billing_reason: "subscription_cycle",
      customer: { external_id: renewOrgId },
      metadata: { organizationId: renewOrgId, planTier: "starter" },
    },
  });

  const polarOrderRes = await processPolarWebhook(polarRenewalOrderPayload, {
    "webhook-id": `wh_polar_order_renewal_${Date.now()}`,
    "webhook-timestamp": `${Math.floor(Date.now() / 1000)}`,
    "webhook-signature": "v1,mock_signature",
  });

  assert(polarOrderRes.handled === true, "Polar recurring order.paid handled cleanly");
  assert(polarOrderRes.creditsResetTo === 20, "Polar recurring order.paid resets credits to 20");

  const postOrderRenew = await getOrganizationCredits(renewOrgId);
  assert(postOrderRenew.creditsRemaining === 20, "Post-order.paid renewal balance is reset to 20 credits");

  // -------------------------------------------------------------------------
  // TEST 13: Paddle Recurring transaction.completed (origin: "subscription_recurring")
  // -------------------------------------------------------------------------
  // Deduct 18 credits, leaving 2
  await deductCredit(renewOrgId, "vid_test_18", 18);
  const prePaddleCycle = await getOrganizationCredits(renewOrgId);
  assert(prePaddleCycle.creditsRemaining === 2, "Org has 2 credits remaining before Paddle renewal");

  const paddleRecurringPayload = JSON.stringify({
    event_id: `evt_paddle_recurring_${Date.now()}`,
    event_type: "transaction.completed",
    data: {
      id: `txn_recurring_${Date.now()}`,
      origin: "subscription_recurring",
      custom_data: { organizationId: renewOrgId, planTier: "starter" },
    },
  });

  const paddleRecurringRes = await processPaddleWebhook(
    paddleRecurringPayload,
    `ts=${Math.floor(Date.now() / 1000)};h1=mock_hash`
  );

  assert(paddleRecurringRes.handled === true, "Paddle recurring transaction handled cleanly");
  assert(paddleRecurringRes.creditsResetTo === 20, "Paddle recurring transaction resets credits to 20");

  const postPaddleRenew = await getOrganizationCredits(renewOrgId);
  assert(postPaddleRenew.creditsRemaining === 20, "Post-Paddle renewal balance is reset to 20 credits");

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
