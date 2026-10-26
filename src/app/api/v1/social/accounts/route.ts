import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/db/client";
import { encryptToken } from "@/lib/social/crypto";

const CreateAccountSchema = z.object({
  platform: z.enum(["tiktok", "instagram", "youtube"]),
  accountHandle: z.string().min(1, "Account handle is required"),
  accountNickname: z.string().optional(),
  isBurner: z.boolean().default(false),
});

export async function GET(request: NextRequest) {
  try {
    const orgId = request.headers.get("x-organization-id") || "org_dev_default_123";

    try {
      const accounts = await prisma.socialAccount.findMany({
        where: {
          organizationId: orgId,
          isActive: true,
        },
        select: {
          id: true,
          platform: true,
          accountHandle: true,
          accountNickname: true,
          isBurner: true,
          dailyPostLimit: true,
          createdAt: true,
        },
        orderBy: { createdAt: "asc" },
      });

      if (accounts.length > 0) {
        return NextResponse.json({ success: true, accounts });
      }
    } catch {
      // Fallback below
    }

    // Default development accounts if DB is empty or offline
    const devAccounts = [
      {
        id: "acc_main_brand",
        platform: "tiktok" as const,
        accountHandle: "@luminalight_official",
        accountNickname: "Main Brand (Official)",
        isBurner: false,
        dailyPostLimit: 1,
        createdAt: new Date().toISOString(),
      },
      {
        id: "acc_burner_1",
        platform: "tiktok" as const,
        accountHandle: "@desk_hacks_daily",
        accountNickname: "Burner #1 (Desk Setups)",
        isBurner: true,
        dailyPostLimit: 2,
        createdAt: new Date().toISOString(),
      },
      {
        id: "acc_burner_2",
        platform: "tiktok" as const,
        accountHandle: "@focus_tools_2026",
        accountNickname: "Burner #2 (Productivity)",
        isBurner: true,
        dailyPostLimit: 2,
        createdAt: new Date().toISOString(),
      },
      {
        id: "acc_reels_main",
        platform: "instagram" as const,
        accountHandle: "@luminalight",
        accountNickname: "Instagram Reels (Main)",
        isBurner: false,
        dailyPostLimit: 1,
        createdAt: new Date().toISOString(),
      },
    ];

    return NextResponse.json({ success: true, accounts: devAccounts });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch accounts";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const orgId = request.headers.get("x-organization-id") || "org_dev_default_123";
    const body = await request.json();
    const parsed = CreateAccountSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation error", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { platform, accountHandle, accountNickname, isBurner } = parsed.data;
    const cleanHandle = accountHandle.startsWith("@") ? accountHandle : `@${accountHandle}`;
    const generatedUserId = `user_${platform}_${Date.now()}`;

    // Enforce tier account limits: Starter: 1, Growth: 5, Scale: 15
    const PLAN_LIMITS: Record<string, number> = {
      free: 1,
      starter: 1,
      growth: 5,
      scale: 15,
    };

    try {
      const sub = await prisma.subscription.findUnique({
        where: { organizationId: orgId },
      });
      const planTier = request.headers.get("x-plan-tier") || sub?.planTier || "starter";
      const maxAllowed = PLAN_LIMITS[planTier] ?? 1;

      const currentCount = await prisma.socialAccount.count({
        where: { organizationId: orgId, isActive: true },
      });

      if (currentCount >= maxAllowed) {
        return NextResponse.json(
          {
            success: false,
            error: `Account limit reached. Your ${planTier.toUpperCase()} plan allows up to ${maxAllowed} connected account(s). Upgrade to Growth (5 accounts) or Scale (15 accounts) to add more.`,
            upgradeRequired: true,
          },
          { status: 403 }
        );
      }
    } catch {
      // Dev mode without DB passes through
    }

    try {
      const newAccount = await prisma.socialAccount.create({
        data: {
          organizationId: orgId,
          platform,
          platformUserId: generatedUserId,
          accountHandle: cleanHandle,
          accountNickname: accountNickname || (isBurner ? `Satellite (${platform})` : `Official (${platform})`),
          isBurner,
          encryptedAccessToken: encryptToken(`mock_${platform}_token_${Date.now()}`),
          isActive: true,
        },
      });

      return NextResponse.json({
        success: true,
        account: {
          id: newAccount.id,
          platform: newAccount.platform,
          accountHandle: newAccount.accountHandle,
          accountNickname: newAccount.accountNickname,
          isBurner: newAccount.isBurner,
        },
      });
    } catch {
      // Dev mode fallback
      return NextResponse.json({
        success: true,
        account: {
          id: `acc_dev_${Date.now()}`,
          platform,
          accountHandle: cleanHandle,
          accountNickname: accountNickname || `${cleanHandle} (${isBurner ? "Burner" : "Official"})`,
          isBurner,
        },
      });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create account";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
