import { NextRequest, NextResponse } from "next/server";
import { processScheduledPostsOnce } from "@/workers/socialPublisher";
import { getAuthContext } from "@/lib/auth/getAuthContext";

/**
 * Endpoint to trigger Just-In-Time generation and dispatch for all due scheduled posts.
 * Can be triggered via cron or manually from the dashboard.
 */
export async function POST(request: NextRequest) {
  try {
    const authContext = await getAuthContext(request);
    // Allow cron or authenticated user
    const cronSecret = request.headers.get("x-cron-secret");
    if (!authContext && cronSecret !== process.env.CRON_SECRET && process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await processScheduledPostsOnce();

    return NextResponse.json({
      success: true,
      message: `JIT worker run complete. Processed: ${result.processedCount}, Published: ${result.successCount}, Retrying: ${result.failureCount}`,
      data: result,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "JIT worker failure";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  return POST(request);
}
