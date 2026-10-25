import { cookies } from "next/headers";

export interface SessionUser {
  userId: string;
  organizationId: string;
  role: "owner" | "admin" | "editor" | "viewer";
  email: string;
  fullName?: string;
}

const SESSION_COOKIE_NAME = "autougc_session";
const DEFAULT_SECRET = "autougc-production-grade-session-secret-key-32chars";

function getSecretKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET || DEFAULT_SECRET;
  return new TextEncoder().encode(secret);
}

/**
 * Creates a cryptographically signed HMAC-SHA256 session token using the Web Crypto API.
 * Safe for both Edge Middleware and Node.js runtimes.
 */
export async function createSessionToken(user: SessionUser): Promise<string> {
  const secretBytes = getSecretKey() as unknown as BufferSource;
  const key = await crypto.subtle.importKey(
    "raw",
    secretBytes,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const payload = JSON.stringify({
    ...user,
    exp: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  const encodedPayload = Buffer.from(payload).toString("base64url");
  const payloadBytes = new TextEncoder().encode(encodedPayload) as unknown as BufferSource;
  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    payloadBytes
  );

  const signature = Buffer.from(signatureBuffer).toString("base64url");
  return `${encodedPayload}.${signature}`;
}

/**
 * Verifies and decodes an HMAC-SHA256 session token.
 */
export async function verifySessionToken(token: string): Promise<SessionUser | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;

    const [encodedPayload, signature] = parts;
    if (!encodedPayload || !signature) return null;

    const secretBytes = getSecretKey() as unknown as BufferSource;
    const key = await crypto.subtle.importKey(
      "raw",
      secretBytes,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const signatureBytes = Buffer.from(signature, "base64url") as unknown as BufferSource;
    const payloadBytes = new TextEncoder().encode(encodedPayload) as unknown as BufferSource;
    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBytes,
      payloadBytes
    );

    if (!isValid) return null;

    const decodedString = Buffer.from(encodedPayload, "base64url").toString("utf8");
    const data = JSON.parse(decodedString);

    if (data.exp && Date.now() > data.exp) {
      return null; // Expired
    }

    return {
      userId: data.userId,
      organizationId: data.organizationId,
      role: data.role,
      email: data.email,
      fullName: data.fullName,
    };
  } catch {
    return null;
  }
}

/**
 * Helper to retrieve session in Server Components / Route Handlers.
 */
export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return await verifySessionToken(token);
}

/**
 * Helper to set session cookie.
 */
export async function setSessionCookie(user: SessionUser) {
  const token = await createSessionToken(user);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  });
}

/**
 * Helper to destroy session cookie.
 */
export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
