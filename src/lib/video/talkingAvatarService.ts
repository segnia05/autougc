import path from "path";
import fs from "fs";
import { logger } from "@/lib/observability/logger";
import { CREATOR_PERSONAS, CreatorPersona } from "@/components/studio/CreatorVisualPicker";

export interface TalkingAvatarRequest {
  characterId: string;
  scriptText: string;
  voiceId?: string;
  audioUrl?: string;
  imageUrl?: string;
  videoUrl?: string;
}

export interface TalkingAvatarResult {
  videoUrl: string;
  provider: "hedra" | "synclabs" | "replicate" | "curated_creator";
  isLipSynced: boolean;
  characterName: string;
  durationSeconds: number;
}

/**
 * Enterprise Talking Avatar & Lip-Sync Engine.
 * Integrates with production lip-sync APIs (Hedra, SyncLabs, Replicate)
 * with rock-solid fallback to clean 9:16 vertical creator video assets.
 */
export async function generateTalkingAvatar(
  request: TalkingAvatarRequest
): Promise<TalkingAvatarResult> {
  const persona: CreatorPersona =
    CREATOR_PERSONAS.find((p) => p.id === request.characterId) ||
    CREATOR_PERSONAS[0]!;

  const hedraKey = process.env.HEDRA_API_KEY;
  const syncLabsKey = process.env.SYNCLABS_API_KEY;
  const replicateToken = process.env.REPLICATE_API_TOKEN;

  // 1. Hedra Character Video Generation
  if (hedraKey && (persona.characterType === "ai_avatar" || request.imageUrl)) {
    try {
      logger.info(`Initiating Hedra talking avatar for character: ${persona.name}`);
      const hedraRes = await fetch("https://api.hedra.com/v1/characters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": hedraKey,
        },
        body: JSON.stringify({
          avatarImage: request.imageUrl || persona.imageUrl,
          textPrompt: request.scriptText,
          voiceId: request.voiceId || persona.voiceId,
          aspectRatio: "9:16",
        }),
      });

      if (hedraRes.ok) {
        const data = await hedraRes.json();
        if (data.videoUrl) {
          return {
            videoUrl: data.videoUrl,
            provider: "hedra",
            isLipSynced: true,
            characterName: persona.name,
            durationSeconds: data.duration || 12.0,
          };
        }
      }
    } catch (err) {
      logger.warn("Hedra lip-sync request failed, falling back:", { error: String(err) });
    }
  }

  // 2. SyncLabs Lip-Sync Engine
  if (syncLabsKey && (request.videoUrl || persona.videoUrl) && request.audioUrl) {
    try {
      logger.info(`Initiating SyncLabs lip-sync for character: ${persona.name}`);
      const syncRes = await fetch("https://api.synclabs.so/v2/lipsync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": syncLabsKey,
        },
        body: JSON.stringify({
          videoUrl: request.videoUrl || persona.videoUrl,
          audioUrl: request.audioUrl,
          model: "lipsync-1.7.1",
          synergize: true,
        }),
      });

      if (syncRes.ok) {
        const data = await syncRes.json();
        if (data.url) {
          return {
            videoUrl: data.url,
            provider: "synclabs",
            isLipSynced: true,
            characterName: persona.name,
            durationSeconds: data.duration || 12.0,
          };
        }
      }
    } catch (err) {
      logger.warn("SyncLabs lip-sync request failed, falling back:", { error: String(err) });
    }
  }

  // 3. Replicate Wav2Lip / SadTalker
  if (replicateToken && request.audioUrl) {
    try {
      logger.info(`Initiating Replicate Wav2Lip for character: ${persona.name}`);
      const repRes = await fetch("https://api.replicate.com/v1/predictions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${replicateToken}`,
        },
        body: JSON.stringify({
          version: "8d65e3f4f4298520e079198b493c25adfc43c058ffec924f204c0497b3282c26",
          input: {
            face: request.imageUrl || persona.imageUrl,
            audio: request.audioUrl,
            pads: [0, 10, 0, 0],
            smooth: true,
          },
        }),
      });

      if (repRes.ok) {
        const repData = await repRes.json();
        if (repData?.output) {
          return {
            videoUrl: repData.output,
            provider: "replicate",
            isLipSynced: true,
            characterName: persona.name,
            durationSeconds: 12.0,
          };
        }
      }
    } catch (err) {
      logger.warn("Replicate lip-sync request failed, falling back:", { error: String(err) });
    }
  }

  // 4. Curated 9:16 Creator Video Library Fallback
  // Returns our clean 9:16 vertical video assets (Sarah gimbal vlog or Alex podcast studio)
  const defaultVideoUrl = persona.videoUrl || "/videos/creator-sarah.mp4";

  return {
    videoUrl: defaultVideoUrl,
    provider: "curated_creator",
    isLipSynced: false,
    characterName: persona.name,
    durationSeconds: 11.2,
  };
}
