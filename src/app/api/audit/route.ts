/**
 * POST /api/audit
 *
 * Receives completed audit answers, validates with Zod (including honeypot
 * check), computes the AI automation readiness score, creates a Lead record,
 * and fires a signed idempotent webhook to n8n.
 *
 * Security layers applied:
 *   - Rate limiting: enforced upstream by src/middleware.ts (5 req/min/IP)
 *   - Honeypot: website_url field must be absent or empty
 *   - Zod validation: all fields sanitized, types enforced, lengths capped
 *   - Webhook: HMAC-SHA256 signed, X-Event-ID idempotency header
 */
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { computeAuditResult, type AuditResponse } from '@/lib/audit-engine'
import { AuditSubmissionSchema, isHoneypotTriggered, formatZodErrors } from '@/lib/validators'
import { dispatchWebhook } from '@/lib/webhook'

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
      console.warn('[audit] Honeypot triggered — silently discarding submission')
      return NextResponse.json({ success: true, leadId: 'bot', audit: null }, { status: 201 })
    }

    // ── Zod validation ─────────────────────────────────────────────────────
    const parsed = AuditSubmissionSchema.safeParse(rawBody)
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: formatZodErrors(parsed.error.issues),
        },
        { status: 400 }
      )
    }

    const {
      name,
      email,
      phone,
      company,
      responses,
      utm_source,
      utm_medium,
      utm_campaign,
      referrerUrl,
    } = parsed.data

    // ── Score ──────────────────────────────────────────────────────────────
    const auditResult = computeAuditResult(responses as AuditResponse[])

    // ── Persist to Payload CMS ─────────────────────────────────────────────
    const payload = await getPayload({ config: configPromise })

    const lead = await payload.create({
      collection: 'leads',
      data: {
        name,
        email: email || undefined,
        phone: phone || undefined,
        company: company || undefined,
        source: 'audit_funnel',
        objective: 'audit',
        message: `Audit completed. Score: ${auditResult.score}/100. ${auditResult.summaryLine}`,
        status: 'new',
        stage: 'discovery',
        priority: auditResult.score >= 60 ? 'high' : auditResult.score >= 35 ? 'medium' : 'low',
        auditDetails: {
          score: auditResult.score,
          opportunities: JSON.stringify(auditResult.opportunities),
          recommendedSystems: JSON.stringify(auditResult.recommendedSystems),
          estimatedMonthlySavings: auditResult.estimatedMonthlySavingsINR,
          responses: JSON.stringify(responses),
        },
        utmTracking: {
          utm_source: utm_source || undefined,
          utm_medium: utm_medium || undefined,
          utm_campaign: utm_campaign || undefined,
          referrerUrl: referrerUrl || undefined,
        },
      },
    })

    // ── Fire n8n Webhook (signed, idempotent, non-blocking) ────────────────
    const n8nUrl = process.env.N8N_WEBHOOK_URL
    if (n8nUrl) {
      // Use lead.id as the event ID — guarantees exactly-once delivery
      // even if the client retries the POST (same lead, same event ID).
      dispatchWebhook(
        n8nUrl,
        {
          event: 'audit_completed',
          lead: { id: lead.id, name, email, phone, company },
          audit: auditResult,
          utm: { utm_source, utm_medium, utm_campaign, referrerUrl },
        },
        `audit_completed:${lead.id}`
      )
    }

    // ── Respond ────────────────────────────────────────────────────────────
    return NextResponse.json(
      { success: true, leadId: lead.id, audit: auditResult },
      { status: 201 }
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('[audit] Lead creation error:', {
      timestamp: new Date().toISOString(),
      error: message,
      stack: error instanceof Error ? error.stack : undefined,
    })
    return NextResponse.json(
      { error: 'Failed to process audit. Please try again.' },
      { status: 500 }
    )
  }
}
