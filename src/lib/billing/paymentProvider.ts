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
  getPolarConfigurationStatus,
} from "./polarProvider";
import {
  fetchPaddlePlans,
  createPaddleCheckoutSession,
  createPaddleCustomerPortalSession,
  getPaddleConfigurationStatus,
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

export interface ActiveConfigurationStatus {
  isConfigured: boolean;
  provider: PaymentProviderType;
  missing: string[];
}

/**
 * Returns the configuration status and missing keys for the currently active provider.
 */
export function getActiveConfigurationStatus(): ActiveConfigurationStatus {
  const provider = getActivePaymentProviderName();
  if (provider === "paddle") {
    const status = getPaddleConfigurationStatus();
    return {
      isConfigured: status.isConfigured,
      provider: "paddle",
      missing: status.missing,
    };
  }
  const status = getPolarConfigurationStatus();
  return {
    isConfigured: status.isConfigured,
    provider: "polar",
    missing: status.missing,
  };
}

export interface ActiveBillingPlansResult {
  provider: PaymentProviderType;
  isConfigured: boolean;
  missing: string[];
  plans: NormalizedPlan[];
}

/**
 * Dynamically fetches billing plans from the active provider (Polar by default, Paddle if toggled).
 * Product names, descriptions, prices, currencies, and benefits are fetched from the provider API.
 * If credentials or product IDs are not configured, returns isConfigured: false and plans: [].
 */
export async function fetchActiveBillingPlans(): Promise<ActiveBillingPlansResult> {
  const status = getActiveConfigurationStatus();
  if (!status.isConfigured) {
    return {
      provider: status.provider,
      isConfigured: false,
      missing: status.missing,
      plans: [],
    };
  }

  if (status.provider === "paddle") {
    const plans = await fetchPaddlePlans();
    return {
      provider: "paddle",
      isConfigured: plans.length > 0,
      missing: status.missing,
      plans,
    };
  }

  const plans = await fetchPolarPlans();
  return {
    provider: "polar",
    isConfigured: plans.length > 0,
    missing: status.missing,
    plans,
  };
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

