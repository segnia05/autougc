import { NextRequest, NextResponse } from "next/server";
import { getAuthContext } from "@/lib/auth/getAuthContext";
import { getOrganizationCredits } from "@/lib/billing/credits";
import { BILLING_PLANS, SubscriptionTier } from "@/lib/billing/stripe";
import { prisma } from "@/db/client";

export async function GET(request: NextRequest) {
  try {
    const authContext = await getAuthContext(request);
    const orgId = authContext?.orgId || request.headers.get("x-organization-id");

    if (!orgId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const credits = await getOrganizationCredits(orgId);
    const tier = (credits.planTier || "growth") as SubscriptionTier;
    const planConfig = BILLING_PLANS[tier] || BILLING_PLANS.growth;

    let renewalDate = "December 1, 2026";
    let status = credits.status;

    try {
      const sub = await prisma.subscription.findUnique({
        where: { organizationId: orgId },
      });
      if (sub?.currentPeriodEnd) {
        renewalDate = sub.currentPeriodEnd.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        });
        status = sub.status;
      }
    } catch {
      // Resilient fallback when DB is offline
    }

    return NextResponse.json({
      success: true,
      subscription: {
        tier,
        name: planConfig.name,
        priceUsd: planConfig.priceUsd,
        creditsTotal: credits.monthlyAllowance,
        creditsRemaining: credits.creditsRemaining,
        creditsUsed: Math.max(0, credits.monthlyAllowance - credits.creditsRemaining),
        maxAccounts: planConfig.maxConnectedAccounts,
        cadence: planConfig.features[2] || "~2 posts / day automated drip",
        renewalDate,
        status,
        maxSeats: tier === "scale" ? 10 : tier === "growth" ? 3 : 1,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load subscription";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
