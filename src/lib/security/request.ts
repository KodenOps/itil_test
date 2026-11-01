/**
 * Small server-side hardening helpers shared by route handlers and server
 * actions. Nothing here replaces RLS or an auth check — it just closes the
 * cheap abuse paths (cross-site posts, form spam).
 */

/**
 * Route handlers do not get the automatic Origin check that Server Actions
 * have, so mutating handlers call this first. Requests without an Origin
 * header (same-origin GETs, some native clients) are allowed; anything that
 * claims an origin must match the Host we were reached on.
 */
export function isSameOriginRequest(request: Request): boolean {
  const origin = request.headers.get("origin");

  if (!origin) return true;

  try {
    return new URL(origin).host === request.headers.get("host");
  } catch {
    return false;
  }
}

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();
const MAX_BUCKETS = 5000;

function prune(now: number) {
  if (buckets.size < MAX_BUCKETS) return;

  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }

  // Still full of live buckets: drop the oldest insertions so memory stays
  // bounded no matter how many distinct keys an attacker sends.
  while (buckets.size >= MAX_BUCKETS) {
    const oldest = buckets.keys().next().value;
    if (oldest === undefined) break;
    buckets.delete(oldest);
  }
}

export type RateLimitResult = {
  ok: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

/**
 * Per-process fixed-window limiter. Adequate for a single Next server; a
 * multi-instance deployment should back this with a shared store instead.
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now();
  prune(now);

  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, retryAfterSeconds: 0 };
  }

  bucket.count += 1;

  if (bucket.count > limit) {
    return {
      ok: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }

  return { ok: true, remaining: limit - bucket.count, retryAfterSeconds: 0 };
}

/** Best-effort client identity for rate limiting (never for authorization). */
export function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim();

  return ip || request.headers.get("x-real-ip") || "unknown";
}
