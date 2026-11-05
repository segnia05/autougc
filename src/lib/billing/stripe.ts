import Stripe from "stripe";

export const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY || "sk_test_mock_stripe_secret_key_autougc",
  {
    apiVersion: "2025-02-24.acacia" as unknown as Stripe.LatestApiVersion,
    typescript: true,
  }
);

export type SubscriptionTier = "free" | "starter" | "growth" | "scale";

export interface PlanConfig {
  id: SubscriptionTier;
  name: string;
  priceUsd: number;
  monthlyCredits: number;
  maxConnectedAccounts: number;
  postingCadence: string;
  stripePriceId: string;
  description: string;
  features: string[];
}

export const BILLING_PLANS: Record<SubscriptionTier, PlanConfig> = {
  free: {
    id: "free",
    name: "Subscription Required",
    priceUsd: 0,
    monthlyCredits: 0,
    maxConnectedAccounts: 1,
    postingCadence: "Manual export only",
    stripePriceId: "",
    description: "Subscribe to an active plan to render and publish viral video ads.",
    features: [
      "Select Starter, Growth, or Scale to begin",
      "Full Studio Canvas & Subtitle Styler",
      "1 Brand Account preview",
      "Standard cloud render queue",
    ],
  },
  starter: {
    id: "starter",
    name: "Starter",
    priceUsd: 49,
    monthlyCredits: 20,
    maxConnectedAccounts: 1,
    postingCadence: "~4 posts / week (Mon/Wed/Fri/Sun drip)",
    stripePriceId: process.env.STRIPE_STARTER_PRICE_ID || "price_starter_49_usd",
    description: "Ideal for solo founders and bootstrapping creators testing viral ads.",
    features: [
      "20 Videos / month",
      "1 Brand Account connected",
      "~4 posts / week (Mon/Wed/Fri/Sun drip)",
      "Autopilot Scheduler & Peak-Hour Timing",
      "1080p MP4 Downloads & Permanent Vault",
      "Zero watermarks & commercial license",
    ],
  },
  growth: {
    id: "growth",
    name: "Growth",
    priceUsd: 89,
    monthlyCredits: 60,
    maxConnectedAccounts: 5,
    postingCadence: "~2 posts / day automated drip",
    stripePriceId: process.env.STRIPE_GROWTH_PRICE_ID || "price_growth_89_usd",
    description: "For scaling DTC brands and SaaS teams running always-on creative testing.",
    features: [
      "60 Videos / month",
      "Up to 5 Accounts (Main + Satellites)",
      "~2 posts / day automated drip",
      "Multi-Account Clipping Army",
      "Anti-Duplicate Shadowban Engine",
      "All 12 Conversational creator voices",
      "Priority GPU cloud rendering",
    ],
  },
  scale: {
    id: "scale",
    name: "Scale",
    priceUsd: 199,
    monthlyCredits: 180,
    maxConnectedAccounts: 15,
    postingCadence: "~6 posts / day high-velocity blitz",
    stripePriceId: process.env.STRIPE_SCALE_PRICE_ID || "price_scale_199_usd",
    description: "For agencies and high-volume performance marketing operations.",
    features: [
      "180 Videos / month",
      "Up to 15 Accounts (Multi-Brand / Team)",
      "~6 posts / day high-velocity blitz",
      "Agency Multi-Brand Workspaces",
      "Priority GPU Rendering Node & API",
      "Dedicated campaign & account support",
    ],
  },
};
