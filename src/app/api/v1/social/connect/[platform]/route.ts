import { NextRequest, NextResponse } from "next/server";
import {
  SocialPlatform,
  OAUTH_CONFIGS,
  generateOAuthState,
  buildAuthRedirectUrl,
} from "@/lib/social/oauth";
import { getAuthContext } from "@/lib/auth/getAuthContext";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ platform: string }> }
) {
  try {
    const { platform } = await context.params;
    const normalizedPlatform = platform.toLowerCase() as SocialPlatform;

    if (!OAUTH_CONFIGS[normalizedPlatform]) {
      return NextResponse.json(
        {
          error: `Unsupported platform: '${platform}'. Must be one of: tiktok, instagram, youtube.`,
        },
        { status: 400 }
      );
    }

    // Extract tenant context from authenticated user session
    const authContext = await getAuthContext(request);
    const orgId = authContext?.orgId || request.headers.get("x-organization-id");

    if (!orgId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Build redirect URI based on current request host
    const origin = request.nextUrl.origin;
    const redirectUri = `${origin}/api/v1/social/callback/${normalizedPlatform}`;

    // Generate secure HMAC-signed CSRF state token
    const state = generateOAuthState(orgId, normalizedPlatform);

    // Build authorization redirect URL
    const authUrl = buildAuthRedirectUrl(normalizedPlatform, state, redirectUri);

    // In dev or API testing, if query param ?json=true is requested, return JSON instead of 302 redirect
    if (request.nextUrl.searchParams.get("json") === "true") {
      return NextResponse.json({
        platform: normalizedPlatform,
        authUrl,
        state,
        redirectUri,
      });
    }

    return NextResponse.redirect(authUrl);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
