import { NextResponse } from "next/server";
import { z } from "zod";
import { synthesizeVoiceover } from "@/lib/audio/ttsProvider";
import { CREATOR_VOICE_PRESETS } from "@/lib/audio/types";
import { datadog } from "@/lib/observability/datadog";
import { posthog } from "@/lib/observability/posthog";
import { sentry } from "@/lib/observability/sentry";
import { grafana } from "@/lib/observability/grafana";
import { logger } from "@/lib/observability/logger";

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
      datadog.increment("audio.validation_error", 1);
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
    const durationMs = Date.now() - startTime;

    // Observability telemetry
    grafana.audioSynthesizedSecondsTotal.inc(
      { voice_id: result.voiceId },
      result.durationSeconds
    );
    datadog.timing("audio.synthesis.duration", durationMs, { voice: result.voiceId });
    datadog.increment("audio.synthesized", 1);
    posthog.capture("audio_synthesized", {
      voiceId: result.voiceId,
      audioDuration: result.durationSeconds,
      wordsCount: result.words.length,
      durationMs,
    });
    logger.info(`Synthesized audio voiceover (${result.durationSeconds}s) for voice: ${result.voiceId}`, {
      voiceId: result.voiceId,
      durationSeconds: result.durationSeconds,
      wordsCount: result.words.length,
      requestId,
    });

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
        durationMs,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to synthesize audio";

    datadog.increment("audio.synthesis_failed", 1);
    sentry.captureException(error, {
      tags: { route: "/api/v1/audio/synthesize" },
      extra: { requestId },
    });
    logger.error("Audio synthesis failed", error, { requestId });

    return NextResponse.json(
      {
        success: false,
        error: { code: "SYNTHESIS_FAILED", message },
      },
      { status: 500 }
    );
  }
}
