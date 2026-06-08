import Link from 'next/link'

interface Metric {
  value: string
  label: string
}

interface CaseStudyCompactCardProps {
  id: string | number
  client: string
  slug: string
  industry?: string
  summary?: string
  metrics?: Metric[]
  /** Optional service-context label */
  serviceContext?: string
}

const INDUSTRY_MAP: Record<string, string> = {
  'real-estate': 'Real Estate',
  'education': 'Education',
  'retail': 'Retail & Luxury',
  'healthcare': 'Healthcare',
  'finance': 'Finance',
  'technology': 'Technology',
  'other': 'Other',
}

export default function CaseStudyCompactCard({
  client,
  slug,
  industry,
  summary,
  metrics,
  serviceContext,
}: CaseStudyCompactCardProps) {
  const highlight = metrics?.[0]
  const industryLabel = industry ? (INDUSTRY_MAP[industry] || industry) : 'Deployment'

  return (
    <Link
      href={`/case-studies/${slug}`}
      className="cs-compact-card"
      style={{ textDecoration: 'none' }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <span style={{
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: 1.5,
          textTransform: 'uppercase',
          color: 'var(--text-m)',
        }}>
          {serviceContext || industryLabel}
        </span>

        {highlight && (
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{
              fontFamily: 'var(--display)',
              fontSize: 22,
              fontWeight: 700,
              color: 'var(--em)',
              lineHeight: 1,
            }}>
              {highlight.value}
            </div>
            <div style={{
              fontSize: 8,
              color: 'var(--text-m)',
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              marginTop: 2,
            }}>
              {highlight.label}
            </div>
          </div>
        )}
      </div>

      {/* Client name */}
      <h4 style={{
        fontFamily: 'var(--display)',
        fontSize: 15,
        fontWeight: 600,
        color: 'var(--text)',
        marginBottom: 10,
        lineHeight: 1.3,
      }}>
        {client}
      </h4>

      {/* Summary */}
      {summary && (
        <p style={{
          fontSize: 12,
          lineHeight: 1.55,
          color: 'var(--text-s)',
          fontWeight: 300,
          marginBottom: 16,
          flexGrow: 1,
        }}>
          {summary.length > 120 ? summary.slice(0, 117) + '…' : summary}
        </p>
      )}

      {/* CTA */}
      <div className="cs-compact-cta">
        <span>Read Story</span>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .cs-compact-card {
          display: flex;
          flex-direction: column;
          background: rgba(10, 15, 20, 0.35);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 14px;
          padding: 24px;
          transition: border-color 0.3s ease, transform 0.3s ease, background 0.3s ease;
          min-height: 200px;
        }

        .cs-compact-card:hover {
          border-color: rgba(15, 159, 112, 0.25);
          transform: translateY(-3px);
          background: rgba(10, 15, 20, 0.5);
        }

        .cs-compact-cta {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 600;
          color: var(--em);
          margin-top: auto;
        }

        .cs-compact-card:hover .cs-compact-cta {
          gap: 10px;
        }
      ` }} />
    </Link>
  )
}
