/**
 * payload-utils.ts — Cached database query helpers.
 *
 * All read-only getters are wrapped with Next.js unstable_cache to enable
 * ISR-style caching. This prevents SQLite from being hit on every server-
 * side render, dramatically reducing latency for high-traffic pages.
 *
 * Cache tags allow on-demand revalidation from webhooks or admin actions:
 *   revalidateTag('blog-posts')     → clears all blog queries
 *   revalidateTag('services')       → clears all service queries
 *   revalidateTag('testimonials')   → clears testimonial queries
 *   revalidateTag('case-studies')   → clears case study queries
 *
 * Revalidation TTLs:
 *   Blog posts      — 60 seconds  (frequently updated)
 *   Services        — 300 seconds (rarely updated)
 *   Testimonials    — 300 seconds (rarely updated)
 *   Case studies    — 300 seconds (rarely updated)
 */
import { getPayload } from 'payload'
import type { Where } from 'payload'
import configPromise from '@payload-config'
import { unstable_cache } from 'next/cache'

export async function getPayloadClient() {
  return await getPayload({ config: configPromise })
}

// ── Pages ────────────────────────────────────────────────────────────────────

export async function getPageBySlug(slug: string) {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'pages',
    where: {
      slug: { equals: slug },
      status: { equals: 'published' },
    },
    limit: 1,
  })
  return docs[0] || null
}

// ── Blog Posts ───────────────────────────────────────────────────────────────

export const getBlogPosts = unstable_cache(
  async () => {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'blog-posts',
      where: { status: { equals: 'published' } },
      sort: '-publishedDate',
    })
    return docs
  },
  ['blog-posts-published'],
  { revalidate: 60, tags: ['blog-posts'] }
)

export async function getBlogPostBySlug(slug: string) {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'blog-posts',
    where: {
      slug: { equals: slug },
      status: { equals: 'published' },
    },
    limit: 1,
  })
  return docs[0] || null
}

// ── Testimonials ─────────────────────────────────────────────────────────────

export const getFeaturedTestimonials = unstable_cache(
  async () => {
    const payload = await getPayloadClient()
    const query: Where = {
      featured: { equals: true },
    }

    // Exclude demo/seed testimonials in production
    if (process.env.NODE_ENV === 'production') {
      query.isDemo = { not_equals: true }
    }

    const { docs } = await payload.find({
      collection: 'testimonials',
      where: query,
      sort: 'order',
    })
    return docs
  },
  ['testimonials-featured'],
  { revalidate: 300, tags: ['testimonials'] }
)

// ── Services ─────────────────────────────────────────────────────────────────

export const getServiceBySlug = unstable_cache(
  async (slug: string) => {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'services',
      where: { slug: { equals: slug } },
      limit: 1,
    })
    return docs[0] || null
  },
  ['service-by-slug'],
  { revalidate: 300, tags: ['services'] }
)

// ── Case Studies ─────────────────────────────────────────────────────────────

export const getFeaturedCaseStudies = unstable_cache(
  async () => {
    try {
      const payload = await getPayloadClient()
      const { docs } = await payload.find({
        collection: 'case-studies',
        where: { featured: { equals: true } },
      })
      return docs
    } catch {
      // DB schema may not be fully migrated — return empty gracefully
      return []
    }
  },
  ['case-studies-featured'],
  { revalidate: 300, tags: ['case-studies'] }
)

export const getCaseStudies = unstable_cache(
  async () => {
    try {
      const payload = await getPayloadClient()
      const { docs } = await payload.find({
        collection: 'case-studies',
        limit: 100,
      })
      return docs
    } catch {
      return []
    }
  },
  ['case-studies-all'],
  { revalidate: 300, tags: ['case-studies'] }
)

export async function getCaseStudyBySlug(slug: string) {
  try {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'case-studies',
      where: { slug: { equals: slug } },
      limit: 1,
    })
    return docs[0] || null
  } catch {
    return null
  }
}

export async function getCaseStudiesByService(serviceId: string) {
  try {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'case-studies',
      where: {
        relatedServices: { contains: serviceId },
      },
    })
    return docs
  } catch {
    return []
  }
}
