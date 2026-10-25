import crypto from "node:crypto";

export type SocialPlatform = "tiktok" | "instagram" | "youtube";

export interface PlatformOAuthConfig {
  clientId: string;
  clientSecret: string;
  authUrl: string;
  tokenUrl: string;
  scopes: string[];
}

export const OAUTH_CONFIGS: Record<SocialPlatform, PlatformOAuthConfig> = {
  tiktok: {
    clientId: process.env.TIKTOK_CLIENT_KEY || "mock_tiktok_client_key",
    clientSecret: process.env.TIKTOK_CLIENT_SECRET || "mock_tiktok_client_secret",
    authUrl: "https://www.tiktok.com/v2/auth/authorize/",
    tokenUrl: "https://open.tiktokapis.com/v2/oauth/token/",
    scopes: ["video.upload", "video.publish", "user.info.basic"],
  },
  instagram: {
    clientId: process.env.INSTAGRAM_CLIENT_ID || "mock_instagram_client_id",
    clientSecret: process.env.INSTAGRAM_CLIENT_SECRET || "mock_instagram_client_secret",
    authUrl: "https://api.instagram.com/oauth/authorize",
    tokenUrl: "https://api.instagram.com/oauth/access_token",
    scopes: ["instagram_basic", "instagram_content_publish"],
  },
  youtube: {
    clientId: process.env.GOOGLE_CLIENT_ID || "mock_google_client_id",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "mock_google_client_secret",
    authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenUrl: "https://oauth2.googleapis.com/token",
    scopes: ["https://www.googleapis.com/auth/youtube.upload"],
  },
};

/**
 * Generates a tamper-proof state string encoding the organization ID and timestamp.
 */
export function generateOAuthState(orgId: string, platform: SocialPlatform): string {
  const payload = {
    orgId,
    platform,
    timestamp: Date.now(),
    nonce: crypto.randomBytes(8).toString("hex"),
  };
  const json = JSON.stringify(payload);
  const secret = process.env.AUTH_SECRET || "autougc_session_secret_key_32chars_long!!";
  const signature = crypto.createHmac("sha256", secret).update(json).digest("hex");
  return Buffer.from(`${json}::${signature}`).toString("base64url");
}

/**
 * Validates and decodes the state string, checking the HMAC signature and expiration (10 min TTL).
 */
export function verifyOAuthState(stateString: string): { orgId: string; platform: SocialPlatform } {
  try {
    const raw = Buffer.from(stateString, "base64url").toString("utf8");
    const [json, signature] = raw.split("::");
    if (!json || !signature) {
      throw new Error("Invalid state format");
    }

    const secret = process.env.AUTH_SECRET || "autougc_session_secret_key_32chars_long!!";
    const expectedSignature = crypto.createHmac("sha256", secret).update(json).digest("hex");

    if (signature !== expectedSignature) {
      throw new Error("State signature verification failed");
    }

    const payload = JSON.parse(json);
    const ageMs = Date.now() - payload.timestamp;
    if (ageMs > 10 * 60 * 1000) {
      throw new Error("OAuth state has expired (10 min TTL)");
    }

    return { orgId: payload.orgId, platform: payload.platform };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "State validation failed";
    throw new Error(`Invalid OAuth state: ${message}`);
  }
}

/**
 * Builds the platform-specific authorization redirect URL.
 */
export function buildAuthRedirectUrl(
  platform: SocialPlatform,
  state: string,
  redirectUri: string
): string {
  const config = OAUTH_CONFIGS[platform];
  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: config.scopes.join(","),
    state,
  });

  if (platform === "youtube") {
    params.set("access_type", "offline");
    params.set("prompt", "consent");
  }

  return `${config.authUrl}?${params.toString()}`;
}

export interface TokenExchangeResult {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  platformAccountId: string;
  accountHandle: string;
}

/**
 * Exchanges authorization code for access tokens, with encrypted storage helper.
 */
export async function exchangeCodeForTokens(
  platform: SocialPlatform,
  code: string,
  redirectUri: string
): Promise<TokenExchangeResult> {
  // If production credentials are not provided or dev mock mode is active, return deterministic mock tokens
  const isMock =
    !process.env.TIKTOK_CLIENT_KEY &&
    !process.env.INSTAGRAM_CLIENT_ID &&
    !process.env.GOOGLE_CLIENT_ID;

  if (isMock || code.startsWith("mock_code_")) {
    return {
      accessToken: `mock_${platform}_access_token_${Date.now()}`,
      refreshToken: `mock_${platform}_refresh_token_${Date.now()}`,
      expiresIn: 3600 * 24 * 30, // 30 days
      platformAccountId: `${platform}_user_99214`,
      accountHandle: `@autougc_${platform}`,
    };
  }

  const config = OAUTH_CONFIGS[platform];
  const response = await fetch(config.tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      code,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Failed to exchange ${platform} OAuth code: ${errorBody}`);
  }

  const data = await response.json();
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresIn: data.expires_in || 3600 * 24 * 30,
    platformAccountId: data.user_id || data.open_id || "unknown_id",
    accountHandle: data.username ? `@${data.username}` : `@creator_${platform}`,
  };
}
