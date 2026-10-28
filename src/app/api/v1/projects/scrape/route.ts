import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { scrapeUrl } from "@/lib/scraper/extractor";
import { db } from "@/db/client";
import { checkRateLimit, getClientIdentifier, createRateLimitResponse } from "@/lib/security/rateLimit";
import { validateCsrfOrigin } from "@/lib/security/csrf";

const ScrapeRequestSchema = z.object({
  url: z.string().url("A valid URL is required (e.g. https://yourbrand.com)"),
  organizationId: z.string().uuid().optional(),
});

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const requestId = `req_${Math.random().toString(36).substring(2, 10)}`;

  // 1. CSRF Protection
  const csrf = validateCsrfOrigin(request);
  if (!csrf.isValid) {
    return NextResponse.json({ success: false, error: { code: "CSRF_ERROR", message: csrf.error } }, { status: 403 });
  }

  // 2. Sliding-Window Rate Limiting (15 requests/minute per client IP)
  const clientIdentifier = getClientIdentifier(request);
  const rateLimit = checkRateLimit(clientIdentifier, { limit: 15, windowSeconds: 60 });
  if (!rateLimit.success) {
    return createRateLimitResponse(rateLimit);
  }

  try {
    const rawBody = await request.json().catch(() => null);
    const parsed = ScrapeRequestSchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid scrape request payload",
            details: parsed.error.format(),
          },
        },
        { status: 400 }
      );
    }

    const { url, organizationId } = parsed.data;

    // Execute scraping engine
    const scrapedData = await scrapeUrl(url);

    // If an organizationId is provided and valid, persist project in PostgreSQL
    let persistedProjectId: string | undefined;

    if (organizationId) {
      try {
        const orgExists = await db.organization.findUnique({
          where: { id: organizationId },
        });

        if (orgExists) {
          // Get default admin or org user
          const member = await db.organizationMember.findFirst({
            where: { organizationId },
          });

          if (member) {
            const project = await db.project.create({
              data: {
                organizationId,
                createdByUserId: member.userId,
                name: scrapedData.pageTitle.slice(0, 200),
                targetUrl: url,
                brandName: scrapedData.brandName,
                brandLogoUrl: scrapedData.assets.find((a) => a.type === "logo")?.url,
                primaryColor: scrapedData.brandColors.primary,
                accentColor: scrapedData.brandColors.accent,
                summary: scrapedData.summary.slice(0, 1000),
              },
            });
            persistedProjectId = project.id;

            // Batch insert scraped assets
            if (scrapedData.assets.length > 0) {
              await db.scrapedAsset.createMany({
                data: scrapedData.assets.map((asset) => ({
                  projectId: project.id,
                  assetType: asset.type,
                  url: asset.url,
                  metadata: { aspectRatio: asset.aspectRatio },
                })),
              });
            }
          }
        }
      } catch (dbErr) {
        // Log database failure but don't crash preview response
        console.warn("Project persistence bypassed:", dbErr);
      }
    }

    const durationMs = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      data: {
        projectId: persistedProjectId || `preview_${Math.random().toString(36).substring(2, 10)}`,
        brandName: scrapedData.brandName,
        pageTitle: scrapedData.pageTitle,
        summary: scrapedData.summary,
        headings: scrapedData.headings,
        brandColors: scrapedData.brandColors,
        assets: scrapedData.assets,
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId,
        durationMs,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to scrape target URL";
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "SCRAPE_FAILED",
          message,
        },
      },
      { status: 422 }
    );
  }
}
