'use client'
import { useState } from 'react'
import Link from 'next/link'

interface CaseStudyCardProps {
  id: string
  client: string
  slug: string
  industry: string
  summary: string
  metrics: { value: string; label: string }[]
  relatedServices?: any[]
}

interface CaseStudiesGridProps {
  initialCaseStudies: CaseStudyCardProps[]
  services: { id: string | number; title: string; slug: string }[]
}

const INDUSTRIES = [
  { label: 'All Industries', value: 'all' },
  { label: 'Real Estate', value: 'real-estate' },
  { label: 'Education', value: 'education' },
  { label: 'Retail & Luxury', value: 'retail' },
  { label: 'Healthcare', value: 'healthcare' },
  { label: 'Finance', value: 'finance' },
  { label: 'Technology', value: 'technology' },
  { label: 'Other', value: 'other' },
]

export default function CaseStudiesGrid({ initialCaseStudies, services }: CaseStudiesGridProps) {
  const [selectedService, setSelectedService] = useState<string>('all')
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all')

  const filteredCaseStudies = initialCaseStudies.filter(cs => {
    // Service Filter Check
    let matchesService = true
    if (selectedService !== 'all') {
      if (!cs.relatedServices) {
        matchesService = false
      } else {
        matchesService = cs.relatedServices.some(s => {
          const sId = typeof s === 'object' ? s.id?.toString() : s?.toString()
          return sId === selectedService
        })
      }
    }

    // Industry Filter Check
    let matchesIndustry = true
    if (selectedIndustry !== 'all') {
      matchesIndustry = cs.industry === selectedIndustry
    }

    return matchesService && matchesIndustry
  })

  return (
    <div className="case-grid-wrapper">
      {/* FILTER CONTROLS */}
      <div className="filters-container">
        {/* SERVICES / CAPABILITY FILTER */}
        <div className="filter-group">
          <span className="filter-group-label">By Deployed Capability:</span>
          <div className="filter-row">
            <button
              className={`filter-btn ${selectedService === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedService('all')}
            >
              All Capabilities
            </button>
            {services.map(s => (
              <button
                key={s.id}
                className={`filter-btn ${selectedService === s.id.toString() ? 'active' : ''}`}
                onClick={() => setSelectedService(s.id.toString())}
              >
                {s.title.replace('Stop Losing Leads Between Your Website, CRM, and Sales Team.', 'CRM Automation').split('.')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* INDUSTRIES FILTER */}
        <div className="filter-group" style={{ marginTop: 16 }}>
          <span className="filter-group-label">By Industry:</span>
          <div className="filter-row">
            {INDUSTRIES.map(ind => (
              <button
                key={ind.value}
                className={`filter-btn ${selectedIndustry === ind.value ? 'active' : ''}`}
                onClick={() => setSelectedIndustry(ind.value)}
              >
                {ind.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CASE STUDIES RESULTS GRID */}
      {filteredCaseStudies.length === 0 ? (
        <div className="empty-results">
          <h3>No matching case studies</h3>
          <p>Try resetting the filters to view all deployment stories.</p>
        </div>
      ) : (
        <div className="case-list-grid">
          {filteredCaseStudies.map(cs => {
            // Get the first primary metric
            const highlightMetric = cs.metrics?.[0] || { value: '100%', label: 'Success' }
            const industryLabel = INDUSTRIES.find(ind => ind.value === cs.industry)?.label || 'Deployment'
            
            return (
              <div key={cs.id} className="case-study-card">
                <div className="card-top">
                  <span className="card-industry">{industryLabel}</span>
                  <div className="card-metric-badge">
                    <span className="badge-value">{highlightMetric.value}</span>
                    <span className="badge-label">{highlightMetric.label}</span>
                  </div>
                </div>

                <h3 className="card-title">{cs.client}</h3>
                <p className="card-summary">{cs.summary}</p>

                <div className="card-footer">
                  <Link href={`/case-studies/${cs.slug}`} className="btn-read-case">
                    Read Success Story →
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .case-grid-wrapper {
          width: 100%;
        }

        .filters-container {
          background: rgba(10, 15, 20, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 48px;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .filter-group-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1.5px;
          color: var(--text-m);
          text-transform: uppercase;
        }

        .filter-row {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .filter-btn {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255,255,255,0.06);
          color: var(--text-s);
          padding: 6px 14px;
          border-radius: 6px;
          font-family: var(--display);
          font-size: 12px;
          cursor: pointer;
          transition: all 0.3s var(--ease);
          outline: none;
        }

        .filter-btn:hover {
          border-color: rgba(15, 159, 112, 0.3);
          color: var(--text);
          background: rgba(15, 159, 112, 0.02);
        }

        .filter-btn.active {
          background: rgba(15, 159, 112, 0.1);
          border-color: var(--em);
          color: var(--em);
        }

        /* Results Grid */
        .case-list-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        .case-study-card {
          background: rgba(10, 15, 20, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 16px;
          padding: 32px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: all 0.4s var(--ease);
          min-height: 340px;
        }

        .case-study-card:hover {
          border-color: rgba(15, 159, 112, 0.25);
          transform: translateY(-4px);
          background: rgba(10, 15, 20, 0.5);
        }

        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 24px;
        }

        .card-industry {
          font-size: 11px;
          color: var(--text-m);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .card-metric-badge {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          text-align: right;
        }

        .badge-value {
          font-family: var(--display);
          font-size: 24px;
          font-weight: 700;
          color: var(--em);
          line-height: 1.1;
        }

        .badge-label {
          font-size: 9px;
          color: var(--text-m);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-top: 2px;
        }

        .card-title {
          font-family: var(--display);
          font-size: 18px;
          font-weight: 600;
          color: var(--text);
          margin-bottom: 12px;
          line-height: 1.3;
        }

        .card-summary {
          font-family: var(--body);
          font-size: 13px;
          line-height: 1.6;
          color: var(--text-s);
          font-weight: 300;
          margin-bottom: 24px;
          flex-grow: 1;
        }

        .btn-read-case {
          font-family: var(--display);
          font-size: 12px;
          color: var(--em);
          text-decoration: none;
          font-weight: 600;
          border-bottom: 1px solid transparent;
          transition: border-color 0.3s;
          display: inline-block;
        }

        .btn-read-case:hover {
          border-color: var(--em);
        }

        .empty-results {
          text-align: center;
          padding: 80px 20px;
          background: rgba(10, 15, 20, 0.2);
          border: 1px dashed rgba(255, 255, 255, 0.05);
          border-radius: 16px;
        }

        .empty-results h3 {
          font-family: var(--display);
          font-size: 18px;
          font-weight: 500;
          color: var(--text);
          margin-bottom: 8px;
        }

        .empty-results p {
          font-size: 13px;
          color: var(--text-m);
        }

        @media (max-width: 1024px) {
          .case-list-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .case-list-grid {
            grid-template-columns: 1fr;
          }
          .filters-container {
            padding: 16px;
          }
          .case-study-card {
            padding: 24px;
          }
        }
      `}} />
    </div>
  )
}
