import { prisma } from "@/db/client";
import { generateApprovalToken } from "@/lib/campaigns/approvalTokens";

export interface DispatchApprovalParams {
  postId: string;
}

/**
 * Dispatches 1-hour pre-publish email notification to customer.
 * Uses native Resend REST API if RESEND_API_KEY is present,
 * or mock dispatch logs in development/testing.
 */
export async function dispatchApprovalNotification({ postId }: DispatchApprovalParams) {
  let post = null;
  try {
    post = await prisma.scheduledPost.findUnique({
      where: { id: postId },
      include: {
        organization: true,
        video: {
          include: {
            script: true,
          },
        },
        socialAccount: true,
      },
    });
  } catch (err) {
    console.warn("DB lookup for scheduled post failed:", err);
  }

  if (!post) {
    throw new Error(`Scheduled post '${postId}' not found.`);
  }

  const recipientEmail =
    post.organization?.billingEmail || "customer@example.com";

  // Generate cryptographically signed single-use approval token
  const { tokenUrl } = await generateApprovalToken({
    postId: post.id,
    orgId: post.organizationId,
    expiresInMinutes: 75,
  });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://autougc.com";
  const studioEditUrl = `${baseUrl}/studio?scheduledPostId=${post.id}`;

  const formattedTime =
    post.localScheduledTime ||
    new Date(post.scheduledFor).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      timeZone: "America/New_York",
      timeZoneName: "short",
    });

  const thumbnailUrl =
    post.video?.thumbnailUrl || "/images/creator-sarah.jpg";
  const fullThumbnailUrl = thumbnailUrl.startsWith("http")
    ? thumbnailUrl
    : `${baseUrl}${thumbnailUrl}`;

  const emailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF8F5; margin: 0; padding: 32px 16px; color: #18181B; }
          .container { max-width: 560px; margin: 0 auto; background: #FFFFFF; border-radius: 16px; border: 1px solid #E5E0D8; padding: 32px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); }
          .badge { display: inline-block; background: #FFF9F6; color: #D95D39; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; padding: 4px 10px; border-radius: 999px; margin-bottom: 16px; border: 1px solid #F5E2DA; }
          h1 { font-size: 24px; font-weight: 800; color: #18181B; margin: 0 0 12px 0; letter-spacing: -0.02em; }
          p { font-size: 15px; line-height: 1.6; color: #52525B; margin: 0 0 20px 0; }
          .video-card { background: #FAF8F5; border-radius: 14px; border: 1px solid #E5E0D8; padding: 20px; margin-bottom: 24px; text-align: center; }
          .video-thumb { width: 100%; max-width: 220px; height: auto; border-radius: 12px; border: 2px solid #D95D39; margin: 0 auto 14px; display: block; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
          .caption-text { font-size: 14px; font-style: italic; color: #18181B; line-height: 1.5; margin-bottom: 12px; text-align: left; background: #FFFFFF; padding: 12px; border-radius: 10px; border: 1px solid #E5E0D8; }
          .meta-row { font-size: 13px; color: #52525B; text-align: left; }
          .meta-row strong { color: #18181B; }
          .btn-primary { display: block; text-align: center; background: #18181B; color: #FFFFFF !important; font-weight: 700; font-size: 15px; text-decoration: none; padding: 14px 24px; border-radius: 12px; margin-bottom: 12px; box-shadow: 0 4px 12px rgba(24,24,27,0.15); }
          .btn-secondary { display: block; text-align: center; background: #FAF8F5; color: #18181B !important; font-weight: 600; font-size: 14px; text-decoration: none; padding: 12px 24px; border-radius: 12px; border: 1px solid #E5E0D8; }
          .footer { font-size: 12px; color: #8E8B85; text-align: center; margin-top: 24px; line-height: 1.5; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="badge">1-Hour Pre-Publish Notice</div>
          <h1>Approve Today's AutoUGC Video</h1>
          <p>Your high-converting marketing video is rendered and scheduled to publish to <strong>${post.socialAccount?.accountHandle || "@brand_tiktok"}</strong> in 1 hour at <strong>${formattedTime}</strong>.</p>
          
          <div class="video-card">
            <img src="${fullThumbnailUrl}" alt="Video Preview Card" class="video-thumb" />
            <div class="caption-text">"${post.caption}"</div>
            <div class="meta-row">
              Target Account: <strong>${post.socialAccount?.accountHandle || "@brand_tiktok"}</strong> (${(post.socialAccount?.platform || "tiktok").toUpperCase()})
            </div>
          </div>

          <a href="${tokenUrl}" class="btn-primary">✓ 1-Click Approve & Publish</a>
          <a href="${studioEditUrl}" class="btn-secondary">✎ Open in Studio to Edit</a>

          <div class="footer">
            AutoUGC Autonomous SaaS Video Engine • If no action is taken, this post will publish automatically per your schedule preferences.
          </div>
        </div>
      </body>
    </html>
  `;

  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey && process.env.NODE_ENV === "production") {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "AutoUGC Growth <approvals@autougc.com>",
          to: [recipientEmail],
          subject: `[Action Required] Approve your video ad publishing in 1 hour (${formattedTime})`,
          html: emailHtml,
        }),
      });
    } catch (err) {
      console.error("Failed to send approval email via Resend REST API:", err);
    }
  } else {
    console.log(`[Approval Email Mock] Subject: [Action Required] Approve your video ad publishing in 1 hour (${formattedTime})`);
    console.log(`[Approval Email Mock] Dispatched to ${recipientEmail} with approve url: ${tokenUrl}`);
  }

  // Update post status to awaiting_approval
  try {
    await prisma.scheduledPost.update({
      where: { id: postId },
      data: {
        approvalStatus: "awaiting_approval",
      },
    });
  } catch {
    // In fallback/offline mode
  }

  return { success: true, tokenUrl, recipientEmail, subject: `[Action Required] Approve your video ad publishing in 1 hour (${formattedTime})` };
}

/**
 * Scans for posts scheduled within the upcoming 1-hour window (next 65 mins)
 * that require approval and have not yet been notified (approvalStatus === 'none').
 * Dispatches the 1-hour pre-publish email notification to the founder.
 */
export async function checkAndDispatchPrePublishApprovals(): Promise<{
  notifiedCount: number;
  postIds: string[];
}> {
  const now = new Date();
  const in65Minutes = new Date(Date.now() + 65 * 60 * 1000);

  try {
    const upcomingPosts = await prisma.scheduledPost.findMany({
      where: {
        requireApproval: true,
        approvalStatus: "none",
        publishStatus: "pending",
        scheduledFor: {
          gte: now,
          lte: in65Minutes,
        },
      },
      select: { id: true },
      take: 20,
    });

    const postIds: string[] = [];
    for (const post of upcomingPosts) {
      try {
        await dispatchApprovalNotification({ postId: post.id });
        postIds.push(post.id);
      } catch (err) {
        console.warn(`Failed dispatching approval email for post ${post.id}:`, err);
      }
    }

    return { notifiedCount: postIds.length, postIds };
  } catch (err) {
    console.warn("Error scanning upcoming posts for approval notifications:", err);
    return { notifiedCount: 0, postIds: [] };
  }
}
