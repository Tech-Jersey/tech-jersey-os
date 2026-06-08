import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans, Playfair_Display, Inter } from 'next/font/google'
import './globals.css'

// ── Font Loading via next/font (eliminates render-blocking @import) ──────────

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-display',
  preload: true,
})

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-serif',
  preload: true,
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  display: 'swap',
  variable: '--font-body',
  preload: true,
})

// ── Analytics IDs ────────────────────────────────────────────────────────────

const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID

// ── Viewport ─────────────────────────────────────────────────────────────────

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#050505',
}

// ── Default Metadata (all pages inherit + override via template) ──────────────

export const metadata: Metadata = {
  // Resolved against metadataBase for all relative URLs (canonical, OG images, etc.)
  metadataBase: new URL('https://techjersey.studio'),

  title: {
    default: 'Tech Jersey Studio — AI Automation & Business Systems',
    template: '%s | Tech Jersey Studio',
  },
  description:
    'Tech Jersey Studio builds AI automation systems, WhatsApp pipelines, CRM engines, and business operating systems for modern enterprises across India, UAE, and Southeast Asia.',
  keywords: [
    'AI automation',
    'WhatsApp automation',
    'n8n automation',
    'CRM automation',
    'business operating system',
    'document intelligence',
    'AI tools',
    'automation agency India',
    'automation agency UAE',
    'Tech Jersey Studio',
  ],
  authors: [{ name: 'Dhruv', url: 'https://techjersey.studio/about' }],
  creator: 'Tech Jersey Studio',
  publisher: 'Tech Jersey Studio',

  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://techjersey.studio',
    siteName: 'Tech Jersey Studio',
    title: 'Tech Jersey Studio — AI Automation & Business Systems',
    description:
      'AI automation systems, WhatsApp pipelines, CRM engines, and business operating systems for modern enterprises.',
    images: [
      {
        url: '/images/og-default.jpg',
        width: 1200,
        height: 630,
        alt: 'Tech Jersey Studio — AI Automation Agency',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    site: '@techjersey_',
    creator: '@techjersey_',
    title: 'Tech Jersey Studio — AI Automation & Business Systems',
    description:
      'AI automation, WhatsApp pipelines, CRM engines, and business operating systems.',
    images: ['/images/og-default.jpg'],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },

  alternates: {
    canonical: 'https://techjersey.studio',
  },

  // Verification tokens — add when available
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
  },
}

// ── Root Layout ───────────────────────────────────────────────────────────────

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${playfairDisplay.variable} ${inter.variable}`}
    >
      <head>
        {/* Preconnect to critical third-party origins */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* GA4 — only injected when NEXT_PUBLIC_GA4_ID is set */}
        {GA4_ID && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA4_ID}', { send_page_view: true });
                `,
              }}
            />
          </>
        )}

        {/* PostHog — injected when NEXT_PUBLIC_POSTHOG_KEY is set */}
        {process.env.NEXT_PUBLIC_POSTHOG_KEY && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]);t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+" (stub)"},o="init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey getNextSurveyStep identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
                posthog.init('${process.env.NEXT_PUBLIC_POSTHOG_KEY}', {
                  api_host: '${process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com'}',
                  person_profiles: 'identified_only',
                });
              `,
            }}
          />
        )}
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
