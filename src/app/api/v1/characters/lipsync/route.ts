import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateTalkingAvatar } from "@/lib/video/talkingAvatarService";
import { getAuthContext } from "@/lib/auth/getAuthContext";
import { validateCsrfOrigin } from "@/lib/security/csrf";
import { checkRateLimit, createRateLimitResponse } from "@/lib/security/rateLimit";

const LipSyncSchema = z.object({
  characterId: z.string().min(1),
  scriptText: z.string().min(1),
  voiceId: z.string().optional(),
  audioUrl: z.string().optional(),
  imageUrl: z.string().optional(),
  videoUrl: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const csrf = validateCsrfOrigin(request);
    if (!csrf.isValid) {
      return NextResponse.json(
        { success: false, error: "CSRF_ERROR", message: csrf.error },
        { status: 403 }
      );
    }

    const authContext = await getAuthContext(request);
    if (!authContext) {
      return NextResponse.json(
        { success: false, error: "UNAUTHORIZED", message: "Sign-in required" },
        { status: 401 }
      );
    }

    const rateLimit = checkRateLimit(`avatar:${authContext.orgId}`, {
      limit: 10,
      windowSeconds: 60,
    });
    if (!rateLimit.success) {
      return createRateLimitResponse(rateLimit);
    }

    const body = await request.json().catch(() => ({}));
    const parsed = LipSyncSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "VALIDATION_ERROR", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const result = await generateTalkingAvatar(parsed.data);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Talking avatar generation failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
