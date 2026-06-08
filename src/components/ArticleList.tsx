'use client'

const ARTICLES = [
  {
    cat: 'Architecture',
    time: '12 min read',
    title: 'Engineering Sub-30s Response Latency on WhatsApp.',
    excerpt: 'A comprehensive breakdown of the webhook architecture, CRM integration, and queue management required to eliminate response delays in high-volume lead environments.',
    slug: 'whatsapp-response-latency',
  },
  {
    cat: 'Architecture',
    time: '8 min read',
    title: 'Cloud API vs Business API: Infrastructure Decisions.',
    excerpt: 'Analyzing cost structures, rate limits, and setup complexity to determine the optimal WhatsApp deployment protocol for your specific enterprise scale.',
    slug: 'cloud-vs-business-api',
  },
  {
    cat: 'AI Logic',
    time: '11 min read',
    title: 'LLM Deployment for Intent Parsing in Indian Markets.',
    excerpt: 'How we configure language models to comprehend Hinglish, extract budget signals, and navigate complex pricing objections autonomously.',
    slug: 'llm-intent-parsing',
  },
  {
    cat: 'Architecture',
    time: '14 min read',
    title: 'True Bidirectional Synchronization: Zoho to WhatsApp.',
    excerpt: 'Mitigating data loss, handling rate limits, and building automated retry logic when bridging communication platforms with central CRMs.',
    slug: 'bidirectional-sync',
  },
]

export default function ArticleList() {
  return (
    <div>
      {ARTICLES.map(a => (
        <div key={a.slug} className="journal-article-row">
          <div style={{ display: 'flex', gap: 24, fontSize: 12, color: 'var(--text-m)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 24 }}>
            <span style={{ color: 'var(--text)' }}>{a.cat}</span>
            <span>{a.time}</span>
          </div>
          <h2 style={{ fontFamily: 'var(--display)', fontWeight: 400, fontSize: 40, lineHeight: 1.15, letterSpacing: -1, marginBottom: 16 }}>{a.title}</h2>
          <p style={{ fontSize: 18, color: 'var(--text-s)', lineHeight: 1.6, fontWeight: 300 }}>{a.excerpt}</p>
        </div>
      ))}
    </div>
  )
}
