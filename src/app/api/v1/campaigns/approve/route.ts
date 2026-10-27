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
          video: true,
        },
      });
    } catch {
      // offline fallback
    }

    const scheduledTime = postDetails?.localScheduledTime || "your scheduled time";
    const channelHandle = postDetails?.socialAccount?.accountHandle || "@yourchannel";
    const videoCaption = postDetails?.caption || "AutoUGC High-Converting Video Ad";

    return new Response(
      renderSuccessHtml({
        postId: result.scheduledPostId,
        scheduledTime,
        channelHandle,
        videoCaption,
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

    if (action !== "approve" && action !== "reject") {
      return NextResponse.json(
        { success: false, error: "Action must be 'approve' or 'reject'." },
        { status: 400 }
      );
    }

    const newStatus = action === "approve" ? "approved" : "rejected";

    await prisma.scheduledPost.update({
      where: { id: scheduledPostId },
      data: {
        approvalStatus: newStatus,
        approvedAt: action === "approve" ? new Date() : undefined,
      },
    });

    return NextResponse.json({
      success: true,
      scheduledPostId,
      approvalStatus: newStatus,
      message: `Post successfully marked as ${newStatus}.`,
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
}) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AutoUGC • Video Approved & Scheduled</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: #F6F7F2;
      color: #1B231B;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }
    .card {
      background: #FFFFFF;
      border: 1px solid #CBD5C4;
      border-radius: 24px;
      max-width: 480px;
      width: 100%;
      padding: 36px 32px;
      box-shadow: 0 10px 30px rgba(27, 35, 27, 0.05);
      text-align: center;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: #E2E9DC;
      color: #1F3824;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 6px 14px;
      border-radius: 9999px;
      border: 1px solid #CBD5C4;
      margin-bottom: 20px;
    }
    h1 {
      font-size: 28px;
      font-weight: 600;
      color: #1B231B;
      margin-bottom: 12px;
    }
    p {
      font-size: 14px;
      color: #4A544A;
      line-height: 1.6;
      margin-bottom: 24px;
    }
    .details {
      background: #FAFBF9;
      border: 1px solid #CBD5C4;
      border-radius: 16px;
      padding: 16px;
      text-align: left;
      font-size: 12px;
      margin-bottom: 28px;
    }
    .row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }
    .row:last-child { margin-bottom: 0; }
    .label { color: #717E6C; }
    .val { color: #1B231B; font-weight: 600; }
    .btn {
      display: inline-block;
      width: 100%;
      background: #1F3824;
      color: #FFFFFF;
      text-decoration: none;
      font-weight: 600;
      font-size: 14px;
      padding: 14px 20px;
      border-radius: 9999px;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">
      <span>✓</span> 1-Click Approval Confirmed
    </div>
    <h1>Approved for Launch</h1>
    <p>Your video ad has been approved and is queued for automated publishing at your designated peak window.</p>
    
    <div class="details">
      <div class="row">
        <span class="label">Target Channel:</span>
        <span class="val">${escapeHtml(data.channelHandle)}</span>
      </div>
      <div class="row">
        <span class="label">Scheduled Time:</span>
        <span class="val">${escapeHtml(data.scheduledTime)}</span>
      </div>
      <div class="row">
        <span class="label">Status:</span>
        <span class="val" style="color: #1F3824;">Queued & Verified</span>
      </div>
    </div>

    <a href="/dashboard?tab=calendar" class="btn">View Live Publishing Calendar →</a>
  </div>
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
      background-color: #F6F7F2;
      color: #1B231B;
      font-family: -apple-system, sans-serif;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }
    .card {
      background: #FFFFFF;
      border: 1px solid #CBD5C4;
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
    p { font-size: 13px; color: #4A544A; line-height: 1.5; margin-bottom: 24px; }
    .btn {
      display: inline-block;
      width: 100%;
      background: #1F3824;
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
