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
  "/api/v1/webhooks(.*)",
  "/api/auth(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
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
