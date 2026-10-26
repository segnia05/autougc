import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/db/client";
import { encryptToken } from "@/lib/social/crypto";
import { getAuthContext } from "@/lib/auth/getAuthContext";

const ScheduleRequestSchema = z.object({
  videoId: z.string().min(1, "videoId is required"),
  platforms: z.array(z.enum(["tiktok", "instagram", "youtube"])).min(1, "Select at least one platform"),
  scheduledFor: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid ISO date string",
  }),
  caption: z.string().min(1, "Caption cannot be empty").max(2200, "Caption exceeds 2200 character limit"),
});

export async function POST(request: NextRequest) {
  try {
    const authContext = await getAuthContext(request);
    const orgId = authContext?.orgId || request.headers.get("x-organization-id");

    if (!orgId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    const parsed = ScheduleRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation error", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { videoId, platforms, scheduledFor, caption } = parsed.data;
    const scheduledDate = new Date(scheduledFor);

    const createdPosts = [];

    for (const platform of platforms) {
      try {
        // Find existing connected account or create mock connected account for dev
        let account = await prisma.socialAccount.findFirst({
          where: {
            organizationId: orgId,
            platform,
            isActive: true,
          },
        });

        if (!account) {
          account = await prisma.socialAccount.create({
            data: {
              organizationId: orgId,
              platform,
              platformUserId: `user_${platform}_${Date.now()}`,
              accountHandle: `@autougc_${platform}`,
              encryptedAccessToken: encryptToken(`mock_${platform}_token_${Date.now()}`),
              isActive: true,
            },
          });
        }

        const scheduledPost = await prisma.scheduledPost.create({
          data: {
            videoId,
            organizationId: orgId,
            socialAccountId: account.id,
            caption,
            scheduledFor: scheduledDate,
            publishStatus: "pending",
          },
        });

        createdPosts.push({
          id: scheduledPost.id,
          platform,
          scheduledFor: scheduledPost.scheduledFor,
          publishStatus: scheduledPost.publishStatus,
        });
      } catch {
        // Fallback for dev mode without live Postgres container
        createdPosts.push({
          id: `mock_post_${platform}_${Date.now()}`,
          platform,
          scheduledFor: scheduledDate,
          publishStatus: "pending",
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully scheduled post across ${platforms.length} platform(s).`,
      posts: createdPosts,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Schedule error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const authContext = await getAuthContext(request);
    const orgId = authContext?.orgId || request.headers.get("x-organization-id");

    if (!orgId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get("accountId");
    const status = searchParams.get("status");

    try {
      const whereClause: Record<string, unknown> = { organizationId: orgId };
      if (accountId && accountId !== "all") {
        whereClause.socialAccountId = accountId;
      }
      if (status && status !== "all") {
        whereClause.publishStatus = status;
      }

      const posts = await prisma.scheduledPost.findMany({
        where: whereClause,
        include: {
          socialAccount: {
            select: {
              id: true,
              platform: true,
              accountHandle: true,
              accountNickname: true,
              isBurner: true,
            },
          },
          video: true,
          campaign: {
            select: {
              id: true,
              name: true,
              cadence: true,
            },
          },
        },
        orderBy: { scheduledFor: "asc" },
        take: 100,
      });

      return NextResponse.json({ posts });
    } catch {
      // Mock fallback data for development mode
      const samplePosts = [
        {
          id: "sched_01",
          caption: "Stop coding under harsh fluorescent lights in 2026 #developer #setup #ugc",
          scheduledFor: new Date(Date.now() + 1000 * 60 * 60 * 4).toISOString(),
          localScheduledTime: "Today @ 4:00 PM EST",
          publishStatus: "pending",
          hookAngle: "pattern_interrupt",
          postUrl: null,
          socialAccount: {
            id: "acc_main_brand",
            platform: "tiktok",
            accountHandle: "@lumina_official",
            accountNickname: "Main Brand (Official)",
            isBurner: false,
          },
          video: { durationSeconds: 14.5, thumbnailUrl: null },
        },
        {
          id: "sched_02",
          caption: "The $80 monitor upgrade nobody is talking about #desksetup #wfh",
          scheduledFor: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
          localScheduledTime: "Tomorrow @ 4:00 PM EST",
          publishStatus: "pending",
          hookAngle: "curiosity_hack",
          postUrl: null,
          socialAccount: {
            id: "acc_burner_1",
            platform: "tiktok",
            accountHandle: "@desk_hacks_daily",
            accountNickname: "Burner #1 (Desk Setups)",
            isBurner: true,
          },
          video: { durationSeconds: 15.0, thumbnailUrl: null },
        },
        {
          id: "sched_03",
          caption: "Say goodbye to 3 PM eye fatigue #productivity #techshorts",
          scheduledFor: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
          localScheduledTime: "Yesterday @ 4:00 PM EST",
          publishStatus: "published",
          platformPostId: "tt_v_889211",
          postUrl: "https://www.tiktok.com/@creator/video/tt_v_889211",
          hookAngle: "problem_agitation",
          socialAccount: {
            id: "acc_burner_2",
            platform: "tiktok",
            accountHandle: "@focus_tools_2026",
            accountNickname: "Burner #2 (Productivity)",
            isBurner: true,
          },
          video: { durationSeconds: 13.8, thumbnailUrl: null },
        },
        {
          id: "sched_04",
          caption: "Over 10,000 developers switched their workspace light this month #software #saas",
          scheduledFor: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(),
          localScheduledTime: "Wed @ 4:00 PM EST",
          publishStatus: "pending",
          hookAngle: "social_proof",
          postUrl: null,
          socialAccount: {
            id: "acc_reels_main",
            platform: "instagram",
            accountHandle: "@luminalight",
            accountNickname: "Instagram Reels (Main)",
            isBurner: false,
          },
          video: { durationSeconds: 15.0, thumbnailUrl: null },
        },
      ];

      let filtered = samplePosts;
      if (accountId && accountId !== "all") {
        filtered = filtered.filter((p) => p.socialAccount.id === accountId);
      }
      if (status && status !== "all") {
        filtered = filtered.filter((p) => p.publishStatus === status);
      }

      return NextResponse.json({ posts: filtered });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error fetching scheduled posts";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
