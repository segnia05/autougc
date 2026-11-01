export type PaymentProviderType = "polar" | "paddle";

export type BillingTier = "starter" | "growth" | "scale";

export interface NormalizedPlan {
  planTier: BillingTier;
  name: string;
  description: string;
  amountCents: number;
  formattedPrice: string;
  currency: string;
  billingInterval: "month" | "year" | "one_time";
  creditsMonthlyAllowance: number;
  features: string[];
  provider: PaymentProviderType;
  productId: string;
  priceId: string;
  popular?: boolean;
}

export interface CheckoutSessionParams {
  orgId: string;
  userId: string;
  email?: string;
  planTier: BillingTier;
  returnUrl?: string;
}

export interface CheckoutSessionResult {
  checkoutUrl: string;
  sessionId?: string;
  provider: PaymentProviderType;
}

export interface CustomerPortalParams {
  orgId: string;
  userId: string;
  customerId?: string;
  returnUrl?: string;
}

export interface CustomerPortalResult {
  portalUrl: string;
  provider: PaymentProviderType;
}

export interface WebhookProcessingResult {
  handled: boolean;
  provider: PaymentProviderType;
  eventType: string;
  organizationId?: string;
  planTier?: BillingTier;
  creditsGranted?: number;
  creditsResetTo?: number;
  error?: string;
}

