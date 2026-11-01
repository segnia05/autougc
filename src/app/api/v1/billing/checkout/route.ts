import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAuthContext } from "@/lib/auth/getAuthContext";
import { prisma } from "@/db/client";
import {
  createActiveCheckoutSession,
  getActivePaymentProviderName,
  getActiveConfigurationStatus,
} from "@/lib/billing/paymentProvider";
import { BillingTier } from "@/lib/billing/types";

const CheckoutRequestSchema = z.object({
  planId: z.enum(["starter", "growth", "scale"]).optional(),
  planTier: z.enum(["starter", "growth", "scale"]).optional(),
}).refine((data) => data.planId || data.planTier, {
  message: "Either planId or planTier must be provided",
});

export async function POST(request: NextRequest) {
  try {
    const authContext = await getAuthContext(request);
    const orgId = authContext?.orgId || request.headers.get("x-organization-id");

    if (!orgId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const parsed = CheckoutRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid plan selection", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const selectedTier = (parsed.data.planTier || parsed.data.planId) as BillingTier;
    const origin = request.nextUrl.origin;
    const provider = getActivePaymentProviderName();

    // Verify provider credentials and product IDs
    const configStatus = getActiveConfigurationStatus();
    if (!configStatus.isConfigured) {
      return NextResponse.json(
        {
          error: "Need product id and api key",
          message: `Payment provider (${configStatus.provider.toUpperCase()}) is not configured. Missing environment variables: ${configStatus.missing.join(", ")}`,
          missingKeys: configStatus.missing,
        },
        { status: 400 }
      );
    }

    // Check if live MoR credentials are configured
    const isPolar = provider === "polar";
    const polarKey = process.env.POLAR_ACCESS_TOKEN || "";
    const paddleKey = process.env.PADDLE_API_KEY || "";

    const isMock = isPolar
      ? polarKey.startsWith("polar_at_mock") || polarKey.startsWith("polar_at_sandbox_test")
      : paddleKey.startsWith("pdl_nt_sandbox_test") || paddleKey.startsWith("pdl_mock");

    const allowances: Record<BillingTier, number> = {
      starter: 20,
      growth: 60,
      scale: 150,
    };
    const credits = allowances[selectedTier];

    if (isMock) {
      // In local dev/mock mode, persist the upgrade directly to Neon DB so the user immediately receives full plan benefits
      try {
        await prisma.subscription.upsert({
          where: { organizationId: orgId },
          update: {
            planTier: selectedTier,
            creditsMonthlyAllowance: credits,
            creditsRemaining: credits,
            status: "active",
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
          create: {
            organizationId: orgId,
            stripeCustomerId: `${provider}_cust_${orgId.slice(-12)}`,
            planTier: selectedTier,
            status: "active",
            creditsMonthlyAllowance: credits,
            creditsRemaining: credits,
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
        });

        await prisma.creditTransaction.create({
          data: {
            organizationId: orgId,
            userId: authContext?.userId || null,
            amount: credits,
            balanceAfter: credits,
            reason: `plan_upgrade_${selectedTier}`,
          },
        });
      } catch (err) {
        console.warn("Mock upgrade DB update skipped/failed:", err);
      }

      return NextResponse.json({
        url: `${origin}/dashboard?tab=billing&upgraded=true&plan=${selectedTier}&credits=${credits}`,
        isMock: true,
        planId: selectedTier,
        planTier: selectedTier,
        credits,
        provider,
      });
    }

    // Live MoR session generation (Polar or Paddle)
    const checkoutResult = await createActiveCheckoutSession({
      orgId,
      userId: authContext?.userId || "user_anonymous",
      email: authContext?.email,
      planTier: selectedTier,
      returnUrl: `${origin}/dashboard?tab=billing&upgraded=true&session_id={CHECKOUT_ID}`,
    });

    return NextResponse.json({
      url: checkoutResult.checkoutUrl,
      sessionId: checkoutResult.sessionId,
      provider: checkoutResult.provider,
      planTier: selectedTier,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to initiate checkout session";
    console.error("Checkout route error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
