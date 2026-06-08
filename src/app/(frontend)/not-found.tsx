import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Page Not Found — Tech Jersey Studio',
  description: 'The page you are looking for does not exist. Explore our AI automation services or take the free audit.',
  robots: { index: false, follow: true },
}

const HELPFUL_LINKS = [
  { label: 'Home', href: '/', desc: 'Back to the main page' },
  { label: 'Services', href: '/services', desc: 'Our AI automation capabilities' },
  { label: 'Case Studies', href: '/case-studies', desc: 'Real client transformations' },
  { label: 'Blog', href: '/blog', desc: 'Systems, playbooks & insights' },
  { label: 'Resources', href: '/resources', desc: 'Free blueprints & guides' },
  { label: 'About', href: '/about', desc: 'Meet the founder' },
]

export default function NotFound() {
  return (
    <>
      <Header />

      <main style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', paddingTop: 120, paddingBottom: 120 }}>
        <div className="container" style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>

          <div style={{
            fontFamily: 'var(--serif)',
            fontStyle: 'italic',
            fontSize: 'clamp(80px, 15vw, 160px)',
            fontWeight: 400,
            color: 'var(--em)',
            opacity: 0.15,
            lineHeight: 1,
            marginBottom: 24,
          }}>
            404
          </div>

          <h1 style={{
            fontFamily: 'var(--display)',
            fontSize: 'clamp(28px, 4vw, 48px)',
            fontWeight: 300,
            letterSpacing: -1.5,
            lineHeight: 1.1,
            marginBottom: 20,
          }}>
            This page doesn't{' '}
            <span style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', color: 'var(--text-s)', fontWeight: 400 }}>
              exist.
            </span>
          </h1>

          <p style={{ fontSize: 16, lineHeight: 1.6, color: 'var(--text-s)', fontWeight: 300, marginBottom: 48, maxWidth: 460, margin: '0 auto 48px' }}>
            The page you're looking for may have moved, or the URL may be incorrect.
            Here are some useful places to go next.
          </p>

          {/* Helpful links grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 48 }}>
            {HELPFUL_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="not-found-link"
              >
                <div style={{ fontFamily: 'var(--display)', fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>
                  {link.label}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-m)', fontWeight: 300 }}>
                  {link.desc}
                </div>
              </Link>
            ))}
          </div>

          {/* Primary CTA */}
          <Link
            href="/audit"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'linear-gradient(135deg, var(--em), #4fffca)',
              color: '#000',
              fontFamily: 'var(--body)',
              fontWeight: 700,
              fontSize: 14,
              padding: '14px 28px',
              borderRadius: 8,
              textDecoration: 'none',
              transition: 'opacity 0.2s',
            }}
          >
            Take the Free Automation Audit →
          </Link>

        </div>
      </main>

      <Footer />

      <style dangerouslySetInnerHTML={{ __html: `
        .not-found-link {
          background: rgba(10,15,20,0.35);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 12px;
          padding: 20px 16px;
          text-decoration: none;
          text-align: left;
          display: block;
          transition: border-color 0.2s ease, transform 0.2s ease;
          color: inherit;
        }
        .not-found-link:hover {
          border-color: rgba(15,159,112,0.25);
          transform: translateY(-2px);
        }
        @media (max-width: 640px) {
          .not-found-link-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 400px) {
          .not-found-link-grid { grid-template-columns: 1fr !important; }
        }
      ` }} />
    </>
  )
}
