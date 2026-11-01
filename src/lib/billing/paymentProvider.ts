import {
  BillingTier,
  CheckoutSessionParams,
  CheckoutSessionResult,
  CustomerPortalParams,
  CustomerPortalResult,
  NormalizedPlan,
  PaymentProviderType,
} from "./types";
import {
  fetchPolarPlans,
  createPolarCheckoutSession,
  createPolarCustomerPortalSession,
} from "./polarProvider";
import {
  fetchPaddlePlans,
  createPaddleCheckoutSession,
  createPaddleCustomerPortalSession,
} from "./paddleProvider";

/**
 * Returns the currently active Merchant of Record (MoR) payment provider.
 * Default is strictly "polar". Can be dynamically flipped to "paddle" via PAYMENT_PROVIDER=paddle.
 */
export function getActivePaymentProviderName(): PaymentProviderType {
  const envProvider = process.env.PAYMENT_PROVIDER?.toLowerCase();
  if (envProvider === "paddle") {
    return "paddle";
  }
  return "polar";
}

/**
 * Dynamically fetches billing plans from the active provider (Polar by default, Paddle if toggled).
 * Product names, descriptions, prices, currencies, and benefits are fetched from the provider API.
 */
export async function fetchActiveBillingPlans(): Promise<{
  provider: PaymentProviderType;
  plans: NormalizedPlan[];
}> {
  const provider = getActivePaymentProviderName();
  if (provider === "paddle") {
    const plans = await fetchPaddlePlans();
    return { provider: "paddle", plans };
  }

  const plans = await fetchPolarPlans();
  return { provider: "polar", plans };
}

/**
 * Dispatches checkout session creation to the active payment provider.
 */
export async function createActiveCheckoutSession(
  params: CheckoutSessionParams
): Promise<CheckoutSessionResult> {
  const provider = getActivePaymentProviderName();
  if (provider === "paddle") {
    return await createPaddleCheckoutSession(params);
  }
  return await createPolarCheckoutSession(params);
}

/**
 * Dispatches customer portal session creation to the active payment provider.
 */
export async function createActivePortalSession(
  params: CustomerPortalParams
): Promise<CustomerPortalResult> {
  const provider = getActivePaymentProviderName();
  if (provider === "paddle") {
    return await createPaddleCustomerPortalSession(params);
  }
  return await createPolarCustomerPortalSession(params);
}
