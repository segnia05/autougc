import Stripe from "stripe";

export const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY || "sk_test_mock_stripe_secret_key_autougc",
  {
    apiVersion: "2025-02-24.acacia" as any,
    typescript: true,
  }
);

export type SubscriptionTier = "starter" | "growth" | "scale";

export interface PlanConfig {
  id: SubscriptionTier;
  name: string;
  priceUsd: number;
  monthlyCredits: number;
  stripePriceId: string;
  description: string;
  features: string[];
}

export const BILLING_PLANS: Record<SubscriptionTier, PlanConfig> = {
  starter: {
    id: "starter",
    name: "Starter",
    priceUsd: 49,
    monthlyCredits: 25,
    stripePriceId: process.env.STRIPE_STARTER_PRICE_ID || "price_starter_49_usd",
    description: "Ideal for solo founders and bootstrapping creators testing viral ads.",
    features: [
      "25 1080p vertical video ads / month",
      "6 conversational creator voices",
      "Dynamic kinetic word-level subtitles",
      "1-click TikTok & Instagram Reels publishing",
      "Zero watermarks & commercial license",
    ],
  },
  growth: {
    id: "growth",
    name: "Growth",
    priceUsd: 89,
    monthlyCredits: 60,
    stripePriceId: process.env.STRIPE_GROWTH_PRICE_ID || "price_growth_89_usd",
    description: "For scaling DTC brands and SaaS teams running always-on creative testing.",
    features: [
      "60 1080p vertical video ads / month",
      "All Starter features + YouTube Shorts",
      "Dynamic background audio & auto-ducking",
      "Priority background rendering pipeline",
      "Custom brand typography & color presets",
    ],
  },
  scale: {
    id: "scale",
    name: "Scale",
    priceUsd: 199,
    monthlyCredits: 180,
    stripePriceId: process.env.STRIPE_SCALE_PRICE_ID || "price_scale_199_usd",
    description: "For agencies and high-volume performance marketing operations.",
    features: [
      "180 1080p vertical video ads / month",
      "All Growth features included",
      "Multi-tenant brand workspaces",
      "Dedicated GPU rendering node",
      "Direct API access & custom webhooks",
    ],
  },
};
