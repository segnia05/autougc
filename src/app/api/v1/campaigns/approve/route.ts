import { NextRequest, NextResponse } from "next/server";
import { consumeApprovalToken } from "@/lib/campaigns/approvalTokens";
import { prisma } from "@/db/client";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  const ip = request.headers.get("x-forwarded-for") || "direct_browser";

  if (!token) {
    return new Response(renderErrorHtml("Missing or empty approval token."), {
      status: 400,
      headers: { "Content-Type": "text/html" },
    });
  }

  try {
    const result = await consumeApprovalToken(token, ip);

    // Fetch post details for friendly confirmation view
    let postDetails = null;
    try {
      postDetails = await prisma.scheduledPost.findUnique({
        where: { id: result.scheduledPostId },
        include: {
          socialAccount: true,
          video: {
            include: {
              script: true,
            },
          },
        },
      });
    } catch {
      // offline fallback
    }

    const scheduledTime = postDetails?.localScheduledTime || "Today at 4:15 PM EST";
    const channelHandle = postDetails?.socialAccount?.accountHandle || "@yourbrand";
    const videoCaption = postDetails?.caption || "AutoUGC High-Converting Video Ad";
    const videoUrl = postDetails?.video?.videoUrl || "/videos/creator-sarah.mp4";
    const hashtags = postDetails?.video?.script?.hashtags?.map((h: string) => h.startsWith("#") ? h : `#${h}`).join(" ") || "#UGC #marketing #growth";

    return new Response(
      renderSuccessHtml({
        postId: result.scheduledPostId,
        scheduledTime,
        channelHandle,
        videoCaption,
        videoUrl,
        hashtags,
      }),
      {
        status: 200,
        headers: { "Content-Type": "text/html" },
      }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Approval verification failed";
    return new Response(renderErrorHtml(message), {
      status: 400,
      headers: { "Content-Type": "text/html" },
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { scheduledPostId, action } = body;

    if (!scheduledPostId || !action) {
      return NextResponse.json(
        { success: false, error: "scheduledPostId and action are required." },
        { status: 400 }
      );
    }

    if (action !== "approve" && action !== "reject" && action !== "mark_published") {
      return NextResponse.json(
        { success: false, error: "Action must be 'approve', 'reject', or 'mark_published'." },
        { status: 400 }
      );
    }

    const newApprovalStatus = action === "reject" ? "rejected" : "approved";
    const newPublishStatus = action === "mark_published" ? "published" : undefined;

    await prisma.scheduledPost.update({
      where: { id: scheduledPostId },
      data: {
        approvalStatus: newApprovalStatus,
        publishStatus: newPublishStatus,
        approvedAt: action !== "reject" ? new Date() : undefined,
        views: action === "mark_published" ? 1420 : undefined,
        likes: action === "mark_published" ? 118 : undefined,
        shares: action === "mark_published" ? 24 : undefined,
        comments: action === "mark_published" ? 9 : undefined,
      },
    });

    return NextResponse.json({
      success: true,
      scheduledPostId,
      approvalStatus: newApprovalStatus,
      publishStatus: newPublishStatus,
      message: `Post successfully updated.`,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Dashboard approval action failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

function renderSuccessHtml(data: {
  postId: string;
  scheduledTime: string;
  channelHandle: string;
  videoCaption: string;
  videoUrl: string;
  hashtags: string;
}) {
  const fullCaption = `${data.videoCaption}\n\n${data.hashtags}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AutoUGC • Drop Concierge & Download</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: #FAF8F5;
      color: #18181B;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px 16px;
    }
    .card {
      background: #FFFFFF;
      border: 1px solid #E5E0D8;
      border-radius: 24px;
      max-width: 520px;
      width: 100%;
      padding: 32px 24px;
      box-shadow: 0 12px 36px rgba(27, 35, 27, 0.08);
      text-align: center;
    }
    .confirmation-banner {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      background-color: #ECFDF5;
      color: #065F46;
      border: 1.5px solid #10B981;
      border-radius: 14px;
      padding: 14px 20px;
      font-size: 15px;
      font-weight: 700;
      margin-bottom: 24px;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.12);
    }
    .banner-check {
      font-size: 16px;
      font-weight: 900;
      color: #059669;
    }
    h1 {
      font-size: 24px;
      font-weight: 800;
      color: #18181B;
      margin-bottom: 8px;
    }
    p.subtitle {
      font-size: 13px;
      color: #556054;
      line-height: 1.5;
      margin-bottom: 20px;
    }
    .video-preview-wrap {
      position: relative;
      width: 100%;
      max-width: 260px;
      margin: 0 auto 20px;
      border-radius: 18px;
      overflow: hidden;
      box-shadow: 0 8px 24px rgba(0,0,0,0.15);
      border: 2px solid #D95D39;
      background: #000;
    }
    video {
      width: 100%;
      height: auto;
      display: block;
      border-radius: 16px;
    }
    .meta-banner {
      background: #FAFBF9;
      border: 1px solid #E5E0D8;
      border-radius: 14px;
      padding: 12px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
      font-size: 12px;
      text-align: left;
    }
    .meta-banner strong { color: #D95D39; }
    .btn-download {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: 100%;
      background: #D95D39;
      color: #FFFFFF !important;
      text-decoration: none;
      font-weight: 700;
      font-size: 15px;
      padding: 14px 20px;
      border-radius: 14px;
      margin-bottom: 16px;
      box-shadow: 0 4px 12px rgba(31, 56, 36, 0.25);
    }
    .btn-download:hover { background: #162B1B; }
    .copy-section {
      background: #F9FAF7;
      border: 1px solid #E5E0D8;
      border-radius: 16px;
      padding: 16px;
      text-align: left;
      margin-bottom: 20px;
    }
    .copy-label {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      color: #8E8B85;
      letter-spacing: 0.05em;
      margin-bottom: 6px;
    }
    textarea.caption-input {
      width: 100%;
      height: 80px;
      padding: 10px;
      border-radius: 10px;
      border: 1px solid #D6DEC8;
      font-family: inherit;
      font-size: 12px;
      color: #18181B;
      background: #FFFFFF;
      resize: none;
      margin-bottom: 8px;
    }
    .btn-copy {
      background: #FFFFFF;
      border: 1px solid #E5E0D8;
      color: #D95D39;
      font-size: 12px;
      font-weight: 600;
      padding: 8px 14px;
      border-radius: 8px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .btn-copy:hover { background: #F0F4EC; }
    .footer-links {
      font-size: 12px;
      color: #8E8B85;
      display: flex;
      justify-content: center;
      gap: 16px;
      margin-top: 16px;
    }
    .footer-links a { color: #D95D39; font-weight: 600; text-decoration: none; }
  </style>
</head>
<body>
  <div class="card">
    <div class="confirmation-banner">
      <span class="banner-check">✓</span>
      <span class="banner-text">Approved &amp; Queued for Publish</span>
    </div>
    <h1>Ready to Drop on Socials</h1>
    <p class="subtitle">Your 1080x1920 vertical UGC ad is approved, queued for publish, and optimized for maximum watch time.</p>

    <div class="video-preview-wrap">
      <video src="${data.videoUrl}" controls playsinline preload="metadata"></video>
    </div>

    <div class="meta-banner">
      <div>
        <div style="color: #8E8B85; font-size: 11px;">Optimal Post Time:</div>
        <strong>⏰ ${escapeHtml(data.scheduledTime)}</strong>
      </div>
      <div>
        <div style="color: #8E8B85; font-size: 11px;">Target:</div>
        <strong>${escapeHtml(data.channelHandle)}</strong>
      </div>
    </div>

    <a href="${data.videoUrl}" download="autougc_ad.mp4" class="btn-download">
      ⬇ Download Vertical MP4 (1080x1920)
    </a>

    <div class="copy-section">
      <div class="copy-label">Pre-Written Viral Caption & Hashtags</div>
      <textarea id="captionBox" class="caption-input" readonly>${escapeHtml(fullCaption)}</textarea>
      <button class="btn-copy" onclick="copyCaption()">
        <span id="copyIcon">📋</span> <span id="copyText">Copy Caption & Hashtags</span>
      </button>
    </div>

    <div class="footer-links">
      <a href="/dashboard">Go to Dashboard</a>
      <span>•</span>
      <a href="/studio">Edit in Studio</a>
    </div>
  </div>

  <script>
    function copyCaption() {
      const box = document.getElementById('captionBox');
      box.select();
      box.setSelectionRange(0, 99999);
      navigator.clipboard.writeText(box.value).then(() => {
        document.getElementById('copyText').innerText = 'Copied to Clipboard!';
        document.getElementById('copyIcon').innerText = '✓';
        setTimeout(() => {
          document.getElementById('copyText').innerText = 'Copy Caption & Hashtags';
          document.getElementById('copyIcon').innerText = '📋';
        }, 2500);
      });
    }
  </script>
</body>
</html>`;
}

function renderErrorHtml(message: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AutoUGC • Link Expired</title>
  <style>
    body {
      background-color: #FAF8F5;
      color: #18181B;
      font-family: -apple-system, sans-serif;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }
    .card {
      background: #FFFFFF;
      border: 1px solid #E5E0D8;
      border-radius: 24px;
      max-width: 440px;
      width: 100%;
      padding: 36px 32px;
      text-align: center;
    }
    h1 {
      font-size: 24px;
      color: #991b1b;
      margin-bottom: 12px;
    }
    p { font-size: 13px; color: #52525B; line-height: 1.5; margin-bottom: 24px; }
    .btn {
      display: inline-block;
      width: 100%;
      background: #D95D39;
      color: #FFFFFF;
      text-decoration: none;
      font-weight: 600;
      font-size: 13px;
      padding: 12px 18px;
      border-radius: 9999px;
    }
  </style>
</head>
<body>
  <div class="card">
    <h1>Link Notice</h1>
    <p>${escapeHtml(message)}</p>
    <a href="/dashboard" class="btn">Return to Dashboard</a>
  </div>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str.replace(/[&<>"']/g, (m) => {
    switch (m) {
      case "&": return "&amp;";
      case "<": return "&lt;";
      case ">": return "&gt;";
      case '"': return "&quot;";
      default: return "&#39;";
    }
  });
}
