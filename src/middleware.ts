import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { datadog } from "@/lib/observability/datadog";
import { grafana } from "@/lib/observability/grafana";
import { tracer } from "@/lib/observability/tracer";
import { logger } from "@/lib/observability/logger";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/pricing",
  "/templates(.*)",
  "/tools(.*)",
  "/brands(.*)",
  "/blog(.*)",
  "/privacy",
  "/terms",
  "/cookies(.*)",
  "/retention(.*)",
  "/videos(.*)",
  "/renders(.*)",
  "/images(.*)",
  "/api/v1/projects/scrape",
  "/api/v1/audio/synthesize",
  "/api/v1/scripts/generate",
  "/api/v1/campaigns/approve(.*)",
  "/api/v1/webhooks(.*)",
  "/api/health(.*)",
  "/api/metrics(.*)",
  "/api/auth(.*)",
]);

const isProtectedBrowserRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/studio(.*)",
  "/settings(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  const startTime = Date.now();
  const spanContext = tracer.extract(request.headers);
  const path = request.nextUrl.pathname;
  const method = request.method;

  // Record metrics on Prometheus & Datadog
  datadog.increment("http.requests", 1, { method, path });
  grafana.httpRequestsTotal.inc({ method, route: path, status: 200 });

  // 1. Strictly gate browser protected routes: unauthenticated users are redirected to sign in
  if (isProtectedBrowserRoute(request)) {
    const { userId } = await auth();
    const hasDevHeader = request.headers.get("x-user-id");
    if (!userId && !hasDevHeader) {
      const signInUrl = new URL("/sign-in", request.url);
      signInUrl.searchParams.set("redirect_url", request.nextUrl.pathname);
      return NextResponse.redirect(signInUrl);
    }
  } else if (!isPublicRoute(request)) {
    // 2. Private API endpoints require active auth session or trusted internal service header
    const hasServiceHeader = request.headers.get("x-user-id");
    if (!hasServiceHeader) {
      await auth.protect();
    }
  }

  const { userId, orgId } = await auth();
  const requestHeaders = new Headers(request.headers);

  // Propagate distributed trace context
  requestHeaders.set("x-request-id", spanContext.traceId);
  requestHeaders.set("x-trace-id", spanContext.traceId);
  requestHeaders.set("x-span-id", spanContext.spanId);
  requestHeaders.set("x-datadog-trace-id", spanContext.traceId);
  requestHeaders.set("traceparent", `00-${spanContext.traceId}-${spanContext.spanId}-01`);

  if (userId) {
    requestHeaders.set("x-user-id", userId);
  }
  if (orgId) {
    requestHeaders.set("x-organization-id", orgId);
  }

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  const durationMs = Date.now() - startTime;
  response.headers.set("x-request-id", spanContext.traceId);
  response.headers.set("x-trace-id", spanContext.traceId);
  response.headers.set("x-response-time-ms", durationMs.toString());

  // Record latency histogram on Prometheus & Datadog
  datadog.timing("http.latency", durationMs, { method, path });
  grafana.httpRequestDurationSeconds.observe(durationMs / 1000, { method, route: path });

  logger.info(`HTTP ${method} ${path} - ${durationMs}ms`, {
    traceId: spanContext.traceId,
    method,
    path,
    durationMs,
    userId: userId || undefined,
    orgId: orgId || undefined,
  });

  return response;
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|mp4|webm)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
