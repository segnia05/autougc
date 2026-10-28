import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateViralScripts } from "@/lib/ai/gemini";
import { db } from "@/db/client";
import { checkRateLimit, getClientIdentifier, createRateLimitResponse } from "@/lib/security/rateLimit";
import { validateCsrfOrigin } from "@/lib/security/csrf";

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
    return NextResponse.json({ success: false, error: { code: "CSRF_ERROR", message: csrf.error } }, { status: 403 });
  }

  // 2. Sliding-Window Rate Limiting (20 generations/minute per client)
  const clientIdentifier = getClientIdentifier(request);
  const rateLimit = checkRateLimit(clientIdentifier, { limit: 20, windowSeconds: 60 });
  if (!rateLimit.success) {
    return createRateLimitResponse(rateLimit);
  }

  try {
    const rawBody = await request.json().catch(() => null);
    const parsed = ScriptGenerateRequestSchema.safeParse(rawBody);

    if (!parsed.success) {
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

    // 2. If a valid persisted projectId was provided, save scripts to PostgreSQL
    const responseScripts = [];

    for (const s of result.scripts) {
      let scriptId = `script_${Math.random().toString(36).substring(2, 10)}`;

      if (projectId && !projectId.startsWith("preview_")) {
        try {
          const persisted = await db.script.create({
            data: {
              projectId,
              angleType: s.angleType,
              hookText: s.hook,
              bodyText: s.body,
              ctaText: s.cta,
              fullScriptText: `${s.hook} ${s.body} ${s.cta}`,
              suggestedVisualCues: s.suggestedVisualCues,
              captionCopy: s.caption,
              hashtags: s.hashtags,
            },
          });
          scriptId = persisted.id;
        } catch (dbErr) {
          console.warn("Script persistence bypassed:", dbErr);
        }
      }

      responseScripts.push({
        scriptId,
        angleType: s.angleType,
        hook: s.hook,
        body: s.body,
        cta: s.cta,
        fullScript: `${s.hook} ${s.body} ${s.cta}`,
        estimatedDurationSeconds: s.estimatedDurationSeconds,
        caption: s.caption,
        hashtags: s.hashtags,
        suggestedVisualCues: s.suggestedVisualCues,
      });
    }

    const durationMs = Date.now() - startTime;

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
