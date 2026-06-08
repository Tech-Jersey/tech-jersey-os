/**
 * POST /api/leads
 *
 * Handles brief/contact form submissions. Validates with Zod (including
 * honeypot check), creates a Lead record in Payload CMS, and fires a
 * signed idempotent webhook to n8n via the Leads.ts afterChange hook.
 *
 * Security layers applied:
 *   - Rate limiting: enforced upstream by src/middleware.ts (10 req/min/IP)
 *   - Honeypot: website_url field must be absent or empty
 *   - Zod validation: all fields sanitized, types enforced, lengths capped
 *   - Webhook: HMAC-SHA256 signed, X-Event-ID idempotency (via Leads hook)
 */
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { BriefSubmissionSchema, isHoneypotTriggered, formatZodErrors } from '@/lib/validators'

export async function POST(request: NextRequest) {
  try {
    // ── Parse body ────────────────────────────────────────────────────────
    let rawBody: unknown
    try {
      rawBody = await request.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    // ── Honeypot check ─────────────────────────────────────────────────────
    // If the honeypot field is filled, return a fake 201 to fool the bot.
    // Real users never see this field (hidden via CSS on the frontend).
    if (
      rawBody &&
      typeof rawBody === 'object' &&
      isHoneypotTriggered(rawBody as Record<string, string>)
    ) {
      console.warn('[leads] Honeypot triggered — silently discarding submission')
      return NextResponse.json({ success: true, id: 'bot' }, { status: 201 })
    }

    // ── Zod validation ─────────────────────────────────────────────────────
    const parsed = BriefSubmissionSchema.safeParse(rawBody)
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: formatZodErrors(parsed.error.issues),
        },
        { status: 400 }
      )
    }

    const { name, email, phone, company, message, objective, source } = parsed.data

    // ── Persist to Payload CMS ─────────────────────────────────────────────
    // The Leads afterChange hook will automatically fire the n8n webhook
    // via dispatchWebhook (signed, idempotent, non-blocking).
    const payload = await getPayload({ config: configPromise })

    const lead = await payload.create({
      collection: 'leads',
      data: {
        name,
        email: email || undefined,
        phone: phone || undefined,
        company: company || undefined,
        message: message || undefined,
        objective: objective as string | undefined,
        source: source as string,
        status: 'new',
        stage: 'discovery',
        priority: 'medium',
      },
    })

    return NextResponse.json({ success: true, id: lead.id }, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('[leads] Lead creation error:', {
      timestamp: new Date().toISOString(),
      error: message,
      stack: error instanceof Error ? error.stack : undefined,
    })
    return NextResponse.json(
      { error: 'Failed to save your details. Please try again.' },
      { status: 500 }
    )
  }
}
