import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getPageBySlug, getFeaturedTestimonials, getFeaturedCaseStudies } from '@/lib/payload-utils'
import StickyAuditCTA from '@/components/StickyAuditCTA'
import LinkCTA from '@/components/LinkCTA'
import { JsonLd } from '@/components/seo/JsonLd'
import { buildOrganizationSchema, buildWebSiteSchema } from '@/lib/schema'

// ── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'Tech Jersey Studio — AI Automation Systems for Modern Enterprises',
  description:
    'Tech Jersey Studio builds AI automation systems, WhatsApp pipelines, CRM engines, and business operating systems for modern enterprises across India, UAE, and Southeast Asia.',
  keywords: ['AI automation India', 'WhatsApp automation', 'n8n automation agency', 'CRM automation', 'business operating system', 'AI tools India'],
  openGraph: {
    title: 'Tech Jersey Studio — AI Automation & Business Systems',
    description: 'AI automation systems, WhatsApp pipelines, CRM engines for modern enterprises.',
    url: 'https://techjersey.studio',
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
  alternates: { canonical: 'https://techjersey.studio' },
}

export default async function HomePage() {
  const pageData = await getPageBySlug('home')
  const testimonials = await getFeaturedTestimonials()
  const featuredCaseStudies = await getFeaturedCaseStudies()

  // Find blocks if they exist in Payload
  const heroBlock = pageData?.content?.find((b: any) => b.blockType === 'hero')
  
  // Rebuilt conversion copy around business outcomes
  const heroHeadline = "We build AI systems that buy back your time & scale operations."
  const heroDesc = "Tech Jersey engineers high-performance WhatsApp automation, bespoke enterprise pipelines, and autonomous AI systems. We replace fragile manual processes with reliable, sub-second logic."

  return (
    <>
      <Header />

      {/* HERO SECTION */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', paddingTop: 120, paddingBottom: 60, overflow: 'hidden' }}>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="glass-content-box" style={{ maxWidth: 900 }}>
            <span className="serif-italic" style={{ color: 'var(--em)', fontSize: 13, letterSpacing: 3, textTransform: 'uppercase', display: 'block', marginBottom: 20 }}>
              AI AUTOMATION & OPERATING SYSTEMS
            </span>
            <h1 style={{
              fontFamily: 'var(--display)', fontWeight: 300,
              fontSize: 'clamp(42px, 5.5vw, 88px)', lineHeight: 1.1,
              letterSpacing: -2, marginBottom: 32,
            }}>
              We build <span className="serif-italic" style={{ color: 'var(--text-s)', fontWeight: 400 }}>AI systems</span> that buy back your time & scale margins.
            </h1>
            <p style={{ fontSize: 18, lineHeight: 1.6, color: 'var(--text-s)', fontWeight: 300, marginBottom: 40, maxWidth: 720 }}>
              {heroDesc}
            </p>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap', marginBottom: 40 }}>
              <LinkCTA
                href="/audit"
                id="hero-audit-cta"
                className="btn-primary"
                location="hero"
                style={{ background: 'linear-gradient(135deg,var(--em),#4fffca)', color: '#000', border: 'none', fontWeight: 700 }}
              >
                🤖 Start Free AI Audit
              </LinkCTA>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Link href="/contact" className="btn-secondary" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  Build Your System →
                </Link>
                <span style={{ fontSize: 11, color: 'var(--text-m)', marginTop: 4 }}>
                  ≈ 2 Minute Audit · Instant score
                </span>
              </div>
            </div>

            {/* HERO SOCIAL PROOF ROW */}
            <div className="hero-social-proof-row">
              <div className="social-proof-item">
                <span className="proof-check">✓</span>
                <span className="proof-text">12+ Enterprises Optimized</span>
              </div>
              <div className="social-proof-item">
                <span className="proof-check">✓</span>
                <span className="proof-text">₹40L+ Client Revenue Unlocked</span>
              </div>
              <div className="social-proof-item">
                <span className="proof-check">✓</span>
                <span className="proof-text">ISO-grade Logic Compliance</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INDUSTRY TRUST GRID */}
      <section style={{ padding: '120px 0', background: 'var(--bg-surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', position: 'relative' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 80 }}>
            <span className="section-label" style={{ color: 'var(--em)', letterSpacing: 3 }}>Capabilities</span>
            <h2 className="section-title" style={{ marginTop: 16, marginBottom: 20 }}>
              Trusted Across High-Growth Industries
            </h2>
            <p className="section-desc" style={{ margin: '0 auto', maxWidth: 760 }}>
              We design AI systems, automation workflows, and business operations infrastructure for teams that need scale, speed, and reliability.
            </p>
          </div>

          <div className="industry-grid">
            {/* E-Commerce */}
            <div className="industry-card">
              <div className="industry-icon-wrapper">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
              </div>
              <h3>E-Commerce</h3>
              <p>Automated cart recovery pipelines, dynamic discounts, and 24/7 WhatsApp concierge systems that convert drops into sales.</p>
            </div>

            {/* Healthcare */}
            <div className="industry-card">
              <div className="industry-icon-wrapper">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
              </div>
              <h3>Healthcare</h3>
              <p>Automated patient intake, immediate qualification checks, and secure appointment scheduling integrations on Cloud API.</p>
            </div>

            {/* Real Estate */}
            <div className="industry-card">
              <div className="industry-icon-wrapper">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M8 10h.01"/><path d="M16 10h.01"/><path d="M8 14h.01"/><path d="M16 14h.01"/></svg>
              </div>
              <h3>Real Estate</h3>
              <p>Instant buyer matching, automated property brochure dispatches via WhatsApp, and live calendar routing for high-intent leads.</p>
            </div>

            {/* Education */}
            <div className="industry-card">
              <div className="industry-icon-wrapper">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/></svg>
              </div>
              <h3>Education</h3>
              <p>Automated course admission pipelines, dynamic lead nurturing sequences, and integrated support bots for active students.</p>
            </div>

            {/* Manufacturing */}
            <div className="industry-card">
              <div className="industry-icon-wrapper">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
              </div>
              <h3>Manufacturing</h3>
              <p>Operational workflow notifications, direct machine logs dispatch, and supply chain status updates mapped directly into ERPs.</p>
            </div>

            {/* Logistics */}
            <div className="industry-card">
              <div className="industry-icon-wrapper">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="2" ry="2"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
              </div>
              <h3>Logistics</h3>
              <p>Real-time delivery status alerts, automated waybill generation triggers, and instant support channels for delivery agents.</p>
            </div>

            {/* Hospitality */}
            <div className="industry-card">
              <div className="industry-icon-wrapper">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 17H2a2 2 0 0 0 2-2V9a8 8 0 0 1 16 0v6a2 2 0 0 0 2 2z"/><path d="M12 2v3"/><path d="M9 22h6"/></svg>
              </div>
              <h3>Hospitality</h3>
              <p>Automated guest check-in reminders, digital concierge WhatsApp bots, and post-stay feedback collection routines.</p>
            </div>

            {/* Professional Services */}
            <div className="industry-card">
              <div className="industry-icon-wrapper">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
              </div>
              <h3>Professional Services</h3>
              <p>Automated client onboarding, smart bill reminder workflows, and AI contracts evaluation systems to speed up sales.</p>
            </div>
          </div>
        </div>
      </section>

      {/* RESULTS / ROI SECTION */}
      <section style={{ padding: '140px 0', position: 'relative', overflow: 'hidden' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 80 }}>
            <span className="section-label" style={{ color: 'var(--em)', letterSpacing: 3 }}>Proven Returns</span>
            <h2 className="section-title" style={{ marginTop: 16 }}>Operational Performance Metrics</h2>
            <p className="section-desc" style={{ margin: '0 auto' }}>
              We design our systems to yield positive ROI in weeks. These are the average metrics registered across our portfolio.
            </p>
          </div>

          <div className="results-roi-grid">
            <div className="results-roi-card">
              <div className="roi-number">₹1.8L+</div>
              <div className="roi-label">Avg. Monthly Savings</div>
              <p>Calculated by subtracting AI execution costs from average employee labor rates for manual message dispatch.</p>
            </div>

            <div className="results-roi-card">
              <div className="roi-number">98.4%</div>
              <div className="roi-label">AI Logic Accuracy</div>
              <p>Consistent, error-free parsing of user intents, document items, and data updates without operational delay.</p>
            </div>

            <div className="results-roi-card">
              <div className="roi-number">4.8 Hrs</div>
              <div className="roi-label">Daily Saved Per Employee</div>
              <p>Time bought back by outsourcing qualifying questions, data entry tasks, and routine client follow-ups.</p>
            </div>

            <div className="results-roi-card">
              <div className="roi-number">100%</div>
              <div className="roi-label">Autonomous Lead Triage</div>
              <p>Every lead is scored, analyzed for readiness, and instantly routed to the appropriate CRM stage without manual review.</p>
            </div>
          </div>
        </div>
      </section>

      {/* DYNAMIC TESTIMONIALS SECTION */}
      {testimonials && testimonials.length > 0 && (
        <section style={{ padding: '120px 0', background: 'var(--bg-surface)', borderTop: '1px solid var(--border)', position: 'relative' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: 80 }}>
              <span className="section-label" style={{ color: 'var(--em)', letterSpacing: 3 }}>Reviews</span>
              <h2 className="section-title" style={{ marginTop: 16 }}>What Our Clients Say</h2>
              <p className="section-desc" style={{ margin: '0 auto' }}>
                Real outcomes achieved by modern businesses powered by Tech Jersey operational infrastructure.
              </p>
            </div>

            <div className="testimonials-grid">
              {testimonials.map((t: any) => {
                // Determine initials for avatar fallback
                const initials = t.name
                  ? t.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
                  : 'TJ';
                
                return (
                  <div key={t.id} className="testimonial-card">
                    {/* Stars logic - only render ratings if ratings exist in CMS data */}
                    {t.rating && (
                      <div className="stars-row">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} className={`star ${i < parseInt(t.rating, 10) ? 'filled' : 'empty'}`}>
                            {i < parseInt(t.rating, 10) ? '★' : '☆'}
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="testimonial-quote">“{t.quote}”</p>
                    <div className="testimonial-author">
                      <div className="testimonial-avatar-fallback">
                        {initials}
                      </div>
                      <div className="testimonial-meta">
                        <span className="author-name">{t.name}</span>
                        <span className="author-title">
                          {t.role}{t.company ? ` at ${t.company}` : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
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
                How much revenue are you <em style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', color: 'var(--text-s)' }}>leaking?</em>
              </h2>
              <p style={{ fontSize: 15, color: 'var(--text-s)', fontWeight: 300, maxWidth: 480 }}>
                Take the 8-question AI Automation Audit. Get an instant Automation Readiness Score, your top opportunities, and exact systems to implement.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6 }}>
              <LinkCTA
                href="/audit"
                id="mid-page-audit-cta"
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

      {/* FEATURED CASE STUDIES — Premium Alternating Layout */}
      {featuredCaseStudies && featuredCaseStudies.length > 0 && (
        <section style={{ padding: '160px 0 120px 0' }}>
          <div className="container">
            {/* Section header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 80 }}>
              <div>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--em)', display: 'block', marginBottom: 16 }}>
                  Proven Deployments
                </span>
                <h2 style={{
                  fontFamily: 'var(--display)', fontSize: 'clamp(32px, 5vw, 56px)',
                  fontWeight: 300, letterSpacing: -1.5, marginBottom: 0, lineHeight: 1.1
                }}>
                  Client{' '}
                  <span className="serif-italic" style={{ color: 'var(--text-s)', fontWeight: 400 }}>
                    Case Studies
                  </span>
                </h2>
              </div>
              <Link href="/case-studies" className="btn-secondary" style={{ fontSize: 13, whiteSpace: 'nowrap', flexShrink: 0 }}>
                View All Work →
              </Link>
            </div>

            {/* Alternating editorial rows */}
            <div className="home-case-rows">
              {(featuredCaseStudies as any[]).slice(0, 3).map((cs: any, idx: number) => {
                const metrics = cs.metrics || []
                const highlight = metrics[0] || { value: '100%', label: 'Impact' }
                const secondMetric = metrics[1]
                const industryLabel = cs.industry
                  ? cs.industry.replace('-', ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())
                  : 'Deployment'
                const isReversed = idx % 2 === 1

                return (
                  <div key={cs.id} className={`home-case-row ${isReversed ? 'reversed' : ''}`}>
                    {/* Metric panel */}
                    <div className="home-case-metric-panel">
                      <div className="home-case-big-metric">
                        <div className="hc-metric-value">{highlight.value}</div>
                        <div className="hc-metric-label">{highlight.label}</div>
                      </div>
                      {secondMetric && (
                        <div className="home-case-secondary-metric">
                          <div className="hc-metric-value2">{secondMetric.value}</div>
                          <div className="hc-metric-label2">{secondMetric.label}</div>
                        </div>
                      )}
                      <div className="hc-industry-badge">{industryLabel}</div>
                    </div>

                    {/* Content panel */}
                    <div className="home-case-content-panel">
                      <div style={{ marginBottom: 24 }}>
                        <span style={{
                          fontSize: 9, fontWeight: 700, letterSpacing: 2.5,
                          textTransform: 'uppercase', color: 'var(--em)',
                          borderBottom: '1px solid rgba(15,159,112,0.3)',
                          paddingBottom: 6, display: 'inline-block', marginBottom: 20,
                        }}>
                          Case Study {String(idx + 1).padStart(2, '0')}
                        </span>
                        <h3 style={{
                          fontFamily: 'var(--display)', fontSize: 'clamp(22px, 3vw, 36px)',
                          fontWeight: 400, color: 'var(--text)',
                          letterSpacing: -0.8, lineHeight: 1.2, marginBottom: 16,
                        }}>
                          {cs.client}
                        </h3>
                        <p style={{
                          fontSize: 15, lineHeight: 1.7, color: 'var(--text-s)',
                          fontWeight: 300, maxWidth: 440,
                        }}>
                          {cs.summary}
                        </p>
                      </div>

                      <Link
                        href={`/case-studies/${cs.slug}`}
                        className="home-case-read-link"
                      >
                        <span>Read Full Story</span>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Founder attribution line */}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 40, marginTop: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
              <span style={{ fontSize: 13, color: 'var(--text-m)', fontWeight: 300 }}>
                All systems designed and deployed by{' '}
                <Link href="/about" style={{ color: 'var(--text)', fontWeight: 600, textDecoration: 'none' }}>Dhruv</Link>
                {' '}— Founder, Tech Jersey Studio
              </span>
              <Link href="/case-studies" style={{ fontSize: 12, color: 'var(--em)', fontWeight: 600, textDecoration: 'none' }}>
                View all case studies →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* BOTTOM CTA */}
      <section style={{ textAlign: 'center', padding: '200px 0', background: 'var(--bg-surface)', position: 'relative', overflow: 'hidden' }}>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="glass-content-box" style={{ margin: '0 auto', maxWidth: 800 }}>
            <h2 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(36px, 5.5vw, 72px)', fontWeight: 300, letterSpacing: -2, marginBottom: 40, lineHeight: 1.1 }}>
              Stop managing.<br />
              <span className="serif-italic">Start engineering.</span>
            </h2>
            <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <LinkCTA
                  href="/audit"
                  id="footer-hero-audit-cta"
                  className="btn-primary"
                  location="footer"
                  style={{ background: 'linear-gradient(135deg,var(--em),#4fffca)', color: '#000', border: 'none', fontWeight: 700 }}
                >
                  Get Free Audit
                </LinkCTA>
                <span style={{ fontSize: 11, color: 'var(--text-m)' }}>
                  ≈ 2 Minute Audit
                </span>
              </div>
              <Link href="/contact" className="btn-secondary">Send Full Brief →</Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <StickyAuditCTA />
      
      {/* Dynamic CSS injected directly here to guarantee responsive styling without finding globals.css path */}
      <style dangerouslySetInnerHTML={{__html: `
        .glass-content-box {
          background: rgba(10, 15, 20, 0.65);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 24px;
          padding: 48px;
          box-shadow: 0 30px 60px rgba(0,0,0,0.4);
          position: relative;
          z-index: 2;
        }

        .hero-social-proof-row {
          display: flex;
          gap: 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          padding-top: 32px;
          margin-top: 40px;
          flex-wrap: wrap;
        }

        .social-proof-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .proof-check {
          color: var(--em);
          font-weight: bold;
          font-size: 14px;
        }

        .proof-text {
          font-family: var(--body);
          font-size: 13px;
          color: var(--text-s);
          font-weight: 400;
        }

        /* ── INDUSTRY TRUST GRID ── */
        .industry-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
          margin-top: 40px;
        }

        .industry-card {
          background: rgba(10, 15, 20, 0.4);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 16px;
          padding: 32px;
          transition: border-color 0.4s var(--ease), transform 0.4s var(--ease), background 0.4s var(--ease);
          cursor: pointer;
        }

        .industry-card:hover {
          border-color: rgba(15, 159, 112, 0.3);
          transform: translateY(-6px);
          background: rgba(10, 15, 20, 0.6);
        }

        .industry-icon-wrapper {
          color: var(--em);
          background: rgba(15, 159, 112, 0.06);
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
          border: 1px solid rgba(15, 159, 112, 0.12);
          transition: transform 0.3s ease;
        }

        .industry-card:hover .industry-icon-wrapper {
          transform: scale(1.05);
        }

        .industry-card h3 {
          font-family: var(--display);
          font-size: 18px;
          font-weight: 600;
          color: var(--text);
          margin-bottom: 12px;
        }

        .industry-card p {
          font-family: var(--body);
          font-size: 13px;
          line-height: 1.6;
          color: var(--text-s);
          font-weight: 300;
        }

        /* ── RESULTS ROI GRID ── */
        .results-roi-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }

        .results-roi-card {
          background: rgba(10, 15, 20, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 16px;
          padding: 40px 32px;
          transition: border-color 0.4s var(--ease), transform 0.4s var(--ease);
          cursor: pointer;
        }

        .results-roi-card:hover {
          border-color: rgba(15, 159, 112, 0.25);
          transform: translateY(-4px);
        }

        .roi-number {
          font-family: var(--display);
          font-size: 40px;
          font-weight: 700;
          background: linear-gradient(135deg, var(--text), var(--em));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 12px;
        }

        .roi-label {
          font-family: var(--display);
          font-size: 14px;
          font-weight: 600;
          color: var(--text);
          margin-bottom: 16px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .results-roi-card p {
          font-family: var(--body);
          font-size: 13px;
          line-height: 1.6;
          color: var(--text-s);
          font-weight: 300;
        }

        /* ── TESTIMONIALS GRID ── */
        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
        }

        .testimonial-card {
          background: rgba(10, 15, 20, 0.4);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 20px;
          padding: 40px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: border-color 0.3s ease;
        }

        .testimonial-card:hover {
          border-color: rgba(15, 159, 112, 0.2);
        }

        .stars-row {
          display: flex;
          gap: 4px;
          margin-bottom: 24px;
        }

        .star {
          font-size: 14px;
        }

        .star.filled {
          color: var(--em);
        }

        .star.empty {
          color: var(--text-m);
        }

        .testimonial-quote {
          font-family: var(--body);
          font-size: 15px;
          line-height: 1.7;
          color: var(--text-s);
          font-style: italic;
          font-weight: 300;
          margin-bottom: 32px;
          flex-grow: 1;
        }

        .testimonial-author {
          display: flex;
          align-items: center;
          gap: 16px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          padding-top: 24px;
        }

        .testimonial-avatar-fallback {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(15, 159, 112, 0.2), rgba(15, 159, 112, 0.05));
          border: 1px solid rgba(15, 159, 112, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--display);
          font-weight: 600;
          font-size: 13px;
          color: var(--text);
          letter-spacing: 0.5px;
          flex-shrink: 0;
        }

        .testimonial-meta {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .author-name {
          font-family: var(--display);
          font-size: 14px;
          font-weight: 600;
          color: var(--text);
        }

        .author-title {
          font-family: var(--body);
          font-size: 11px;
          color: var(--text-m);
          font-weight: 400;
        }

        /* ── FEATURED CASE STUDIES — Alternating Rows ── */
        .home-case-rows {
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .home-case-row {
          display: grid;
          grid-template-columns: 1fr 1.4fr;
          gap: 60px;
          align-items: center;
          padding: 64px 0;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .home-case-row.reversed {
          grid-template-columns: 1.4fr 1fr;
        }

        .home-case-row.reversed .home-case-metric-panel {
          order: 2;
        }

        .home-case-row.reversed .home-case-content-panel {
          order: 1;
        }

        .home-case-metric-panel {
          background: rgba(10, 15, 20, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 20px;
          padding: 48px 40px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .home-case-big-metric {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .hc-metric-value {
          font-family: var(--display);
          font-size: clamp(52px, 7vw, 80px);
          font-weight: 700;
          background: linear-gradient(135deg, var(--text), var(--em));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          line-height: 1;
          letter-spacing: -2px;
        }

        .hc-metric-label {
          font-size: 12px;
          color: var(--text-m);
          text-transform: uppercase;
          letter-spacing: 1.5px;
          font-weight: 500;
        }

        .home-case-secondary-metric {
          padding-top: 20px;
          border-top: 1px solid rgba(255,255,255,0.05);
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .hc-metric-value2 {
          font-family: var(--display);
          font-size: 28px;
          font-weight: 700;
          color: var(--em);
          line-height: 1;
        }

        .hc-metric-label2 {
          font-size: 10px;
          color: var(--text-m);
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 500;
        }

        .hc-industry-badge {
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--text-m);
          border: 1px solid rgba(255,255,255,0.06);
          padding: 5px 10px;
          border-radius: 4px;
          align-self: flex-start;
        }

        .home-case-content-panel {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .home-case-read-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 600;
          color: var(--em);
          text-decoration: none;
          transition: gap 0.25s ease;
        }

        .home-case-read-link:hover {
          gap: 14px;
        }

        @media (max-width: 1200px) {
          .industry-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .results-roi-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .testimonials-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 24px;
          }
          .home-case-row {
            grid-template-columns: 1fr 1fr;
            gap: 40px;
          }
          .home-case-row.reversed {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 768px) {
          .glass-content-box {
            padding: 32px;
          }
          
          .hero-social-proof-row {
            flex-direction: column;
            gap: 16px;
            padding-top: 24px;
            margin-top: 32px;
          }

          .industry-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .results-roi-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .testimonials-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .testimonial-card {
            padding: 24px;
          }

          .home-case-row {
            grid-template-columns: 1fr;
            gap: 28px;
            padding: 40px 0;
          }

          .home-case-row.reversed {
            grid-template-columns: 1fr;
          }

          .home-case-row.reversed .home-case-metric-panel,
          .home-case-row.reversed .home-case-content-panel {
            order: unset;
          }

          .home-case-metric-panel {
            padding: 32px 24px;
          }
        }

      `}} />

      {/* ── STRUCTURED DATA ─── */}
      <JsonLd data={buildOrganizationSchema()} />
      <JsonLd data={buildWebSiteSchema()} />
    </>
  )
}
