import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import StickyAuditCTA from '@/components/StickyAuditCTA'
import LinkCTA from '@/components/LinkCTA'
import { getPayloadClient } from '@/lib/payload-utils'
import { JsonLd } from '@/components/seo/JsonLd'
import { buildItemListSchema, buildBreadcrumbSchema, buildWebPageSchema } from '@/lib/schema'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'AI Automation Services — WhatsApp, CRM, Document Intelligence | Tech Jersey Studio',
  description:
    "Explore Tech Jersey Studio's full capability stack: WhatsApp automation, CRM pipeline engineering, document intelligence, AI tools, and business operating systems for modern enterprises in India, UAE, and Southeast Asia.",
  keywords: ['AI automation services', 'WhatsApp automation India', 'CRM automation', 'document intelligence', 'business operating system', 'n8n automation agency'],
  openGraph: {
    title: 'AI Automation Services | Tech Jersey Studio',
    description: 'WhatsApp automation, CRM pipelines, document intelligence, and business operating systems.',
    url: 'https://techjersey.studio/services',
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
  alternates: { canonical: 'https://techjersey.studio/services' },
}

// Service icon map (slug → emoji)
const SERVICE_ICONS: Record<string, string> = {
  'whatsapp-automation': '💬',
  'crm-automation': '🔗',
  'document-intelligence': '📄',
  'ai-tools': '🧠',
  'business-os': '⚙️',
}

export default async function ServicesIndexPage() {
  let services: any[] = []

  try {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'services',
      limit: 100,
      depth: 0,
    })
    services = docs
  } catch {
    // Fallback to static service list if CMS unavailable
    services = [
      { slug: 'whatsapp-automation', title: 'WhatsApp Automation', tagline: 'Convert inquiries to qualified leads in 8 seconds.', category: 'messaging' },
      { slug: 'crm-automation', title: 'CRM Automation', tagline: 'Recover 40% of lost revenue from inactive leads.', category: 'crm' },
      { slug: 'document-intelligence', title: 'Document Intelligence', tagline: 'Extract, classify and route documents in milliseconds.', category: 'ai' },
      { slug: 'ai-tools', title: 'Custom AI Tools', tagline: 'Purpose-built AI assistants for your exact workflow.', category: 'ai' },
      { slug: 'business-os', title: 'Business Operating System', tagline: 'A unified command center for your entire business.', category: 'systems' },
    ]
  }

  const serviceListItems = services.map((s) => ({
    name: s.title,
    url: `/services/${s.slug}`,
  }))

  return (
    <>
      <Header />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section style={{ paddingTop: 200, paddingBottom: 100, position: 'relative', overflow: 'hidden' }}>
        {/* Ambient glow */}
        <div style={{ position: 'absolute', top: -100, right: -200, width: 600, height: 600, background: 'radial-gradient(circle, rgba(15,159,112,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div className="container">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" style={{ marginBottom: 32 }}>
            <ol style={{ display: 'flex', gap: 8, listStyle: 'none', fontSize: 13, color: 'var(--text-m)' }}>
              <li><Link href="/" style={{ color: 'var(--text-m)' }}>Home</Link></li>
              <li style={{ opacity: 0.4 }}>/</li>
              <li style={{ color: 'var(--text-s)' }}>Services</li>
            </ol>
          </nav>

          <div style={{ maxWidth: 720, marginBottom: 80 }}>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--em)', display: 'block', marginBottom: 20 }}>
              Capabilities
            </span>
            <h1 style={{
              fontFamily: 'var(--display)', fontWeight: 300,
              fontSize: 'clamp(44px, 6vw, 80px)', lineHeight: 1.05,
              letterSpacing: -2, marginBottom: 24,
            }}>
              Systems that{' '}
              <span style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', color: 'var(--text-s)', fontWeight: 400 }}>
                compound.
              </span>
            </h1>
            <p style={{ fontSize: 18, lineHeight: 1.6, color: 'var(--text-s)', fontWeight: 300, marginBottom: 40, maxWidth: 560 }}>
              Every capability below is a complete, production-ready system — not a prototype.
              Each is designed to deliver measurable ROI within 30 days of deployment.
            </p>
            <LinkCTA href="/audit" id="services-hero-cta" className="btn-primary" location="hero" style={{ background: 'linear-gradient(135deg,var(--em),#4fffca)', color: '#000', border: 'none', fontWeight: 700 }}>
              Get Your Free Automation Audit →
            </LinkCTA>
          </div>

          {/* Services Grid */}
          <div className="services-index-grid">
            {services.map((service) => {
              const icon = SERVICE_ICONS[service.slug] || '⚡'
              const categoryLabel = service.category
                ? service.category.charAt(0).toUpperCase() + service.category.slice(1)
                : 'System'

              return (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  className="service-index-card"
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                    <span style={{ fontSize: 28 }}>{icon}</span>
                    <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--em)', background: 'rgba(15,159,112,0.08)', border: '1px solid rgba(15,159,112,0.15)', padding: '3px 8px', borderRadius: 4 }}>
                      {categoryLabel}
                    </span>
                  </div>
                  <h2 style={{ fontFamily: 'var(--display)', fontSize: 22, fontWeight: 600, color: 'var(--text)', marginBottom: 12, lineHeight: 1.2 }}>
                    {service.title}
                  </h2>
                  <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text-s)', fontWeight: 300, marginBottom: 24 }}>
                    {service.tagline || service.description || 'A complete AI-powered system built for modern enterprises.'}
                  </p>
                  <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--em)', fontWeight: 600 }}>
                    Explore System →
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── AUDIT CTA ─────────────────────────────────────────────────────── */}
      <section style={{ padding: '100px 0', background: 'var(--bg-surface)', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div className="glass-content-box" style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', color: 'var(--em)', display: 'block', marginBottom: 20 }}>
              Not sure where to start?
            </span>
            <h2 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 300, letterSpacing: -1, marginBottom: 16, lineHeight: 1.15 }}>
              Get your free Automation Score in{' '}
              <span style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', color: 'var(--text-s)' }}>3 minutes.</span>
            </h2>
            <p style={{ fontSize: 15, color: 'var(--text-s)', fontWeight: 300, lineHeight: 1.6, marginBottom: 32 }}>
              Answer 8 questions about your current workflow. Receive a personalised score, top opportunities, and recommended systems.
            </p>
            <LinkCTA href="/audit" id="services-bottom-cta" className="btn-primary" location="mid_page" style={{ background: 'linear-gradient(135deg,var(--em),#4fffca)', color: '#000', border: 'none', fontWeight: 700 }}>
              Start Free Audit →
            </LinkCTA>
          </div>
        </div>
      </section>

      <Footer />
      <StickyAuditCTA />

      {/* ── STRUCTURED DATA ─── */}
      <JsonLd data={buildItemListSchema(serviceListItems, 'Tech Jersey Studio AI Automation Services')} />
      <JsonLd data={buildBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Services', url: '/services' },
      ])} />
      <JsonLd data={buildWebPageSchema({
        name: 'AI Automation Services — Tech Jersey Studio',
        url: '/services',
        description: 'Complete AI automation services: WhatsApp automation, CRM pipelines, document intelligence, and business operating systems.',
      })} />

      <style dangerouslySetInnerHTML={{ __html: `
        .services-index-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        .service-index-card {
          background: rgba(10, 15, 20, 0.35);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          padding: 32px;
          display: flex;
          flex-direction: column;
          text-decoration: none;
          color: inherit;
          transition: border-color 0.3s ease, transform 0.3s ease;
          min-height: 280px;
        }

        .service-index-card:hover {
          border-color: rgba(15, 159, 112, 0.25);
          transform: translateY(-4px);
        }

        @media (max-width: 1024px) {
          .services-index-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 640px) {
          .services-index-grid { grid-template-columns: 1fr; }
        }
      ` }} />
    </>
  )
}
