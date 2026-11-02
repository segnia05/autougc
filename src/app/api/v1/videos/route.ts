import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db/client";
import { getAuthContext } from "@/lib/auth/getAuthContext";

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

      // Auto-seed initial creator UGC videos if none exist
      if (dbVideos.length === 0) {
        const project = await prisma.project.findFirst({
          where: { organizationId: orgId },
          orderBy: { createdAt: "desc" },
        });

        if (project) {
          const brand = project.brandName || "Your Brand";
          const seeds = [
            {
              angle: "problem_agitation" as const,
              hook: `Why is nobody talking about this insane hack for ${brand}?!`,
              body: `If you use AI for writing or content creation, this saves hours every single day.`,
              cta: `Tap the link in bio to test ${brand} free!`,
              creator: "Sarah Miller (Handheld Organic)",
              voiceId: "sarah_dtc_founder",
              thumbnailUrl: project.screenshotUrl || "/images/creator-sarah.jpg",
              videoUrl: "/videos/creator-sarah.mp4",
              duration: 21.4,
            },
            {
              angle: "secret_hack" as const,
              hook: `Watch how ${brand} rewrites and humanizes 1,000 words in 3 seconds flat.`,
              body: `It bypasses every major detector with 0% AI detection score, no prompt engineering needed.`,
              cta: `Try it free with the link in bio!`,
              creator: "Alex Vance (DTC Software Demo)",
              voiceId: "alex_casual_dtc",
              thumbnailUrl: "/images/creator-alex.jpg",
              videoUrl: "/videos/creator-alex.mp4",
              duration: 24.8,
            },
            {
              angle: "negative_hook" as const,
              hook: `Stop paying for 5 different clunky rewrite tools in 2026.`,
              body: `I tested every competitor so you don't have to. Here's why ${brand} is dominating right now.`,
              cta: `Bookmark this and check ${brand} out!`,
              creator: "Marcus Chen (Minimalist Tech Review)",
              voiceId: "alex_casual_dtc",
              thumbnailUrl: "/images/creator-sarah.jpg",
              videoUrl: "/videos/creator-sarah.mp4",
              duration: 19.5,
            },
            {
              angle: "problem_agitation" as const,
              hook: `The reason professors and editors flag your text even when you didn't use AI...`,
              body: `Standard AI patterns trigger false positives. ${brand} creates authentic human tone and rhythm.`,
              cta: `Get started with ${brand} today!`,
              creator: "Maya Lin (Viral Confession)",
              voiceId: "sarah_dtc_founder",
              thumbnailUrl: "/images/creator-alex.jpg",
              videoUrl: "/videos/creator-alex.mp4",
              duration: 22.0,
            },
          ];

          for (const s of seeds) {
            const script = await prisma.script.create({
              data: {
                projectId: project.id,
                angleType: s.angle,
                hookText: s.hook,
                bodyText: s.body,
                ctaText: s.cta,
                fullScriptText: `${s.hook} ${s.body} ${s.cta}`,
                captionCopy: `${s.hook} Link in bio to try ${brand}! 🚀 #${brand.replace(/\s+/g, "")} #UGC #AI`,
                hashtags: ["UGC", "AI", brand.replace(/\s+/g, "")],
              },
            });

            await prisma.video.create({
              data: {
                projectId: project.id,
                organizationId: orgId,
                scriptId: script.id,
                voiceId: s.voiceId,
                thumbnailUrl: s.thumbnailUrl,
                videoUrl: s.videoUrl,
                renderStatus: "completed",
                durationSeconds: s.duration,
              },
            });
          }

          // Refetch newly seeded creator videos
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
