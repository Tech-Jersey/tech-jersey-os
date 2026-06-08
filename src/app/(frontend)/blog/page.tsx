import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'AI Automation Blog — Systems, Playbooks & Engineering Insights | Tech Jersey Studio',
  description:
    'Technical breakdowns, system playbooks, and engineering insights on AI automation, WhatsApp pipelines, CRM systems, and business operating systems from Tech Jersey Studio.',
  keywords: ['AI automation blog', 'n8n tutorials', 'WhatsApp automation guide', 'CRM automation India', 'business systems engineering'],
  openGraph: {
    title: 'AI Automation Blog — Tech Jersey Studio',
    description: 'Systems, playbooks, and engineering insights on AI automation for modern enterprises.',
    url: 'https://techjersey.studio/blog',
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
  alternates: { canonical: 'https://techjersey.studio/blog' },
}

const ARTICLES = [
  {
    title: 'Optimizing Workflows with n8n',
    desc: 'How we replaced a full-time administrative role with a robust, error-free n8n workflow connecting Stripe, Slack, and Google Sheets.',
    date: 'June 01, 2026',
    aiGenerated: true,
  },
  {
    title: 'Daily Automatic Blog Posts with AI',
    desc: 'A technical breakdown of how we architected a system that automatically researches, drafts, and publishes SEO-optimized blog posts every single day.',
    date: 'May 28, 2026',
    aiGenerated: true,
  },
  {
    title: 'The Fallacy of the Single-Page Application',
    desc: 'Why multi-page architecture with strict routing outperforms bloated SPAs for enterprise operational dashboards.',
    date: 'May 15, 2026',
    aiGenerated: false,
  },
  {
    title: 'Deploying LLMs in Production',
    desc: 'Navigating the challenges of latency, prompt injection, and context limits when bringing Large Language Models to customer-facing platforms.',
    date: 'April 22, 2026',
    aiGenerated: true,
  },
]

export default function BlogPage() {
  return (
    <>
      <Header />
      
      <main style={{ paddingTop: '160px', paddingBottom: '120px', minHeight: '100vh', background: 'var(--bg)' }}>
        <div className="container">
          
          <div style={{ maxWidth: '800px', marginBottom: '80px' }}>
            <div className="section-label">Insights</div>
            <h1 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(48px, 6vw, 80px)', fontWeight: 300, letterSpacing: -2, lineHeight: 1.1, marginBottom: 24 }}>
              The <span className="serif-italic" style={{ color: 'var(--text-s)' }}>Engineering</span> Journal.
            </h1>
            <p style={{ fontSize: '20px', color: 'var(--text-m)', lineHeight: 1.6, fontWeight: 300 }}>
              Technical breakdowns, architectural decisions, and thoughts on the future of business automation.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {ARTICLES.map((article, i) => (
              <div key={i} className="glass-content-box article-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                  <div style={{ color: 'var(--text-m)', fontFamily: 'monospace', fontSize: '14px' }}>{article.date}</div>
                  
                  {article.aiGenerated && (
                    <div style={{ 
                      display: 'flex', alignItems: 'center', gap: '6px', 
                      background: 'rgba(0, 255, 255, 0.1)', 
                      border: '1px solid rgba(0, 255, 255, 0.3)',
                      padding: '4px 12px', borderRadius: '100px',
                      color: '#00ffff', fontSize: '12px', fontWeight: 600, letterSpacing: 0.5
                    }}>
                      <span style={{ fontSize: '14px' }}>✨</span> AI-Generated
                    </div>
                  )}
                </div>

                <h2 style={{ fontFamily: 'var(--display)', fontSize: '32px', fontWeight: 400, letterSpacing: -1 }}>
                  {article.title}
                </h2>
                
                <p style={{ fontSize: '18px', color: 'var(--text-s)', lineHeight: 1.6, fontWeight: 300 }}>
                  {article.desc}
                </p>

                <div style={{ marginTop: '16px' }}>
                  <Link href="#" className="read-more-link" style={{ color: '#ffffff', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.3)', paddingBottom: '4px', fontSize: '14px', textTransform: 'uppercase', letterSpacing: 1 }}>
                    Read Article →
                  </Link>
                </div>

              </div>
            ))}
          </div>

        </div>
      </main>

      <Footer />
      <style dangerouslySetInnerHTML={{__html: `
        .article-card {
          transition: transform 0.3s ease, background 0.3s ease;
        }
        .article-card:hover {
          transform: translateX(12px);
          background: rgba(20, 25, 30, 0.8);
        }
        .read-more-link:hover {
          border-bottom-color: #ffffff;
        }
      `}} />
    </>
  )
}
