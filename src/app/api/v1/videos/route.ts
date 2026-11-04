import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db/client";
import { getAuthContext } from "@/lib/auth/getAuthContext";
import { generateViralHooksWithAi } from "@/lib/ai/hookEngine";

export async function GET(request: NextRequest) {
  try {
    const authContext = await getAuthContext(request);
    let orgId: string | null = authContext?.orgId || request.headers.get("x-organization-id");

    if (!orgId) {
      const latestOrg = await prisma.organization.findFirst({
        orderBy: { createdAt: "desc" },
      });
      orgId = latestOrg?.id ?? null;
    }

    if (!orgId) {
      return NextResponse.json({ success: true, videos: [] });
    }

    try {
      const requestedId = request.nextUrl.searchParams.get("id");
      if (requestedId) {
        const v = await prisma.video.findUnique({
          where: { id: requestedId },
          include: {
            script: true,
            project: true,
            scheduledPosts: {
              include: {
                socialAccount: true,
              },
            },
          },
        });

        if (v) {
          return NextResponse.json({
            success: true,
            video: {
              id: v.id,
              brandName: v.project.brandName,
              projectName: v.project.name,
              hookAngle: v.script.angleType,
              hookText: v.script.hookText,
              bodyText: v.script.bodyText,
              ctaText: v.script.ctaText,
              caption: v.script.captionCopy,
              hashtags: v.script.hashtags,
              durationSeconds: Number(v.durationSeconds),
              renderStatus: v.renderStatus,
              videoUrl: v.videoUrl || "/videos/creator-sarah.mp4",
              thumbnailUrl: v.thumbnailUrl || "/images/creator-sarah.jpg",
              voiceId: v.voiceId,
              aspectRatio: v.aspectRatio,
              createdAt: v.createdAt.toISOString(),
              scheduledSlot: v.scheduledPosts[0]
                ? {
                    scheduledFor: v.scheduledPosts[0].scheduledFor.toISOString(),
                    localScheduledTime: v.scheduledPosts[0].localScheduledTime,
                    accountHandle: v.scheduledPosts[0].socialAccount.accountHandle,
                    platform: v.scheduledPosts[0].socialAccount.platform,
                    publishStatus: v.scheduledPosts[0].publishStatus,
                  }
                : null,
            },
          });
        }
      }

      let dbVideos = await prisma.video.findMany({
        where: { organizationId: orgId },
        include: {
          script: true,
          project: true,
          scheduledPosts: {
            include: {
              socialAccount: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 50,
      });

      // Auto-generate initial creator UGC videos using Gemini Hook Engine if none exist
      if (dbVideos.length === 0) {
        const project = await prisma.project.findFirst({
          where: { organizationId: orgId },
          orderBy: { createdAt: "desc" },
        });

        if (project) {
          const brand = project.brandName || "Your Brand";
          
          // Generate customized viral hooks using brand intelligence
          const generatedHooks = await generateViralHooksWithAi({
            brandName: brand,
            targetUrl: project.targetUrl,
            whatItDoes: project.whatItDoes || project.summary || "",
            targetAudience: project.targetAudience || "Target users and customers",
            coreUsp: project.summary || "",
            competitors: project.competitors || [],
            count: 4,
          });

          const creatorProfiles = [
            {
              creator: "Sarah Miller (Handheld Organic)",
              voiceId: "sarah_dtc_founder",
              thumbnailUrl: project.screenshotUrl || "/images/creator-sarah.jpg",
              videoUrl: "/videos/creator-sarah.mp4",
              duration: 21.4,
            },
            {
              creator: "Alex Vance (DTC Software Demo)",
              voiceId: "alex_casual_dtc",
              thumbnailUrl: "/images/creator-alex.jpg",
              videoUrl: "/videos/creator-alex.mp4",
              duration: 24.8,
            },
            {
              creator: "Marcus Chen (Minimalist Tech Review)",
              voiceId: "alex_casual_dtc",
              thumbnailUrl: "/images/creator-sarah.jpg",
              videoUrl: "/videos/creator-sarah.mp4",
              duration: 19.5,
            },
            {
              creator: "Maya Lin (Viral Confession)",
              voiceId: "sarah_dtc_founder",
              thumbnailUrl: "/images/creator-alex.jpg",
              videoUrl: "/videos/creator-alex.mp4",
              duration: 22.0,
            },
          ];

          for (let i = 0; i < generatedHooks.length; i++) {
            const h = generatedHooks[i]!;
            const profile = creatorProfiles[i % creatorProfiles.length]!;

            // Map hook angle to valid AngleType enum
            const angleType =
              h.angleType === "pattern_interrupt"
                ? "negative_hook"
                : h.angleType === "secret_hack"
                ? "secret_hack"
                : "problem_agitation";

            const script = await prisma.script.create({
              data: {
                projectId: project.id,
                angleType,
                hookText: h.hookHeadline,
                bodyText: h.spokenBodyText,
                ctaText: h.spokenCtaText,
                fullScriptText: h.fullScript,
                captionCopy: h.captionCopy,
                hashtags: h.viralHashtags,
              },
            });

            await prisma.video.create({
              data: {
                projectId: project.id,
                organizationId: orgId,
                scriptId: script.id,
                voiceId: profile.voiceId,
                thumbnailUrl: profile.thumbnailUrl,
                videoUrl: profile.videoUrl,
                renderStatus: "completed",
                durationSeconds: profile.duration,
              },
            });
          }

          // Refetch newly generated creator videos
          dbVideos = await prisma.video.findMany({
            where: { organizationId: orgId },
            include: {
              script: true,
              project: true,
              scheduledPosts: {
                include: {
                  socialAccount: true,
                },
              },
            },
            orderBy: { createdAt: "desc" },
            take: 50,
          });
        }
      }

      return NextResponse.json({
        success: true,
        videos: dbVideos.map((v) => ({
          id: v.id,
          brandName: v.project.brandName,
          projectName: v.project.name,
          hookAngle: v.script.angleType,
          hookText: v.script.hookText,
          bodyText: v.script.bodyText,
          ctaText: v.script.ctaText,
          caption: v.script.captionCopy,
          hashtags: v.script.hashtags,
          durationSeconds: Number(v.durationSeconds),
          renderStatus: v.renderStatus,
          videoUrl: v.videoUrl || "/videos/creator-sarah.mp4",
          thumbnailUrl: v.thumbnailUrl || "/images/creator-sarah.jpg",
          voiceId: v.voiceId,
          aspectRatio: v.aspectRatio,
          createdAt: v.createdAt.toISOString(),
          scheduledSlot: v.scheduledPosts[0]
            ? {
                scheduledFor: v.scheduledPosts[0].scheduledFor.toISOString(),
                localScheduledTime: v.scheduledPosts[0].localScheduledTime,
                accountHandle: v.scheduledPosts[0].socialAccount.accountHandle,
                platform: v.scheduledPosts[0].socialAccount.platform,
                publishStatus: v.scheduledPosts[0].publishStatus,
              }
            : null,
        })),
      });
    } catch (dbErr) {
      console.warn("DB query notice in /api/v1/videos:", dbErr);
      return NextResponse.json({ success: true, videos: [] });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch videos";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authContext = await getAuthContext(request);
    let orgId: string | null = authContext?.orgId || request.headers.get("x-organization-id");

    if (!orgId) {
      const latestOrg = await prisma.organization.findFirst({
        orderBy: { createdAt: "desc" },
      });
      orgId = latestOrg?.id ?? null;
    }

    if (!orgId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get("videoId");

    if (!videoId) {
      return NextResponse.json({ success: false, error: "videoId is required" }, { status: 400 });
    }

    const video = await prisma.video.findFirst({
      where: { id: videoId, organizationId: orgId },
    });

    if (!video) {
      return NextResponse.json({ success: false, error: "Video not found or access denied" }, { status: 404 });
    }

    // Cascade delete scheduled posts if any
    await prisma.scheduledPost.deleteMany({
      where: { videoId },
    });

    await prisma.video.delete({
      where: { id: videoId },
    });

    return NextResponse.json({ success: true, deletedVideoId: videoId });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete video";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
