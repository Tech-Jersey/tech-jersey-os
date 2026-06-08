'use client'
import { useState } from 'react'
import dynamic from 'next/dynamic'

const DownloadGateModal = dynamic(() => import('./DownloadGateModal'), { ssr: false })

interface ValuePoint { point: string }

interface ResourceCardProps {
  slug: string
  title: string
  category: string
  description?: string
  available: boolean
  downloadCount: number
  valueProposition?: ValuePoint[]
  featured?: boolean
}

const CATEGORY_ICONS: Record<string, string> = {
  'Blueprint': '📋',
  'ROI Calculator': '📊',
  'Checklist': '✅',
  'Guide': '📖',
  'Case Study PDF': '📄',
}

export default function ResourceCard({
  slug, title, category, description, available,
  downloadCount, valueProposition, featured,
}: ResourceCardProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const icon = CATEGORY_ICONS[category] || '📁'

  return (
    <>
      <div className={`resource-card ${featured ? 'featured' : ''} ${!available ? 'coming-soon' : ''}`}>
        {/* Featured badge */}
        {featured && (
          <div className="resource-featured-badge">Featured</div>
        )}

        {/* Header */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <span style={{ fontSize: 24 }}>{icon}</span>
            <div style={{ textAlign: 'right' }}>
              {!available ? (
                <span className="resource-coming-badge">Coming Soon</span>
              ) : downloadCount > 0 ? (
                <span className="resource-download-count">{downloadCount} downloads</span>
              ) : null}
            </div>
          </div>

          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--em)', marginBottom: 10 }}>
            {category}
          </div>
          <h3 style={{ fontFamily: 'var(--display)', fontSize: 17, fontWeight: 600, color: 'var(--text)', lineHeight: 1.3, marginBottom: 12 }}>
            {title}
          </h3>
          {description && (
            <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--text-s)', fontWeight: 300 }}>
              {description}
            </p>
          )}
        </div>

        {/* Value proposition */}
        {valueProposition && valueProposition.length > 0 && (
          <div style={{ marginBottom: 24, borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: 16 }}>
            {valueProposition.map((vp, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
                <span style={{ color: 'var(--em)', fontSize: 11, fontWeight: 700, marginTop: 1, flexShrink: 0 }}>✓</span>
                <span style={{ fontSize: 12, color: 'var(--text-s)', lineHeight: 1.4, fontWeight: 300 }}>{vp.point}</span>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div style={{ marginTop: 'auto' }}>
          {available ? (
            <button
              onClick={() => setModalOpen(true)}
              className="resource-download-btn"
            >
              ↓ Download Free
            </button>
          ) : (
            <div className="resource-soon-btn">
              <span>🔔</span>
              <span>Notify Me</span>
            </div>
          )}
        </div>
      </div>

      {modalOpen && (
        <DownloadGateModal
          resourceSlug={slug}
          resourceTitle={title}
          onClose={() => setModalOpen(false)}
        />
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .resource-card {
          background: rgba(10, 15, 20, 0.35);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          padding: 28px;
          display: flex;
          flex-direction: column;
          position: relative;
          transition: border-color 0.3s ease, transform 0.3s ease;
        }

        .resource-card:hover {
          border-color: rgba(15, 159, 112, 0.2);
          transform: translateY(-3px);
        }

        .resource-card.featured {
          border-color: rgba(15, 159, 112, 0.2);
          background: rgba(15, 159, 112, 0.03);
        }

        .resource-card.coming-soon {
          opacity: 0.8;
        }

        .resource-featured-badge {
          position: absolute;
          top: 16px;
          right: 16px;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: var(--em);
          background: rgba(15, 159, 112, 0.1);
          border: 1px solid rgba(15, 159, 112, 0.25);
          padding: 3px 8px;
          border-radius: 4px;
        }

        .resource-coming-badge {
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: var(--text-m);
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.06);
          padding: 3px 8px;
          border-radius: 4px;
        }

        .resource-download-count {
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: var(--em);
        }

        .resource-download-btn {
          width: 100%;
          padding: 14px 20px;
          background: linear-gradient(135deg, var(--em), #4fffca);
          color: #000;
          font-family: var(--body);
          font-weight: 700;
          font-size: 13px;
          letter-spacing: 0.5px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.2s;
        }

        .resource-download-btn:hover {
          opacity: 0.9;
          transform: translateY(-1px);
        }

        .resource-soon-btn {
          width: 100%;
          padding: 14px 20px;
          background: rgba(255,255,255,0.03);
          color: var(--text-m);
          font-family: var(--body);
          font-weight: 500;
          font-size: 13px;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: not-allowed;
          user-select: none;
        }
      ` }} />
    </>
  )
}
