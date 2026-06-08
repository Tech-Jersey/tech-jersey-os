import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getServiceBySlug, getCaseStudiesByService, getPayloadClient } from '@/lib/payload-utils'
import StickyAuditCTA from '@/components/StickyAuditCTA'
import LinkCTA from '@/components/LinkCTA'
import WhatsAppSimulator from '@/components/demos/WhatsAppSimulator'
import CRMWorkflowSimulator from '@/components/demos/CRMWorkflowSimulator'
import CRMRevenueCalculator from '@/components/demos/CRMRevenueCalculator'
import DocumentAIDemo from '@/components/demos/DocumentAIDemo'
import { JsonLd } from '@/components/seo/JsonLd'
import { buildServiceSchema, buildFAQSchema, buildBreadcrumbSchema } from '@/lib/schema'

interface ServicePageProps {
  params: Promise<{
    slug: string
  }>
}

// ── Static Params: pre-render all service pages at build time ─────────────
export const revalidate = 300

export async function generateStaticParams() {
  try {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'services',
      limit: 100,
      depth: 0,
    })
    return docs.map((s: any) => ({ slug: s.slug }))
  } catch {
    // DB may not be migrated yet (e.g. missing tables).
    // Return empty — pages will be built on-demand via SSR.
    return []
  }
}

// ── Dynamic Metadata ───────────────────────────────────────────────────────
export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params
  const service = await getServiceBySlug(slug)
  if (!service) return { title: 'Service Not Found' }

  const categoryLabel = service.category
    ? service.category.charAt(0).toUpperCase() + service.category.slice(1)
    : 'Automation'

  const title = `${service.title} — ${categoryLabel} System | Tech Jersey Studio`
  const description = (service as any).tagline || (service as any).description ||
    `${service.title}: a bespoke ${categoryLabel} system built by Tech Jersey Studio for modern enterprises.`

  return {
    title,
    description,
    keywords: [service.title, 'AI automation', categoryLabel, 'India', 'Tech Jersey Studio'],
    openGraph: {
      title,
      description,
      url: `https://techjersey.studio/services/${slug}`,
      type: 'website',
    },
    twitter: { card: 'summary_large_image' },
    alternates: { canonical: `https://techjersey.studio/services/${slug}` },
  }
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params
  const service = await getServiceBySlug(slug)

  if (!service) {
    return notFound()
  }

  // Display name conversions
  const categoryLabel = service.category
    ? service.category.charAt(0).toUpperCase() + service.category.slice(1)
    : 'Capability'

  const demoType = (service as any).demoType || (slug === 'whatsapp-automation' ? 'whatsapp' : 'none')
  const heroTrustRow = (service as any).heroTrustRow || []
  const problemStatements = (service as any).problemStatements || []
  const integrations = (service as any).integrations || []
  const hasDemoInHero = demoType !== 'none'

  // Fetch related case studies — guarded against schema migration gaps
  let relatedCaseStudies: any[] = []
  try {
    relatedCaseStudies = await getCaseStudiesByService(String(service.id))
  } catch {
    // Case studies DB table may not be fully migrated yet — skip gracefully
    relatedCaseStudies = []
  }

  return (
    <>
      <Header />

      {/* SERVICE HERO */}
      <section style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', position: 'relative', paddingTop: 140, paddingBottom: 80, overflow: 'hidden' }}>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'grid', gridTemplateColumns: hasDemoInHero ? '1.2fr 1fr' : '1fr', gap: 60, alignItems: 'center' }} className="service-hero-grid">
            <div className="glass-content-box" style={{ padding: 48 }}>
              <span className="serif-italic" style={{ color: 'var(--em)', fontSize: 12, letterSpacing: 3, textTransform: 'uppercase', display: 'block', marginBottom: 16 }}>
                {categoryLabel} System
              </span>
              <h1 style={{
                fontFamily: 'var(--display)', fontWeight: 300,
                fontSize: 'clamp(36px, 5vw, 64px)', lineHeight: 1.15,
                letterSpacing: -1.5, marginBottom: 24,
                color: 'var(--text)'
              }}>
                {service.title}
              </h1>
              <p className="serif-italic" style={{ fontSize: 20, color: 'var(--text-s)', marginBottom: 20 }}>
                {service.tagline}
              </p>
              <p style={{ fontSize: 16, lineHeight: 1.6, color: 'var(--text-s)', fontWeight: 300, marginBottom: 40 }}>
                {service.description}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
                <LinkCTA
                  href="/audit"
                  id="service-hero-audit-cta"
                  className="btn-primary"
                  location="hero"
                  style={{ background: 'linear-gradient(135deg,var(--em),#4fffca)', color: '#000', border: 'none', fontWeight: 700 }}
                >
                  🤖 Get Free Audit
                </LinkCTA>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {demoType !== 'none' && (
                    <a href="#demo-section" className="btn-secondary" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                      See {demoType === 'crm' ? 'CRM' : demoType === 'whatsapp' ? 'WhatsApp' : demoType === 'document-ai' ? 'Document AI' : ''} Demo →
                    </a>
                  )}
                  {demoType === 'none' && (
                    <Link href="/contact" className="btn-secondary" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                      {service.ctaText || 'Build System'} →
                    </Link>
                  )}
                  <span style={{ fontSize: 10, color: 'var(--text-m)', marginTop: 4 }}>
                    ≈ 2 Minute Audit · Instant Score
                  </span>
                </div>
              </div>

              {/* Hero Trust Row */}
              {heroTrustRow.length > 0 && (
                <div className="hero-trust-row">
                  {heroTrustRow.map((item: any) => (
                    <div key={item.id} className="hero-trust-item">
                      <span className="hero-trust-check">✓</span>
                      <span className="hero-trust-text">{item.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Demo component based on demoType */}
            {demoType === 'whatsapp' && (
              <div className="service-demo-wrapper">
                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', color: 'var(--em)' }}>
                    Live Simulator Sandbox
                  </span>
                  <p style={{ fontSize: 13, color: 'var(--text-s)', marginTop: 4 }}>Click options to test our official API AI router</p>
                </div>
                <WhatsAppSimulator />
              </div>
            )}
            {demoType === 'crm' && (
              <div className="service-demo-wrapper">
                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', color: 'var(--em)' }}>
                    Pipeline Automation Demo
                  </span>
                  <p style={{ fontSize: 13, color: 'var(--text-s)', marginTop: 4 }}>Click Run to see a lead flow through your automated CRM pipeline</p>
                </div>
                <CRMWorkflowSimulator />
              </div>
            )}
            {demoType === 'document-ai' && (
              <div className="service-demo-wrapper" id="demo-section">
                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', color: 'var(--em)' }}>
                    AI Document Extraction Simulator
                  </span>
                  <p style={{ fontSize: 13, color: 'var(--text-s)', marginTop: 4 }}>Select a document type or upload your own to test</p>
                </div>
                <DocumentAIDemo />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* PROBLEM SECTION */}
      {problemStatements.length > 0 && (
        <section style={{ padding: '100px 0', background: 'var(--bg-surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: 60 }}>
              <span className="section-label" style={{ color: 'var(--em)', letterSpacing: 2 }}>The Problem</span>
              <h2 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 300, letterSpacing: -1, marginTop: 12 }}>
                Your Sales Pipeline Has <em style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', color: 'var(--text-s)' }}>Invisible Leaks</em>
              </h2>
            </div>
            <div className="problem-grid">
              {problemStatements.map((problem: any) => (
                <div key={problem.id} className="problem-card">
                  <div className="problem-icon">{problem.icon}</div>
                  <h3 className="problem-title">{problem.title}</h3>
                  <p className="problem-desc">{problem.description}</p>
                  {problem.impactMetric && (
                    <div className="problem-metric">
                      <span className="problem-metric-value">{problem.impactMetric}</span>
                      <span className="problem-metric-label">estimated impact</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* KEY CAPABILITIES / SOLUTION */}
      {service.keyCapabilities && service.keyCapabilities.length > 0 && (
        <section style={{ padding: '80px 0', background: problemStatements.length > 0 ? 'transparent' : 'var(--bg-surface)', borderTop: problemStatements.length > 0 ? 'none' : '1px solid var(--border)', borderBottom: problemStatements.length > 0 ? 'none' : '1px solid var(--border)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <span className="section-label" style={{ color: 'var(--em)', letterSpacing: 2 }}>
                {problemStatements.length > 0 ? 'The Solution' : 'Specifications'}
              </span>
              <h2 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 300, letterSpacing: -1, marginTop: 12 }}>
                {problemStatements.length > 0 ? 'End-to-End Automation Architecture' : 'System Architecture Deliverables'}
              </h2>
            </div>
            <div className="caps-grid">
              {service.keyCapabilities.map((cap: any) => (
                <div key={cap.id} className="cap-card">
                  <span className="cap-check">✦</span>
                  <span className="cap-text">{cap.point}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* BEFORE VS AFTER SECTION (only for Document Intelligence) */}
      {demoType === 'document-ai' && (
        <section style={{ padding: '100px 0', background: 'var(--bg-surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: 60 }}>
              <span className="section-label" style={{ color: 'var(--em)', letterSpacing: 2 }}>Outcomes Comparison</span>
              <h2 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 300, letterSpacing: -1, marginTop: 12 }}>
                Manual Entry <em style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', color: 'var(--text-s)' }}>vs</em> AI Automation
              </h2>
            </div>
            
            <div className="outcome-comparison-grid">
              <div className="comparison-col manual-col">
                <h3>Manual Invoice Processing</h3>
                <ul>
                  <li>
                    <span className="bullet-bad">✕</span>
                    <div>
                      <strong>4-6 Minutes Per Invoice</strong>
                      <p>Manual transcription of header fields, date formats, vendor details, and individual line items.</p>
                    </div>
                  </li>
                  <li>
                    <span className="bullet-bad">✕</span>
                    <div>
                      <strong>12%+ Human Error Rate</strong>
                      <p>Typos in HSN codes, tax amounts, or billing numbers leading to reconciliation blockages during month-end.</p>
                    </div>
                  </li>
                  <li>
                    <span className="bullet-bad">✕</span>
                    <div>
                      <strong>₹85+ Cost Per Document</strong>
                      <p>High operator salaries spent on repetitive data entry tasks instead of analysis and strategic operations.</p>
                    </div>
                  </li>
                  <li>
                    <span className="bullet-bad">✕</span>
                    <div>
                      <strong>Rigid OCR Templates</strong>
                      <p>Systems fail when vendor relocates logo, adds discount columns, or increases row counts.</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="comparison-col auto-col">
                <h3>Document Intelligence Flow</h3>
                <ul>
                  <li>
                    <span className="bullet-good">✓</span>
                    <div>
                      <strong>Under 15 Seconds Total</strong>
                      <p>Instant batch ingestion, layout-aware OCR extraction, and schema validation.</p>
                    </div>
                  </li>
                  <li>
                    <span className="bullet-good">✓</span>
                    <div>
                      <strong>99.2% Accuracy Threshold</strong>
                      <p>Automated mathematical checking cross-references invoice lines, tax values, and purchase orders.</p>
                    </div>
                  </li>
                  <li>
                    <span className="bullet-good">✓</span>
                    <div>
                      <strong>Under ₹13 Cost Per Document</strong>
                      <p>Low API and compute overhead costs, allowing your operations team to focus on resolving exceptions.</p>
                    </div>
                  </li>
                  <li>
                    <span className="bullet-good">✓</span>
                    <div>
                      <strong>Layout-Agnostic LLM Parsing</strong>
                      <p>Reads documents like a human. Vision-based models identify fields regardless of design or positioning.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* AUTOMATION FLOW SECTION (only for Document Intelligence) */}
      {demoType === 'document-ai' && (
        <section style={{ padding: '100px 0' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: 60 }}>
              <span className="section-label" style={{ color: 'var(--em)', letterSpacing: 2 }}>System Pipeline</span>
              <h2 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 300, letterSpacing: -1, marginTop: 12 }}>
                Automated Ingestion & Extraction <em style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', color: 'var(--text-s)' }}>Pipeline Flow</em>
              </h2>
            </div>

            <div className="flow-steps-timeline">
              <div className="flow-step-node">
                <div className="node-number">01</div>
                <div className="node-content">
                  <h4>Multi-Channel Ingestion</h4>
                  <p>Documents ingest automatically from dedicated email inboxes (PDF attachments), WhatsApp threads, cloud folders, or batch manual uploads.</p>
                </div>
              </div>
              
              <div className="flow-step-arrow">→</div>

              <div className="flow-step-node">
                <div className="node-number">02</div>
                <div className="node-content">
                  <h4>Optical Layout OCR</h4>
                  <p>Hybrid OCR engines process layout structures, word coordinates, bounding boxes, tables, and lines into text block tokens.</p>
                </div>
              </div>

              <div className="flow-step-arrow">→</div>

              <div className="flow-step-node">
                <div className="node-number">03</div>
                <div className="node-content">
                  <h4>Vision LLM Analysis</h4>
                  <p>Proprietary semantic mapping engines run inference to classify fields, identify HSN codes, vendor profiles, and line-item details.</p>
                </div>
              </div>

              <div className="flow-step-arrow">→</div>

              <div className="flow-step-node">
                <div className="node-number">04</div>
                <div className="node-content">
                  <h4>Validation & Export</h4>
                  <p>Confidence score check is run, tax maths verified, and structured JSON output gets updated and synced with Tally, QuickBooks, or SAP.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* DEMO SECTION (mid-page for CRM) */}
      {demoType === 'crm' && (
        <section id="demo-section" style={{ padding: '100px 0' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: 60 }}>
              <span className="section-label" style={{ color: 'var(--em)', letterSpacing: 2 }}>Revenue Recovery</span>
              <h2 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 300, letterSpacing: -1, marginTop: 12 }}>
                Calculate Your <em style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', color: 'var(--text-s)' }}>Revenue Leakage</em>
              </h2>
            </div>
            <CRMRevenueCalculator />
          </div>
        </section>
      )}

      {/* ROI / METRICS SECTION */}
      {service.roiMetrics && service.roiMetrics.length > 0 && (
        <section style={{ padding: '100px 0', position: 'relative' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: 60 }}>
              <span className="section-label" style={{ color: 'var(--em)', letterSpacing: 2 }}>ROI Yield</span>
              <h2 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 300, letterSpacing: -1, marginTop: 12 }}>
                Performance Metrics & Outcomes
              </h2>
            </div>
            <div className="service-roi-grid">
              {service.roiMetrics.map((roi: any) => (
                <div key={roi.id} className="service-roi-card">
                  <div className="service-roi-value">{roi.value}</div>
                  <div className="service-roi-label">{roi.label}</div>
                  <p className="service-roi-desc">{roi.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* INTEGRATIONS SECTION */}
      {integrations.length > 0 && (
        <section style={{ padding: '80px 0', background: 'var(--bg-surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <span className="section-label" style={{ color: 'var(--em)', letterSpacing: 2 }}>Integrations</span>
              <h2 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 300, letterSpacing: -1, marginTop: 12 }}>
                Connects With Your Existing Stack
              </h2>
            </div>
            <div className="integrations-grid">
              {integrations.map((integration: any) => (
                <div key={integration.id} className="integration-card">
                  <span className="integration-icon">{integration.icon}</span>
                  <span className="integration-name">{integration.name}</span>
                  {integration.category && (
                    <span className="integration-category">{integration.category}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CASE STUDY SNAPSHOT SECTION */}
      {service.caseStudySnapshot && service.caseStudySnapshot.clientName && (
        <section style={{ padding: '120px 0', background: integrations.length > 0 ? 'transparent' : 'var(--bg-surface)', borderTop: integrations.length > 0 ? 'none' : '1px solid var(--border)', borderBottom: integrations.length > 0 ? 'none' : '1px solid var(--border)' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 60, alignItems: 'center' }} className="case-snapshot-grid">
              <div className="glass-content-box" style={{ background: 'rgba(15,159,112,0.03)', border: '1px solid rgba(15,159,112,0.15)', textAlign: 'center', padding: '48px 32px' }}>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--em)', display: 'block', marginBottom: 12 }}>
                  CASE STUDY SNAPSHOT
                </span>
                <div style={{
                  fontFamily: 'var(--display)', fontSize: 'clamp(44px, 6vw, 72px)', fontWeight: 700,
                  background: 'linear-gradient(135deg, var(--text), var(--em))',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  lineHeight: 1.1, marginBottom: 8
                }}>
                  {service.caseStudySnapshot.metricValue}
                </div>
                <div style={{ fontFamily: 'var(--display)', fontSize: 13, fontWeight: 600, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 24 }}>
                  {service.caseStudySnapshot.metricLabel}
                </div>
                <span className="serif-italic" style={{ fontSize: 14, color: 'var(--text-s)' }}>
                  Verified Client: {service.caseStudySnapshot.clientName}
                </span>
              </div>
              <div>
                <h2 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 300, letterSpacing: -1, marginBottom: 24, lineHeight: 1.2 }}>
                  How we optimized operations for <span className="serif-italic" style={{ color: 'var(--text-s)', fontWeight: 400 }}>{service.caseStudySnapshot.clientName}</span>.
                </h2>
                <p style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--text-s)', fontWeight: 300, marginBottom: 32 }}>
                  &ldquo;{service.caseStudySnapshot.summary}&rdquo;
                </p>
                {service.caseStudySnapshot.caseStudyLink && (
                  <Link href={service.caseStudySnapshot.caseStudyLink} className="btn-secondary" style={{ padding: '14px 28px', fontSize: 13 }}>
                    Read Full Case Study ROI →
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FAQ SECTION */}
      {service.faqs && service.faqs.length > 0 && (
        <section style={{ padding: '100px 0' }}>
          <div className="container-narrow">
            <div style={{ textAlign: 'center', marginBottom: 60 }}>
              <span className="section-label" style={{ color: 'var(--em)', letterSpacing: 2 }}>FAQ</span>
              <h2 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 300, letterSpacing: -1, marginTop: 12 }}>
                Integration Inquiries
              </h2>
            </div>
            <div className="faq-list">
              {service.faqs.map((faq: any) => (
                <div key={faq.id} className="faq-item">
                  <h3>{faq.question}</h3>
                  <p>{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* AUDIT CONVERSION STRIP */}
      <section style={{ background: 'rgba(15,159,112,0.05)', borderTop: '1px solid rgba(15,159,112,0.12)', borderBottom: '1px solid rgba(15,159,112,0.12)', padding: '60px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 32 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', color: 'var(--em)', marginBottom: 10 }}>Free · ≈ 2 Minute Audit</div>
              <h2 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(24px,4vw,40px)', fontWeight: 300, letterSpacing: -1, marginBottom: 8 }}>
                Is your logic ready for <em style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', color: 'var(--text-s)' }}>automation?</em>
              </h2>
              <p style={{ fontSize: 15, color: 'var(--text-s)', fontWeight: 300, maxWidth: 480 }}>
                Take the 8-question AI Automation Audit. Get an instant score, recommended architecture roadmap, and savings estimate in INR.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6 }}>
              <LinkCTA
                href="/audit"
                id="service-footer-audit-cta"
                className="btn-primary"
                location="mid_page"
                style={{ background: 'linear-gradient(135deg,var(--em),#4fffca)', color: '#000', border: 'none', fontWeight: 700, whiteSpace: 'nowrap' }}
              >
                Start Free Audit →
              </LinkCTA>
              <span style={{ fontSize: 11, color: 'var(--text-m)', width: '100%', textAlign: 'center' }}>
                ≈ 2 Minute Audit · Instant Score
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* RELATED CASE STUDIES */}
      {relatedCaseStudies && relatedCaseStudies.length > 0 && (
        <section style={{ padding: '100px 0 120px 0', borderTop: '1px solid var(--border)' }}>
          <div className="container">
            <div style={{ marginBottom: 48 }}>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--em)', display: 'block', marginBottom: 12 }}>
                Proven Results
              </span>
              <h2 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 300, letterSpacing: -0.5, marginBottom: 8 }}>
                Related{' '}
                <span className="serif-italic" style={{ color: 'var(--text-s)', fontWeight: 400 }}>Case Studies</span>
              </h2>
              <p style={{ fontSize: 14, color: 'var(--text-s)', fontWeight: 300, maxWidth: 540 }}>
                See how businesses in similar situations deployed this capability and the outcomes they achieved.
              </p>
            </div>
            <div className="related-cases-grid">
              {relatedCaseStudies.slice(0, 3).map((cs: any) => {
                const highlightMetric = cs.metrics?.[0] || { value: '—', label: 'Impact' }
                const industryLabel = cs.industry ? cs.industry.replace('-', ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()) : ''
                return (
                  <Link key={cs.id} href={`/case-studies/${cs.slug}`} className="related-case-card" style={{ textDecoration: 'none' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                        <span style={{ fontSize: 9, color: 'var(--text-m)', textTransform: 'uppercase', letterSpacing: 1 }}>{industryLabel}</span>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontFamily: 'var(--display)', fontSize: 22, fontWeight: 700, color: 'var(--em)', lineHeight: 1 }}>{highlightMetric.value}</div>
                          <div style={{ fontSize: 8, color: 'var(--text-m)', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 2 }}>{highlightMetric.label}</div>
                        </div>
                      </div>
                      <h4 style={{ fontFamily: 'var(--display)', fontSize: 16, fontWeight: 600, color: 'var(--text)', marginBottom: 8, lineHeight: 1.3 }}>
                        {cs.client}
                      </h4>
                      <p style={{ fontSize: 12, lineHeight: 1.5, color: 'var(--text-s)', fontWeight: 300 }}>
                        {cs.summary}
                      </p>
                    </div>
                    <span style={{ fontSize: 11, color: 'var(--em)', fontWeight: 600, marginTop: 12, display: 'inline-block' }}>
                      Read Success Story →
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      <Footer />
      <StickyAuditCTA />

      {/* Styled styles for services detail pages layout */}
      <style dangerouslySetInnerHTML={{__html: `
        /* ── Hero Trust Row ── */
        .hero-trust-row {
          display: flex;
          gap: 20px;
          margin-top: 32px;
          flex-wrap: wrap;
        }

        .hero-trust-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .hero-trust-check {
          font-size: 11px;
          color: var(--em);
          font-weight: 700;
        }

        .hero-trust-text {
          font-family: var(--body);
          font-size: 12px;
          color: var(--text-s);
          font-weight: 400;
          letter-spacing: 0.3px;
        }

        /* ── Problem Section ── */
        .problem-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
        }

        .problem-card {
          background: rgba(10,15,20,0.4);
          border: 1px solid rgba(255,255,255,0.04);
          border-radius: 16px;
          padding: 32px;
          transition: border-color 0.4s var(--ease), transform 0.4s var(--ease);
        }

        .problem-card:hover {
          border-color: rgba(231, 76, 60, 0.2);
          transform: translateY(-2px);
        }

        .problem-icon {
          font-size: 28px;
          margin-bottom: 16px;
        }

        .problem-title {
          font-family: var(--display);
          font-size: 16px;
          font-weight: 600;
          color: var(--text);
          margin-bottom: 10px;
        }

        .problem-desc {
          font-family: var(--body);
          font-size: 13px;
          line-height: 1.6;
          color: var(--text-s);
          font-weight: 300;
          margin-bottom: 16px;
        }

        .problem-metric {
          display: flex;
          flex-direction: column;
          gap: 2px;
          padding-top: 12px;
          border-top: 1px solid rgba(255,255,255,0.04);
        }

        .problem-metric-value {
          font-family: var(--display);
          font-size: 14px;
          font-weight: 700;
          color: #e74c3c;
        }

        .problem-metric-label {
          font-family: var(--body);
          font-size: 9px;
          color: var(--text-m);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        /* ── Capabilities ── */
        .caps-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        .cap-card {
          background: rgba(10, 15, 20, 0.4);
          border: 1px solid rgba(255,255,255,0.04);
          border-radius: 12px;
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .cap-check {
          color: var(--em);
          font-weight: 700;
          font-size: 16px;
        }

        .cap-text {
          font-family: var(--body);
          font-size: 14px;
          color: var(--text-s);
          font-weight: 300;
        }

        /* ── ROI Metrics ── */
        .service-roi-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
        }

        .service-roi-card {
          background: rgba(10, 15, 20, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 16px;
          padding: 40px 32px;
          transition: border-color 0.4s var(--ease), transform 0.4s var(--ease);
          cursor: pointer;
        }

        .service-roi-card:hover {
          border-color: rgba(15, 159, 112, 0.25);
          transform: translateY(-4px);
        }

        .service-roi-value {
          font-family: var(--display);
          font-size: 40px;
          font-weight: 700;
          background: linear-gradient(135deg, var(--text), var(--em));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 8px;
        }

        .service-roi-label {
          font-family: var(--display);
          font-size: 13px;
          font-weight: 600;
          color: var(--text);
          margin-bottom: 12px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .service-roi-desc {
          font-family: var(--body);
          font-size: 13px;
          line-height: 1.6;
          color: var(--text-s);
          font-weight: 300;
        }

        /* ── Integrations ── */
        .integrations-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 16px;
        }

        .integration-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 24px 16px;
          background: rgba(10,15,20,0.3);
          border: 1px solid rgba(255,255,255,0.04);
          border-radius: 12px;
          transition: border-color 0.3s ease, transform 0.3s ease;
        }

        .integration-card:hover {
          border-color: rgba(15,159,112,0.2);
          transform: translateY(-2px);
        }

        .integration-icon {
          font-size: 28px;
        }

        .integration-name {
          font-family: var(--display);
          font-size: 12px;
          font-weight: 600;
          color: var(--text);
          text-align: center;
        }

        .integration-category {
          font-family: var(--body);
          font-size: 9px;
          color: var(--text-m);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        /* ── FAQ ── */
        .faq-list {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .faq-item {
          background: rgba(10, 15, 20, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 12px;
          padding: 32px;
        }

        .faq-item h3 {
          font-family: var(--display);
          font-size: 16px;
          font-weight: 600;
          color: var(--text);
          margin-bottom: 12px;
        }

        .faq-item p {
          font-family: var(--body);
          font-size: 14px;
          line-height: 1.6;
          color: var(--text-s);
          font-weight: 300;
        }

        /* ── Comparison and Flow Styles ── */
        .outcome-comparison-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
        }
        .comparison-col {
          padding: 40px;
          border-radius: 16px;
          background: rgba(10, 15, 20, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.04);
        }
        .manual-col {
          border-left: 3px solid #e74c3c;
        }
        .auto-col {
          border-left: 3px solid var(--em);
          background: rgba(15, 159, 112, 0.02);
        }
        .comparison-col h3 {
          font-family: var(--display);
          font-size: 20px;
          font-weight: 500;
          margin-bottom: 24px;
        }
        .manual-col h3 {
          color: #e74c3c;
        }
        .auto-col h3 {
          color: var(--em);
        }
        .comparison-col ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .comparison-col li {
          display: flex;
          gap: 16px;
          align-items: flex-start;
        }
        .bullet-bad {
          color: #e74c3c;
          font-weight: bold;
          font-size: 16px;
          margin-top: 2px;
        }
        .bullet-good {
          color: var(--em);
          font-weight: bold;
          font-size: 16px;
          margin-top: 2px;
        }
        .comparison-col strong {
          font-family: var(--display);
          font-size: 15px;
          color: var(--text);
          display: block;
          margin-bottom: 4px;
        }
        .comparison-col p {
          font-family: var(--body);
          font-size: 13px;
          line-height: 1.5;
          color: var(--text-s);
          margin: 0;
        }

        .flow-steps-timeline {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          justify-content: space-between;
        }
        .flow-step-node {
          flex: 1;
          background: rgba(10, 15, 20, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 12px;
          padding: 24px;
          position: relative;
          transition: all 0.3s ease;
        }
        .flow-step-node:hover {
          border-color: rgba(15, 159, 112, 0.2);
          transform: translateY(-2px);
        }
        .node-number {
          font-family: var(--display);
          font-size: 32px;
          font-weight: 700;
          color: rgba(15, 159, 112, 0.15);
          position: absolute;
          top: 16px;
          right: 16px;
        }
        .node-content h4 {
          font-family: var(--display);
          font-size: 15px;
          font-weight: 600;
          color: var(--text);
          margin-top: 8px;
          margin-bottom: 12px;
        }
        .node-content p {
          font-family: var(--body);
          font-size: 12px;
          line-height: 1.5;
          color: var(--text-s);
          margin: 0;
        }
        .flow-step-arrow {
          font-size: 24px;
          color: rgba(15, 159, 112, 0.3);
          align-self: center;
          font-weight: 300;
        }

        /* ── Responsive ── */
        @media (max-width: 1200px) {
          .service-hero-grid {
            grid-template-columns: 1fr !important;
            gap: 48px;
          }
          .caps-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .service-roi-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 24px;
          }
          .case-snapshot-grid {
            grid-template-columns: 1fr !important;
            gap: 40px;
          }
          .problem-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 992px) {
          .flow-steps-timeline {
            flex-direction: column;
            gap: 20px;
          }
          .flow-step-arrow {
            transform: rotate(90deg);
            margin: 0 auto;
          }
        }

        @media (max-width: 768px) {
          .outcome-comparison-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
          .caps-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          .service-roi-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          .problem-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          .faq-item {
            padding: 24px;
          }
          .hero-trust-row {
            gap: 12px;
          }
          .integrations-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
          }
          .integration-card {
            padding: 16px 10px;
          }
          .integration-name {
            font-size: 10px;
          }
          .related-cases-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
        }

        /* ── Related Case Studies ── */
        .related-cases-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        .related-case-card {
          background: rgba(10, 15, 20, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 14px;
          padding: 28px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 260px;
          transition: all 0.4s var(--ease);
        }

        .related-case-card:hover {
          border-color: rgba(15, 159, 112, 0.25);
          transform: translateY(-4px);
          background: rgba(10, 15, 20, 0.5);
        }

        @media (max-width: 1024px) {
          .related-cases-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}} />

      {/* ── STRUCTURED DATA ─── */}
      <JsonLd data={buildServiceSchema({
        title: service.title,
        slug: service.slug,
        tagline: (service as any).tagline,
        description: (service as any).description,
        category: service.category,
        updatedAt: (service as any).updatedAt,
      })} />
      {(() => {
        const faqs: { question: string; answer: string }[] = (service as any).faqs || []
        return faqs.length > 0 ? <JsonLd data={buildFAQSchema(faqs)} /> : null
      })()}
      <JsonLd data={buildBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Services', url: '/services' },
        { name: service.title, url: `/services/${service.slug}` },
      ])} />
    </>
  )
}
