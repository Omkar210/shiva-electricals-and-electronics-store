export type RateLimitBucketType = "auth" | "checkout" | "public" | "media";

interface BucketConfig {
  maxRequests: number;
  windowMs: number;
}

interface RateLimitRecord {
  timestamps: number[];
  blockedUntil?: number;
}

/**
 * In-memory sliding-window log for rate limiting.
 * Keyed by `${bucket}:${identifier}`.
 */
const rateLimitStore = new Map<string, RateLimitRecord>();

// Periodic cleanup of stale records every 5 minutes to prevent memory leak
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanupExpiredRecords(): void {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;

  for (const [key, record] of rateLimitStore.entries()) {
    // Retain only records active within the last 10 minutes
    const validTimestamps = record.timestamps.filter((ts) => now - ts < 10 * 60 * 1000);
    const isBlocked = record.blockedUntil && record.blockedUntil > now;

    if (validTimestamps.length === 0 && !isBlocked) {
      rateLimitStore.delete(key);
    } else {
      record.timestamps = validTimestamps;
    }
  }
}

/**
 * Returns default bucket configurations, overridable by environment variables.
 */
function getBucketConfig(bucket: RateLimitBucketType): BucketConfig {
  switch (bucket) {
    case "auth": {
      const max = parseInt(process.env.RATE_LIMIT_AUTH_MAX || "5", 10);
      const windowSec = parseInt(process.env.RATE_LIMIT_AUTH_WINDOW_SEC || "60", 10);
      return { maxRequests: max, windowMs: windowSec * 1000 };
    }
    case "checkout": {
      const max = parseInt(process.env.RATE_LIMIT_CHECKOUT_MAX || "5", 10);
      const windowSec = parseInt(process.env.RATE_LIMIT_CHECKOUT_WINDOW_SEC || "120", 10);
      return { maxRequests: max, windowMs: windowSec * 1000 };
    }
    case "media": {
      const max = parseInt(process.env.RATE_LIMIT_MEDIA_MAX || "15", 10);
      const windowSec = parseInt(process.env.RATE_LIMIT_MEDIA_WINDOW_SEC || "60", 10);
      return { maxRequests: max, windowMs: windowSec * 1000 };
    }
    case "public":
    default: {
      const max = parseInt(process.env.RATE_LIMIT_PUBLIC_MAX || "60", 10);
      const windowSec = parseInt(process.env.RATE_LIMIT_PUBLIC_WINDOW_SEC || "60", 10);
      return { maxRequests: max, windowMs: windowSec * 1000 };
    }
  }
}

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds: number;
}

/**
 * Validates a request against a sliding-window rate limit bucket.
 * Does not expose bucket state or internal counters.
 */
export function checkRateLimit(
  bucket: RateLimitBucketType,
  identifier: string,
  customConfig?: Partial<BucketConfig>,
): RateLimitResult {
  cleanupExpiredRecords();

  const config = getBucketConfig(bucket);
  const maxRequests = customConfig?.maxRequests ?? config.maxRequests;
  const windowMs = customConfig?.windowMs ?? config.windowMs;

  const sanitizedKey = `${bucket}:${identifier.trim().toLowerCase()}`;
  const now = Date.now();

  let record = rateLimitStore.get(sanitizedKey);
  if (!record) {
    record = { timestamps: [] };
    rateLimitStore.set(sanitizedKey, record);
  }

  // Check if currently hard-blocked
  if (record.blockedUntil && record.blockedUntil > now) {
    const retryAfter = Math.ceil((record.blockedUntil - now) / 1000);
    return {
      allowed: false,
      retryAfterSeconds: retryAfter > 0 ? retryAfter : 1,
    };
  }

  // Filter timestamps within current sliding window
  record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs);

  if (record.timestamps.length >= maxRequests) {
    // Penalize with a block for the remainder of the window or minimum 10 seconds
    const oldestTimestamp = record.timestamps[0];
    const expiry = oldestTimestamp + windowMs;
    const retryAfter = Math.max(10, Math.ceil((expiry - now) / 1000));
    record.blockedUntil = now + retryAfter * 1000;

    return {
      allowed: false,
      retryAfterSeconds: retryAfter,
    };
  }

  // Register this attempt
  record.timestamps.push(now);
  return {
    allowed: true,
    retryAfterSeconds: 0,
  };
}

/**
 * Extracts client IP safely from Next.js server headers.
 */
export async function getClientIp(): Promise<string> {
  try {
    const { headers } = await import("next/headers");
    const headerList = await headers();
    const forwardedFor = headerList.get("x-forwarded-for");
    if (forwardedFor) {
      // First IP in the comma-separated chain is the original client IP
      return forwardedFor.split(",")[0].trim();
    }
    const realIp = headerList.get("x-real-ip");
    if (realIp) return realIp.trim();
    const cfIp = headerList.get("cf-connecting-ip");
    if (cfIp) return cfIp.trim();
  } catch {
    // If called outside request context (e.g. unit tests)
  }
  return "127.0.0.1";
}

/**
 * Standard generic rate limit error message.
 * Strictly avoids leaking whether an account exists or how many attempts remain.
 */
export const GENERIC_RATE_LIMIT_ERROR =
  "Too many requests. For your security, please slow down and try again shortly.";

/**
 * Helper to reset rate limits for a given key (used for tests and successful logins).
 */
export function resetRateLimit(bucket: RateLimitBucketType, identifier: string): void {
  const sanitizedKey = `${bucket}:${identifier.trim().toLowerCase()}`;
  rateLimitStore.delete(sanitizedKey);
}
