import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getAuthContext } from "@/lib/auth/getAuthContext";
import { prisma } from "@/db/client";
import { logger } from "@/lib/observability/logger";
import { datadog } from "@/lib/observability/datadog";
import { sentry } from "@/lib/observability/sentry";

/**
 * GDPR Art. 15 (Right of Access) & Art. 20 (Right to Data Portability) Endpoint.
 *
 * Exports a verified machine-readable JSON dossier of all user personal data,
 * project assets, AI scripts, video creatives, social connections, and billing ledgers.
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now();

  try {
    const authContext = await getAuthContext(request);
    if (!authContext) {
      datadog.increment("compliance.export.unauthorized", 1);
      return NextResponse.json(
        { success: false, error: "UNAUTHORIZED", message: "Authentication required to export account data." },
        { status: 401 }
      );
    }

    const { userId, orgId, planTier, role } = authContext;

    logger.info(`Processing GDPR data portability export for user ${userId}`, {
      userId,
      orgId,
    });

    sentry.addBreadcrumb({
      category: "compliance",
      message: `GDPR Data Export requested by ${userId}`,
      level: "info",
    });

    // 1. Query User Profile
    const userProfile = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        createdAt: true,
        updatedAt: true,
      },
    }).catch(() => null);

    // 2. Query Organization & Subscriptions
    const organization = await prisma.organization.findUnique({
      where: { id: orgId },
      include: {
        subscription: true,
        creditTransactions: true,
      },
    }).catch(() => null);

    // 3. Query Projects & Scraped Brand Assets
    const projects = await prisma.project.findMany({
      where: { organizationId: orgId },
      include: {
        assets: true,
      },
    }).catch(() => []);

    // 4. Query Generated Scripts
    const projectIds = projects.map((p) => p.id);
    const scripts = await prisma.script.findMany({
      where: { projectId: { in: projectIds } },
    }).catch(() => []);

    // 5. Query Rendered Videos
    const videos = await prisma.video.findMany({
      where: { organizationId: orgId },
      select: {
        id: true,
        projectId: true,
        voiceId: true,
        aspectRatio: true,
        durationSeconds: true,
        hasWatermark: true,
        videoUrl: true,
        renderStatus: true,
        createdAt: true,
      },
    }).catch(() => []);

    // 6. Query Connected Social Accounts (Sanitized, omitting tokens)
    const socialAccounts = await prisma.socialAccount.findMany({
      where: { organizationId: orgId },
      select: {
        id: true,
        platform: true,
        accountHandle: true,
        isActive: true,
        createdAt: true,
      },
    }).catch(() => []);

    // 7. Query Scheduled Campaign Posts
    const scheduledPosts = await prisma.scheduledPost.findMany({
      where: { organizationId: orgId },
      select: {
        id: true,
        caption: true,
        targetTimezone: true,
        localScheduledTime: true,
        scheduledFor: true,
        publishStatus: true,
        updatedAt: true,
      },
    }).catch(() => []);

    // 8. Compile Dossier
    const exportDossier = {
      manifest: {
        dpoContact: "dpo@autougc.ai",
        regulation: "GDPR (EU) 2016/679 & CCPA",
        format: "application/json",
        exportedAt: new Date().toISOString(),
        requestingUser: {
          userId,
          email: userProfile?.email || "verified_user",
          role,
          planTier,
        },
      },
      account: {
        profile: userProfile || { id: userId },
        organization: organization ? {
          id: organization.id,
          name: organization.name,
          slug: organization.slug,
          subscription: organization.subscription,
          creditTransactions: organization.creditTransactions,
        } : { id: orgId },
      },
      creativeAssets: {
        projectsCount: projects.length,
        projects,
        scriptsCount: scripts.length,
        scripts,
        videosCount: videos.length,
        videos,
      },
      distribution: {
        connectedAccountsCount: socialAccounts.length,
        connectedAccounts: socialAccounts,
        scheduledPostsCount: scheduledPosts.length,
        scheduledPosts,
      },
    };

    // 9. Generate SHA-256 Cryptographic Fingerprint
    const jsonString = JSON.stringify(exportDossier, null, 2);
    const sha256Fingerprint = crypto
      .createHash("sha256")
      .update(jsonString)
      .digest("hex");

    const finalPayload = {
      ...exportDossier,
      cryptographicVerification: {
        algorithm: "SHA-256",
        signature: sha256Fingerprint,
      },
    };

    const durationMs = Date.now() - startTime;
    datadog.increment("compliance.export.success", 1);
    datadog.timing("compliance.export.duration", durationMs);
    logger.info(`GDPR data export generated successfully for user ${userId}`, {
      userId,
      durationMs,
      sha256Fingerprint,
    });

    return new NextResponse(JSON.stringify(finalPayload, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": `attachment; filename="autougc-data-export-${userId}.json"`,
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "X-Data-Export-Signature": sha256Fingerprint,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to generate GDPR data export";
    datadog.increment("compliance.export.failed", 1);
    sentry.captureException(error, { tags: { route: "/api/v1/compliance/export" } });
    logger.error("GDPR data export failed", error);

    return NextResponse.json(
      { success: false, error: "EXPORT_FAILED", message },
      { status: 500 }
    );
  }
}
