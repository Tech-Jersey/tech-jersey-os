import Link from 'next/link'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <>
      {/* AUDIT TEASER STRIP — above footer */}
      <section style={{
        background: 'linear-gradient(135deg, rgba(15,159,112,0.1), rgba(15,159,112,0.03))',
        borderTop: '1px solid rgba(15,159,112,0.15)',
        padding: '56px 0',
      }}>
        <div className="container">
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 32 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', color: 'var(--em)', marginBottom: 8 }}>
                Free · No Commitment · ≈ 2 Minutes
              </div>
              <h3 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(22px,3vw,32px)', fontWeight: 300, letterSpacing: -0.8, marginBottom: 8 }}>
                Find out how much your business can{' '}
                <em style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', color: 'var(--text-s)' }}>save.</em>
              </h3>
              <p style={{ fontSize: 14, color: 'var(--text-s)', fontWeight: 300 }}>
                Indian businesses on our systems typically save ₹40,000–₹2.5L per month in recovered operational cost.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
              <Link
                href="/audit"
                id="footer-audit-cta"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '16px 32px',
                  background: 'linear-gradient(135deg, var(--em), #4fffca)',
                  color: '#000',
                  fontFamily: 'var(--body)',
                  fontWeight: 700,
                  fontSize: 14,
                  letterSpacing: 0.5,
                  borderRadius: 6,
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                Take the Free Audit ↗
              </Link>
              <span style={{ fontSize: 11, color: 'var(--text-m)' }}>Instant score · No email required to start</span>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN FOOTER */}
      <footer className="footer">
        <div className="container">
          <div className="footer-inner">

            {/* Brand */}
            <div>
              <div className="footer-brand">Tech <span>Jersey</span></div>
              <p className="footer-desc">
                We design automation systems, custom websites, AI tools, and business operating systems for growth-stage enterprises.
              </p>
              <div style={{ marginTop: 32, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <a
                  href="https://wa.me/917357971717"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: 12, color: 'var(--em)', fontWeight: 600, border: '1px solid rgba(15,159,112,0.25)', padding: '8px 16px', borderRadius: 6 }}
                >
                  💬 WhatsApp Us
                </a>
                <a
                  href="mailto:tech.jersey.d@gmail.com"
                  style={{ fontSize: 12, color: 'var(--text-s)', fontWeight: 400, border: '1px solid var(--border)', padding: '8px 16px', borderRadius: 6 }}
                >
                  ✉️ Email Us
                </a>
              </div>
            </div>

            {/* Studio column */}
            <div className="footer-col">
              <h4>Studio</h4>
              <Link href="/about">About the Founder</Link>
              <Link href="/case-studies">Case Studies</Link>
              <Link href="/audit" style={{ color: 'var(--em)', fontWeight: 500 }}>Free AI Audit</Link>
              <Link href="/resources">Resources</Link>
              <Link href="/blog">Blog</Link>
              <Link href="/contact">Contact</Link>
            </div>

            {/* Capabilities column */}
            <div className="footer-col">
              <h4>Capabilities</h4>
              <Link href="/services/whatsapp-automation">WhatsApp Automation</Link>
              <Link href="/services/crm-automation">CRM Automation</Link>
              <Link href="/services/document-intelligence">Document Intelligence</Link>
              <Link href="/services/ai-tools">AI Tools</Link>
              <Link href="/services/business-os">Business OS</Link>
            </div>

            {/* Direct column */}
            <div className="footer-col">
              <h4>Direct</h4>
              <a href="https://wa.me/917357971717" target="_blank" rel="noopener noreferrer">+91 73579 71717</a>
              <a href="mailto:tech.jersey.d@gmail.com">tech.jersey.d@gmail.com</a>
              <div style={{ marginTop: 24, borderTop: '1px solid var(--border)', paddingTop: 24 }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--text-m)', marginBottom: 12 }}>
                  Based in India
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-s)', fontWeight: 300 }}>
                  Serving clients across India, UAE &amp; Southeast Asia
                </div>
              </div>
            </div>

          </div>

          <div className="footer-bottom">
            <span>© {year} Tech Jersey Studio. All rights reserved.</span>
            <div className="footer-legal">
              <Link href="/privacy">Privacy Policy</Link>
              <Link href="/terms">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
