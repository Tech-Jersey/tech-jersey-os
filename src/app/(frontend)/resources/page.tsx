import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import StickyAuditCTA from '@/components/StickyAuditCTA'
import ResourceCard from '@/components/resources/ResourceCard'
import { getPayloadClient } from '@/lib/payload-utils'

export const metadata: Metadata = {
  title: 'Free Resources — Tech Jersey Studio',
  description: 'Download free AI automation blueprints, ROI calculators, and workflow checklists. Practical resources for business owners building operational infrastructure.',
  openGraph: {
    title: 'Free Automation Resources — Tech Jersey Studio',
    description: 'Blueprints, ROI calculators, and checklists to build your business operating system.',
    type: 'website',
  },
}

// ── Fallback resources shown when CMS has no entries ───────────────────────

const COMING_SOON_RESOURCES = [
  {
    id: 'cs-1',
    slug: 'whatsapp-automation-blueprint',
    title: 'WhatsApp Automation Blueprint',
    category: 'blueprint',
    description: 'End-to-end blueprint for automating your WhatsApp lead qualification, follow-up, and CRM sync using n8n and the Cloud API.',
    available: false,
    downloadCount: 0,
    valueProposition: [
      { point: '12-step automation architecture' },
      { point: 'n8n workflow JSON templates' },
      { point: 'CRM integration checklist' },
    ],
  },
  {
    id: 'cs-2',
    slug: 'automation-roi-calculator',
    title: 'AI Automation ROI Calculator',
    category: 'roi_calculator',
    description: 'Spreadsheet-based calculator to estimate monthly savings from automating manual operations across sales, support, and admin.',
    available: false,
    downloadCount: 0,
    valueProposition: [
      { point: 'Monthly cost savings estimate' },
      { point: 'Payback period calculation' },
      { point: 'Team hours recaptured per week' },
    ],
  },
  {
    id: 'cs-3',
    slug: 'lead-nurture-playbook',
    title: 'Lead Nurture Sequence Playbook',
    category: 'guide',
    description: 'Exact message scripts and timing for a 7-day WhatsApp + Email nurture sequence that converts audit funnel leads into paying clients.',
    available: false,
    downloadCount: 0,
    valueProposition: [
      { point: '7-day sequence with exact scripts' },
      { point: 'Day-by-day timing guide' },
      { point: 'A/B test variants included' },
    ],
  },
  {
    id: 'cs-4',
    slug: 'business-os-checklist',
    title: 'Business Operating System Checklist',
    category: 'checklist',
    description: '64-point audit checklist to identify every manual process in your business that should be automated or systematised.',
    available: false,
    downloadCount: 0,
    valueProposition: [
      { point: '64 automation opportunity checkpoints' },
      { point: 'Department-by-department breakdown' },
      { point: 'Priority scoring system' },
    ],
  },
  {
    id: 'cs-5',
    slug: 'document-intelligence-guide',
    title: 'Document AI Integration Guide',
    category: 'guide',
    description: 'How to connect OpenAI Vision to your document workflows — invoices, POs, contracts — and push structured data directly into your ERP.',
    available: false,
    downloadCount: 0,
    valueProposition: [
      { point: 'Prompt engineering templates' },
      { point: 'Error rate benchmarks' },
      { point: 'Integration architecture diagram' },
    ],
  },
  {
    id: 'cs-6',
    slug: 'crm-automation-starter',
    title: 'CRM Automation Starter Pack',
    category: 'blueprint',
    description: 'Step-by-step guide to connecting your existing CRM (HubSpot/Zoho) with AI-driven qualification and routing logic.',
    available: false,
    downloadCount: 0,
    valueProposition: [
      { point: 'HubSpot & Zoho templates' },
      { point: 'Lead scoring logic' },
      { point: 'Routing rule examples' },
    ],
  },
]

const CATEGORY_MAP: Record<string, string> = {
  blueprint: 'Blueprint',
  roi_calculator: 'ROI Calculator',
  checklist: 'Checklist',
  guide: 'Guide',
  case_study_pdf: 'Case Study PDF',
}

export default async function ResourcesPage() {
  // Try to load resources from CMS; fallback to static list
  let resources: any[] = []
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'resources',
      limit: 20,
      depth: 1,
      sort: '-featured,updatedAt',
    })
    resources = result.docs as any[]
  } catch {
    resources = []
  }

  // Use CMS resources if available, otherwise use static list
  const displayResources = resources.length > 0 ? resources : COMING_SOON_RESOURCES
  const availableCount = displayResources.filter((r: any) => r.available).length

  return (
    <>
      <Header />

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section style={{ paddingTop: 160, paddingBottom: 80, position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: -200, right: -100,
          width: 600, height: 600,
          background: 'radial-gradient(circle, rgba(15,159,112,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div className="container">
          <div style={{ maxWidth: 720 }}>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--em)', display: 'block', marginBottom: 20 }}>
              Free Resources
            </span>
            <h1 style={{
              fontFamily: 'var(--display)', fontWeight: 300,
              fontSize: 'clamp(40px, 6vw, 72px)', lineHeight: 1.05,
              letterSpacing: -2, marginBottom: 24,
            }}>
              Tools to build
              <br />
              <span className="serif-italic" style={{ color: 'var(--text-s)', fontWeight: 400 }}>
                your operating system.
              </span>
            </h1>
            <p style={{ fontSize: 17, lineHeight: 1.65, color: 'var(--text-s)', fontWeight: 300, maxWidth: 560 }}>
              Practical blueprints, ROI calculators, and step-by-step guides for business owners building automation infrastructure. No fluff. No vendor lock-in.
            </p>
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: 40, marginTop: 48, flexWrap: 'wrap' }}>
            {[
              { value: displayResources.length.toString(), label: 'Resources planned' },
              { value: availableCount > 0 ? availableCount.toString() : 'Coming', label: availableCount > 0 ? 'Available now' : 'Soon' },
              { value: 'Free', label: 'Always' },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontFamily: 'var(--display)', fontSize: 28, fontWeight: 700, color: 'var(--text)', lineHeight: 1 }}>
                  {s.value}
                </div>
                <div style={{ fontSize: 10, color: 'var(--text-m)', fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase', marginTop: 4 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RESOURCE GRID ─────────────────────────────────────────────── */}
      <section style={{ padding: '60px 0 120px 0', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          {/* Coming soon banner */}
          {availableCount === 0 && (
            <div style={{
              background: 'rgba(15,159,112,0.05)',
              border: '1px solid rgba(15,159,112,0.15)',
              borderRadius: 12,
              padding: '16px 24px',
              marginBottom: 48,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}>
              <span style={{ fontSize: 18 }}>🔔</span>
              <span style={{ fontSize: 13, color: 'var(--text-s)', fontWeight: 300 }}>
                <strong style={{ color: 'var(--text)', fontWeight: 600 }}>All resources are in production.</strong>{' '}
                They'll be available for download soon. Take the{' '}
                <a href="/audit" style={{ color: 'var(--em)', fontWeight: 600, textDecoration: 'none' }}>
                  Free Audit
                </a>{' '}
                to get personalised recommendations now.
              </span>
            </div>
          )}

          <div className="resources-grid">
            {displayResources.map((resource: any) => (
              <ResourceCard
                key={resource.id}
                slug={resource.slug}
                title={resource.title}
                category={CATEGORY_MAP[resource.category] || resource.category}
                description={resource.description}
                available={resource.available}
                downloadCount={resource.downloadCount}
                valueProposition={resource.valueProposition}
                featured={resource.featured}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── AUDIT CTA ─────────────────────────────────────────────────── */}
      <section style={{ padding: '80px 0 120px 0', background: 'var(--bg-surface)', borderTop: '1px solid var(--border)' }}>
        <div className="container-narrow" style={{ textAlign: 'center' }}>
          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', color: 'var(--em)', display: 'block', marginBottom: 16 }}>
            Not sure where to start?
          </span>
          <h2 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 300, letterSpacing: -1, marginBottom: 20 }}>
            Get a personalised automation roadmap — free.
          </h2>
          <p style={{ fontSize: 15, color: 'var(--text-s)', fontWeight: 300, lineHeight: 1.6, maxWidth: 480, margin: '0 auto 32px' }}>
            The 2-minute AI Audit tells you exactly which systems to build first, and what it would save your business.
          </p>
          <a
            href="/audit"
            className="btn-primary"
            style={{ background: 'linear-gradient(135deg,var(--em),#4fffca)', color: '#000', border: 'none', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 8 }}
          >
            Start Free Audit →
          </a>
        </div>
      </section>

      <Footer />
      <StickyAuditCTA />

      <style dangerouslySetInnerHTML={{ __html: `
        .resources-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        @media (max-width: 1024px) {
          .resources-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 640px) {
          .resources-grid { grid-template-columns: 1fr; }
        }
      ` }} />
    </>
  )
}
