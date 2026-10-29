import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/pricing",
  "/templates(.*)",
  "/tools(.*)",
  "/privacy",
  "/terms",
  "/api/v1/projects/scrape",
  "/api/v1/audio/synthesize",
  "/api/v1/scripts/generate",
  "/api/v1/webhooks(.*)",
  "/api/auth(.*)",
  "/api/health(.*)",
  "/api/v1/campaigns/approve(.*)",
]);

const isProtectedBrowserRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/studio(.*)",
  "/settings(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  // 1. Strictly gate browser protected routes: unauthenticated users are immediately redirected to sign in
  if (isProtectedBrowserRoute(request)) {
    await auth.protect();
  } else if (!isPublicRoute(request)) {
    // 2. Private API endpoints require active auth session or trusted internal service header
    const hasServiceHeader = request.headers.get("x-user-id");
    if (!hasServiceHeader) {
      await auth.protect();
    }
  }

  const { userId, orgId } = await auth();
  const requestHeaders = new Headers(request.headers);
  if (userId) {
    requestHeaders.set("x-user-id", userId);
  }
  if (orgId) {
    requestHeaders.set("x-organization-id", orgId);
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
