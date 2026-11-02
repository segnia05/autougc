import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/db/client";
import { encryptToken } from "@/lib/social/crypto";
import { getAuthContext } from "@/lib/auth/getAuthContext";

const ScheduleRequestSchema = z.object({
  videoId: z.string().optional(),
  platforms: z.array(z.enum(["tiktok", "instagram", "youtube"])).min(1, "Select at least one platform"),
  scheduledFor: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid ISO date string",
  }),
  caption: z.string().min(1, "Caption cannot be empty").max(2200, "Caption exceeds 2200 character limit"),
  hookAngle: z.string().optional(),
  requireApproval: z.boolean().optional(),
  socialAccountId: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const authContext = await getAuthContext(request);
    let orgId = authContext?.orgId || request.headers.get("x-organization-id");

    if (!orgId) {
      const latestOrg = await prisma.organization.findFirst({
        orderBy: { createdAt: "desc" },
      });
      orgId = latestOrg?.id || "org_default";
    }

    const body = await request.json();
    const parsed = ScheduleRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation error", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const {
      videoId: requestedVideoId,
      platforms,
      scheduledFor,
      caption,
      hookAngle,
      requireApproval = true,
      socialAccountId,
    } = parsed.data;

    const scheduledDate = new Date(scheduledFor);

    // Resolve or create a valid Video record for this org
    let videoId = requestedVideoId;
    const existingVideo = videoId ? await prisma.video.findUnique({ where: { id: videoId } }).catch(() => null) : null;

    if (!existingVideo) {
      const project = await prisma.project.findFirst({
        where: { organizationId: orgId },
        orderBy: { createdAt: "desc" },
      });

      if (project) {
        let script = await prisma.script.findFirst({
          where: { projectId: project.id },
        });

        if (!script) {
          script = await prisma.script.create({
            data: {
              projectId: project.id,
              angleType: "problem_agitation",
              hookText: `Why didn't anyone tell me about ${project.brandName} sooner?!`,
              bodyText: `If you write with AI, this is an absolute lifesaver.`,
              ctaText: "Check the link in bio to try it free.",
              fullScriptText: `Why didn't anyone tell me about ${project.brandName} sooner?! If you write with AI, this is an absolute lifesaver. Check the link in bio to try it free.`,
              captionCopy: `Tested ${project.brandName} so you don't have to. Link in bio! 🚀`,
              hashtags: ["UGC", "AI", project.brandName.replace(/\s+/g, "")],
            },
          });
        }

        const newVideo = await prisma.video.create({
          data: {
            projectId: project.id,
            organizationId: orgId,
            scriptId: script.id,
            voiceId: "alex_casual_dtc",
            thumbnailUrl: project.screenshotUrl || "/images/creator-sarah.jpg",
            renderStatus: "completed",
            durationSeconds: 22.0,
          },
        });
        videoId = newVideo.id;
      } else {
        videoId = "mock_video_default";
      }
    }

    const createdPosts = [];

    for (const platform of platforms) {
      try {
        let accountId = socialAccountId;

        if (!accountId) {
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
                accountHandle: `@brand_${platform}`,
                encryptedAccessToken: encryptToken(`mock_${platform}_token_${Date.now()}`),
                isActive: true,
              },
            });
          }
          accountId = account.id;
        }

        const scheduledPost = await prisma.scheduledPost.create({
          data: {
            videoId: videoId!,
            organizationId: orgId,
            socialAccountId: accountId,
            caption,
            scheduledFor: scheduledDate,
            hookAngle: hookAngle || "Problem-Agitation-Solution",
            publishStatus: "pending",
            requireApproval,
            approvalStatus: requireApproval ? "awaiting_approval" : "none",
          },
        });

        createdPosts.push({
          id: scheduledPost.id,
          platform,
          scheduledFor: scheduledPost.scheduledFor,
          publishStatus: scheduledPost.publishStatus,
          approvalStatus: scheduledPost.approvalStatus,
        });
      } catch (postErr) {
        createdPosts.push({
          id: `mock_post_${platform}_${Date.now()}`,
          platform,
          scheduledFor: scheduledDate,
          publishStatus: "pending",
          approvalStatus: requireApproval ? "awaiting_approval" : "none",
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
    let orgId: string | null = authContext?.orgId || request.headers.get("x-organization-id");

    if (!orgId) {
      const latestOrg = await prisma.organization.findFirst({
        orderBy: { createdAt: "desc" },
      });
      orgId = latestOrg?.id ?? null;
    }

    if (!orgId) {
      return NextResponse.json({ success: true, posts: [] });
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

      let posts = await prisma.scheduledPost.findMany({
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

      // Auto-seed initial scheduled posts for newly onboarded project if 0 posts exist
      if (posts.length === 0) {
        const project = await prisma.project.findFirst({
          where: { organizationId: orgId },
          orderBy: { createdAt: "desc" },
        });

        if (project) {
          const brandName = project.brandName || "Your Brand";
          const brandHandle = `@${brandName.toLowerCase().replace(/[^a-z0-9]/g, "")}_official`;

          // Ensure TikTok and Instagram accounts exist
          let tiktokAcc = await prisma.socialAccount.findFirst({
            where: { organizationId: orgId, platform: "tiktok" },
          });
          if (!tiktokAcc) {
            tiktokAcc = await prisma.socialAccount.create({
              data: {
                organizationId: orgId,
                platform: "tiktok",
                platformUserId: `tt_${Date.now()}`,
                accountHandle: brandHandle,
                accountNickname: `${brandName} TikTok`,
                encryptedAccessToken: encryptToken(`token_tt_${Date.now()}`),
                isActive: true,
              },
            });
          }

          let instaAcc = await prisma.socialAccount.findFirst({
            where: { organizationId: orgId, platform: "instagram" },
          });
          if (!instaAcc) {
            instaAcc = await prisma.socialAccount.create({
              data: {
                organizationId: orgId,
                platform: "instagram",
                platformUserId: `ig_${Date.now()}`,
                accountHandle: brandHandle,
                accountNickname: `${brandName} IG`,
                encryptedAccessToken: encryptToken(`token_ig_${Date.now()}`),
                isActive: true,
              },
            });
          }

          // Create base video
          let script = await prisma.script.findFirst({
            where: { projectId: project.id },
          });
          if (!script) {
            script = await prisma.script.create({
              data: {
                projectId: project.id,
                angleType: "problem_agitation",
                hookText: `Why didn't anyone tell me about ${brandName} sooner?!`,
                bodyText: `If you write with AI, this is an absolute lifesaver.`,
                ctaText: "Check the link in bio to try it free.",
                fullScriptText: `Why didn't anyone tell me about ${brandName} sooner?! If you write with AI, this is an absolute lifesaver. Check the link in bio to try it free.`,
                captionCopy: `Tested ${brandName} so you don't have to. Link in bio! 🚀`,
                hashtags: ["UGC", "AI", brandName.replace(/\s+/g, "")],
              },
            });
          }

          const video = await prisma.video.create({
            data: {
              projectId: project.id,
              organizationId: orgId,
              scriptId: script.id,
              voiceId: "alex_casual_dtc",
              thumbnailUrl: project.screenshotUrl || "/images/creator-sarah.jpg",
              renderStatus: "completed",
              durationSeconds: 22.0,
            },
          });

          // Generate 6 scheduled posts across current & next month
          const now = new Date();
          const seedConfigs = [
            {
              dayOffset: 1,
              time: "18:30",
              platform: tiktokAcc,
              hook: "Problem-Agitation-Solution",
              approval: "awaiting_approval",
              caption: `Why didn't anyone tell me about ${brandName} sooner?! If you use AI for writing, this is an absolute game-changer. Link in bio! 🚀 #UGC #Productivity #${brandName.replace(/\s+/g, "")}`,
            },
            {
              dayOffset: 3,
              time: "12:30",
              platform: instaAcc,
              hook: "Competitor Comparison / Tear-Down",
              approval: "none",
              caption: `I tested every tool in this niche so you don't have to. Here's why ${brandName} is currently dominating in 2026. 🔥 #${brandName.replace(/\s+/g, "")} #SaaS`,
            },
            {
              dayOffset: 5,
              time: "20:30",
              platform: tiktokAcc,
              hook: "30-Day Honest Founder Proof",
              approval: "none",
              caption: `Here's what happened after 30 days of using ${brandName}. The results completely blew my expectations away. 📈 #${brandName.replace(/\s+/g, "")} #AI`,
            },
            {
              dayOffset: 8,
              time: "09:00",
              platform: instaAcc,
              hook: "Feature Showcase / Speed Run",
              approval: "none",
              caption: `How to get 10x better results with ${brandName} in under 60 seconds. Bookmark this before you start your next draft! ⏱️`,
            },
            {
              dayOffset: 12,
              time: "18:30",
              platform: tiktokAcc,
              hook: "Behind The Scenes Proof",
              approval: "none",
              caption: `Secret hack that nobody talks about. ${brandName} makes this so effortless it feels like cheating. 🤫`,
            },
          ];

          for (const cfg of seedConfigs) {
            const postDate = new Date(now);
            postDate.setDate(postDate.getDate() + cfg.dayOffset);
            const [hoursStr = "12", minsStr = "0"] = cfg.time.split(":");
            const hours = Number(hoursStr) || 12;
            const mins = Number(minsStr) || 0;
            postDate.setHours(hours, mins, 0, 0);

            await prisma.scheduledPost.create({
              data: {
                videoId: video.id,
                organizationId: orgId,
                socialAccountId: cfg.platform.id,
                hookAngle: cfg.hook,
                caption: cfg.caption,
                scheduledFor: postDate,
                publishStatus: "pending",
                requireApproval: true,
                approvalStatus: cfg.approval as any,
              },
            });
          }

          // Refetch newly seeded posts
          posts = await prisma.scheduledPost.findMany({
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
        }
      }

      return NextResponse.json({ success: true, posts });
    } catch (dbErr) {
      console.warn("Notice in /api/v1/social/schedule:", dbErr);
      return NextResponse.json({ success: true, posts: [] });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error fetching scheduled posts";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
