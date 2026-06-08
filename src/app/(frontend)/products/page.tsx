import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

export const metadata = {
  title: 'What Products | Tech Jersey',
  description: 'Explore the bespoke systems, tools, and platforms engineered by Tech Jersey.',
}

const PRODUCTS = [
  {
    title: 'AI Document Analysis Tool',
    desc: 'An enterprise-grade system that automatically ingests, analyzes, and extracts structured data from thousands of unstructured PDFs and business documents.',
    tags: ['Python', 'OpenAI', 'AWS'],
    color: '#4F9CF9',
  },
  {
    title: 'Bespoke E-commerce Platform',
    desc: 'A headless commerce engine designed for high-volume transactions, featuring dynamic inventory syncing and AI-driven product recommendations.',
    tags: ['Next.js', 'Shopify Plus', 'Stripe'],
    color: '#25D366',
  },
  {
    title: 'Custom Internal CRM',
    desc: 'A fully custom operations dashboard that consolidates lead generation, customer support, and financial reporting into a single source of truth.',
    tags: ['React', 'Node.js', 'PostgreSQL'],
    color: '#FFB800',
  },
  {
    title: 'Automated Lead Qualification Bot',
    desc: 'An intelligent chatbot integrated directly into WhatsApp that pre-qualifies incoming leads and books meetings automatically based on complex logic.',
    tags: ['n8n', 'WhatsApp API', 'LangChain'],
    color: '#E1306C',
  },
]

export default function ProductsPage() {
  return (
    <>
      <Header />
      
      <main style={{ paddingTop: '160px', paddingBottom: '120px', minHeight: '100vh', background: 'var(--bg)' }}>
        <div className="container">
          
          <div style={{ maxWidth: '800px', marginBottom: '80px' }}>
            <div className="section-label">Our Work</div>
            <h1 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(48px, 6vw, 80px)', fontWeight: 300, letterSpacing: -2, lineHeight: 1.1, marginBottom: 24 }}>
              What <span className="serif-italic" style={{ color: 'var(--text-s)' }}>Products</span> we engineer.
            </h1>
            <p style={{ fontSize: '20px', color: 'var(--text-m)', lineHeight: 1.6, fontWeight: 300 }}>
              We don't build generic websites. We engineer high-performance digital systems designed to solve complex operational bottlenecks.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '40px' }}>
            {PRODUCTS.map((prod, i) => (
              <div key={i} className="glass-content-box product-card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                
                {/* Visual Mockup Area */}
                <div style={{ 
                  height: '240px', 
                  background: `linear-gradient(135deg, ${prod.color}22 0%, ${prod.color}05 100%)`,
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  position: 'relative',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <div style={{ width: '80%', height: '80%', background: 'rgba(0,0,0,0.5)', borderRadius: '12px', border: `1px solid ${prod.color}55`, boxShadow: `0 20px 40px rgba(0,0,0,0.5), inset 0 1px 0 ${prod.color}55` }}>
                     {/* Abstract Mockup UI Elements */}
                     <div style={{ display: 'flex', gap: 6, padding: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                       <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff5f56' }}/>
                       <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ffbd2e' }}/>
                       <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#27c93f' }}/>
                     </div>
                     <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ width: '40%', height: 12, background: `${prod.color}55`, borderRadius: 4 }} />
                        <div style={{ width: '100%', height: 8, background: 'rgba(255,255,255,0.1)', borderRadius: 4 }} />
                        <div style={{ width: '80%', height: 8, background: 'rgba(255,255,255,0.1)', borderRadius: 4 }} />
                        <div style={{ width: '90%', height: 8, background: 'rgba(255,255,255,0.1)', borderRadius: 4 }} />
                     </div>
                  </div>
                </div>

                {/* Content Area */}
                <div style={{ padding: '40px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontFamily: 'var(--display)', fontSize: '28px', fontWeight: 400, marginBottom: '16px', letterSpacing: -1 }}>{prod.title}</h3>
                  <p style={{ fontSize: '16px', color: 'var(--text-s)', lineHeight: 1.6, marginBottom: '32px', flex: 1 }}>{prod.desc}</p>
                  
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {prod.tags.map(tag => (
                      <span key={tag} style={{ fontSize: '12px', fontFamily: 'monospace', padding: '4px 10px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', color: 'var(--text-m)' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      </main>

      <Footer />
      <style dangerouslySetInnerHTML={{__html: `
        .product-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .product-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 40px 80px rgba(0,0,0,0.6);
        }
      `}} />
    </>
  )
}
