import { NextRequest } from "next/server";

/**
 * Validates Origin and Referer headers against trusted origins to prevent Cross-Site Request Forgery (CSRF).
 */
export function validateCsrfOrigin(request: NextRequest): { isValid: boolean; error?: string } {
  // Safe HTTP read methods are exempt from CSRF origin checks
  if (["GET", "HEAD", "OPTIONS"].includes(request.method)) {
    return { isValid: true };
  }

  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const host = request.headers.get("host") || "localhost:3000";

  // If both origin and referer are absent on a browser mutation request, reject
  if (!origin && !referer) {
    // Permit service-to-service calls with custom authorization headers (e.g., cron jobs, webhooks)
    const hasAuthToken =
      request.headers.get("authorization") ||
      request.headers.get("x-user-id") ||
      request.headers.get("stripe-signature");

    if (hasAuthToken) {
      return { isValid: true };
    }

    return { isValid: false, error: "Missing Origin or Referer header for state mutation." };
  }

  // Parse origin or referer hostname
  try {
    const targetUrl = origin || referer;
    if (!targetUrl) return { isValid: false, error: "Invalid request origin." };

    const parsedUrl = new URL(targetUrl);
    const parsedHost = parsedUrl.host;

    // Allowed hosts (host from request header, configured app URL, or local development)
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ? new URL(process.env.NEXT_PUBLIC_APP_URL).host : null;
    const isLocalhost = parsedHost.includes("localhost") || parsedHost.includes("127.0.0.1");
    const isMatchingHost = parsedHost === host || (appUrl && parsedHost === appUrl);

    if (isMatchingHost || isLocalhost) {
      return { isValid: true };
    }

    return {
      isValid: false,
      error: `Cross-origin request blocked. Origin '${parsedHost}' does not match server host '${host}'.`,
    };
  } catch {
    return { isValid: false, error: "Malformed Origin or Referer header." };
  }
}
