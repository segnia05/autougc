import { NextRequest, NextResponse } from "next/server";

export interface RateLimitOptions {
  limit: number; // Maximum allowed requests
  windowSeconds: number; // Window size in seconds
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetInSeconds: number;
}

interface SlidingLogEntry {
  timestamps: number[];
}

// In-memory sliding log cache with automatic garbage collection
const rateLimitCache = new Map<string, SlidingLogEntry>();

// Periodic cleanup every 5 minutes to prevent memory leaks from inactive identifiers
if (typeof setInterval !== "undefined") {
  const cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitCache.entries()) {
      // Retain only entries active within the last 15 minutes
      entry.timestamps = entry.timestamps.filter((ts) => now - ts < 900000);
      if (entry.timestamps.length === 0) {
        rateLimitCache.delete(key);
      }
    }
  }, 300000);
  cleanupTimer.unref?.();
}

/**
 * High-performance sliding window rate limiter.
 * Protects endpoints from DDoS, credential stuffing, scraping abuse, and API cost exhaustion.
 */
export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = { limit: 60, windowSeconds: 60 }
): RateLimitResult {
  const now = Date.now();
  const windowMs = options.windowSeconds * 1000;
  const cutoff = now - windowMs;

  let entry = rateLimitCache.get(identifier);
  if (!entry) {
    entry = { timestamps: [] };
    rateLimitCache.set(identifier, entry);
  }

  // Filter timestamps within current sliding window
  entry.timestamps = entry.timestamps.filter((ts) => ts > cutoff);

  if (entry.timestamps.length >= options.limit) {
    const oldest = entry.timestamps[0] || now;
    const resetInSeconds = Math.max(1, Math.ceil((oldest + windowMs - now) / 1000));
    return {
      success: false,
      limit: options.limit,
      remaining: 0,
      resetInSeconds,
    };
  }

  // Record current request
  entry.timestamps.push(now);
  const remaining = Math.max(0, options.limit - entry.timestamps.length);
  const resetInSeconds = options.windowSeconds;

  return {
    success: true,
    limit: options.limit,
    remaining,
    resetInSeconds,
  };
}

/**
 * Extracts a secure client identifier from NextRequest.
 * Prefers authenticated organization/user context, falling back to proxy IP.
 */
export function getClientIdentifier(request: NextRequest, orgId?: string | null): string {
  if (orgId) {
    return `org:${orgId}`;
  }

  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const clientIp = forwarded.split(",")[0]?.trim();
    if (clientIp) return `ip:${clientIp}`;
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) return `ip:${realIp.trim()}`;

  return "ip:127.0.0.1";
}

/**
 * Generates an RFC-compliant HTTP 429 Too Many Requests response with standard rate limit headers.
 */
export function createRateLimitResponse(result: RateLimitResult): NextResponse {
  return NextResponse.json(
    {
      error: "Too Many Requests",
      message: `Rate limit exceeded. Please retry after ${result.resetInSeconds} seconds.`,
      retryAfterSeconds: result.resetInSeconds,
    },
    {
      status: 429,
      headers: {
        "Retry-After": String(result.resetInSeconds),
        "X-RateLimit-Limit": String(result.limit),
        "X-RateLimit-Remaining": "0",
        "X-RateLimit-Reset": String(Math.floor(Date.now() / 1000) + result.resetInSeconds),
      },
    }
  );
}
