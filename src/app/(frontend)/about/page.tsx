import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import StickyAuditCTA from '@/components/StickyAuditCTA'
import LinkCTA from '@/components/LinkCTA'
import CaseStudyCompactCard from '@/components/CaseStudyCompactCard'
import { getPayloadClient, getFeaturedCaseStudies } from '@/lib/payload-utils'
import { JsonLd } from '@/components/seo/JsonLd'
import { buildFounderSchema, buildOrganizationSchema, buildBreadcrumbSchema } from '@/lib/schema'

export const metadata: Metadata = {
  title: 'Dhruv — Founder & AI Systems Architect | Tech Jersey Studio',
  description: 'Meet Dhruv, founder of Tech Jersey Studio — an AI systems architect specialising in WhatsApp automation, CRM pipelines, and business operating systems for enterprises across India, UAE, and Southeast Asia.',
  keywords: ['AI systems architect India', 'automation agency founder', 'WhatsApp automation expert', 'n8n developer India', 'Tech Jersey Studio founder'],
  openGraph: {
    title: 'Dhruv — Founder & AI Systems Architect | Tech Jersey Studio',
    description: 'Meet the mind behind Tech Jersey Studio — AI automation and business systems architect serving India, UAE, and Southeast Asia.',
    type: 'profile',
    url: 'https://techjersey.studio/about',
  },
  twitter: { card: 'summary_large_image' },
  alternates: { canonical: 'https://techjersey.studio/about' },
}

// ── Static data: editable via CMS in future via GlobalSettings.founder ──────

const PHILOSOPHY_CARDS = [
  {
    number: '01',
    title: 'Automation is not replacement.',
    body: 'We don\'t build systems that remove people. We build systems that remove friction. Your team should focus on decisions — not data entry, follow-ups, or manual routing.',
  },
  {
    number: '02',
    title: 'Every system must be measurable.',
    body: 'If you can\'t quantify the impact, you haven\'t built the right thing. Every deployment comes with clear metrics: response time, cost per lead, hours saved per week.',
  },
  {
    number: '03',
    title: 'Speed compounds.',
    body: 'A business that responds in 8 seconds beats one that responds in 4 hours — every single time. Latency isn\'t a technical problem. It\'s a revenue problem.',
  },
]

const TECH_STACK = [
  { name: 'n8n', category: 'Automation', icon: '⚡' },
  { name: 'WhatsApp API', category: 'Messaging', icon: '💬' },
  { name: 'Next.js', category: 'Frontend', icon: '△' },
  { name: 'Payload CMS', category: 'Backend', icon: '⬡' },
  { name: 'OpenAI', category: 'AI', icon: '🧠' },
  { name: 'PostgreSQL', category: 'Database', icon: '🗄️' },
  { name: 'HubSpot', category: 'CRM', icon: '🔗' },
  { name: 'Zoho Suite', category: 'CRM', icon: '🔗' },
  { name: 'Twilio', category: 'Communications', icon: '📡' },
  { name: 'Vercel', category: 'Infrastructure', icon: '▲' },
  { name: 'Cloudflare', category: 'Security', icon: '🔒' },
  { name: 'Figma', category: 'Design', icon: '✏️' },
]

const WORK_PROCESS = [
  {
    step: '01',
    title: 'Understand the system, not the symptom.',
    body: 'Before writing a single line of code, I map your existing workflows end-to-end. Most issues aren\'t where clients think they are.',
  },
  {
    step: '02',
    title: 'Design for outcome, not output.',
    body: 'The deliverable isn\'t a chatbot. It\'s a 40% reduction in manual hours. We work backward from business outcomes to build the right system.',
  },
  {
    step: '03',
    title: 'Build fast. Test real.',
    body: 'Rapid iteration with live data. No month-long planning phases. You see working prototypes within days, not after a 12-slide deck.',
  },
  {
    step: '04',
    title: 'Hand over control.',
    body: 'Every system comes with documentation, training, and a direct WhatsApp line. You own the system. We stay as your architecture partner.',
  },
]

const STATS = [
  { value: '5+', label: 'Years building systems' },
  { value: '12+', label: 'Enterprise clients' },
  { value: '₹40L+', label: 'Client revenue unlocked' },
  { value: '3', label: 'Countries served' },
]

export default async function AboutPage() {
  const featuredCaseStudies = await getFeaturedCaseStudies()

  return (
    <>
      <Header />

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section style={{ paddingTop: 180, paddingBottom: 100, position: 'relative', overflow: 'hidden' }}>
        {/* Ambient glow */}
        <div style={{
          position: 'absolute', top: -100, left: -200,
          width: 700, height: 700,
          background: 'radial-gradient(circle, rgba(15,159,112,0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div className="container">
          <div className="about-hero-grid">
            {/* Left — headline */}
            <div>
              <span style={{
                fontSize: 9, fontWeight: 700, letterSpacing: 3,
                textTransform: 'uppercase', color: 'var(--em)',
                display: 'block', marginBottom: 24,
              }}>
                Founder & Systems Architect
              </span>

              <h1 style={{
                fontFamily: 'var(--display)', fontWeight: 300,
                fontSize: 'clamp(44px, 6vw, 80px)', lineHeight: 1.05,
                letterSpacing: -2, marginBottom: 32,
              }}>
                Dhruv
                <br />
                <span className="serif-italic" style={{ fontSize: '0.75em', color: 'var(--text-s)' }}>
                  Tech Jersey Studio
                </span>
              </h1>

              <blockquote style={{
                fontFamily: 'var(--serif)',
                fontStyle: 'italic',
                fontSize: 'clamp(17px, 2vw, 22px)',
                lineHeight: 1.6,
                color: 'var(--text-s)',
                fontWeight: 400,
                borderLeft: '2px solid var(--em)',
                paddingLeft: 24,
                marginBottom: 40,
              }}>
                "Most businesses don't have a growth problem. They have a systems problem. We fix the systems."
              </blockquote>

              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <LinkCTA
                  href="/contact"
                  id="about-contact-cta"
                  className="btn-primary"
                  location="about_hero"
                  style={{ background: 'linear-gradient(135deg,var(--em),#4fffca)', color: '#000', border: 'none', fontWeight: 700 }}
                >
                  Work With Me Directly
                </LinkCTA>
                <a
                  href="https://wa.me/917357971717"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  💬 WhatsApp Directly
                </a>
              </div>
            </div>

            {/* Right — photo placeholder */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Photo area */}
              <div className="about-photo-frame">
                <div className="about-photo-placeholder">
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 48, marginBottom: 12, opacity: 0.3 }}>👤</div>
                    <div style={{ fontSize: 11, color: 'var(--text-m)', fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase' }}>
                      Founder Photo
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text-m)', marginTop: 4, fontWeight: 300 }}>
                      Upload via Admin → Global Settings → Founder → Photo
                    </div>
                  </div>
                </div>
              </div>

              {/* Social links */}
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                {[
                  { label: 'LinkedIn', icon: 'in', href: '#' },
                  { label: 'Twitter', icon: '𝕏', href: '#' },
                  { label: 'Instagram', icon: '◎', href: '#' },
                ].map(social => (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    style={{
                      width: 40, height: 40, borderRadius: 8,
                      border: '1px solid var(--border)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 13, fontWeight: 700, color: 'var(--text-m)',
                      textDecoration: 'none', transition: 'all 0.2s',
                    }}
                    className="about-social-link"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ───────────────────────────────────────────────── */}
      <section style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '60px 0' }}>
        <div className="container">
          <div className="about-stats-grid">
            {STATS.map(stat => (
              <div key={stat.label} style={{ textAlign: 'center' }}>
                <div style={{
                  fontFamily: 'var(--display)',
                  fontSize: 'clamp(36px, 5vw, 56px)',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, var(--text), var(--em))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  lineHeight: 1,
                  marginBottom: 8,
                }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-m)', fontWeight: 500, letterSpacing: 1, textTransform: 'uppercase' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PHILOSOPHY CARDS ──────────────────────────────────────────── */}
      <section style={{ padding: '120px 0' }}>
        <div className="container">
          <div style={{ marginBottom: 64 }}>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--em)', display: 'block', marginBottom: 16 }}>
              Design Philosophy
            </span>
            <h2 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 300, letterSpacing: -1.5, lineHeight: 1.1, maxWidth: 640 }}>
              How I think about
              {' '}<span className="serif-italic" style={{ color: 'var(--text-s)', fontWeight: 400 }}>
                automation.
              </span>
            </h2>
          </div>

          <div className="about-philosophy-grid">
            {PHILOSOPHY_CARDS.map(card => (
              <div key={card.number} className="philosophy-card">
                <div style={{
                  fontFamily: 'var(--serif)',
                  fontStyle: 'italic',
                  fontSize: 48,
                  color: 'var(--em)',
                  opacity: 0.2,
                  lineHeight: 1,
                  marginBottom: 20,
                }}>
                  {card.number}
                </div>
                <h3 style={{
                  fontFamily: 'var(--display)',
                  fontSize: 18,
                  fontWeight: 600,
                  color: 'var(--text)',
                  marginBottom: 16,
                  lineHeight: 1.3,
                }}>
                  {card.title}
                </h3>
                <p style={{
                  fontSize: 14,
                  lineHeight: 1.7,
                  color: 'var(--text-s)',
                  fontWeight: 300,
                }}>
                  {card.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STORY SECTION ─────────────────────────────────────────────── */}
      <section style={{ padding: '80px 0 120px 0', background: 'var(--bg-surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div className="about-story-grid">
            <div>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--em)', display: 'block', marginBottom: 16 }}>
                The Story
              </span>
              <h2 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 300, letterSpacing: -1, lineHeight: 1.15, marginBottom: 0 }}>
                Why I build{' '}
                <span className="serif-italic" style={{ color: 'var(--text-s)', fontWeight: 400 }}>
                  systems.
                </span>
              </h2>
            </div>

            <div>
              <div style={{ fontSize: 16, lineHeight: 1.8, color: 'var(--text-s)', fontWeight: 300 }}>
                <p style={{ marginBottom: 24 }}>
                  I started Tech Jersey after watching too many talented business owners spend their days doing things software should be handling. Not because they lacked ambition — but because no one had ever shown them what was possible.
                </p>
                <p style={{ marginBottom: 24 }}>
                  My background is in systems engineering and product development. Before building Tech Jersey, I worked on automation and AI infrastructure for teams across education, real estate, and retail. I saw the same pattern every time: high operational cost, slow response times, and leads falling through the cracks.
                </p>
                <p style={{ marginBottom: 24 }}>
                  The solution was never a new tool. It was a new architecture — one that connected the tools already in use, removed the manual steps in between, and turned reactive businesses into ones that respond in seconds.
                </p>
                <p>
                  That's what Tech Jersey does. We build the infrastructure that lets your team focus on the work only humans can do.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TECH STACK GRID ───────────────────────────────────────────── */}
      <section style={{ padding: '120px 0' }}>
        <div className="container">
          <div style={{ marginBottom: 56 }}>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--em)', display: 'block', marginBottom: 16 }}>
              Technical Stack
            </span>
            <h2 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 300, letterSpacing: -1, lineHeight: 1.15 }}>
              Tools I master
            </h2>
          </div>

          <div className="about-stack-grid">
            {TECH_STACK.map(tool => (
              <div key={tool.name} className="stack-card">
                <span style={{ fontSize: 20, marginBottom: 10, display: 'block' }}>{tool.icon}</span>
                <div style={{ fontFamily: 'var(--display)', fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>
                  {tool.name}
                </div>
                <div style={{ fontSize: 10, color: 'var(--text-m)', fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase' }}>
                  {tool.category}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WORK PROCESS ──────────────────────────────────────────────── */}
      <section style={{ padding: '80px 0 120px 0', background: 'var(--bg-surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ marginBottom: 64 }}>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--em)', display: 'block', marginBottom: 16 }}>
              How I Work
            </span>
            <h2 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 300, letterSpacing: -1, lineHeight: 1.15, maxWidth: 560 }}>
              My process, from first call to live system.
            </h2>
          </div>

          <div className="about-process-grid">
            {WORK_PROCESS.map(step => (
              <div key={step.step} className="about-process-step">
                <div style={{
                  fontFamily: 'var(--serif)',
                  fontStyle: 'italic',
                  fontSize: 56,
                  color: 'var(--em)',
                  opacity: 0.15,
                  lineHeight: 1,
                  marginBottom: 20,
                }}>
                  {step.step}
                </div>
                <h3 style={{ fontFamily: 'var(--display)', fontSize: 17, fontWeight: 600, color: 'var(--text)', marginBottom: 14, lineHeight: 1.35 }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text-s)', fontWeight: 300, margin: 0 }}>
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED CASE STUDIES ─────────────────────────────────────── */}
      {featuredCaseStudies && featuredCaseStudies.length > 0 && (
        <section style={{ padding: '120px 0' }}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48 }}>
              <div>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--em)', display: 'block', marginBottom: 12 }}>
                  Work
                </span>
                <h2 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 300, letterSpacing: -1, margin: 0 }}>
                  Selected case studies
                </h2>
              </div>
              <Link href="/case-studies" className="btn-secondary" style={{ fontSize: 13, whiteSpace: 'nowrap' }}>
                View All Work →
              </Link>
            </div>

            <div className="about-cases-grid">
              {(featuredCaseStudies as any[]).slice(0, 3).map((cs: any) => (
                <CaseStudyCompactCard
                  key={cs.id}
                  id={cs.id}
                  client={cs.client}
                  slug={cs.slug}
                  industry={cs.industry}
                  summary={cs.summary}
                  metrics={cs.metrics}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── DIRECT CTA ────────────────────────────────────────────────── */}
      <section style={{ padding: '120px 0', background: 'var(--bg-surface)', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div className="glass-content-box" style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', color: 'var(--em)', display: 'block', marginBottom: 20 }}>
              Work Together
            </span>
            <h2 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 300, letterSpacing: -1.5, marginBottom: 20, lineHeight: 1.1 }}>
              Ready to build your operating system?
            </h2>
            <p style={{ fontSize: 15, color: 'var(--text-s)', fontWeight: 300, lineHeight: 1.6, marginBottom: 40, maxWidth: 520, margin: '0 auto 40px' }}>
              I work directly with founders and business owners — no account managers, no handoffs. You get me, the systems architect, from day one.
            </p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <LinkCTA
                href="/contact"
                id="about-bottom-contact-cta"
                className="btn-primary"
                location="about_bottom"
                style={{ background: 'linear-gradient(135deg,var(--em),#4fffca)', color: '#000', border: 'none', fontWeight: 700 }}
              >
                Send Me a Brief →
              </LinkCTA>
              <a
                href="https://wa.me/917357971717"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                💬 WhatsApp Me Directly
              </a>
            </div>
            <div style={{ marginTop: 24, display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
              {['No long onboarding', 'Working prototype in days', 'You own all the code'].map(t => (
                <span key={t} style={{ fontSize: 11, color: 'var(--text-m)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: 'var(--em)', fontWeight: 700 }}>✓</span> {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <StickyAuditCTA />

      {/* ── STYLES ─────────────────────────────────────────────────────── */}
      <style dangerouslySetInnerHTML={{ __html: `
        .about-hero-grid {
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 80px;
          align-items: center;
        }

        .about-photo-frame {
          border-radius: 20px;
          overflow: hidden;
          position: relative;
          aspect-ratio: 4/5;
          background: rgba(10, 15, 20, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .about-photo-placeholder {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(160deg, rgba(15,159,112,0.04) 0%, rgba(10,15,20,0.8) 100%);
        }

        .about-social-link:hover {
          color: var(--text) !important;
          border-color: var(--border-light) !important;
        }

        .about-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 40px;
        }

        .about-philosophy-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
        }

        .philosophy-card {
          background: rgba(10, 15, 20, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 16px;
          padding: 40px 32px;
          transition: border-color 0.3s ease, transform 0.3s ease;
        }

        .philosophy-card:hover {
          border-color: rgba(15, 159, 112, 0.2);
          transform: translateY(-4px);
        }

        .about-story-grid {
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 80px;
          align-items: start;
        }

        .about-stack-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 16px;
        }

        .stack-card {
          background: rgba(10, 15, 20, 0.35);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 12px;
          padding: 20px 16px;
          text-align: center;
          transition: border-color 0.25s, transform 0.25s;
        }

        .stack-card:hover {
          border-color: rgba(15, 159, 112, 0.2);
          transform: translateY(-3px);
        }

        .about-process-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 32px;
        }

        .about-process-step {
          padding: 0;
          border-top: 1px solid rgba(255,255,255,0.06);
          padding-top: 32px;
        }

        .about-cases-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        @media (max-width: 1200px) {
          .about-stack-grid { grid-template-columns: repeat(4, 1fr); }
          .about-process-grid { grid-template-columns: repeat(2, 1fr); gap: 24px; }
        }

        @media (max-width: 1024px) {
          .about-hero-grid { grid-template-columns: 1fr; gap: 48px; }
          .about-stats-grid { grid-template-columns: repeat(2, 1fr); gap: 32px; }
          .about-philosophy-grid { grid-template-columns: 1fr; }
          .about-story-grid { grid-template-columns: 1fr; gap: 48px; }
          .about-cases-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 768px) {
          .about-hero-grid { gap: 40px; }
          .about-stack-grid { grid-template-columns: repeat(3, 1fr); }
          .about-process-grid { grid-template-columns: 1fr; }
          .about-stats-grid { grid-template-columns: repeat(2, 1fr); }
          .about-cases-grid { grid-template-columns: 1fr; }
        }

        @media (max-width: 480px) {
          .about-stack-grid { grid-template-columns: repeat(2, 1fr); }
        }
      ` }} />

      {/* ── STRUCTURED DATA ─── */}
      <JsonLd data={buildFounderSchema()} />
      <JsonLd data={buildOrganizationSchema()} />
      <JsonLd data={buildBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'About', url: '/about' },
      ])} />
    </>
  )
}
