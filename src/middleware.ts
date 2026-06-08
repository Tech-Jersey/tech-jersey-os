/**
 * middleware.ts — Next.js Edge Middleware for API rate limiting.
 *
 * Applied exclusively to public-facing API routes:
 *   /api/audit  — 5 requests per IP per 60 seconds
 *   /api/leads  — 10 requests per IP per 60 seconds
 *
 * IP resolution order:
 *   1. x-forwarded-for (set by Vercel/Cloudflare/Nginx reverse proxies)
 *   2. x-real-ip       (set by some proxy configurations)
 *   3. 'unknown'       (local dev without a proxy)
 *
 * CSRF Note (/api/audit and /api/leads):
 *   These endpoints are JSON-only APIs (they check for Content-Type: application/json).
 *   They do NOT use cookie-based sessions — they accept no credentials.
 *   Because the browser's SameSite cookie policy does not apply to credentialless
 *   cross-origin requests, and the Payload CMS CSRF list already covers the admin
 *   UI, no additional CSRF token mechanism is needed for these two routes.
 *   The Content-Type check in each route handler acts as a natural CSRF barrier
 *   (HTML forms cannot set application/json as Content-Type).
 */
import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/rate-limiter'

interface EndpointConfig {
  limit: number
  windowMs: number
}

const RATE_LIMIT_CONFIG: Record<string, EndpointConfig> = {
  '/api/audit': {
    limit: parseInt(process.env.RATE_LIMIT_AUDIT ?? '5', 10),
    windowMs: 60_000, // 1 minute window
  },
  '/api/leads': {
    limit: parseInt(process.env.RATE_LIMIT_LEADS ?? '10', 10),
    windowMs: 60_000,
  },
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const endpointConfig = RATE_LIMIT_CONFIG[pathname]

  // Not a rate-limited route — pass through immediately
  if (!endpointConfig) return NextResponse.next()

  // Resolve client IP from proxy headers (standard Vercel/Cloudflare pattern)
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown'

  const result = checkRateLimit(`${pathname}:${ip}`, endpointConfig)

  if (!result.allowed) {
    return NextResponse.json(
      {
        error: 'Too many requests. Please wait before submitting again.',
        retryAfter: result.retryAfter,
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(result.retryAfter),
          'X-RateLimit-Limit': String(endpointConfig.limit),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(Math.ceil(result.resetAt / 1000)),
        },
      }
    )
  }

  const response = NextResponse.next()
  response.headers.set('X-RateLimit-Limit', String(endpointConfig.limit))
  response.headers.set('X-RateLimit-Remaining', String(result.remaining))
  response.headers.set('X-RateLimit-Reset', String(Math.ceil(result.resetAt / 1000)))
  return response
}

export const config = {
  matcher: ['/api/audit', '/api/leads'],
}
