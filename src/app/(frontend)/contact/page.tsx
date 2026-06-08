import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AuditFunnel from '@/components/audit/AuditFunnel'
import BriefForm from '@/components/contact/BriefForm'
import '../audit/audit.css'

export const metadata: Metadata = {
  title: 'Contact & Free AI Audit | Tech Jersey',
  description:
    'Get your free AI Automation Audit in 3 minutes, or send a project brief directly. Tech Jersey builds automation systems, AI tools, and custom websites for Indian businesses.',
}

// ─────────────────────────────────────────────────────────────────────────────
// CONTACT PAGE
// Primary path: AuditFunnel (high-intent conversion)
// Secondary path: Send Brief form (collapsed, available via tab/anchor)
// ─────────────────────────────────────────────────────────────────────────────

export default function ContactPage() {
  return (
    <>
      <Header />

      <main style={{ paddingTop: 100, paddingBottom: 0 }}>

        {/* TAB SELECTOR */}
        <div style={{ borderBottom: '1px solid var(--border)', paddingTop: 40 }}>
          <div className="container">
            <div style={{ display: 'flex', gap: 0, marginBottom: -1 }}>
              <a
                href="#audit"
                style={{
                  padding: '14px 28px',
                  borderBottom: '2px solid var(--em)',
                  color: 'var(--text)',
                  fontFamily: 'var(--body)',
                  fontSize: 14,
                  fontWeight: 600,
                  textDecoration: 'none',
                  letterSpacing: 0.5,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span style={{ fontSize: 16 }}>🤖</span> Free AI Audit
                <span style={{
                  background: 'var(--em)',
                  color: '#000',
                  fontSize: 9,
                  fontWeight: 800,
                  letterSpacing: 1,
                  padding: '2px 8px',
                  borderRadius: 100,
                  textTransform: 'uppercase',
                }}>Recommended</span>
              </a>
              <a
                href="#brief"
                style={{
                  padding: '14px 28px',
                  borderBottom: '2px solid transparent',
                  color: 'var(--text-s)',
                  fontFamily: 'var(--body)',
                  fontSize: 14,
                  fontWeight: 400,
                  textDecoration: 'none',
                  letterSpacing: 0.5,
                }}
              >
                Send a Brief
              </a>
            </div>
          </div>
        </div>

        {/* AUDIT FUNNEL (Primary) */}
        <div id="audit">
          <div className="audit-hero" style={{ paddingTop: 56 }}>
            <div className="audit-hero-label">Free · 3 Minutes · Instant Results</div>
            <h1>
              Your Free AI <em>Automation Audit</em>
            </h1>
            <p>
              Answer 8 questions. Get your{' '}
              <strong style={{ color: 'var(--text)', fontWeight: 500 }}>
                Automation Readiness Score
              </strong>
              , top opportunities, and the exact systems that will save you time and money.
            </p>
          </div>
          <AuditFunnel />
        </div>

        {/* DIVIDER */}
        <div style={{ height: 1, background: 'var(--border)', margin: '80px 0 0' }} />

        {/* SEND A BRIEF (Secondary) */}
        <div id="brief" style={{ paddingTop: 80, paddingBottom: 120 }}>
          <div className="container">
            <div style={{ maxWidth: 720, margin: '0 auto' }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', color: 'var(--text-m)', marginBottom: 16 }}>
                Prefer to write?
              </div>
              <h2 style={{ fontFamily: 'var(--display)', fontWeight: 300, fontSize: 'clamp(32px,5vw,56px)', letterSpacing: -1.5, marginBottom: 40, lineHeight: 1.1 }}>
                Send a{' '}
                <span style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', color: 'var(--text-s)' }}>
                  brief.
                </span>
              </h2>

              <BriefForm />

              <div style={{ marginTop: 64, paddingTop: 40, borderTop: '1px solid var(--border)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--text-m)', marginBottom: 10 }}>Direct Consultation</div>
                    <a href="https://wa.me/917357971717" target="_blank" rel="noopener" style={{ fontFamily: 'var(--display)', fontSize: 22, fontWeight: 400, color: 'var(--text)' }}>+91 73579 71717</a>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--text-m)', marginBottom: 10 }}>Engineering Support</div>
                    <a href="mailto:tech.jersey.d@gmail.com" style={{ fontFamily: 'var(--display)', fontSize: 18, fontWeight: 400, color: 'var(--text)' }}>tech.jersey.d@gmail.com</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </main>

      <Footer />
    </>
  )
}
