'use client'
import { useState, useMemo, useEffect, useRef } from 'react'
import { trackCRMCalculatorUsed } from '@/lib/analytics'

interface SliderConfig {
  id: string
  label: string
  icon: string
  min: number
  max: number
  step: number
  defaultValue: number
  unit: string
  tooltipText: string
}

const SLIDERS: SliderConfig[] = [
  {
    id: 'leads',
    label: 'Monthly Leads',
    icon: '🎯',
    min: 50,
    max: 2000,
    step: 50,
    defaultValue: 300,
    unit: '',
    tooltipText: 'Total inbound leads per month across all channels',
  },
  {
    id: 'leakage',
    label: 'Lead Leakage Rate',
    icon: '💧',
    min: 5,
    max: 60,
    step: 5,
    defaultValue: 30,
    unit: '%',
    tooltipText: 'Percentage of leads that go uncontacted or fall through cracks',
  },
  {
    id: 'dealValue',
    label: 'Avg Deal Value',
    icon: '💰',
    min: 5000,
    max: 500000,
    step: 5000,
    defaultValue: 50000,
    unit: '₹',
    tooltipText: 'Average revenue per closed deal',
  },
  {
    id: 'closeRate',
    label: 'Current Close Rate',
    icon: '📈',
    min: 2,
    max: 40,
    step: 1,
    defaultValue: 12,
    unit: '%',
    tooltipText: 'Percentage of leads that currently convert to paying customers',
  },
]

function formatINR(value: number): string {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`
  if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`
  return `₹${value.toLocaleString('en-IN')}`
}

export default function CRMRevenueCalculator() {
  const [values, setValues] = useState<Record<string, number>>(
    Object.fromEntries(SLIDERS.map(s => [s.id, s.defaultValue]))
  )

  const updateValue = (id: string, val: number) => {
    setValues(prev => ({ ...prev, [id]: val }))
  }

  const calculations = useMemo(() => {
    const { leads, leakage, dealValue, closeRate } = values

    // Current state
    const leadsLost = Math.round(leads * (leakage / 100))
    const leadsWorked = leads - leadsLost
    const currentDeals = Math.round(leadsWorked * (closeRate / 100))
    const currentRevenue = currentDeals * dealValue

    // With automation (reduce leakage to ~5%, improve close rate by 25%)
    const autoLeakage = Math.max(5, leakage * 0.2) // Reduce leakage to 20% of current or min 5%
    const autoLeadsLost = Math.round(leads * (autoLeakage / 100))
    const autoLeadsWorked = leads - autoLeadsLost
    const autoCloseRate = Math.min(closeRate * 1.25, 50) // 25% improvement, cap at 50%
    const autoDeals = Math.round(autoLeadsWorked * (autoCloseRate / 100))
    const autoRevenue = autoDeals * dealValue

    // Recovery
    const revenueRecovered = autoRevenue - currentRevenue
    const leadsRecovered = autoLeadsWorked - leadsWorked
    const additionalDeals = autoDeals - currentDeals

    // Response time improvement
    const avgResponseTimeHours = leakage > 30 ? 24 : leakage > 15 ? 6 : 2
    const autoResponseMinutes = 2

    return {
      currentRevenue,
      autoRevenue,
      revenueRecovered,
      leadsLost,
      leadsRecovered,
      currentDeals,
      additionalDeals,
      autoDeals,
      avgResponseTimeHours,
      autoResponseMinutes,
      monthlyRecovery: revenueRecovered,
      annualRecovery: revenueRecovered * 12,
    }
  }, [values])

  // Track calculator usage (debounced)
  const trackTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  useEffect(() => {
    if (trackTimeoutRef.current) clearTimeout(trackTimeoutRef.current)
    trackTimeoutRef.current = setTimeout(() => {
      trackCRMCalculatorUsed(calculations.monthlyRecovery, calculations.annualRecovery)
    }, 2000)
    return () => { if (trackTimeoutRef.current) clearTimeout(trackTimeoutRef.current) }
  }, [calculations.monthlyRecovery, calculations.annualRecovery])

  return (
    <div className="crm-calc-container">
      {/* Title */}
      <div className="crm-calc-title-row">
        <span className="crm-calc-badge">Interactive Calculator</span>
        <h3 className="crm-calc-title">How Much Revenue Are You Leaving on the Table?</h3>
        <p className="crm-calc-subtitle">Adjust the sliders below to match your business. See exactly how much revenue CRM automation can recover.</p>
      </div>

      <div className="crm-calc-grid">
        {/* Inputs */}
        <div className="crm-calc-inputs">
          {SLIDERS.map(slider => (
            <div key={slider.id} className="crm-calc-slider-group">
              <div className="crm-calc-slider-header">
                <span className="crm-calc-slider-icon">{slider.icon}</span>
                <span className="crm-calc-slider-label">{slider.label}</span>
                <span className="crm-calc-slider-value">
                  {slider.unit === '₹' ? formatINR(values[slider.id]) : `${values[slider.id]}${slider.unit}`}
                </span>
              </div>
              <input
                type="range"
                min={slider.min}
                max={slider.max}
                step={slider.step}
                value={values[slider.id]}
                onChange={e => updateValue(slider.id, Number(e.target.value))}
                className="crm-calc-range"
                style={{
                  background: `linear-gradient(to right, var(--em) 0%, var(--em) ${((values[slider.id] - slider.min) / (slider.max - slider.min)) * 100}%, rgba(255,255,255,0.08) ${((values[slider.id] - slider.min) / (slider.max - slider.min)) * 100}%, rgba(255,255,255,0.08) 100%)`,
                }}
              />
              <div className="crm-calc-slider-range">
                <span>{slider.unit === '₹' ? formatINR(slider.min) : `${slider.min}${slider.unit}`}</span>
                <span>{slider.unit === '₹' ? formatINR(slider.max) : `${slider.max}${slider.unit}`}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Results */}
        <div className="crm-calc-results">
          {/* Revenue Recovery */}
          <div className="crm-calc-result-card crm-calc-result-highlight">
            <span className="crm-calc-result-badge">Revenue Recovered</span>
            <div className="crm-calc-result-value">{formatINR(calculations.monthlyRecovery)}</div>
            <span className="crm-calc-result-period">per month</span>
            <div className="crm-calc-result-annual">
              {formatINR(calculations.annualRecovery)} <span>annually</span>
            </div>
          </div>

          {/* Comparison */}
          <div className="crm-calc-comparison">
            <div className="crm-calc-compare-item">
              <span className="crm-calc-compare-label">Current Revenue</span>
              <span className="crm-calc-compare-value crm-calc-compare-current">{formatINR(calculations.currentRevenue)}/mo</span>
            </div>
            <div className="crm-calc-compare-arrow">→</div>
            <div className="crm-calc-compare-item">
              <span className="crm-calc-compare-label">With Automation</span>
              <span className="crm-calc-compare-value crm-calc-compare-auto">{formatINR(calculations.autoRevenue)}/mo</span>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="crm-calc-metrics-grid">
            <div className="crm-calc-metric">
              <span className="crm-calc-metric-icon">🎯</span>
              <span className="crm-calc-metric-value">+{calculations.leadsRecovered}</span>
              <span className="crm-calc-metric-label">Leads Recovered</span>
            </div>
            <div className="crm-calc-metric">
              <span className="crm-calc-metric-icon">🤝</span>
              <span className="crm-calc-metric-value">+{calculations.additionalDeals}</span>
              <span className="crm-calc-metric-label">Extra Deals/Mo</span>
            </div>
            <div className="crm-calc-metric">
              <span className="crm-calc-metric-icon">⚡</span>
              <span className="crm-calc-metric-value">{calculations.avgResponseTimeHours}h → {calculations.autoResponseMinutes}min</span>
              <span className="crm-calc-metric-label">Response Time</span>
            </div>
            <div className="crm-calc-metric">
              <span className="crm-calc-metric-icon">💧</span>
              <span className="crm-calc-metric-value">-{calculations.leadsLost}</span>
              <span className="crm-calc-metric-label">Leads Saved from Leaking</span>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .crm-calc-container {
          background: rgba(10,15,20,0.4);
          border: 1px solid rgba(255,255,255,0.04);
          border-radius: 20px;
          padding: 48px 40px;
          position: relative;
          overflow: hidden;
        }

        .crm-calc-container::before {
          content: '';
          position: absolute;
          top: -100px;
          right: -100px;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(15,159,112,0.06), transparent 70%);
          pointer-events: none;
        }

        .crm-calc-title-row {
          text-align: center;
          margin-bottom: 48px;
        }

        .crm-calc-badge {
          display: inline-block;
          font-family: var(--display);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--em);
          background: rgba(15,159,112,0.08);
          border: 1px solid rgba(15,159,112,0.15);
          padding: 6px 16px;
          border-radius: 20px;
          margin-bottom: 16px;
        }

        .crm-calc-title {
          font-family: var(--display);
          font-size: clamp(22px, 3vw, 32px);
          font-weight: 300;
          color: var(--text);
          letter-spacing: -0.5px;
          margin-bottom: 12px;
        }

        .crm-calc-subtitle {
          font-family: var(--body);
          font-size: 14px;
          color: var(--text-s);
          font-weight: 300;
          max-width: 520px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .crm-calc-grid {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 48px;
          align-items: start;
        }

        .crm-calc-inputs {
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        .crm-calc-slider-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .crm-calc-slider-header {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .crm-calc-slider-icon {
          font-size: 14px;
        }

        .crm-calc-slider-label {
          font-family: var(--display);
          font-size: 12px;
          font-weight: 500;
          color: var(--text-s);
          flex-grow: 1;
        }

        .crm-calc-slider-value {
          font-family: var(--display);
          font-size: 14px;
          font-weight: 700;
          color: var(--em);
        }

        .crm-calc-range {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 6px;
          border-radius: 6px;
          outline: none;
          cursor: pointer;
        }

        .crm-calc-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: var(--em);
          border: 2px solid #fff;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(15,159,112,0.3);
          transition: transform 0.15s ease;
        }

        .crm-calc-range::-webkit-slider-thumb:hover {
          transform: scale(1.15);
        }

        .crm-calc-range::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: var(--em);
          border: 2px solid #fff;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(15,159,112,0.3);
        }

        .crm-calc-slider-range {
          display: flex;
          justify-content: space-between;
          font-family: var(--body);
          font-size: 10px;
          color: var(--text-m);
        }

        .crm-calc-results {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .crm-calc-result-card {
          padding: 32px 28px;
          border-radius: 16px;
          text-align: center;
        }

        .crm-calc-result-highlight {
          background: rgba(15,159,112,0.06);
          border: 1px solid rgba(15,159,112,0.2);
        }

        .crm-calc-result-badge {
          display: inline-block;
          font-family: var(--display);
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--em);
          margin-bottom: 12px;
        }

        .crm-calc-result-value {
          font-family: var(--display);
          font-size: clamp(36px, 5vw, 52px);
          font-weight: 700;
          background: linear-gradient(135deg, var(--text), var(--em));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          line-height: 1.1;
          margin-bottom: 4px;
        }

        .crm-calc-result-period {
          font-family: var(--body);
          font-size: 13px;
          color: var(--text-s);
          font-weight: 300;
        }

        .crm-calc-result-annual {
          margin-top: 12px;
          font-family: var(--display);
          font-size: 16px;
          font-weight: 600;
          color: var(--em);
        }

        .crm-calc-result-annual span {
          font-weight: 300;
          color: var(--text-s);
          font-size: 12px;
        }

        .crm-calc-comparison {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.04);
          border-radius: 12px;
        }

        .crm-calc-compare-item {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .crm-calc-compare-label {
          font-family: var(--body);
          font-size: 10px;
          color: var(--text-s);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .crm-calc-compare-value {
          font-family: var(--display);
          font-size: 16px;
          font-weight: 700;
        }

        .crm-calc-compare-current {
          color: var(--text-s);
        }

        .crm-calc-compare-auto {
          color: var(--em);
        }

        .crm-calc-compare-arrow {
          font-size: 20px;
          color: var(--em);
          flex-shrink: 0;
        }

        .crm-calc-metrics-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .crm-calc-metric {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 16px 12px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.04);
          border-radius: 12px;
          transition: border-color 0.3s ease;
        }

        .crm-calc-metric:hover {
          border-color: rgba(15,159,112,0.2);
        }

        .crm-calc-metric-icon {
          font-size: 18px;
        }

        .crm-calc-metric-value {
          font-family: var(--display);
          font-size: 14px;
          font-weight: 700;
          color: var(--em);
        }

        .crm-calc-metric-label {
          font-family: var(--body);
          font-size: 9px;
          color: var(--text-s);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          text-align: center;
        }

        @media (max-width: 1024px) {
          .crm-calc-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          .crm-calc-container {
            padding: 32px 24px;
          }
        }

        @media (max-width: 768px) {
          .crm-calc-container {
            padding: 24px 16px;
            border-radius: 14px;
          }

          .crm-calc-title-row {
            margin-bottom: 32px;
          }

          .crm-calc-result-card {
            padding: 24px 16px;
          }

          .crm-calc-metrics-grid {
            grid-template-columns: 1fr 1fr;
            gap: 8px;
          }

          .crm-calc-metric {
            padding: 12px 8px;
          }

          .crm-calc-comparison {
            flex-direction: column;
            gap: 12px;
            text-align: center;
          }

          .crm-calc-compare-arrow {
            transform: rotate(90deg);
          }
        }
      `}} />
    </div>
  )
}
