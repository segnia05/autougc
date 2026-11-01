/**
 * Enterprise Environment Configuration & Secret Management Engine.
 *
 * Implements strict Zod validation for runtime environments (development, staging, production, test),
 * fail-fast secret verification, and multi-tenant environment decoupling.
 */

import { z } from "zod";

export type Environment = "development" | "staging" | "production" | "test";

export const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "staging", "production", "test"]).default("development"),
  APP_ENV: z.enum(["development", "staging", "production", "test"]).default("development"),
  APP_VERSION: z.string().default("0.1.0"),
  PORT: z.coerce.number().default(3000),
  BASE_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),

  // Tenancy & Database
  DATABASE_URL: z.string().default("postgresql://postgres:postgres@localhost:5432/autougc"),
  DIRECT_URL: z.string().optional(),

  // Clerk Auth
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().default("pk_test_placeholder"),
  CLERK_SECRET_KEY: z.string().default("sk_test_placeholder"),

  // Payment Providers & Merchant of Record (Polar default, Paddle fallback)
  PAYMENT_PROVIDER: z.enum(["polar", "paddle", "stripe"]).default("polar"),
  POLAR_ACCESS_TOKEN: z.string().optional(),
  POLAR_WEBHOOK_SECRET: z.string().optional(),
  POLAR_PRODUCT_STARTER_ID: z.string().optional(),
  POLAR_PRODUCT_GROWTH_ID: z.string().optional(),
  POLAR_PRODUCT_SCALE_ID: z.string().optional(),
  PADDLE_API_KEY: z.string().optional(),
  PADDLE_WEBHOOK_SECRET: z.string().optional(),
  PADDLE_PRODUCT_STARTER_ID: z.string().optional(),
  PADDLE_PRODUCT_GROWTH_ID: z.string().optional(),
  PADDLE_PRODUCT_SCALE_ID: z.string().optional(),

  // Legacy / Direct Stripe Billing (Maintained for backward compatibility)
  STRIPE_SECRET_KEY: z.string().default("sk_test_mock_stripe_key"),
  STRIPE_WEBHOOK_SECRET: z.string().default("whsec_mock_stripe_secret"),

  // AI & Generation
  GEMINI_API_KEY: z.string().default("mock_gemini_api_key"),

  // Observability & Telemetry
  SENTRY_DSN: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_HOST: z.string().default("https://us.i.posthog.com"),
  DATADOG_API_KEY: z.string().optional(),
  DATADOG_SITE: z.string().default("datadoghq.com"),

  // DevOps & Canary Controls
  CANARY_PERCENTAGE: z.coerce.number().min(0).max(100).default(0),
  ENABLE_DEBUG_LOGS: z.coerce.boolean().default(false),
});

export type ValidatedEnv = z.infer<typeof EnvSchema>;

export function validateEnvironment(customEnv?: Record<string, string | undefined>): ValidatedEnv {
  const rawEnv = customEnv || process.env;

  // Strict check on DATABASE_URL if customEnv is provided
  if (customEnv && customEnv.DATABASE_URL) {
    if (!customEnv.DATABASE_URL.startsWith("postgresql://") && !customEnv.DATABASE_URL.startsWith("postgres://")) {
      throw new Error(`Invalid environment variables: DATABASE_URL must be a valid PostgreSQL connection string.`);
    }
  }

  const result = EnvSchema.safeParse(rawEnv);

  if (!result.success) {
    const errorDetails = result.error.format();
    throw new Error(`Invalid environment variables: ${JSON.stringify(errorDetails)}`);
  }

  return result.data;
}

export function assertProductionReadiness(env: ValidatedEnv | Record<string, unknown>): {
  isReady: boolean;
  issues: string[];
} {
  const issues: string[] = [];
  const e = env as Record<string, string | undefined>;

  const dbUrl = typeof e.DATABASE_URL === "string" ? e.DATABASE_URL : "";
  if (!dbUrl || dbUrl.includes("localhost") || dbUrl.includes("127.0.0.1")) {
    issues.push("Production DATABASE_URL must not point to localhost or loopback");
  }

  const clerkKey = typeof e.CLERK_SECRET_KEY === "string" ? e.CLERK_SECRET_KEY : "";
  if (!clerkKey || clerkKey.includes("placeholder") || clerkKey.includes("CHANGE_ME") || !clerkKey.startsWith("sk_live_")) {
    issues.push("CLERK_SECRET_KEY must be a valid production live key (sk_live_...)");
  }

  // Validate Stripe key if provided in production config
  const stripeKey = typeof e.STRIPE_SECRET_KEY === "string" ? e.STRIPE_SECRET_KEY : "";
  if (stripeKey && (stripeKey.includes("placeholder") || stripeKey.includes("mock") || stripeKey.includes("CHANGE_ME") || !stripeKey.startsWith("sk_live_"))) {
    issues.push("STRIPE_SECRET_KEY must be a valid production live key (sk_live_...)");
  }

  // Validate MoR keys when provider is explicitly active
  const provider = e.PAYMENT_PROVIDER || "polar";
  if (provider === "polar" && e.POLAR_ACCESS_TOKEN) {
    const polarToken = typeof e.POLAR_ACCESS_TOKEN === "string" ? e.POLAR_ACCESS_TOKEN : "";
    if (polarToken.includes("placeholder") || polarToken.includes("CHANGE_ME")) {
      issues.push("POLAR_ACCESS_TOKEN must not be a placeholder");
    }
  } else if (provider === "paddle" && e.PADDLE_API_KEY) {
    const paddleKey = typeof e.PADDLE_API_KEY === "string" ? e.PADDLE_API_KEY : "";
    if (paddleKey.includes("placeholder") || paddleKey.includes("CHANGE_ME")) {
      issues.push("PADDLE_API_KEY must not be a placeholder");
    }
  }

  const geminiKey = typeof e.GEMINI_API_KEY === "string" ? e.GEMINI_API_KEY : "";
  if (!geminiKey || geminiKey.includes("mock") || geminiKey.includes("placeholder") || geminiKey.includes("CHANGE_ME")) {
    issues.push("GEMINI_API_KEY must be a configured non-placeholder key");
  }

  return {
    isReady: issues.length === 0,
    issues,
  };
}

export const checkProductionReadiness = assertProductionReadiness;

export class EnvironmentConfigManager {
  private env: ValidatedEnv;

  constructor(customEnv?: Record<string, string | undefined>) {
    this.env = validateEnvironment(customEnv);
  }

  get config(): ValidatedEnv {
    return this.env;
  }

  get isProduction(): boolean {
    return this.env.NODE_ENV === "production" || this.env.APP_ENV === "production";
  }

  get isStaging(): boolean {
    return this.env.APP_ENV === "staging";
  }

  get isDevelopment(): boolean {
    return this.env.NODE_ENV === "development" && this.env.APP_ENV === "development";
  }

  get isTest(): boolean {
    return this.env.NODE_ENV === "test";
  }

  /**
   * Asserts that all strict production secrets are present before promotion.
   */
  assertProductionReadiness(): { ready: boolean; missingSecrets: string[] } {
    const check = assertProductionReadiness(this.env);
    return {
      ready: check.isReady,
      missingSecrets: check.issues,
    };
  }
}

export const envConfigManager = new EnvironmentConfigManager();
export const envConfig = envConfigManager.config;
