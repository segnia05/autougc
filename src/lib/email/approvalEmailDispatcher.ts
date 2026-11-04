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

  const formattedTime = new Date(post.scheduledFor).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });

  const emailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF8F5; margin: 0; padding: 32px 16px; color: #18181B; }
          .container { max-width: 560px; margin: 0 auto; background: #FFFFFF; border-radius: 16px; border: 1px solid #E5E0D8; padding: 32px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); }
          .badge { display: inline-block; background: #FFF9F6; color: #D95D39; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; padding: 4px 10px; border-radius: 999px; margin-bottom: 16px; border: 1px solid #F5E2DA; }
          h1 { font-size: 24px; font-weight: 800; color: #D95D39; margin: 0 0 12px 0; letter-spacing: -0.02em; }
          p { font-size: 15px; line-height: 1.6; color: #4A5568; margin: 0 0 20px 0; }
          .video-card { background: #FAF8F5; border-radius: 12px; border: 1px solid #E5E0D8; padding: 18px; margin-bottom: 24px; }
          .caption-text { font-size: 14px; font-style: italic; color: #2D3748; line-height: 1.5; margin-bottom: 8px; }
          .meta-row { font-size: 12px; color: #718096; }
          .btn-primary { display: block; text-align: center; background: #D95D39; color: #FFFFFF !important; font-weight: 700; font-size: 16px; text-decoration: none; padding: 14px 24px; border-radius: 10px; margin-bottom: 12px; }
          .btn-secondary { display: block; text-align: center; background: #FAF8F5; color: #D95D39 !important; font-weight: 600; font-size: 14px; text-decoration: none; padding: 12px 24px; border-radius: 10px; border: 1px solid #E5E0D8; }
          .footer { font-size: 12px; color: #A0AEC0; text-align: center; margin-top: 24px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="badge">1-Hour Pre-Publish Notice</div>
          <h1>Approve Today's AutoUGC Video</h1>
          <p>Your high-converting marketing video is rendered and scheduled to publish to <strong>${post.socialAccount?.accountHandle || "@yourbrand"}</strong> at <strong>${formattedTime}</strong>.</p>
          
          <div class="video-card">
            <div class="caption-text">"${post.caption}"</div>
            <div class="meta-row">Target Platform: <strong>${(post.socialAccount?.platform || "tiktok").toUpperCase()}</strong></div>
          </div>

          <a href="${tokenUrl}" class="btn-primary">✓ 1-Click Approve & Publish</a>
          <a href="${studioEditUrl}" class="btn-secondary">✎ Open in Studio to Edit Hooks & Creative</a>

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

  return { success: true, tokenUrl, recipientEmail };
}
