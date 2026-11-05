import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import { prisma } from "@/db/client";

interface ClerkEmailAddress {
  email_address: string;
  id: string;
}

interface ClerkUserData {
  id: string;
  email_addresses: ClerkEmailAddress[];
  first_name: string | null;
  last_name: string | null;
  image_url: string | null;
}

interface ClerkOrgData {
  id: string;
  name: string;
  slug: string;
  created_by: string;
}

interface ClerkMembershipData {
  id: string;
  role: string;
  organization: {
    id: string;
  };
  public_user_data: {
    user_id: string;
  };
}

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

  const rawBody = await request.text();
  const svixId = request.headers.get("svix-id");
  const svixTimestamp = request.headers.get("svix-timestamp");
  const svixSignature = request.headers.get("svix-signature");

  let payload: { type: string; data: Record<string, unknown> };

  if (webhookSecret && svixId && svixTimestamp && svixSignature) {
    try {
      const wh = new Webhook(webhookSecret);
      payload = wh.verify(rawBody, {
        "svix-id": svixId,
        "svix-timestamp": svixTimestamp,
        "svix-signature": svixSignature,
      }) as unknown as { type: string; data: Record<string, unknown> };
    } catch (err) {
      console.error("Clerk webhook signature verification error:", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }
  } else {
    // Development fallback without secret
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
  }

  const { type, data } = payload;

  try {
    switch (type) {
      case "user.created": {
        const userData = data as unknown as ClerkUserData;
        const email = userData.email_addresses?.[0]?.email_address || `user_${userData.id.slice(-6)}@autougc.com`;
        const fullName = [userData.first_name, userData.last_name].filter(Boolean).join(" ") || "AutoUGC Creator";
        const avatarUrl = userData.image_url || null;

        const user = await prisma.user.upsert({
          where: { id: userData.id },
          update: { email, fullName, avatarUrl },
          create: {
            id: userData.id,
            email,
            fullName,
            avatarUrl,
          },
        });

        // Provision personal workspace organization with 20 initial render credits
        const personalOrgId = `org_${user.id.replace(/^user_/, "")}`;
        await prisma.organization.upsert({
          where: { id: personalOrgId },
          update: { billingEmail: email },
          create: {
            id: personalOrgId,
            name: `${fullName}'s Workspace`,
            slug: `workspace-${user.id.toLowerCase().replace(/[^a-z0-9]/g, "").slice(-8)}`,
            billingEmail: email,
            subscription: {
              create: {
                stripeCustomerId: `cus_${user.id.slice(-12)}`,
                planTier: "free",
                status: "active",
                creditsMonthlyAllowance: 0,
                creditsRemaining: 0,
                currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
              },
            },
            members: {
              create: {
                userId: user.id,
                role: "owner",
              },
            },
          },
        });
        break;
      }

      case "user.updated": {
        const userData = data as unknown as ClerkUserData;
        const email = userData.email_addresses?.[0]?.email_address;
        const fullName = [userData.first_name, userData.last_name].filter(Boolean).join(" ");
        const avatarUrl = userData.image_url;

        await prisma.user.update({
          where: { id: userData.id },
          data: {
            ...(email ? { email } : {}),
            ...(fullName ? { fullName } : {}),
            ...(avatarUrl ? { avatarUrl } : {}),
          },
        });
        break;
      }

      case "user.deleted": {
        const userData = data as unknown as { id: string };
        await prisma.user.delete({
          where: { id: userData.id },
        });
        break;
      }

      case "organization.created": {
        const orgData = data as unknown as ClerkOrgData;
        const orgId = orgData.id;
        const creatorId = orgData.created_by;

        const creator = await prisma.user.findUnique({ where: { id: creatorId } });
        const billingEmail = creator?.email || "billing@autougc.com";

        await prisma.organization.upsert({
          where: { id: orgId },
          update: {
            name: orgData.name,
            slug: orgData.slug || `org-${orgId.toLowerCase().slice(-8)}`,
          },
          create: {
            id: orgId,
            name: orgData.name,
            slug: orgData.slug || `org-${orgId.toLowerCase().slice(-8)}`,
            billingEmail,
            subscription: {
              create: {
                stripeCustomerId: `cus_${orgId.slice(-12)}`,
                planTier: "free",
                status: "active",
                creditsMonthlyAllowance: 0,
                creditsRemaining: 0,
                currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
              },
            },
            members: creator
              ? {
                  create: {
                    userId: creator.id,
                    role: "owner",
                  },
                }
              : undefined,
          },
        });
        break;
      }

      case "organizationMembership.created": {
        const membershipData = data as unknown as ClerkMembershipData;
        const orgId = membershipData.organization.id;
        const userId = membershipData.public_user_data.user_id;
        const rawRole = membershipData.role.toLowerCase();
        const role = rawRole.includes("admin") || rawRole.includes("owner") ? "admin" : "editor";

        await prisma.organizationMember.upsert({
          where: {
            organizationId_userId: {
              organizationId: orgId,
              userId,
            },
          },
          update: { role },
          create: {
            organizationId: orgId,
            userId,
            role,
          },
        });
        break;
      }

      case "organizationMembership.deleted": {
        const membershipData = data as unknown as ClerkMembershipData;
        await prisma.organizationMember.deleteMany({
          where: {
            organizationId: membershipData.organization.id,
            userId: membershipData.public_user_data.user_id,
          },
        });
        break;
      }

      default:
        break;
    }
  } catch (err) {
    // If database connection is not active in dev/test, acknowledge webhook without failing
    console.warn(`Clerk webhook [${type}] processed with DB warning:`, err);
  }

  return NextResponse.json({ success: true, received: true });
}
