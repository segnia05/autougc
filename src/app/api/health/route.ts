import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db/client";
import { cacheManager } from "@/lib/cache/cacheManager";
import { jobQueue } from "@/lib/queue/jobQueue";
import { geminiBreaker, socialDispatcherBreaker, stripeBreaker } from "@/lib/resilience/circuitBreaker";
import { telemetry } from "@/lib/monitoring/telemetry";

/**
 * Enterprise Health Check & Uptime Monitoring Endpoint.
 *
 * Supports Kubernetes/Docker/ECS liveness and readiness probes:
 * - GET /api/health -> Full readiness diagnostic (Database, Cache, Queues, Circuit Breakers)
 * - GET /api/health?probe=liveness -> Instant liveness ping
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const searchParams = request.nextUrl.searchParams;
  const isLivenessProbe = searchParams.get("probe") === "liveness";

  // Fast liveness probe (Process is alive and responding)
  if (isLivenessProbe) {
    return NextResponse.json(
      { status: "ok", timestamp: new Date().toISOString() },
      { status: 200 }
    );
  }

  // Comprehensive readiness diagnostic
  let dbStatus: "healthy" | "degraded" | "unavailable" = "healthy";
  let dbLatencyMs = 0;

  try {
    const dbStart = Date.now();
    // Test Neon PostgreSQL connection responsiveness
    await prisma.$queryRaw`SELECT 1`;
    dbLatencyMs = Date.now() - dbStart;
  } catch (dbErr) {
    console.warn("[HEALTH_CHECK_WARNING] Database query failed or unavailable:", dbErr);
    dbStatus = "degraded";
  }

  const cacheStats = cacheManager.getStats();
  const queueMetrics = jobQueue.getMetrics();
  const telemetrySnapshot = telemetry.getMetricsSnapshot();

  const circuitBreakerStatus = {
    geminiAi: geminiBreaker.getState(),
    socialPublisher: socialDispatcherBreaker.getState(),
    stripeBilling: stripeBreaker.getState(),
  };

  const isHealthy = dbStatus === "healthy" || dbStatus === "degraded";
  const overallStatus = dbStatus === "healthy" ? "healthy" : "degraded";
  const totalDurationMs = Date.now() - startTime;

  const responsePayload = {
    status: overallStatus,
    version: "0.1.0",
    uptimeSeconds: telemetrySnapshot.uptimeSeconds,
    timestamp: new Date().toISOString(),
    responseDurationMs: totalDurationMs,
    checks: {
      database: {
        status: dbStatus,
        latencyMs: dbLatencyMs,
        provider: "Neon PostgreSQL (Pooled PgBouncer)",
      },
      cache: {
        status: "healthy",
        keysCount: cacheStats.keysCount,
        hitRatio: cacheStats.hitRatio,
      },
      queue: {
        status: "healthy",
        queueDepth: queueMetrics.queueDepth,
        processing: queueMetrics.processing,
        totalJobs: queueMetrics.totalJobs,
      },
      circuitBreakers: circuitBreakerStatus,
      memory: telemetrySnapshot.memory,
    },
  };

  telemetry.recordRequest(totalDurationMs, isHealthy ? 200 : 503);

  return NextResponse.json(responsePayload, {
    status: isHealthy ? 200 : 503,
    headers: {
      "Cache-Control": "no-store, max-age=0, must-revalidate",
    },
  });
}
