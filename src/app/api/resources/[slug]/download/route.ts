import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload-utils'
import { z } from 'zod'
import { dispatchWebhook } from '@/lib/webhook'
import { checkRateLimit } from '@/lib/rate-limiter'

const DownloadSchema = z.object({
  email: z.string().email({ message: 'A valid email is required.' }).transform(v => v.toLowerCase().trim()),
  name: z.string().min(2, 'Name must be at least 2 characters.').max(80).trim(),
  website_url: z.string().max(0, 'Bot detected.').optional(), // honeypot
})

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  // Rate limiting: 3 downloads per IP per 10 minutes
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  const rateLimitKey = `resource_dl:${ip}`
  const rlResult = checkRateLimit(rateLimitKey, { limit: 3, windowMs: 10 * 60 * 1000 })
  if (!rlResult.allowed) {
    return NextResponse.json(
      { error: 'Too many download requests. Please wait a few minutes and try again.' },
      { status: 429 }
    )
  }

  // Validate body
  let body: z.infer<typeof DownloadSchema>
  try {
    const raw = await req.json()
    body = DownloadSchema.parse(raw)
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues[0].message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  // Honeypot check
  if (body.website_url) {
    return NextResponse.json({ error: 'Bot detected.' }, { status: 400 })
  }

  // Look up resource
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'resources',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
  })

  const resource = result.docs[0] as any
  if (!resource) {
    return NextResponse.json({ error: 'Resource not found.' }, { status: 404 })
  }

  if (!resource.available || !resource.file) {
    return NextResponse.json({ error: 'This resource is not yet available for download.' }, { status: 403 })
  }

  // Upsert Lead record (create if new email, skip if exists)
  let existingLead: any = null
  const leadSearch = await payload.find({
    collection: 'leads',
    where: { email: { equals: body.email } },
    limit: 1,
    depth: 0,
  })
  existingLead = leadSearch.docs[0] as any

  if (!existingLead) {
    await payload.create({
      collection: 'leads',
      data: {
        name: body.name,
        email: body.email,
        source: 'website',
        status: 'new',
        stage: 'discovery',
        priority: 'medium',
        message: `Downloaded resource: ${resource.title}`,
        nurtureDetails: {
          resourceDownloaded: slug,
          nurtureTag: resource.nurtureTag || `resource_${slug}`,
        },
      } as any,
    })
  }

  // Increment download count (fire-and-forget)
  payload.update({
    collection: 'resources',
    id: resource.id,
    data: { downloadCount: (resource.downloadCount || 0) + 1 } as any,
  }).catch(() => {}) // Non-critical

  // Fire n8n webhook (fire-and-forget)
  const n8nUrl = process.env.N8N_WEBHOOK_URL
  if (n8nUrl) {
    dispatchWebhook(n8nUrl, {
      event: 'resource_download',
      resource: { slug, title: resource.title, category: resource.category },
      lead: { name: body.name, email: body.email },
      nurtureTag: resource.nurtureTag || `resource_${slug}`,
    })
  }

  // Return download URL
  const fileUrl = typeof resource.file === 'object'
    ? resource.file.url
    : `/media/${resource.file}`

  return NextResponse.json({
    downloadUrl: fileUrl,
    title: resource.title,
  })
}
