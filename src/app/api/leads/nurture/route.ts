import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload-utils'
import { z } from 'zod'
import { verifyWebhookSignature } from '@/lib/webhook'

/**
 * PATCH /api/leads/nurture
 *
 * Called by n8n to update a lead's nurture state after sending messages.
 * Protected by HMAC-SHA256 webhook signature (same secret as outbound webhooks).
 *
 * Body:
 *   leadId          - Payload CMS lead document ID
 *   sequenceStage   - Current nurture stage name (e.g. "day_3_whatsapp")
 *   lastEmailed     - ISO timestamp of last email sent
 *   whatsappSent    - boolean, whether WA message was sent
 *   lastWhatsappAt  - ISO timestamp of last WhatsApp message
 *   nurtureTag      - current sequence tag
 *   unsubscribed    - boolean, whether lead unsubscribed
 */

const NurtureUpdateSchema = z.object({
  leadId: z.string().min(1, 'leadId is required.'),
  sequenceStage: z.string().optional(),
  lastEmailed: z.string().datetime({ message: 'lastEmailed must be ISO datetime.' }).optional(),
  whatsappSent: z.boolean().optional(),
  lastWhatsappAt: z.string().datetime({ message: 'lastWhatsappAt must be ISO datetime.' }).optional(),
  nurtureTag: z.string().optional(),
  unsubscribed: z.boolean().optional(),
})

export async function PATCH(req: NextRequest) {
  // Verify HMAC signature from n8n
  const signature = req.headers.get('x-webhook-signature') || ''
  const rawBody = await req.text()

  if (!await verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: 'Invalid webhook signature.' }, { status: 401 })
  }

  let body: z.infer<typeof NurtureUpdateSchema>
  try {
    body = NurtureUpdateSchema.parse(JSON.parse(rawBody))
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues[0].message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const { leadId, sequenceStage, lastEmailed, whatsappSent, lastWhatsappAt, nurtureTag, unsubscribed } = body

  try {
    const payload = await getPayloadClient()

    // Build partial nurtureDetails update
    const nurtureUpdate: Record<string, unknown> = {}
    if (sequenceStage !== undefined) nurtureUpdate['nurtureDetails.sequenceStage'] = sequenceStage
    if (lastEmailed !== undefined) nurtureUpdate['nurtureDetails.lastEmailed'] = lastEmailed
    if (whatsappSent !== undefined) nurtureUpdate['nurtureDetails.whatsappSent'] = whatsappSent
    if (lastWhatsappAt !== undefined) nurtureUpdate['nurtureDetails.lastWhatsappAt'] = lastWhatsappAt
    if (nurtureTag !== undefined) nurtureUpdate['nurtureDetails.nurtureTag'] = nurtureTag
    if (unsubscribed !== undefined) nurtureUpdate['nurtureDetails.unsubscribed'] = unsubscribed

    await payload.update({
      collection: 'leads',
      id: leadId,
      data: nurtureUpdate as any,
    })

    return NextResponse.json({ success: true, leadId })
  } catch (err: any) {
    console.error('[Nurture Callback] Failed to update lead:', err?.message)
    return NextResponse.json({ error: 'Failed to update lead record.' }, { status: 500 })
  }
}
