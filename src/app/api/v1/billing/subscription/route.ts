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
    const tier = (credits.planTier || "free") as SubscriptionTier;
    const planConfig = BILLING_PLANS[tier] || BILLING_PLANS.free;

    let renewalDate = "December 1, 2026";
    let status = credits.status;
    let workspaceName = authContext?.fullName ? `${authContext.fullName}'s Workspace` : "Creative Workspace";
    let workspaceSlug = "workspace";
    let members: Array<{
      id: string;
      fullName: string;
      email: string;
      role: string;
      isCurrentUser: boolean;
    }> = [
      {
        id: authContext?.userId || "user_current",
        fullName: authContext?.fullName || "Founder (You)",
        email: authContext?.email || "owner@autougc.com",
        role: authContext?.role || "owner",
        isCurrentUser: true,
      },
    ];

    try {
      const org = await prisma.organization.findUnique({
        where: { id: orgId },
        include: {
          subscription: true,
          members: {
            include: {
              user: true,
            },
          },
        },
      });

      if (org) {
        workspaceName = org.name;
        workspaceSlug = org.slug;

        if (org.subscription?.currentPeriodEnd) {
          renewalDate = org.subscription.currentPeriodEnd.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          });
          status = org.subscription.status;
        }

        if (org.members && org.members.length > 0) {
          members = org.members.map((m) => ({
            id: m.userId,
            fullName: m.user.fullName || (m.userId === authContext?.userId ? authContext.fullName : "Team Member"),
            email: m.user.email || (m.userId === authContext?.userId ? authContext.email : ""),
            role: m.role,
            isCurrentUser: m.userId === authContext?.userId,
          }));
        }
      }
    } catch (err) {
      console.warn("Notice in /api/v1/billing/subscription:", err);
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
        workspaceName,
        workspaceSlug,
        userFullName: authContext?.fullName || "AutoUGC Creator",
        userEmail: authContext?.email || "",
        userRole: authContext?.role || "owner",
        members,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load subscription";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
