import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AuditFunnel from '@/components/audit/AuditFunnel'
import './audit.css'

// ─────────────────────────────────────────────────────────────────────────────
// SEO
// ─────────────────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'Free AI Automation Audit | Tech Jersey',
  description:
    'Discover your Automation Readiness Score in 3 minutes. Get a personalised report showing your top opportunities, recommended systems, and estimated monthly savings.',
  openGraph: {
    title: 'Free AI Automation Audit — Tech Jersey',
    description:
      'Take the 8-question audit and instantly receive your Automation Readiness Score, uncovered opportunities, and recommended AI systems.',
    type: 'website',
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function AuditPage() {
  return (
    <>
      <Header />

      <main className="audit-page">

        {/* Hero */}
        <div className="audit-hero">
          <div className="audit-hero-label">Free · 3 Minutes · Instant Results</div>
          <h1>
            Your Free AI{' '}
            <em>Automation Audit</em>
          </h1>
          <p>
            Answer 8 questions about your business. Get an instant{' '}
            <strong style={{ color: 'var(--text)', fontWeight: 500 }}>
              Automation Readiness Score
            </strong>
            , your top opportunities, and the exact systems that will save you time and money.
          </p>
        </div>

        {/* Funnel (Client Component) */}
        <AuditFunnel />

      </main>

      <Footer />
    </>
  )
}
