import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateViralScripts } from "@/lib/ai/gemini";
import { db } from "@/db/client";
import { checkRateLimit, getClientIdentifier, createRateLimitResponse } from "@/lib/security/rateLimit";
import { validateCsrfOrigin } from "@/lib/security/csrf";
import { datadog } from "@/lib/observability/datadog";
import { posthog } from "@/lib/observability/posthog";
import { sentry } from "@/lib/observability/sentry";
import { grafana } from "@/lib/observability/grafana";
import { logger } from "@/lib/observability/logger";

const ScriptGenerateRequestSchema = z.object({
  projectId: z.string().optional(),
  brandName: z.string().min(1, "Brand name is required"),
  pageTitle: z.string().default("Product Launch"),
  summary: z.string().default("A modern high-performance solution"),
  headings: z.array(z.string()).default([]),
  targetAudience: z.string().optional(),
});

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const requestId = `req_${Math.random().toString(36).substring(2, 10)}`;

  // 1. CSRF Protection
  const csrf = validateCsrfOrigin(request);
  if (!csrf.isValid) {
    datadog.increment("scripts.csrf_blocked", 1);
    return NextResponse.json({ success: false, error: { code: "CSRF_ERROR", message: csrf.error } }, { status: 403 });
  }

  // 2. Sliding-Window Rate Limiting (20 generations/minute per client)
  const clientIdentifier = getClientIdentifier(request);
  const rateLimit = checkRateLimit(clientIdentifier, { limit: 20, windowSeconds: 60 });
  if (!rateLimit.success) {
    datadog.increment("scripts.rate_limited", 1);
    return createRateLimitResponse(rateLimit);
  }

  try {
    const rawBody = await request.json().catch(() => null);
    const parsed = ScriptGenerateRequestSchema.safeParse(rawBody);

    if (!parsed.success) {
      datadog.increment("scripts.validation_error", 1);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid script generation request payload",
            details: parsed.error.format(),
          },
        },
        { status: 400 }
      );
    }

    const { projectId, brandName, pageTitle, summary, headings, targetAudience } =
      parsed.data;

    // 1. Generate the 3 viral scripts via Gemini / Intelligence Engine
    const result = await generateViralScripts({
      brandName,
      pageTitle,
      summary,
      headings,
      targetAudience,
    });

    // 2. If a valid project exists in DB, persist generated scripts
    const responseScripts = [];

    if (projectId && !projectId.startsWith("preview_")) {
      try {
        const project = await db.project.findUnique({
          where: { id: projectId },
        });

        if (project) {
          for (const s of result.scripts) {
            const saved = await db.script.create({
              data: {
                projectId,
                angleType: s.angleType,
                hookText: s.hook,
                bodyText: s.body,
                ctaText: s.cta,
                fullScriptText: `${s.hook} ${s.body} ${s.cta}`,
                captionCopy: s.caption,
                hashtags: s.hashtags,
                suggestedVisualCues: s.suggestedVisualCues,
              },
            });
            responseScripts.push({
              id: saved.id,
              fullScript: `${s.hook} ${s.body} ${s.cta}`,
              ...s,
            });
          }
        }
      } catch (dbErr) {
        console.warn("Script persistence bypassed:", dbErr);
      }
    }

    // Fallback if not persisted
    if (responseScripts.length === 0) {
      for (const s of result.scripts) {
        responseScripts.push({
          id: `script_${Math.random().toString(36).substring(2, 10)}`,
          angleType: s.angleType,
          hook: s.hook,
          body: s.body,
          cta: s.cta,
          fullScript: `${s.hook} ${s.body} ${s.cta}`,
          caption: s.caption,
          hashtags: s.hashtags,
          suggestedVisualCues: s.suggestedVisualCues,
        });
      }
    }

    const durationMs = Date.now() - startTime;

    // Observability metrics & event tracking
    grafana.scriptsGeneratedTotal.inc({ angle: "viral_trio" }, responseScripts.length);
    datadog.timing("gemini.script_gen.duration", durationMs, { brand: brandName });
    datadog.increment("scripts.generated", responseScripts.length);
    posthog.capture("script_generated", {
      brandName,
      scriptsCount: responseScripts.length,
      durationMs,
    });
    logger.info(`Generated ${responseScripts.length} viral script angles for brand: ${brandName}`, {
      brandName,
      durationMs,
      requestId,
    });

    return NextResponse.json({
      success: true,
      data: {
        scripts: responseScripts,
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId,
        durationMs,
      },
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to generate scripts";

    datadog.increment("scripts.failed", 1);
    sentry.captureException(error, {
      tags: { route: "/api/v1/scripts/generate" },
      extra: { requestId },
    });
    logger.error("Script generation failed", error, { requestId });

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "GENERATION_FAILED",
          message,
        },
      },
      { status: 500 }
    );
  }
}
