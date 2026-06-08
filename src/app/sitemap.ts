import type { MetadataRoute } from 'next'
import { getPayloadClient } from '@/lib/payload-utils'

/**
 * sitemap.ts — Dynamic CMS-driven sitemap
 *
 * Regenerates every hour via ISR (revalidate = 3600).
 * Includes: static routes + all published services, case studies, blog posts, resources.
 *
 * Priority guide:
 *   1.0  — Homepage (highest conversion page)
 *   0.95 — Audit funnel (primary CTA destination)
 *   0.9  — Services index, Case studies index
 *   0.85 — Individual service pages (keyword-targeted)
 *   0.8  — Individual case studies, About, Blog index
 *   0.7  — Blog posts, Resources, Contact
 */

const BASE_URL = 'https://techjersey.studio'

export const revalidate = 3600 // Regenerate sitemap every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  // ── Static Routes ────────────────────────────────────────────────────────────

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/audit`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.95,
    },
    {
      url: `${BASE_URL}/services`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/case-studies`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/resources`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]

  // ── Dynamic Routes — Fetched from CMS ────────────────────────────────────────

  let serviceRoutes: MetadataRoute.Sitemap = []
  let caseStudyRoutes: MetadataRoute.Sitemap = []
  let blogRoutes: MetadataRoute.Sitemap = []
  let resourceRoutes: MetadataRoute.Sitemap = []

  try {
    const payload = await getPayloadClient()

    // Services
    const { docs: services } = await payload.find({
      collection: 'services',
      limit: 100,
      depth: 0,
    })
    serviceRoutes = services.map((s: any) => ({
      url: `${BASE_URL}/services/${s.slug}`,
      lastModified: new Date(s.updatedAt || now),
      changeFrequency: 'monthly' as const,
      priority: 0.85,
    }))

    // Case Studies
    const { docs: caseStudies } = await payload.find({
      collection: 'case-studies',
      limit: 100,
      depth: 0,
    })
    caseStudyRoutes = caseStudies.map((cs: any) => ({
      url: `${BASE_URL}/case-studies/${cs.slug}`,
      lastModified: new Date(cs.updatedAt || now),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }))

    // Blog Posts (published only)
    const { docs: blogPosts } = await payload.find({
      collection: 'blog-posts',
      where: { status: { equals: 'published' } },
      limit: 500,
      depth: 0,
    })
    blogRoutes = blogPosts.map((post: any) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt || post.publishedDate || now),
      changeFrequency: 'yearly' as const,
      priority: 0.7,
    }))

    // Resources (available only)
    const { docs: resources } = await payload.find({
      collection: 'resources',
      where: { available: { equals: true } },
      limit: 100,
      depth: 0,
    })
    resourceRoutes = resources.map((r: any) => ({
      url: `${BASE_URL}/resources`,  // Resources are all on single page; no individual URLs
      lastModified: new Date(r.updatedAt || now),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

  } catch (err) {
    // CMS unavailable at build time — return static routes only
    console.warn('[sitemap] CMS unreachable during sitemap generation — using static routes only:', err)
  }

  return [
    ...staticRoutes,
    ...serviceRoutes,
    ...caseStudyRoutes,
    ...blogRoutes,
    // Deduplicate resource routes (all point to /resources)
    ...(resourceRoutes.length > 0 ? [resourceRoutes[0]] : []),
  ]
}
