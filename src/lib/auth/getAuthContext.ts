import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/db/client";

export interface AuthContext {
  userId: string;
  orgId: string;
  role: "owner" | "admin" | "editor" | "viewer";
  email: string;
  fullName: string;
  planTier: "free" | "starter" | "growth" | "scale";
  creditsRemaining: number;
  creditsMonthlyAllowance: number;
}

/**
 * Resolves the authenticated Clerk user into real multi-tenant PostgreSQL records.
 * Auto-provisions User, Organization, and Subscription credit accounts if needed.
 * Gracefully handles both personal users and multi-member Clerk organizations.
 */
export async function getAuthContext(request?: Request): Promise<AuthContext | null> {
  let userId: string | null = null;
  let orgId: string | null = null;

  try {
    const authObj = await auth();
    userId = authObj.userId;
    orgId = authObj.orgId ?? null;
  } catch {
    // If auth() fails or running in edge/isolated context, fallback to forwarded headers
    if (request) {
      userId = request.headers.get("x-user-id");
      orgId = request.headers.get("x-organization-id");
    }
  }

  if (!userId && request) {
    userId = request.headers.get("x-user-id");
    orgId = orgId || request.headers.get("x-organization-id");
  }

  if (!userId) {
    return null;
  }

  // Database tenancy resolution & auto-sync
  try {
    let dbUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        memberships: {
          include: {
            organization: {
              include: {
                subscription: true,
              },
            },
          },
        },
      },
    });

    if (!dbUser) {
      let email = `creator_${userId.slice(-6)}@autougc.com`;
      let fullName = "AutoUGC Creator";
      let avatarUrl: string | undefined;

      try {
        const clerkUser = await currentUser();
        if (clerkUser) {
          email = clerkUser.emailAddresses[0]?.emailAddress || email;
          fullName = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || fullName;
          avatarUrl = clerkUser.imageUrl || undefined;
        }
      } catch {
        // Clerk API unavailable in offline test run
      }

      dbUser = await prisma.user.upsert({
        where: { id: userId },
        update: {
          fullName,
          avatarUrl,
        },
        create: {
          id: userId,
          email,
          fullName,
          avatarUrl,
        },
        include: {
          memberships: {
            include: {
              organization: {
                include: {
                  subscription: true,
                },
              },
            },
          },
        },
      });
    }

    let resolvedOrgId = orgId;
    let userRole: "owner" | "admin" | "editor" | "viewer" = "owner";
    let orgSubscription: {
      planTier: string;
      creditsRemaining: number;
      creditsMonthlyAllowance: number;
    } | null = null;

    if (resolvedOrgId) {
      // User has an explicit Clerk Organization selected
      const existingOrg = await prisma.organization.findUnique({
        where: { id: resolvedOrgId },
        include: { subscription: true },
      });

      if (!existingOrg) {
        const createdOrg = await prisma.organization.create({
          data: {
            id: resolvedOrgId,
            name: `${dbUser.fullName || "Team"}'s Organization`,
            slug: `org-${resolvedOrgId.toLowerCase().replace(/[^a-z0-9]/g, "").slice(-12)}`,
            billingEmail: dbUser.email,
            subscription: {
              create: {
                stripeCustomerId: `cus_${resolvedOrgId.slice(-12)}`,
                planTier: "free",
                status: "active",
                creditsMonthlyAllowance: 3,
                creditsRemaining: 3,
                currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
              },
            },
            members: {
              create: {
                userId: dbUser.id,
                role: "owner",
              },
            },
          },
          include: { subscription: true },
        });
        orgSubscription = createdOrg.subscription;
      } else {
        orgSubscription = existingOrg.subscription;
        const membership = await prisma.organizationMember.findUnique({
          where: {
            organizationId_userId: {
              organizationId: resolvedOrgId,
              userId: dbUser.id,
            },
          },
        });
        if (!membership) {
          await prisma.organizationMember.create({
            data: {
              organizationId: resolvedOrgId,
              userId: dbUser.id,
              role: "editor",
            },
          });
          userRole = "editor";
        } else {
          userRole = membership.role as "owner" | "admin" | "editor" | "viewer";
        }
      }
    } else {
      // Personal user account - resolve or provision personal workspace
      const existingMembership = dbUser.memberships[0];
      if (existingMembership) {
        resolvedOrgId = existingMembership.organizationId;
        userRole = existingMembership.role as "owner" | "admin" | "editor" | "viewer";
        orgSubscription = existingMembership.organization.subscription;
      } else {
        const personalOrgId = `org_${userId.replace(/^user_/, "")}`;
        const createdOrg = await prisma.organization.create({
          data: {
            id: personalOrgId,
            name: `${dbUser.fullName || "Personal"}'s Workspace`,
            slug: `workspace-${userId.toLowerCase().replace(/[^a-z0-9]/g, "").slice(-8)}`,
            billingEmail: dbUser.email,
            subscription: {
              create: {
                stripeCustomerId: `cus_${userId.slice(-12)}`,
                planTier: "free",
                status: "active",
                creditsMonthlyAllowance: 3,
                creditsRemaining: 3,
                currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
              },
            },
            members: {
              create: {
                userId: dbUser.id,
                role: "owner",
              },
            },
          },
          include: { subscription: true },
        });
        resolvedOrgId = createdOrg.id;
        orgSubscription = createdOrg.subscription;
      }
    }

    // If organization exists but subscription was deleted or not yet created, self-heal
    if (!orgSubscription && resolvedOrgId) {
      orgSubscription = await prisma.subscription.upsert({
        where: { organizationId: resolvedOrgId },
        update: {},
        create: {
          organizationId: resolvedOrgId,
          stripeCustomerId: `cus_${resolvedOrgId.slice(-12)}`,
          planTier: "free",
          status: "active",
          creditsMonthlyAllowance: 3,
          creditsRemaining: 3,
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      });
    }

    const planTier = (orgSubscription?.planTier || "free") as "free" | "starter" | "growth" | "scale";
    const creditsRemaining = orgSubscription?.creditsRemaining ?? 3;
    const creditsMonthlyAllowance = orgSubscription?.creditsMonthlyAllowance ?? 3;

    return {
      userId: dbUser.id,
      orgId: resolvedOrgId,
      role: userRole,
      email: dbUser.email,
      fullName: dbUser.fullName || "AutoUGC Creator",
      planTier,
      creditsRemaining,
      creditsMonthlyAllowance,
    };
  } catch {
    // Resilient offline/dev fallback: deterministic tenant mapped to userId
    const fallbackOrgId = orgId || `org_${userId.replace(/^user_/, "")}`;
    return {
      userId,
      orgId: fallbackOrgId,
      role: "owner",
      email: `creator_${userId.slice(-6)}@autougc.com`,
      fullName: "AutoUGC Creator",
      planTier: "free",
      creditsRemaining: 3,
      creditsMonthlyAllowance: 3,
    };
  }
}
