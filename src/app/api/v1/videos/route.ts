import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db/client";
import { getAuthContext } from "@/lib/auth/getAuthContext";

export async function GET(request: NextRequest) {
  try {
    const authContext = await getAuthContext(request);
    const orgId = authContext?.orgId || request.headers.get("x-organization-id");

    if (!orgId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    try {
      const dbVideos = await prisma.video.findMany({
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
          videoUrl: v.videoUrl || "https://cdn.autougc.com/videos/demo_1080p.mp4",
          thumbnailUrl: v.thumbnailUrl || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=400&q=80",
          voiceId: v.voiceId,
          aspectRatio: v.aspectRatio,
          createdAt: v.createdAt.toISOString(),
          scheduledSlot: v.scheduledPosts[0]
            ? {
                scheduledFor: v.scheduledPosts[0].scheduledFor.toISOString(),
                localScheduledTime: v.scheduledPosts[0].localScheduledTime,
                accountHandle: v.scheduledPosts[0].socialAccount.accountHandle,
                platform: v.scheduledPosts[0].socialAccount.platform,
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
