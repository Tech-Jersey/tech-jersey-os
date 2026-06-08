import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import RichText from '@/components/RichText'
import { getCaseStudyBySlug, getCaseStudies } from '@/lib/payload-utils'
import StickyAuditCTA from '@/components/StickyAuditCTA'
import LinkCTA from '@/components/LinkCTA'
import MetricCounter from '@/components/case-study/MetricCounter'
import ProcessPipeline from '@/components/case-study/ProcessPipeline'
import DeploymentTimeline from '@/components/case-study/DeploymentTimeline'
import CaseStudyCompactCard from '@/components/CaseStudyCompactCard'
import { JsonLd } from '@/components/seo/JsonLd'
import { buildArticleSchema, buildBreadcrumbSchema } from '@/lib/schema'

interface PageProps {
  params: Promise<{ slug: string }>
}

// ── Static Params: pre-render all case studies at build time ─────────────
export const revalidate = 300

export async function generateStaticParams() {
  try {
    const docs = await getCaseStudies()
    return (docs || []).map((cs: any) => ({ slug: cs.slug }))
  } catch {
    // DB may not be migrated yet — fall back to SSR
    return []
  }
}

// ── Dynamic SEO Metadata ───────────────────────────────────────────────
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const cs = await getCaseStudyBySlug(slug)
  if (!cs) return { title: 'Case Study Not Found' }

  const title = (cs as any).seo?.title || `${cs.client} Case Study — AI Automation Results | Tech Jersey Studio`
  const description = (cs as any).seo?.description || cs.summary || `See how Tech Jersey Studio transformed ${cs.client}'s operations with AI automation.`
  const industryLabel = (cs as any).industry?.replace(/-/g, ' ')

  return {
    title,
    description,
    keywords: [cs.client, 'AI automation case study', industryLabel, 'Tech Jersey Studio'].filter(Boolean) as string[],
    openGraph: {
      title,
      description,
      type: 'article',
      url: `https://techjersey.studio/case-studies/${slug}`,
      tags: ['AI Automation', 'Case Study', industryLabel, 'Tech Jersey'].filter(Boolean) as string[],
    },
    twitter: { card: 'summary_large_image' },
    alternates: { canonical: `https://techjersey.studio/case-studies/${slug}` },
  }
}

// ── Page ────────────────────────────────────────────────────────────────────

export default async function CaseStudyDetailPage({ params }: PageProps) {
  const { slug } = await params
  const cs = await getCaseStudyBySlug(slug)

  if (!cs) return notFound()

  const caseStudy = cs as any
  const relatedServices = caseStudy.relatedServices || []
  const metrics = caseStudy.metrics || []
  const processSteps = caseStudy.processSteps || []
  const timeline = caseStudy.timeline || []
  const founderQuote = caseStudy.founderQuote
  const accentColor = caseStudy.accentColor || 'var(--em)'
  const industryLabel = caseStudy.industry
    ? caseStudy.industry.replace('-', ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())
    : 'Deployment'

  return (
    <>
      <Header />

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section style={{ paddingTop: 160, paddingBottom: 80, position: 'relative', overflow: 'hidden' }}>
        {/* Subtle accent glow */}
        <div style={{
          position: 'absolute', top: 0, right: 0,
          width: 600, height: 600,
          background: `radial-gradient(circle, ${accentColor === 'var(--em)' ? 'rgba(15,159,112,0.06)' : accentColor + '10'} 0%, transparent 70%)`,
          pointerEvents: 'none',
        }} />

        <div className="container">
          {/* Breadcrumb */}
          <div style={{ marginBottom: 32 }}>
            <Link
              href="/case-studies"
              style={{ color: 'var(--text-m)', fontSize: 12, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}
              className="cs-back-link"
            >
              ← All Case Studies
            </Link>
          </div>

          <div className="cs-hero-grid">
            {/* Left — headline content */}
            <div className="glass-content-box" style={{ padding: '40px 48px' }}>
              <div style={{ marginBottom: 20 }}>
                <span style={{
                  fontSize: 9, fontWeight: 700, letterSpacing: 2.5,
                  textTransform: 'uppercase', color: accentColor,
                  borderBottom: `1px solid ${accentColor}40`,
                  paddingBottom: 6, display: 'inline-block',
                }}>
                  Client Case Study · {industryLabel}
                </span>
              </div>

              <h1 style={{
                fontFamily: 'var(--display)', fontWeight: 300,
                fontSize: 'clamp(32px, 5vw, 56px)', lineHeight: 1.1,
                letterSpacing: -1.5, marginBottom: 24, color: 'var(--text)',
              }}>
                {caseStudy.client}
              </h1>

              {caseStudy.summary && (
                <p style={{ fontSize: 17, lineHeight: 1.65, color: 'var(--text-s)', fontWeight: 300 }}>
                  {caseStudy.summary}
                </p>
              )}

              {/* Service tags */}
              {relatedServices.length > 0 && (
                <div style={{ marginTop: 28, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {relatedServices.map((svc: any) => (
                    <Link
                      key={svc.id}
                      href={`/services/${svc.slug}`}
                      style={{
                        fontSize: 10, fontWeight: 600, letterSpacing: 1.5,
                        textTransform: 'uppercase', color: 'var(--text-m)',
                        border: '1px solid var(--border)', padding: '5px 12px',
                        borderRadius: 4, textDecoration: 'none',
                        transition: 'color 0.2s, border-color 0.2s',
                      }}
                      className="cs-service-tag"
                    >
                      {svc.title?.split('.')[0] || svc.slug}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Right — animated metrics */}
            {metrics.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {metrics.slice(0, 4).map((m: any, idx: number) => (
                  <MetricCounter
                    key={idx}
                    value={m.value}
                    label={m.label}
                    context={m.context}
                    delay={idx * 120}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── CHALLENGE VS SOLUTION ──────────────────────────────────────── */}
      <section style={{ padding: '80px 0', background: 'var(--bg-surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div className="cs-two-col">
            {/* Challenge */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
                <span style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(231,76,60,0.12)', border: '1px solid rgba(231,76,60,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: '#e74c3c', fontWeight: 700 }}>✕</span>
                <h2 style={{ fontFamily: 'var(--display)', fontSize: 20, fontWeight: 600, color: '#e74c3c', margin: 0 }}>The Challenge</h2>
              </div>
              <div className="cs-richtext-box">
                <RichText content={caseStudy.challenge} />
              </div>
            </div>

            {/* Solution */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
                <span style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(15,159,112,0.12)', border: '1px solid rgba(15,159,112,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: 'var(--em)', fontWeight: 700 }}>✓</span>
                <h2 style={{ fontFamily: 'var(--display)', fontSize: 20, fontWeight: 600, color: 'var(--em)', margin: 0 }}>The Solution</h2>
              </div>
              <div className="cs-richtext-box">
                <RichText content={caseStudy.solution} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOUNDER / STUDIO QUOTE ─────────────────────────────────────── */}
      {founderQuote?.quote && (
        <section style={{ padding: '64px 0', background: 'var(--bg)' }}>
          <div className="container-narrow">
            <figure style={{ margin: 0, textAlign: 'center' }}>
              <svg width="32" height="24" viewBox="0 0 32 24" fill="none" style={{ margin: '0 auto 20px', display: 'block', opacity: 0.3 }}>
                <path d="M0 24V14.4C0 10.56 0.96 7.28 2.88 4.56C4.8 1.76 7.6 0.08 11.28 0L12 2.4C10 2.88 8.36 3.92 7.08 5.52C5.88 7.12 5.28 8.96 5.28 11.04H10.08V24H0ZM18.72 24V14.4C18.72 10.56 19.68 7.28 21.6 4.56C23.52 1.76 26.32 0.08 30 0L30.72 2.4C28.72 2.88 27.08 3.92 25.8 5.52C24.6 7.12 24 8.96 24 11.04H28.8V24H18.72Z" fill="var(--text)" />
              </svg>
              <blockquote style={{
                fontFamily: 'var(--serif)',
                fontStyle: 'italic',
                fontSize: 'clamp(18px, 2.5vw, 26px)',
                lineHeight: 1.55,
                color: 'var(--text)',
                fontWeight: 400,
                marginBottom: 24,
              }}>
                {founderQuote.quote}
              </blockquote>
              {founderQuote.attribution && (
                <figcaption style={{ fontSize: 12, color: 'var(--text-m)', fontStyle: 'normal', letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 600 }}>
                  — {founderQuote.attribution}
                </figcaption>
              )}
            </figure>
          </div>
        </section>
      )}

      {/* ── SYSTEM ARCHITECTURE PIPELINE ──────────────────────────────── */}
      <section style={{ padding: '100px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: accentColor, display: 'block', marginBottom: 12 }}>
              System Architecture
            </span>
            <h2 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 300, letterSpacing: -1, marginBottom: 0 }}>
              Custom Deployed Architecture
            </h2>
          </div>

          <ProcessPipeline steps={processSteps} accentColor={accentColor === 'var(--em)' ? undefined : accentColor} />
        </div>
      </section>

      {/* ── DEPLOYMENT TIMELINE ────────────────────────────────────────── */}
      {timeline.length > 0 && (
        <section style={{ padding: '0 0 100px 0' }}>
          <div className="container">
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 64 }}>
              <div style={{ marginBottom: 40 }}>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--text-m)', display: 'block', marginBottom: 8 }}>
                  Deployment Diary
                </span>
                <h3 style={{ fontFamily: 'var(--display)', fontSize: 24, fontWeight: 400, letterSpacing: -0.5, margin: 0 }}>
                  How We Got There
                </h3>
              </div>
              <DeploymentTimeline events={timeline} />
            </div>
          </div>
        </section>
      )}

      {/* ── RESULTS NARRATIVE ──────────────────────────────────────────── */}
      {caseStudy.resultsNarrative && (
        <section style={{ padding: '60px 0 100px 0', background: 'var(--bg-surface)', borderTop: '1px solid var(--border)' }}>
          <div className="container-narrow">
            <h3 style={{ fontFamily: 'var(--display)', fontSize: 22, fontWeight: 500, marginBottom: 32, letterSpacing: -0.5 }}>
              The Outcome
            </h3>
            <div className="cs-richtext-box">
              <RichText content={caseStudy.resultsNarrative} />
            </div>
          </div>
        </section>
      )}

      {/* ── AUDIT CTA STRIP ────────────────────────────────────────────── */}
      <section style={{ padding: '60px 0' }}>
        <div className="container">
          <div className="cs-cta-box">
            <div>
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: accentColor, display: 'block', marginBottom: 10 }}>
                Automation Readiness
              </span>
              <h3 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 400, letterSpacing: -0.5, marginBottom: 10 }}>
                Could your business see similar results?
              </h3>
              <p style={{ fontSize: 14, color: 'var(--text-s)', fontWeight: 300, maxWidth: 480, lineHeight: 1.6, margin: 0 }}>
                Take the 2-minute AI Audit. Receive your Automation Readiness Score, top opportunities, and exact systems to implement — instantly.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <LinkCTA
                href="/audit"
                id={`cs-${slug}-audit-cta`}
                className="btn-primary"
                location="case_study_mid"
                style={{ background: 'linear-gradient(135deg,var(--em),#4fffca)', color: '#000', border: 'none', fontWeight: 700, whiteSpace: 'nowrap' }}
              >
                Start Free Audit →
              </LinkCTA>
              <span style={{ fontSize: 10, color: 'var(--text-m)' }}>≈ 2 Minutes · Instant Score</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── RELATED SERVICES ───────────────────────────────────────────── */}
      {relatedServices.length > 0 && (
        <section style={{ padding: '60px 0 120px 0', borderTop: '1px solid var(--border)' }}>
          <div className="container">
            <h3 style={{ fontFamily: 'var(--display)', fontSize: 20, fontWeight: 500, marginBottom: 28, letterSpacing: -0.5 }}>
              Deployed Studio Capabilities
            </h3>
            <div className="cs-related-grid">
              {relatedServices.map((service: any) => (
                <Link key={service.id} href={`/services/${service.slug}`} className="cs-related-card">
                  <h4>{service.title?.split('.')[0] || service.slug}</h4>
                  {service.tagline && <p>{service.tagline}</p>}
                  <span className="cs-related-arrow">Build This System →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
      <StickyAuditCTA />

      {/* ── STYLES ─────────────────────────────────────────────────────── */}
      <style dangerouslySetInnerHTML={{ __html: `
        .cs-back-link:hover { color: var(--text) !important; }

        .cs-hero-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 48px;
          align-items: start;
        }

        .cs-service-tag:hover {
          color: var(--text) !important;
          border-color: var(--border-light) !important;
        }

        .cs-two-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
        }

        .cs-richtext-box {
          background: rgba(10, 15, 20, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.03);
          border-radius: 12px;
          padding: 32px;
        }

        .cs-cta-box {
          background: rgba(15, 159, 112, 0.04);
          border: 1px solid rgba(15, 159, 112, 0.15);
          border-radius: 20px;
          padding: 40px 48px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 40px;
        }

        .cs-related-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .cs-related-card {
          background: rgba(10, 15, 20, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 12px;
          padding: 24px;
          text-decoration: none;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 160px;
          transition: all 0.3s ease;
        }

        .cs-related-card:hover {
          border-color: rgba(15, 159, 112, 0.2);
          transform: translateY(-2px);
        }

        .cs-related-card h4 {
          font-family: var(--display);
          font-size: 14px;
          font-weight: 600;
          color: var(--text);
          margin: 0 0 8px;
        }

        .cs-related-card p {
          font-size: 12px;
          color: var(--text-m);
          line-height: 1.4;
          margin: 0 0 16px;
          flex-grow: 1;
        }

        .cs-related-arrow {
          font-size: 11px;
          color: var(--em);
          font-weight: 600;
        }

        @media (max-width: 1024px) {
          .cs-hero-grid { grid-template-columns: 1fr; gap: 32px; }
          .cs-two-col { grid-template-columns: 1fr; gap: 40px; }
          .cs-cta-box { flex-direction: column; padding: 32px; text-align: center; }
          .cs-related-grid { grid-template-columns: 1fr 1fr; }
        }

        @media (max-width: 640px) {
          .cs-related-grid { grid-template-columns: 1fr; }
          .cs-cta-box { padding: 24px; }
        }
      ` }} />

      {/* ── STRUCTURED DATA ─── */}
      <JsonLd data={buildArticleSchema({
        client: caseStudy.client,
        slug,
        summary: caseStudy.summary,
        updatedAt: caseStudy.updatedAt,
        createdAt: caseStudy.createdAt,
      })} />
      <JsonLd data={buildBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Case Studies', url: '/case-studies' },
        { name: caseStudy.client, url: `/case-studies/${slug}` },
      ])} />
    </>
  )
}
