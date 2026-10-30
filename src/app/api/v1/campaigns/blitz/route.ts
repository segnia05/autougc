import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateBlitzCampaign } from "@/lib/ai/blitzEngine";
import { scrapeProductPage } from "@/lib/scraper/productScraper";
import { validateCsrfOrigin } from "@/lib/security/csrf";
import { checkRateLimit, getClientIdentifier, createRateLimitResponse } from "@/lib/security/rateLimit";

const BlitzRequestSchema = z.object({
  url: z.string().url().optional().or(z.literal("")),
  brandName: z.string().optional(),
  summary: z.string().optional(),
  niche: z.string().optional(),
});

export async function POST(request: NextRequest) {
  // 1. CSRF Protection
  const csrf = validateCsrfOrigin(request);
  if (!csrf.isValid) {
    return NextResponse.json(
      { success: false, error: { code: "CSRF_ERROR", message: csrf.error } },
      { status: 403 }
    );
  }

  // 2. Rate Limiting (15 Blitz runs/min)
  const clientIdentifier = getClientIdentifier(request);
  const rateLimit = checkRateLimit(clientIdentifier, { limit: 15, windowSeconds: 60 });
  if (!rateLimit.success) {
    return createRateLimitResponse(rateLimit);
  }

  try {
    const rawBody = await request.json().catch(() => ({}));
    const parsed = BlitzRequestSchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid Blitz request payload",
            details: parsed.error.format(),
          },
        },
        { status: 400 }
      );
    }

    let brandName = parsed.data.brandName || "My Brand";
    let summary = parsed.data.summary || "";
    let pageTitle = "High-Growth Product Launch";
    let headings: string[] = [];

    // If a URL was provided, scrape it to extract brand intelligence (Senna behavior)
    if (parsed.data.url && parsed.data.url.trim().length > 0) {
      try {
        const scraped = await scrapeProductPage(parsed.data.url);
        brandName = scraped.brandName || brandName;
        summary = scraped.summary || summary;
        pageTitle = scraped.pageTitle || pageTitle;
        headings = scraped.headings || [];
      } catch (scrapeErr) {
        console.warn("Could not scrape URL, continuing with user input:", scrapeErr);
      }
    }

    const variations = await generateBlitzCampaign({
      brandName,
      pageTitle,
      summary: summary || `The ultimate solution for ${brandName}`,
      headings,
      targetAudience: parsed.data.niche,
    });

    return NextResponse.json({
      success: true,
      brandName,
      summary,
      totalVariations: variations.length,
      variations,
    });
  } catch (err: unknown) {
    console.error("Blitz generation failed:", err);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "BLITZ_GENERATION_FAILED",
          message: err instanceof Error ? err.message : "Internal Blitz engine error",
        },
      },
      { status: 500 }
    );
  }
}

