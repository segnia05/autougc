import { NextResponse } from "next/server";
import { z } from "zod";
import { synthesizeVoiceover } from "@/lib/audio/ttsProvider";
import { CREATOR_VOICE_PRESETS } from "@/lib/audio/types";

const SynthesizeRequestSchema = z.object({
  scriptText: z.string().min(5, "Script text is required"),
  voiceId: z.string().default("alex_casual_dtc"),
});

export async function POST(request: Request) {
  const startTime = Date.now();
  const requestId = `req_${Math.random().toString(36).substring(2, 10)}`;

  try {
    const rawBody = await request.json().catch(() => null);
    const parsed = SynthesizeRequestSchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid audio synthesis payload",
            details: parsed.error.format(),
          },
        },
        { status: 400 }
      );
    }

    const { scriptText, voiceId } = parsed.data;
    const result = await synthesizeVoiceover(scriptText, voiceId);

    return NextResponse.json({
      success: true,
      data: {
        voiceId: result.voiceId,
        audioUrl: result.audioUrl,
        durationSeconds: result.durationSeconds,
        words: result.words,
        availableVoices: CREATOR_VOICE_PRESETS,
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId,
        durationMs: Date.now() - startTime,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to synthesize audio";
    return NextResponse.json(
      {
        success: false,
        error: { code: "SYNTHESIS_FAILED", message },
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      voices: CREATOR_VOICE_PRESETS,
    },
  });
}
