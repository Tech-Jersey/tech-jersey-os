'use client'
import { useState, useEffect, useCallback } from 'react'
import { trackCRMPipelineRun } from '@/lib/analytics'

interface PipelineStage {
  id: string
  label: string
  icon: string
  description: string
  status: 'idle' | 'active' | 'done'
  metric: string
  metricLabel: string
}

const INITIAL_STAGES: PipelineStage[] = [
  {
    id: 'capture',
    label: 'Lead Captured',
    icon: '🎯',
    description: 'Website form, WhatsApp, or ad click auto-captured into CRM',
    status: 'idle',
    metric: '<1s',
    metricLabel: 'Capture Time',
  },
  {
    id: 'enrich',
    label: 'Data Enriched',
    icon: '🔍',
    description: 'Company size, industry, revenue range auto-populated via APIs',
    status: 'idle',
    metric: '12+',
    metricLabel: 'Data Points Added',
  },
  {
    id: 'score',
    label: 'Lead Scored',
    icon: '📊',
    description: 'AI assigns priority score based on fit, intent, and engagement',
    status: 'idle',
    metric: '94/100',
    metricLabel: 'Lead Score',
  },
  {
    id: 'assign',
    label: 'Auto-Assigned',
    icon: '👤',
    description: 'Routed to the right sales rep based on territory, load, and expertise',
    status: 'idle',
    metric: '0s',
    metricLabel: 'Assignment Delay',
  },
  {
    id: 'notify',
    label: 'Team Notified',
    icon: '🔔',
    description: 'Slack, WhatsApp, and email alerts sent with full lead context',
    status: 'idle',
    metric: '3',
    metricLabel: 'Channels Notified',
  },
  {
    id: 'followup',
    label: 'Follow-Up Triggered',
    icon: '🤖',
    description: 'Personalized email + WhatsApp sequence starts automatically',
    status: 'idle',
    metric: '<2min',
    metricLabel: 'First Touch Time',
  },
]

export default function CRMWorkflowSimulator() {
  const [stages, setStages] = useState<PipelineStage[]>(INITIAL_STAGES)
  const [isRunning, setIsRunning] = useState(false)
  const [currentStageIndex, setCurrentStageIndex] = useState(-1)
  const [showSummary, setShowSummary] = useState(false)

  const runPipeline = useCallback(() => {
    if (isRunning) return
    setIsRunning(true)
    setShowSummary(false)
    setStages(INITIAL_STAGES)
    setCurrentStageIndex(0)
    trackCRMPipelineRun()
  }, [isRunning])

  useEffect(() => {
    if (currentStageIndex < 0 || currentStageIndex >= stages.length) return

    // Set current stage to active
    setStages(prev =>
      prev.map((s, i) => ({
        ...s,
        status: i === currentStageIndex ? 'active' : i < currentStageIndex ? 'done' : 'idle',
      }))
    )

    const timer = setTimeout(() => {
      // Mark current as done
      setStages(prev =>
        prev.map((s, i) => ({
          ...s,
          status: i <= currentStageIndex ? 'done' : 'idle',
        }))
      )

      if (currentStageIndex < stages.length - 1) {
        setTimeout(() => setCurrentStageIndex(prev => prev + 1), 200)
      } else {
        setTimeout(() => {
          setShowSummary(true)
          setIsRunning(false)
        }, 400)
      }
    }, 900)

    return () => clearTimeout(timer)
  }, [currentStageIndex, stages.length])

  const resetPipeline = () => {
    setStages(INITIAL_STAGES)
    setIsRunning(false)
    setCurrentStageIndex(-1)
    setShowSummary(false)
  }

  return (
    <div className="crm-sim-container">
      {/* Header */}
      <div className="crm-sim-header">
        <div className="crm-sim-header-dot green" />
        <div className="crm-sim-header-dot yellow" />
        <div className="crm-sim-header-dot red" />
        <span className="crm-sim-header-title">CRM Pipeline Automation</span>
      </div>

      {/* Pipeline */}
      <div className="crm-sim-body">
        {/* Lead Input */}
        <div className={`crm-sim-lead-input ${currentStageIndex >= 0 ? 'active' : ''}`}>
          <div className="crm-sim-lead-avatar">RK</div>
          <div className="crm-sim-lead-info">
            <span className="crm-sim-lead-name">Rahul Kumar</span>
            <span className="crm-sim-lead-source">via Website Contact Form</span>
          </div>
          <span className={`crm-sim-lead-badge ${currentStageIndex >= 0 ? 'show' : ''}`}>
            New Lead
          </span>
        </div>

        {/* Stages */}
        <div className="crm-sim-stages">
          {stages.map((stage, i) => (
            <div
              key={stage.id}
              className={`crm-sim-stage crm-sim-stage--${stage.status}`}
            >
              <div className="crm-sim-stage-connector">
                <div className={`crm-sim-stage-line ${stage.status !== 'idle' ? 'filled' : ''}`} />
              </div>
              <div className="crm-sim-stage-icon">{stage.icon}</div>
              <div className="crm-sim-stage-content">
                <span className="crm-sim-stage-label">{stage.label}</span>
                <span className="crm-sim-stage-desc">{stage.description}</span>
              </div>
              {stage.status === 'done' && (
                <div className="crm-sim-stage-metric">
                  <span className="crm-sim-metric-value">{stage.metric}</span>
                  <span className="crm-sim-metric-label">{stage.metricLabel}</span>
                </div>
              )}
              {stage.status === 'active' && (
                <div className="crm-sim-stage-spinner">
                  <div className="crm-spinner" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Summary */}
        {showSummary && (
          <div className="crm-sim-summary">
            <div className="crm-sim-summary-icon">✅</div>
            <div className="crm-sim-summary-text">
              <strong>Pipeline Complete</strong>
              <span>Lead captured, scored, assigned, and first follow-up sent — all in under 2 minutes. Zero manual effort.</span>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="crm-sim-controls">
          <button
            onClick={runPipeline}
            disabled={isRunning}
            className="crm-sim-run-btn"
          >
            {isRunning ? 'Running Pipeline...' : showSummary ? '🔄 Run Again' : '▶ Run Pipeline Demo'}
          </button>
          {showSummary && (
            <button onClick={resetPipeline} className="crm-sim-reset-btn">
              Reset
            </button>
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .crm-sim-container {
          width: 100%;
          max-width: 540px;
          margin: 0 auto;
          background: #0d1117;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 30px 60px rgba(0,0,0,0.4);
        }

        .crm-sim-header {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 12px 16px;
          background: rgba(255,255,255,0.03);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        .crm-sim-header-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }

        .crm-sim-header-dot.green { background: #0f9f70; }
        .crm-sim-header-dot.yellow { background: #f5a623; }
        .crm-sim-header-dot.red { background: #e74c3c; }

        .crm-sim-header-title {
          margin-left: 12px;
          font-family: var(--display);
          font-size: 12px;
          font-weight: 600;
          color: var(--text-s);
          letter-spacing: 0.5px;
        }

        .crm-sim-body {
          padding: 24px 20px;
        }

        .crm-sim-lead-input {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          background: rgba(15,159,112,0.04);
          border: 1px solid rgba(15,159,112,0.1);
          border-radius: 12px;
          margin-bottom: 20px;
          opacity: 0.5;
          transition: opacity 0.4s ease, border-color 0.4s ease;
        }

        .crm-sim-lead-input.active {
          opacity: 1;
          border-color: rgba(15,159,112,0.3);
        }

        .crm-sim-lead-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--em), #4fffca);
          color: #000;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--display);
          font-size: 12px;
          font-weight: 700;
          flex-shrink: 0;
        }

        .crm-sim-lead-info {
          display: flex;
          flex-direction: column;
          flex-grow: 1;
          min-width: 0;
        }

        .crm-sim-lead-name {
          font-family: var(--display);
          font-size: 13px;
          font-weight: 600;
          color: var(--text);
        }

        .crm-sim-lead-source {
          font-family: var(--body);
          font-size: 11px;
          color: var(--text-s);
        }

        .crm-sim-lead-badge {
          font-family: var(--display);
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: #000;
          background: linear-gradient(135deg, var(--em), #4fffca);
          padding: 4px 10px;
          border-radius: 20px;
          white-space: nowrap;
          opacity: 0;
          transform: scale(0.8);
          transition: opacity 0.3s ease, transform 0.3s ease;
          flex-shrink: 0;
        }

        .crm-sim-lead-badge.show {
          opacity: 1;
          transform: scale(1);
        }

        .crm-sim-stages {
          display: flex;
          flex-direction: column;
          gap: 0;
          margin-bottom: 20px;
        }

        .crm-sim-stage {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 10px;
          transition: background 0.3s ease, opacity 0.3s ease;
          opacity: 0.4;
          position: relative;
        }

        .crm-sim-stage--active {
          background: rgba(15,159,112,0.08);
          opacity: 1;
        }

        .crm-sim-stage--done {
          opacity: 1;
        }

        .crm-sim-stage-connector {
          width: 2px;
          height: 100%;
          position: absolute;
          left: 32px;
          top: 0;
        }

        .crm-sim-stage-line {
          width: 2px;
          height: 100%;
          background: rgba(255,255,255,0.06);
          transition: background 0.4s ease;
        }

        .crm-sim-stage-line.filled {
          background: var(--em);
        }

        .crm-sim-stage:first-child .crm-sim-stage-connector,
        .crm-sim-stage:last-child .crm-sim-stage-connector { display: none; }

        .crm-sim-stage-icon {
          font-size: 18px;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          flex-shrink: 0;
          z-index: 1;
          transition: border-color 0.3s ease, background 0.3s ease;
        }

        .crm-sim-stage--active .crm-sim-stage-icon {
          border-color: var(--em);
          background: rgba(15,159,112,0.1);
        }

        .crm-sim-stage--done .crm-sim-stage-icon {
          border-color: rgba(15,159,112,0.3);
          background: rgba(15,159,112,0.06);
        }

        .crm-sim-stage-content {
          display: flex;
          flex-direction: column;
          flex-grow: 1;
          min-width: 0;
        }

        .crm-sim-stage-label {
          font-family: var(--display);
          font-size: 12px;
          font-weight: 600;
          color: var(--text);
        }

        .crm-sim-stage-desc {
          font-family: var(--body);
          font-size: 10px;
          color: var(--text-s);
          line-height: 1.4;
        }

        .crm-sim-stage-metric {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          flex-shrink: 0;
          animation: metricFadeIn 0.3s ease forwards;
        }

        .crm-sim-metric-value {
          font-family: var(--display);
          font-size: 14px;
          font-weight: 700;
          color: var(--em);
        }

        .crm-sim-metric-label {
          font-family: var(--body);
          font-size: 8px;
          color: var(--text-s);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        @keyframes metricFadeIn {
          from { opacity: 0; transform: translateX(8px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .crm-sim-stage-spinner {
          flex-shrink: 0;
        }

        .crm-spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(15,159,112,0.2);
          border-top-color: var(--em);
          border-radius: 50%;
          animation: crmSpin 0.6s linear infinite;
        }

        @keyframes crmSpin {
          to { transform: rotate(360deg); }
        }

        .crm-sim-summary {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 16px;
          background: rgba(15,159,112,0.06);
          border: 1px solid rgba(15,159,112,0.2);
          border-radius: 12px;
          margin-bottom: 20px;
          animation: summarySlideIn 0.4s ease forwards;
        }

        @keyframes summarySlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .crm-sim-summary-icon {
          font-size: 20px;
          flex-shrink: 0;
        }

        .crm-sim-summary-text {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .crm-sim-summary-text strong {
          font-family: var(--display);
          font-size: 13px;
          font-weight: 700;
          color: var(--em);
        }

        .crm-sim-summary-text span {
          font-family: var(--body);
          font-size: 11px;
          color: var(--text-s);
          line-height: 1.5;
        }

        .crm-sim-controls {
          display: flex;
          gap: 10px;
        }

        .crm-sim-run-btn {
          flex-grow: 1;
          padding: 12px 20px;
          background: linear-gradient(135deg, var(--em), #4fffca);
          color: #000;
          font-family: var(--display);
          font-size: 13px;
          font-weight: 700;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: opacity 0.2s ease, transform 0.2s ease;
        }

        .crm-sim-run-btn:hover:not(:disabled) {
          opacity: 0.9;
          transform: translateY(-1px);
        }

        .crm-sim-run-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .crm-sim-reset-btn {
          padding: 12px 16px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          color: var(--text-s);
          font-family: var(--display);
          font-size: 12px;
          font-weight: 500;
          border-radius: 10px;
          cursor: pointer;
          transition: border-color 0.2s ease;
        }

        .crm-sim-reset-btn:hover {
          border-color: rgba(255,255,255,0.2);
        }

        @media (max-width: 768px) {
          .crm-sim-container {
            max-width: 100%;
            border-radius: 12px;
          }

          .crm-sim-body {
            padding: 16px 12px;
          }

          .crm-sim-stage-desc {
            display: none;
          }

          .crm-sim-lead-source {
            display: none;
          }
        }
      `}} />
    </div>
  )
}
