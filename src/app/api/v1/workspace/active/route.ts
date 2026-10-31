import { NextRequest, NextResponse } from "next/server";
import { getAuthContext } from "@/lib/auth/getAuthContext";
import { prisma } from "@/db/client";

export async function GET(req: NextRequest) {
  try {
    const authCtx = await getAuthContext(req);

    if (!authCtx) {
      // Check if dev or local cookie exists
      const onboardedCookie = req.cookies.get("autougc_onboarded")?.value;
      const brandCookie = req.cookies.get("autougc_brand_name")?.value;

      if (onboardedCookie === "true" && brandCookie) {
        return NextResponse.json({
          onboarded: true,
          brandName: brandCookie,
          founderName: "Founder",
          credits: 50,
          goal: `Scale paid customer acquisition for ${brandCookie}`,
          screenshotUrl: "",
        });
      }

      return NextResponse.json({ onboarded: false }, { status: 401 });
    }

    // Lookup organization and latest project
    const organization = await prisma.organization.findUnique({
      where: { id: authCtx.orgId },
      include: {
        subscription: true,
        projects: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: {
            assets: {
              where: { assetType: "image" },
              take: 1,
            },
            campaigns: {
              take: 1,
            },
          },
        },
      },
    });

    const latestProject = organization?.projects[0];

    if (!latestProject) {
      return NextResponse.json({
        onboarded: false,
        userId: authCtx.userId,
        email: authCtx.email,
        fullName: authCtx.fullName,
      });
    }

    const screenshotUrl = latestProject.assets[0]?.url || "";
    const primaryGoal = `Sell more ${latestProject.brandName} plans to people who want ${latestProject.summary || "results"}`;

    return NextResponse.json({
      onboarded: true,
      brandName: latestProject.brandName,
      founderName: authCtx.fullName?.split(" ")[0] || "Founder",
      goal: primaryGoal,
      screenshotUrl,
      credits: organization?.subscription?.creditsRemaining ?? 50,
      projectId: latestProject.id,
      campaignId: latestProject.campaigns[0]?.id,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { onboarded: false, error: err instanceof Error ? err.message : "Failed loading workspace" },
      { status: 500 }
    );
  }
}
