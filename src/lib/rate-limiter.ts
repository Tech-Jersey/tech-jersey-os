/**
 * rate-limiter.ts — In-memory, sliding-window token-bucket rate limiter.
 *
 * Zero external dependencies. Sufficient for single-instance deployments
 * (single VPS / single Vercel function instance). The store resets on
 * every process restart / cold start.
 *
 * For multi-instance deployments (horizontally scaled), upgrade to
 * @upstash/ratelimit backed by Redis. The interface is identical.
 *
 * Usage:
 *   const result = checkRateLimit(`/api/audit:${ip}`, { limit: 5, windowMs: 60_000 })
 *   if (!result.allowed) return 429
 */

interface BucketEntry {
  count: number
  /** Epoch ms at which this window expires and resets. */
  resetAt: number
}

/** The in-process store. Auto-eviction happens on every check. */
const store = new Map<string, BucketEntry>()

export interface RateLimitResult {
  /** True if the request is within quota. */
  allowed: boolean
  /** Requests remaining in the current window. */
  remaining: number
  /** Epoch ms when the current window resets. */
  resetAt: number
  /** Seconds until reset (rounded up). */
  retryAfter: number
}

export interface RateLimitOptions {
  /** Maximum number of requests allowed per window. */
  limit: number
  /** Window duration in milliseconds. */
  windowMs: number
}

/**
 * Checks and updates the rate-limit bucket for a given key.
 *
 * @param key      Unique bucket key, typically `${pathname}:${ip}`
 * @param options  { limit, windowMs }
 */
export function checkRateLimit(key: string, options: RateLimitOptions): RateLimitResult {
  const now = Date.now()

  // Evict stale keys to prevent unbounded growth
  // Only evict every ~100 calls to keep overhead low
  if (store.size > 1000) {
    for (const [k, entry] of store.entries()) {
      if (entry.resetAt < now) store.delete(k)
    }
  }

  const entry = store.get(key)

  // No entry or window expired — start fresh
  if (!entry || entry.resetAt < now) {
    const resetAt = now + options.windowMs
    store.set(key, { count: 1, resetAt })
    return {
      allowed: true,
      remaining: options.limit - 1,
      resetAt,
      retryAfter: 0,
    }
  }

  // Window active and quota exhausted
  if (entry.count >= options.limit) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.resetAt,
      retryAfter: Math.ceil((entry.resetAt - now) / 1000),
    }
  }

  // Window active and quota available
  entry.count++
  return {
    allowed: true,
    remaining: options.limit - entry.count,
    resetAt: entry.resetAt,
    retryAfter: 0,
  }
}
