'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import type { AuditResult } from '@/lib/audit-engine'

type AuditResultsProps = {
  result: AuditResult
  name: string
  leadId?: string
  onRestart: () => void
}

const RING_RADIUS = 54
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS

// Format INR — compact (e.g. ₹1,20,000)
function formatINR(amount: number): string {
  if (amount >= 100_000) {
    return `₹${(amount / 100_000).toFixed(1)}L`
  }
  return `₹${amount.toLocaleString('en-IN')}`
}

const SEVERITY_COLOR: Record<AuditResult['scoreSeverity'], string> = {
  critical: '#ff6b6b',
  high:     '#ffd93d',
  medium:   '#0f9f70',
  low:      '#4F9CF9',
}

export default function AuditResults({ result, name, leadId, onRestart }: AuditResultsProps) {
  const fillRef = useRef<SVGCircleElement>(null)

  useEffect(() => {
    const el = fillRef.current
    if (!el) return
    const offset = RING_CIRCUMFERENCE * (1 - result.score / 100)
    el.style.strokeDasharray  = String(RING_CIRCUMFERENCE)
    el.style.strokeDashoffset = String(RING_CIRCUMFERENCE)
    const frame = requestAnimationFrame(() => {
      el.style.strokeDashoffset = String(offset)
    })
    return () => cancelAnimationFrame(frame)
  }, [result.score])

  const color = SEVERITY_COLOR[result.scoreSeverity]

  const handleDownload = () => {
    // Build print-optimised URL; pass leadId if available for server-side lookup
    const params = new URLSearchParams()
    if (leadId) params.set('id', leadId)
    params.set('score', String(result.score))
    params.set('label', result.scoreLabel)
    params.set('savings', String(result.estimatedMonthlySavingsINR))
    params.set('name', name)
    const url = `/audit/report?${params.toString()}`
    window.open(url, '_blank')
  }

  // Build WhatsApp booking message
  const bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL
  const waMsg = encodeURIComponent(
    `Hi Tech Jersey! I just completed the AI Automation Audit.\n` +
    `My Score: ${result.score}/100 — ${result.scoreLabel}\n` +
    `Est. Savings: ${formatINR(result.estimatedMonthlySavingsINR)}/month\n\n` +
    `I'd like to book a strategy call to discuss my automation blueprint.`
  )
  const waHref = `https://wa.me/917357971717?text=${waMsg}`

  return (
    <div className="audit-results">

      {/* Score + Summary */}
      <div className="audit-score-wrap">
        {/* SVG Ring */}
        <div className="audit-score-ring">
          <svg width="140" height="140" viewBox="0 0 140 140">
            <circle className="audit-score-track" cx="70" cy="70" r={RING_RADIUS} />
            <circle
              ref={fillRef}
              className="audit-score-fill"
              cx="70"
              cy="70"
              r={RING_RADIUS}
              stroke={color}
              style={{
                strokeDasharray: RING_CIRCUMFERENCE,
                strokeDashoffset: RING_CIRCUMFERENCE,
                transition: 'stroke-dashoffset 1.4s cubic-bezier(0.19,1,0.22,1)',
              }}
            />
          </svg>
          <div className="audit-score-number">
            <strong style={{ color }}>{result.score}</strong>
            <span>/ 100</span>
          </div>
        </div>

        {/* Text */}
        <div>
          <div className="audit-score-label" style={{ marginBottom: 8 }}>
            {result.scoreLabel}
          </div>
          <p className="audit-score-summary" style={{ marginBottom: 16 }}>
            {result.summaryLine}
          </p>
          <div className="audit-savings-pill">
            💰 Est. monthly savings: {formatINR(result.estimatedMonthlySavingsINR)}/month
          </div>
        </div>
      </div>

      {/* Opportunities */}
      {result.opportunities.length > 0 && (
        <div className="audit-section">
          <div className="audit-section-title">Opportunities Found</div>
          <div className="audit-list">
            {result.opportunities.map((opp, i) => (
              <div key={i} className="audit-list-item">{opp}</div>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Systems */}
      {result.recommendedSystems.length > 0 && (
        <div className="audit-section">
          <div className="audit-section-title">
            Recommended Systems for {name.split(' ')[0]}
          </div>
          <div className="audit-list">
            {result.recommendedSystems.map((sys, i) => (
              <div key={i} className="audit-system-item">
                <span className="audit-system-dot" />
                {sys}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Download PDF */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
        <button
          onClick={handleDownload}
          type="button"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '10px 20px',
            background: 'transparent',
            border: '1px solid var(--border-light)',
            borderRadius: 6,
            color: 'var(--text-s)',
            fontSize: 13,
            fontFamily: 'var(--body)',
            cursor: 'pointer',
            transition: 'border-color 0.3s, color 0.3s',
          }}
          onMouseOver={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--text)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--text)' }}
          onMouseOut={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-light)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-s)' }}
        >
          ⬇ Download Audit Report PDF
        </button>
      </div>

      {/* CTA */}
      <div className="audit-cta-block">
        <h3>
          Ready to{' '}
          <span style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', color: 'var(--text-s)' }}>
            implement this?
          </span>
        </h3>
        <p>
          Book a free 30-minute strategy call. We'll map out your exact automation
          architecture and deliver a fixed-price proposal within 48 hours.
        </p>
        <div className="audit-cta-buttons">
          {bookingUrl ? (
            <a href={bookingUrl} target="_blank" rel="noopener noreferrer" className="audit-cta-primary">
              📅 Book Free Strategy Call
            </a>
          ) : (
            <a href={waHref} target="_blank" rel="noopener noreferrer" className="audit-cta-primary">
              📞 Book Strategy Call on WhatsApp
            </a>
          )}
          <Link href="/contact" className="audit-cta-secondary">
            Send Full Brief Instead →
          </Link>
        </div>
        <button
          onClick={onRestart}
          type="button"
          style={{
            marginTop: 20,
            background: 'transparent',
            border: 'none',
            color: 'var(--text-m)',
            fontSize: 12,
            cursor: 'pointer',
            textDecoration: 'underline',
            fontFamily: 'var(--body)',
          }}
        >
          ↺ Restart audit
        </button>
      </div>
    </div>
  )
}
