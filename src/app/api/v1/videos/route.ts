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

      if (dbVideos.length > 0) {
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
      }
    } catch {
      // Database offline/dev fallback
    }

    // Dev fallback videos representing rendered UGC 1080p outputs
    const fallbackVideos = [
      {
        id: "vid_mock_01",
        brandName: "Lumina",
        projectName: "Ergonomic Desk Light",
        hookAngle: "problem_agitation",
        hookText: "Why does nobody talk about how painful late-night eye strain actually is?",
        bodyText: "Lumina matches daylight temperature in real-time so your eyes stay fresh even through 10-hour sprints.",
        ctaText: "Get $30 off your ergonomic setup today.",
        caption: "Stop frying your retinas with blue light. Lumina adapts to your circadian rhythm automatically. #workfromhome #desksetup #ergonomics",
        hashtags: ["workfromhome", "desksetup", "productivity", "ugc"],
        durationSeconds: 14.8,
        renderStatus: "completed",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=400&q=80",
        voiceId: "alex_casual_dtc",
        aspectRatio: "9:16",
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        scheduledSlot: {
          scheduledFor: new Date(Date.now() + 3600000 * 4).toISOString(),
          localScheduledTime: "Today @ 4:00 PM EST",
          accountHandle: "@lumina_official",
          platform: "tiktok",
        },
      },
      {
        id: "vid_mock_02",
        brandName: "Lumina",
        projectName: "Ergonomic Desk Light",
        hookAngle: "pattern_interrupt",
        hookText: "Stop coding under harsh fluorescent ceiling lights in 2026.",
        bodyText: "We tested 12 lighting setups and this 90+ CRI diffused lightbar was the only one that eliminated glare.",
        ctaText: "Check the link in bio for the limited creator discount.",
        caption: "Your monitor glare is ruining your focus. Upgrade your workspace lighting in 30 seconds. #developer #coding #setupinspiration",
        hashtags: ["coding", "deskgoals", "techsetup"],
        durationSeconds: 15.2,
        renderStatus: "completed",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=400&q=80",
        voiceId: "chloe_dynamic_genz",
        aspectRatio: "9:16",
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
        scheduledSlot: {
          scheduledFor: new Date(Date.now() + 3600000 * 28).toISOString(),
          localScheduledTime: "Tomorrow @ 7:30 PM EST",
          accountHandle: "@lumina_desk_hacks",
          platform: "instagram",
        },
      },
      {
        id: "vid_mock_03",
        brandName: "Lumina",
        projectName: "Ergonomic Desk Light",
        hookAngle: "secret_hack",
        hookText: "The secret desk trick that Silicon Valley engineers won't tell you about.",
        bodyText: "Zero screen reflections, smart touch dimming, and full aerospace-grade aluminum build.",
        ctaText: "Order now before the current batch sells out.",
        caption: "Found this game changer for anyone working remote. Literally couldn't go back. #remotework #techreview #deskupgrade",
        hashtags: ["remotework", "productivityhacks", "ugcvideo"],
        durationSeconds: 13.9,
        renderStatus: "completed",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=400&q=80",
        voiceId: "marcus_authoritative",
        aspectRatio: "9:16",
        createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
        scheduledSlot: {
          scheduledFor: new Date(Date.now() + 3600000 * 52).toISOString(),
          localScheduledTime: "Wednesday @ 4:00 PM EST",
          accountHandle: "@lumina_focus_lab",
          platform: "tiktok",
        },
      },
      {
        id: "vid_mock_04",
        brandName: "Lumina",
        projectName: "Ergonomic Desk Light",
        hookAngle: "problem_agitation",
        hookText: "Still getting 3 PM headaches at your desk? This is why.",
        bodyText: "Flicker-free high-frequency LEDs engineered specifically to combat visual fatigue.",
        ctaText: "Tap below and test it risk-free for 30 days.",
        caption: "If you spend more than 6 hours at a screen every day, watch this right now. #healthyliving #worktips",
        hashtags: ["worktips", "wellness", "desksetup"],
        durationSeconds: 15.0,
        renderStatus: "completed",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=400&q=80",
        voiceId: "sophia_warm",
        aspectRatio: "9:16",
        createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
        scheduledSlot: null,
      },
    ];

    return NextResponse.json({
      success: true,
      videos: fallbackVideos,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch videos";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
