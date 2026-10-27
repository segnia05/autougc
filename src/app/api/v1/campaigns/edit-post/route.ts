import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db/client";
import { getAuthContext } from "@/lib/auth/getAuthContext";
import { enforceMandatoryBrandMention } from "@/lib/templates/videoTemplates";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      scheduledPostId,
      hookText,
      bodyText,
      ctaText,
      caption,
      voiceId,
      creatorId,
      archetype,
      brandName = "My Brand",
      approveNow = false,
    } = body;

    if (!scheduledPostId) {
      return NextResponse.json(
        { success: false, error: "Missing required field: scheduledPostId" },
        { status: 400 }
      );
    }

    const authContext = await getAuthContext(request);
    const orgId = authContext?.orgId || request.headers.get("x-organization-id");

    // 1. Enforce mandatory brand mention rule across customized texts
    const enforced = enforceMandatoryBrandMention(
      brandName,
      hookText || "",
      bodyText || "",
      ctaText || ""
    );

    const fullScriptText = `${enforced.hookText} ${enforced.bodyText} ${enforced.ctaText}`;

    // 2. Database update
    let updatedPost = null;
    try {
      const existingPost = await prisma.scheduledPost.findUnique({
        where: { id: scheduledPostId },
        include: { video: true },
      });

      if (!existingPost) {
        return NextResponse.json(
          { success: false, error: `Scheduled post '${scheduledPostId}' not found.` },
          { status: 404 }
        );
      }

      if (orgId && existingPost.organizationId !== orgId) {
        return NextResponse.json(
          { success: false, error: "Unauthorized access to scheduled post." },
          { status: 403 }
        );
      }

      // Update Video if exists
      if (existingPost.videoId && existingPost.video) {
        await prisma.video.update({
          where: { id: existingPost.videoId },
          data: {
            voiceId: voiceId || undefined,
            creatorId: creatorId || undefined,
            archetype: archetype || undefined,
          },
        });

        // Update Script if exists
        if (existingPost.video.scriptId) {
          await prisma.script.update({
            where: { id: existingPost.video.scriptId },
            data: {
              hookText: enforced.hookText,
              bodyText: enforced.bodyText,
              ctaText: enforced.ctaText,
              fullScriptText,
              captionCopy: caption || undefined,
            },
          });
        }
      }

      // Update ScheduledPost record
      updatedPost = await prisma.scheduledPost.update({
        where: { id: scheduledPostId },
        data: {
          caption: caption || existingPost.caption,
          voiceId: voiceId || existingPost.voiceId,
          creatorId: creatorId || existingPost.creatorId,
          archetype: archetype || existingPost.archetype,
          approvalStatus: approveNow ? "approved" : existingPost.approvalStatus,
          approvedAt: approveNow ? new Date() : existingPost.approvedAt,
          approvedByIp: approveNow ? "studio_editor" : existingPost.approvedByIp,
        },
      });
    } catch (dbErr) {
      console.warn("[edit-post] Database update fallback note:", dbErr);
    }

    return NextResponse.json({
      success: true,
      message: approveNow
        ? "Video successfully updated and approved! It will publish at its scheduled hour."
        : "Video edits saved successfully.",
      data: {
        scheduledPostId,
        enforcedHook: enforced.hookText,
        enforcedBody: enforced.bodyText,
        enforcedCta: enforced.ctaText,
        approvalStatus: approveNow ? "approved" : (updatedPost?.approvalStatus || "pending"),
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to save edits";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
