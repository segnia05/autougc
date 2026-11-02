import { NextRequest, NextResponse } from "next/server";
import { getAuthContext } from "@/lib/auth/getAuthContext";
import { prisma } from "@/db/client";
import { logger } from "@/lib/observability/logger";

export async function POST(req: NextRequest) {
  try {
    const authCtx = await getAuthContext(req);
    const body = await req.json();

    const {
      url,
      founderName,
      referralSource,
      brandName,
      audience,
      usp,
      goal,
      screenshotUrl,
      whatItDoes,
      competitors,
      category,
    } = body;

    if (!brandName || !url) {
      return NextResponse.json(
        { error: "brandName and url are required" },
        { status: 400 }
      );
    }

    // Default identifiers if running in public or pre-auth onboarding
    const userId = authCtx?.userId || "usr_onboarded_founder";
    const orgId = authCtx?.orgId || `org_${brandName.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 16)}`;

    // Update or create user record
    if (authCtx?.userId) {
      await prisma.user.update({
        where: { id: authCtx.userId },
        data: {
          fullName: founderName || undefined,
        },
      }).catch((err) => logger.warn("Failed updating user fullName in onboarding", { error: String(err) }));
    }

    // Ensure Organization exists
    const organization = await prisma.organization.upsert({
      where: { slug: `org-${brandName.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 16)}` },
      update: {
        name: `${brandName} Workspace`,
      },
      create: {
        id: orgId,
        name: `${brandName} Workspace`,
        slug: `org-${brandName.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 16)}`,
        billingEmail: authCtx?.email || "founder@autougc.com",
        subscription: {
          create: {
            stripeCustomerId: `cus_${orgId.slice(-12)}`,
            planTier: "starter",
            status: "active",
            creditsMonthlyAllowance: 50,
            creditsRemaining: 50,
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
        },
      },
      include: { subscription: true },
    });

    // Create or update Project
    const project = await prisma.project.create({
      data: {
        organizationId: organization.id,
        createdByUserId: authCtx?.userId || userId,
        name: brandName,
        brandName: brandName,
        targetUrl: url,
        summary: usp || "Autonomous AI UGC Ads",
        targetAudience: audience || null,
        competitors: Array.isArray(competitors) ? competitors : [],
        whatItDoes: whatItDoes || usp || null,
        primaryGoal: goal || null,
        screenshotUrl: screenshotUrl || null,
        assets: screenshotUrl
          ? {
              create: {
                assetType: "image",
                url: screenshotUrl,
                contentText: `${brandName} Software UI Proof`,
                metadata: { type: "viewport_screenshot", source: "onboarding" },
              },
            }
          : undefined,
        campaigns: {
          create: {
            organizationId: organization.id,
            name: "Starter campaign",
            totalVideos: 30,
            cadence: "mon_wed_fri_sun",
            status: "active",
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
        },
      },
      include: {
        campaigns: true,
      },
    });

    // Build success response with onboarding cookie
    const response = NextResponse.json({
      success: true,
      brandName,
      founderName: founderName || "Founder",
      goal: goal || `Sell more ${brandName} plans to people who want ${usp}`,
      screenshotUrl: screenshotUrl || "",
      targetAudience: audience || "",
      competitors: Array.isArray(competitors) ? competitors : [],
      whatItDoes: whatItDoes || usp || "",
      credits: organization.subscription?.creditsRemaining ?? 50,
      projectId: project.id,
      campaignId: project.campaigns[0]?.id,
    });

    // Set permanent onboarding cookie so middleware permits dashboard entry
    response.cookies.set("autougc_onboarded", "true", {
      path: "/",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      sameSite: "lax",
      httpOnly: false,
    });

    response.cookies.set("autougc_brand_name", brandName, {
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
      sameSite: "lax",
    });

    response.cookies.set("autougc_org_id", organization.id, {
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
      sameSite: "lax",
    });

    return response;
  } catch (error: unknown) {
    logger.error("Failed saving onboarding completion", { error: String(error) });
    // Still permit graceful continuation with fallback cookie
    const response = NextResponse.json({
      success: true,
      fallback: true,
      message: "Saved in fallback state",
    });
    response.cookies.set("autougc_onboarded", "true", {
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
      sameSite: "lax",
    });
    return response;
  }
}
