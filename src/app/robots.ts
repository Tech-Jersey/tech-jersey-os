import type { MetadataRoute } from 'next'

/**
 * robots.ts — Next.js Metadata Route
 *
 * Prevents search crawlers from indexing:
 *   - Payload CMS admin panel (/admin/)
 *   - Internal API routes (/api/)
 *   - Payload Next.js handler routes (/(payload)/)
 *   - Uploaded media files (/media/)
 *
 * Signals sitemap location for all crawlers.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/(payload)/',
          '/media/',
        ],
      },
      // Prevent GPTBot and similar AI scrapers from training on content
      {
        userAgent: 'GPTBot',
        disallow: ['/'],
      },
      {
        userAgent: 'CCBot',
        disallow: ['/'],
      },
      {
        userAgent: 'Google-Extended',
        disallow: ['/'],
      },
    ],
    sitemap: 'https://techjersey.studio/sitemap.xml',
    host: 'https://techjersey.studio',
  }
}
