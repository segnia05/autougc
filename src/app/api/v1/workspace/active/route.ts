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

      if (onboardedCookie === "true" || brandCookie) {
        try {
          const project = await prisma.project.findFirst({
            where: brandCookie
              ? { brandName: { equals: brandCookie, mode: "insensitive" } }
              : undefined,
            orderBy: { createdAt: "desc" },
            include: {
              organization: {
                include: { subscription: true },
              },
              assets: { where: { assetType: "image" }, take: 1 },
              campaigns: { take: 1 },
            },
          });

          if (project) {
            return NextResponse.json({
              onboarded: true,
              brandName: project.brandName,
              targetUrl: project.targetUrl,
              targetAudience: project.targetAudience || "Students and creators",
              competitors: project.competitors || [],
              whatItDoes: project.whatItDoes || project.summary || "",
              summary: project.summary || "",
              founderName: "Founder",
              goal: project.primaryGoal || `Sell more ${project.brandName} plans`,
              screenshotUrl: project.screenshotUrl || project.assets[0]?.url || "",
              credits: project.organization.subscription?.creditsRemaining ?? 50,
              planTier: project.organization.subscription?.planTier ?? "starter",
              projectId: project.id,
              campaignId: project.campaigns[0]?.id,
            });
          }
        } catch {
          // Fallback to cookie
        }

        if (brandCookie) {
          return NextResponse.json({
            onboarded: true,
            brandName: brandCookie,
            founderName: "Founder",
            credits: 50,
            goal: `Scale paid customer acquisition for ${brandCookie}`,
            screenshotUrl: "",
            targetAudience: "Target audience",
            competitors: [],
          });
        }
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

    const screenshotUrl = latestProject.screenshotUrl || latestProject.assets[0]?.url || "";
    const primaryGoal = latestProject.primaryGoal || `Sell more ${latestProject.brandName} plans to people who want ${latestProject.summary || "results"}`;

    return NextResponse.json({
      onboarded: true,
      brandName: latestProject.brandName,
      targetUrl: latestProject.targetUrl,
      targetAudience: latestProject.targetAudience || "Target customers and writers",
      competitors: latestProject.competitors || [],
      whatItDoes: latestProject.whatItDoes || latestProject.summary || "",
      summary: latestProject.summary || "",
      founderName: authCtx.fullName?.split(" ")[0] || "Founder",
      goal: primaryGoal,
      screenshotUrl,
      credits: organization?.subscription?.creditsRemaining ?? 50,
      planTier: organization?.subscription?.planTier ?? "starter",
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

export async function PATCH(req: NextRequest) {
  try {
    const authCtx = await getAuthContext(req);
    let orgId: string | null = authCtx?.orgId || req.headers.get("x-organization-id");

    if (!orgId) {
      const latestOrg = await prisma.organization.findFirst({
        orderBy: { createdAt: "desc" },
      });
      orgId = latestOrg?.id ?? null;
    }

    if (!orgId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      brandName,
      targetUrl,
      targetAudience,
      competitors,
      whatItDoes,
      goal,
      screenshotUrl,
    } = body;

    const project = await prisma.project.findFirst({
      where: { organizationId: orgId },
      orderBy: { createdAt: "desc" },
    });

    if (!project) {
      return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
    }

    const updated = await prisma.project.update({
      where: { id: project.id },
      data: {
        brandName: brandName || undefined,
        name: brandName || undefined,
        targetUrl: targetUrl || undefined,
        targetAudience: targetAudience || undefined,
        competitors: Array.isArray(competitors) ? competitors : undefined,
        whatItDoes: whatItDoes || undefined,
        primaryGoal: goal || undefined,
        screenshotUrl: screenshotUrl || undefined,
      },
    });

    return NextResponse.json({
      success: true,
      project: {
        id: updated.id,
        brandName: updated.brandName,
        targetUrl: updated.targetUrl,
        targetAudience: updated.targetAudience,
        competitors: updated.competitors,
        whatItDoes: updated.whatItDoes,
        goal: updated.primaryGoal,
        screenshotUrl: updated.screenshotUrl,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed updating workspace";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
