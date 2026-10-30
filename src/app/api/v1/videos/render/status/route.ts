import { NextRequest, NextResponse } from "next/server";
import { jobQueue } from "@/lib/queue/jobQueue";
import { VideoRenderJobResult } from "@/lib/video/videoWorker";
import fs from "fs";
import path from "path";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const jobId = searchParams.get("jobId");
  const videoId = searchParams.get("videoId");

  if (!jobId && !videoId) {
    return NextResponse.json(
      { success: false, error: "Missing jobId or videoId query parameter" },
      { status: 400 }
    );
  }

  // 1. Check in Job Queue
  if (jobId) {
    const job = jobQueue.getJob<unknown, VideoRenderJobResult>(jobId);
    if (job) {
      if (job.status === "completed") {
        return NextResponse.json({
          success: true,
          status: "completed",
          progress: 100,
          result: job.result,
        });
      }

      if (job.status === "failed") {
        return NextResponse.json({
          success: false,
          status: "failed",
          error: job.error || "Rendering failed in background queue",
        });
      }

      return NextResponse.json({
        success: true,
        status: job.status,
        progress: job.progress,
      });
    }
  }

  // 2. Direct File Check Fallback
  if (videoId) {
    const filePath = path.join(process.cwd(), "public/renders", `${videoId}.mp4`);
    if (fs.existsSync(filePath)) {
      return NextResponse.json({
        success: true,
        status: "completed",
        progress: 100,
        result: {
          videoId,
          videoUrl: `/renders/${videoId}.mp4`,
          durationSeconds: 12.0,
        },
      });
    }
  }

  return NextResponse.json({
    success: true,
    status: "processing",
    progress: 45,
  });
}
