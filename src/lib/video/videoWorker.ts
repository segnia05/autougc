import { jobQueue, Job } from "@/lib/queue/jobQueue";
import { renderUgcVideo } from "@/lib/video/renderEngine";
import { synthesizeVoiceover } from "@/lib/audio/ttsProvider";
import { generateTalkingAvatar } from "@/lib/video/talkingAvatarService";
import { prisma } from "@/db/client";
import { logger } from "@/lib/observability/logger";
import { UgcAdCompositionProps } from "@/remotion/types";

export interface VideoRenderJobData {
  videoId: string;
  orgId: string;
  userId: string;
  planTier: string;
  brandName: string;
  hookText: string;
  bodyText: string;
  ctaText: string;
  voiceId: string;
  aspectRatio: string;
  productImageUrl?: string;
  videoUrl?: string;
  characterId?: string;
  hookStickerType?: "tiktok_question" | "tweet_card" | "pov_badge" | "bold_warning";
  showHookSticker?: boolean;
  showCtaSticker?: boolean;
}

export interface VideoRenderJobResult {
  videoId: string;
  videoUrl: string;
  durationSeconds: number;
}

// Flag to ensure worker is registered once
let isWorkerRegistered = false;

export function registerVideoRenderWorker(): void {
  if (isWorkerRegistered) return;
  isWorkerRegistered = true;

  jobQueue.registerWorker<VideoRenderJobData, VideoRenderJobResult>(
    "video_render",
    async (job: Job<VideoRenderJobData, VideoRenderJobResult>, updateProgress) => {
      const {
        videoId,
        orgId,
        userId,
        planTier,
        brandName,
        hookText,
        bodyText,
        ctaText,
        voiceId,
        aspectRatio,
        productImageUrl,
        videoUrl: initialVideoUrl,
        characterId,
        hookStickerType,
        showHookSticker,
        showCtaSticker,
      } = job.data;

      logger.info(`Starting async render job ${job.id} for video: ${videoId}`);
      updateProgress(10); // Initialized

      // 1. Voiceover Synthesis & Word Timestamps
      updateProgress(25);
      const fullScript = `${hookText} ${bodyText} ${ctaText}`;
      const synth = await synthesizeVoiceover(fullScript, voiceId);

      // 2. Character / Lip-Sync Resolution
      updateProgress(40);
      let activeVideoUrl = initialVideoUrl || "/videos/creator-sarah.mp4";
      if (characterId) {
        try {
          const avatarRes = await generateTalkingAvatar({
            characterId,
            scriptText: fullScript,
            voiceId,
            videoUrl: activeVideoUrl,
            imageUrl: productImageUrl,
          });
          if (avatarRes && avatarRes.videoUrl) {
            activeVideoUrl = avatarRes.videoUrl;
          }
        } catch (avatarErr) {
          logger.warn("Avatar lip-sync fallback triggered:", { error: String(avatarErr) });
        }
      }

      // 3. Remotion Composition Render
      updateProgress(60);
      const compositionProps: UgcAdCompositionProps = {
        brandName,
        hookText,
        bodyText,
        ctaText,
        brandColor: "#1F3824",
        productImageUrl: productImageUrl || "/images/creator-sarah.jpg",
        videoUrl: activeVideoUrl,
        hookStickerType: hookStickerType || "tiktok_question",
        showHookSticker: showHookSticker ?? true,
        showCtaSticker: showCtaSticker ?? true,
        words: synth.words,
      };

      const renderRes = await renderUgcVideo(videoId, compositionProps);
      updateProgress(85);

      // 4. Persist to PostgreSQL (if DB available)
      try {
        let project = await prisma.project.findFirst({
          where: { organizationId: orgId },
        });

        if (!project) {
          project = await prisma.project.create({
            data: {
              organizationId: orgId,
              createdByUserId: userId,
              name: `${brandName} Video Campaign`,
              targetUrl: "https://autougc.com",
              brandName,
            },
          });
        }

        const script = await prisma.script.create({
          data: {
            projectId: project.id,
            angleType: "problem_agitation",
            hookText,
            bodyText,
            ctaText,
            fullScriptText: fullScript,
            captionCopy: `${hookText} ${bodyText} #ugc #ad`,
            hashtags: ["ugc", "viral", brandName.toLowerCase().replace(/[^a-z0-9]/g, "")],
          },
        });

        await prisma.video.create({
          data: {
            id: videoId,
            projectId: project.id,
            organizationId: orgId,
            scriptId: script.id,
            voiceId,
            aspectRatio,
            durationSeconds: renderRes.durationSeconds,
            hasWatermark: planTier === "free",
            videoUrl: renderRes.publicUrl,
            thumbnailUrl: productImageUrl || "/images/creator-sarah.jpg",
            renderStatus: "completed",
          },
        });
      } catch (dbErr) {
        logger.warn("Database record persistence notice:", { error: String(dbErr) });
      }

      updateProgress(100);
      logger.info(`Completed async render job ${job.id} for video: ${videoId}`);

      return {
        videoId,
        videoUrl: renderRes.publicUrl,
        durationSeconds: renderRes.durationSeconds,
      };
    },
    { concurrency: 3, maxRetries: 2 }
  );
}
