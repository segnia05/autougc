import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionToken } from "@/lib/auth/session";

// Public route prefixes that do not require authentication
const PUBLIC_ROUTES = [
  "/",
  "/sign-in",
  "/templates",
  "/tools",
  "/privacy",
  "/terms",
  "/api/auth",
  "/api/v1/projects/scrape", // Public preview capability per design.md
  "/api/v1/webhooks",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Allow public routes without session check
  const isPublic = PUBLIC_ROUTES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  // Allow static Next.js assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // 2. Extract and verify session token
  const token = request.cookies.get("autougc_session")?.value;
  const session = token ? await verifySessionToken(token) : null;

  // 3. Handle Protected Dashboard & Studio Routes
  const isProtectedAppRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/studio") ||
    pathname.startsWith("/settings");

  if (isProtectedAppRoute && !session) {
    const signInUrl = new URL("/", request.url);
    signInUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // 4. Handle Protected API Routes (/api/v1/*)
  const isProtectedApiRoute = pathname.startsWith("/api/v1") && !isPublic;
  if (isProtectedApiRoute && !session) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "Authentication required to access this resource.",
        },
      },
      { status: 401 }
    );
  }

  // 5. Tenant Injection for Downstream Handlers
  const requestHeaders = new Headers(request.headers);
  if (session) {
    requestHeaders.set("x-user-id", session.userId);
    requestHeaders.set("x-organization-id", session.organizationId);
    requestHeaders.set("x-user-role", session.role);
    requestHeaders.set("x-user-email", session.email);
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
