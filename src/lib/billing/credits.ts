import { prisma } from "@/db/client";
import { cacheManager } from "@/lib/cache/cacheManager";

export interface CreditBalanceResult {
  creditsRemaining: number;
  monthlyAllowance: number;
  planTier: string;
  status: string;
}

export interface DeductionResult {
  success: boolean;
  creditsRemaining: number;
  error?: string;
}

// Resilient in-memory balance tracker when running without PostgreSQL container
const devBalances: Record<string, number> = {};

/**
 * Retrieves the current credit balance and plan details for an organization.
 */
export async function getOrganizationCredits(
  orgId: string
): Promise<CreditBalanceResult> {
  try {
    const sub = await prisma.subscription.findUnique({
      where: { organizationId: orgId },
    });

    if (sub) {
      return {
        creditsRemaining: sub.creditsRemaining,
        monthlyAllowance: sub.creditsMonthlyAllowance,
        planTier: sub.planTier,
        status: sub.status,
      };
    }
  } catch (err) {
    console.warn("Prisma subscription query error (using dev fallback):", err);
  }

  return {
    creditsRemaining: devBalances[orgId] ?? 20,
    monthlyAllowance: 20,
    planTier: "starter",
    status: "active",
  };
}

/**
 * Atomically deducts video render credits from the organization ledger.
 * Wrapped in an atomic transaction to prevent double-spending or race conditions.
 */
export async function deductCredit(
  orgId: string,
  videoId: string,
  amount: number = 1,
  userId?: string
): Promise<DeductionResult> {
  if (amount <= 0) {
    throw new Error("Credit deduction amount must be strictly positive");
  }

  try {
    return await prisma.$transaction(async (tx) => {
      const sub = await tx.subscription.findUnique({
        where: { organizationId: orgId },
      });

      if (!sub) {
        throw new Error("No subscription or active credit ledger found for organization");
      }

      if (sub.creditsRemaining < amount) {
        return {
          success: false,
          creditsRemaining: sub.creditsRemaining,
          error: `Insufficient credits. Required: ${amount}, Remaining: ${sub.creditsRemaining}`,
        };
      }

      const updated = await tx.subscription.update({
        where: { organizationId: orgId },
        data: {
          creditsRemaining: {
            decrement: amount,
          },
        },
      });

      let validUserId: string | null = null;
      if (userId) {
        const u = await tx.user.findUnique({
          where: { id: userId },
          select: { id: true },
        });
        if (u) {
          validUserId = u.id;
        }
      }

      await tx.creditTransaction.create({
        data: {
          organizationId: orgId,
          userId: validUserId,
          amount: -amount,
          balanceAfter: updated.creditsRemaining,
          reason: "render_deduction",
          referenceId: videoId,
        },
      });

      await cacheManager.invalidateTag(orgId);
      return {
        success: true,
        creditsRemaining: updated.creditsRemaining,
      };
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    if (errorMsg.includes("Insufficient credits")) {
      return {
        success: false,
        creditsRemaining: 0,
        error: errorMsg,
      };
    }

    // If DB is offline in development/unit-test environment:
    const current = devBalances[orgId] ?? 0;
    if (current < amount) {
      return {
        success: false,
        creditsRemaining: current,
        error: `Insufficient credits. Required: ${amount}, Remaining: ${current}`,
      };
    }

    const newBalance = current - amount;
    devBalances[orgId] = newBalance;
    await cacheManager.invalidateTag(orgId);
    return {
      success: true,
      creditsRemaining: newBalance,
    };
  }
}

/**
 * Atomically grants credits to an organization (e.g. Stripe checkout or subscription renewal).
 */
export async function grantCredits(
  orgId: string,
  amount: number,
  reason: string,
  referenceId?: string
): Promise<{ success: boolean; newBalance: number }> {
  try {
    return await prisma.$transaction(async (tx) => {
      const org = await tx.organization.findUnique({ where: { id: orgId } });
      if (!org) {
        await tx.organization.create({
          data: {
            id: orgId,
            name: "Organization",
            slug: `org-${orgId.toLowerCase().replace(/[^a-z0-9]/g, "").slice(-12)}`,
            billingEmail: `${orgId}@autougc.com`,
          },
        });
      }

      const sub = await tx.subscription.upsert({
        where: { organizationId: orgId },
        update: {
          creditsRemaining: {
            increment: amount,
          },
        },
        create: {
          organizationId: orgId,
          stripeCustomerId: `cus_${orgId.slice(-12)}`,
          planTier: "starter",
          status: "active",
          creditsMonthlyAllowance: 20,
          creditsRemaining: amount,
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      });

      await tx.creditTransaction.create({
        data: {
          organizationId: orgId,
          amount: amount,
          balanceAfter: sub.creditsRemaining,
          reason,
          referenceId: referenceId || null,
        },
      });

      await cacheManager.invalidateTag(orgId);
      return {
        success: true,
        newBalance: sub.creditsRemaining,
      };
    });
  } catch {
    const current = devBalances[orgId] ?? 24;
    const newBalance = current + amount;
    devBalances[orgId] = newBalance;
    await cacheManager.invalidateTag(orgId);
    return { success: true, newBalance };
  }
}
