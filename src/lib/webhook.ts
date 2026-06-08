/**
 * webhook.ts — Signed, idempotent, fire-and-forget webhook dispatcher.
 *
 * Features:
 *   1. HMAC-SHA256 signing   — every outbound POST carries an
 *      X-Webhook-Signature: sha256=<hex> header. The n8n workflow should
 *      verify this against N8N_WEBHOOK_SECRET before processing.
 *
 *   2. Idempotency protection — each dispatch generates a unique
 *      X-Event-ID (UUID v4). Sent IDs are stored in a TTL-aware in-memory
 *      Set. Duplicate calls within the TTL window are silently dropped,
 *      preventing double automation execution on retries / hot reloads.
 *
 *   3. Non-blocking           — the function returns void immediately.
 *      It NEVER throws, even if the target is unreachable.
 *
 * Usage:
 *   import { dispatchWebhook } from '@/lib/webhook'
 *   dispatchWebhook(url, { event: 'new_lead', lead: doc })
 */
import crypto from 'crypto'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

// ── Idempotency store ────────────────────────────────────────────────────────

/** How long (ms) to remember a dispatched event ID before evicting it. */
const EVENT_TTL_MS = 5 * 60 * 1000 // 5 minutes

interface StoredEvent {
  expiresAt: number
}

/** In-process store of recently dispatched event IDs. */
const dispatchedEvents = new Map<string, StoredEvent>()

/** Evict expired entries so the Map doesn't grow unboundedly. */
function evictExpired(): void {
  const now = Date.now()
  for (const [id, entry] of dispatchedEvents.entries()) {
    if (entry.expiresAt < now) {
      dispatchedEvents.delete(id)
    }
  }
}

/**
 * Returns true if this event ID has already been dispatched recently.
 * Registers the ID if it is new.
 */
function isDuplicate(eventId: string): boolean {
  evictExpired()
  if (dispatchedEvents.has(eventId)) {
    return true
  }
  dispatchedEvents.set(eventId, { expiresAt: Date.now() + EVENT_TTL_MS })
  return false
}

// ── Signature helper ─────────────────────────────────────────────────────────

/**
 * Generates an HMAC-SHA256 signature over a raw JSON string body.
 *
 * n8n verification (Header Auth node):
 *   Header name:  X-Webhook-Signature
 *   Expected:     sha256=<HMAC-SHA256(N8N_WEBHOOK_SECRET, body)>
 */
function signPayload(body: string, secret: string): string {
  return 'sha256=' + crypto.createHmac('sha256', secret).update(body).digest('hex')
}

/**
 * Verifies an inbound HMAC-SHA256 webhook signature.
 * Used to authenticate callbacks from n8n to Payload.
 *
 * @param rawBody  The raw request body string (before JSON.parse)
 * @param signature  The X-Webhook-Signature header value (format: "sha256=<hex>")
 * @returns true if the signature is valid, false otherwise
 */
export async function verifyWebhookSignature(rawBody: string, signature: string): Promise<boolean> {
  let secret = process.env.N8N_WEBHOOK_SECRET

  try {
    const payload = await getPayload({ config: configPromise })
    const settings = await payload.findGlobal({
      slug: 'global-settings',
      depth: 0,
    }) as any

    if (settings?.n8n?.webhookSecret) {
      secret = settings.n8n.webhookSecret
    }
  } catch (err) {
    console.error('[webhook] Failed to fetch webhook secret from DB, using env fallback:', err)
  }

  if (!secret) {
    // In development without secret configured, allow through with a warning
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[webhook] N8N_WEBHOOK_SECRET not set — signature verification skipped in dev mode.')
      return true
    }
    return false
  }

  const expected = signPayload(rawBody, secret)
  // Constant-time comparison to prevent timing attacks
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
  } catch {
    return false
  }
}



// ── Dispatcher ───────────────────────────────────────────────────────────────

/**
 * Dispatches a signed, idempotency-protected webhook POST request.
 *
 * @param url     Target webhook URL. If omitted/null, falls back to DB Global Settings or env.
 * @param data    JSON-serializable payload
 * @param eventId Optional caller-supplied event ID. If omitted, a UUID is
 *                generated automatically. Pass the same ID to enable
 *                caller-side idempotency (e.g. for retries).
 */
export function dispatchWebhook(
  url: string | null | undefined,
  data: unknown,
  eventId?: string
): void {
  // Generate a unique event ID for this dispatch
  const id = eventId ?? crypto.randomUUID()

  // Drop duplicate events — idempotency guard
  if (isDuplicate(id)) {
    console.warn(`[webhook] Duplicate event dropped: ${id}`)
    return
  }

  // Fire-and-forget: execute asynchronously to avoid blocking the main server thread
  ;(async () => {
    try {
      let finalUrl = url
      let secret = process.env.N8N_WEBHOOK_SECRET ?? ''

      try {
        const payload = await getPayload({ config: configPromise })
        const settings = await payload.findGlobal({
          slug: 'global-settings',
          depth: 0,
        }) as any

        if (settings?.n8n?.webhookUrl) {
          finalUrl = settings.n8n.webhookUrl
        }
        if (settings?.n8n?.webhookSecret) {
          secret = settings.n8n.webhookSecret
        }
      } catch (err) {
        console.error(`[webhook] Failed to load n8n config from database for event ${id}, falling back to env:`, err)
      }

      // Final fallback to environment variables
      if (!finalUrl) {
        finalUrl = process.env.N8N_WEBHOOK_URL
      }

      if (!finalUrl) {
        console.warn(`[webhook] No webhook URL configured for event ${id}. Skipping dispatch.`)
        return
      }

      const body = JSON.stringify({ ...( typeof data === 'object' && data !== null ? data : { data } ), _eventId: id })
      const signature = secret ? signPayload(body, secret) : ''

      const res = await fetch(finalUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Event-ID': id,
          ...(signature && { 'X-Webhook-Signature': signature }),
        },
        body,
      })

      if (!res.ok) {
        console.warn(`[webhook] Non-OK response ${res.status} for event ${id}`)
      }
    } catch (err) {
      console.error(`[webhook] Dispatch failed for event ${id}:`, err)
      // Remove from sent-set on failure so a retry attempt can re-send
      dispatchedEvents.delete(id)
    }
  })()
}

