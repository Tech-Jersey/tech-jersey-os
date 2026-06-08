import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import ArticleList from '@/components/ArticleList'

export const metadata = {
  title: 'Journal — Tech Jersey',
  description: 'Architecture breakdowns, system playbooks, and engineering insights from Tech Jersey Studio.',
}

export default function JournalPage() {
  return (
    <>
      <Header />

      <section style={{ paddingTop: 240, paddingBottom: 100 }}>
        <div className="container">
          <h1 style={{ fontFamily: 'var(--display)', fontWeight: 300, fontSize: 'clamp(48px,8vw,100px)', letterSpacing: -2 }}>
            The{' '}
            <span style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', color: 'var(--text-s)' }}>Journal.</span>
          </h1>
        </div>
      </section>

      <section style={{ paddingBottom: 240 }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 120, alignItems: 'start' }}>

            {/* Articles — Client Component handles the hover interaction */}
            <ArticleList />

            {/* Sidebar */}
            <div style={{ position: 'sticky', top: 120 }}>
              <div style={{ marginBottom: 64 }}>
                <h3 style={{ fontFamily: 'var(--display)', fontSize: 24, fontWeight: 400, marginBottom: 24, letterSpacing: -0.5 }}>Build Your System</h3>
                <p style={{ fontSize: 15, color: 'var(--text-s)', lineHeight: 1.6, fontWeight: 300, marginBottom: 32 }}>We analyze your lead flow and design custom infrastructure.</p>
                <Link href="/contact" className="btn-primary" style={{ width: '100%', justifyContent: 'center', display: 'flex' }}>Request Consultation</Link>
              </div>
              <div>
                <h3 style={{ fontFamily: 'var(--display)', fontSize: 24, fontWeight: 400, marginBottom: 24, letterSpacing: -0.5 }}>Editorial Dispatch</h3>
                <p style={{ fontSize: 15, color: 'var(--text-s)', lineHeight: 1.6, fontWeight: 300, marginBottom: 32 }}>Architecture breakdowns and system playbooks. No marketing noise.</p>
                <input className="lux-input" type="email" placeholder="Email address" style={{ fontSize: 16, padding: '12px 0', marginBottom: 16 }} />
                <button className="btn-secondary" style={{ width: '100%', padding: 14 }}>Subscribe</button>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
