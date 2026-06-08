import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const BASE_URL = 'https://techjersey.studio'

const nextConfig: NextConfig = {
  // ── Image Optimisation ──────────────────────────────────────────────────────
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'https', hostname: 'techjersey.studio' },
      { protocol: 'https', hostname: '*.techjersey.studio' },
    ],
    // Serve self-hosted media from /media endpoint
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // ── Permanent Redirects (301) ───────────────────────────────────────────────
  async redirects() {
    return [
      // Legacy route: /journal → /blog (duplicate content elimination)
      {
        source: '/journal',
        destination: '/blog',
        permanent: true,
      },
      // Legacy route: /products → /services
      {
        source: '/products',
        destination: '/services',
        permanent: true,
      },
      // Trailing slash normalisation — redirect /page/ → /page
      {
        source: '/:path+/',
        destination: '/:path+',
        permanent: true,
      },
    ]
  },

  // ── Security & SEO Headers ──────────────────────────────────────────────────
  async headers() {
    return [
      // Apply to all public pages
      {
        source: '/((?!api|admin|_next|favicon).*)',
        headers: [
          // Prevent clickjacking
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          // Prevent MIME sniffing
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Referrer for analytics (needed for GA4 attribution)
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Permissions policy
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          // HSTS (only matters when served over HTTPS)
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
        ],
      },
      // Block API routes from being indexed by crawlers (belt-and-suspenders alongside robots.ts)
      {
        source: '/api/(.*)',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
        ],
      },
      // Block admin from being indexed
      {
        source: '/admin/(.*)',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
        ],
      },
    ]
  },

  // ── Bundle Optimisation ─────────────────────────────────────────────────────
  experimental: {
    // Tree-shake large packages
    optimizePackageImports: ['three'],
  },
}

export default withPayload(nextConfig)
