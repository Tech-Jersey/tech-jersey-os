'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import './report.css'

function formatINR(amount: number): string {
  if (amount >= 100_000) return `₹${(amount / 100_000).toFixed(1)}L`
  return `₹${amount.toLocaleString('en-IN')}`
}

function ReportContent() {
  const params = useSearchParams()
  const score   = Number(params.get('score') || 0)
  const label   = params.get('label')   || 'Automation Readiness Assessment'
  const savings = Number(params.get('savings') || 0)
  const name    = params.get('name')    || 'Business Owner'

  const today = new Date().toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  const bandColor =
    score >= 75 ? '#ff6b6b' :
    score >= 50 ? '#ffd93d' :
    score >= 25 ? '#0f9f70' : '#4F9CF9'

  return (
    <div className="report-page">

      {/* Action bar — screen only, hidden on print */}
      <div className="report-print-bar">
        <p>Your Audit Report is ready. Print or save as PDF using your browser.</p>
        <button
          className="report-print-btn"
          onClick={() => window.print()}
          type="button"
        >
          🖨 Print / Save as PDF
        </button>
      </div>

      <div className="report-inner">

        {/* Header */}
        <div className="report-header">
          <div className="report-brand">Tech <span>Jersey</span></div>
          <div className="report-meta">
            <div>AI Automation Audit</div>
            <div>Prepared for: <strong>{name}</strong></div>
            <div>Date: {today}</div>
          </div>
        </div>

        {/* Title */}
        <div className="report-title-block">
          <div className="report-subtitle">Confidential Report</div>
          <div className="report-title">Automation Readiness Assessment</div>
          <div className="report-prepared">Prepared by Tech Jersey Engineering Studio</div>
        </div>

        {/* Score band */}
        <div className="report-score-band" style={{ borderColor: bandColor }}>
          <div className="report-score-number" style={{ color: bandColor }}>
            {score}
            <span style={{ fontSize: 18, color: '#999' }}>/100</span>
          </div>
          <div>
            <div className="report-score-label">{label}</div>
            <div className="report-score-summary">
              This score reflects the urgency and revenue impact of automating your current
              business workflows based on your audit responses.
            </div>
          </div>
        </div>

        {/* Savings */}
        {savings > 0 && (
          <div className="report-savings">
            💰 Estimated Monthly Savings: {formatINR(savings)} / month
          </div>
        )}

        {/* Recommendations placeholder */}
        <div className="report-section">
          <div className="report-section-title">Recommended Next Steps</div>
          <div className="report-list">
            <div className="report-list-item">
              📞 Book a free 30-minute strategy call with the Tech Jersey team to discuss your
              personalised automation blueprint.
            </div>
            <div className="report-list-item">
              📄 Request a detailed System Architecture Document covering your recommended
              automation stack and integration points.
            </div>
            <div className="report-list-item">
              💬 Connect on WhatsApp (+91 73579 71717) for a rapid consultation and
              receive a fixed-price proposal within 48 hours.
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="report-section">
          <div className="report-section-title">Contact Tech Jersey</div>
          <div className="report-list">
            <div className="report-list-item">
              <strong>WhatsApp:</strong> +91 73579 71717
            </div>
            <div className="report-list-item">
              <strong>Email:</strong> tech.jersey.d@gmail.com
            </div>
            <div className="report-list-item">
              <strong>Website:</strong> {process.env.NEXT_PUBLIC_SERVER_URL || 'https://techjersey.in'}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="report-footer">
          <span>© {new Date().getFullYear()} Tech Jersey Studio. Confidential.</span>
          <span>Automation Readiness Score: {score}/100</span>
        </div>

      </div>
    </div>
  )
}

export default function AuditReportPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, fontFamily: 'sans-serif' }}>Loading report…</div>}>
      <ReportContent />
    </Suspense>
  )
}
