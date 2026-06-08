interface ProcessStep {
  icon: string
  title: string
  description?: string
  techTag?: string
}

interface ProcessPipelineProps {
  steps?: ProcessStep[]
  /** Accentuate connector color */
  accentColor?: string
}

// Default 4-step generic flow shown when no CMS steps are defined
const DEFAULT_STEPS: ProcessStep[] = [
  { icon: '📥', title: 'Intake Trigger', description: 'Webhook or API trigger fires instantly on new event or file upload.', techTag: 'n8n' },
  { icon: '🧠', title: 'AI Processing', description: 'Vision model parsing, intent classification, and schema validation.', techTag: 'OpenAI' },
  { icon: '🔄', title: 'Data Reconciliation', description: 'Mathematical verification, deduplication, and format normalization.', techTag: 'Custom Logic' },
  { icon: '💾', title: 'System Sync', description: 'Direct insertion into CRM, ERP, or accounting system via API.', techTag: 'HubSpot / Zoho' },
]

export default function ProcessPipeline({ steps, accentColor = 'var(--em)' }: ProcessPipelineProps) {
  const items = (steps && steps.length > 0) ? steps : DEFAULT_STEPS

  return (
    <div style={{ width: '100%' }}>
      {/* Desktop: horizontal flow */}
      <div className="pipeline-flow">
        {items.map((step, idx) => (
          <div key={idx} className="pipeline-row-item">
            {/* Node */}
            <div className="pipeline-node-card">
              <div className="pipeline-node-icon">{step.icon}</div>
              <div className="pipeline-step-num" style={{ color: accentColor }}>
                Step {idx + 1}
              </div>
              <h4 className="pipeline-node-title">{step.title}</h4>
              {step.description && (
                <p className="pipeline-node-desc">{step.description}</p>
              )}
              {step.techTag && (
                <div className="pipeline-tech-tag" style={{ borderColor: `${accentColor}40`, color: accentColor }}>
                  {step.techTag}
                </div>
              )}
            </div>

            {/* Connector — not after last item */}
            {idx < items.length - 1 && (
              <div className="pipeline-connector-wrap" aria-hidden="true">
                <svg width="100%" height="20" viewBox="0 0 60 20" preserveAspectRatio="none" fill="none">
                  <path d="M0 10 H52" stroke={accentColor} strokeWidth="1.5" strokeDasharray="5,4" strokeOpacity="0.5" />
                  <polygon points="50,5 50,15 60,10" fill={accentColor} opacity="0.5" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Mobile: vertical stacked flow */}
      <div className="pipeline-flow-mobile">
        {items.map((step, idx) => (
          <div key={idx} className="pipeline-mobile-item">
            <div className="pipeline-mobile-left">
              <div className="pipeline-mobile-icon">{step.icon}</div>
              {idx < items.length - 1 && (
                <div className="pipeline-mobile-line" style={{ background: `${accentColor}30` }} />
              )}
            </div>
            <div className="pipeline-mobile-content">
              <div style={{ fontSize: 10, color: accentColor, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 4 }}>
                Step {idx + 1}
              </div>
              <h4 style={{ fontFamily: 'var(--display)', fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>
                {step.title}
              </h4>
              {step.description && (
                <p style={{ fontSize: 12, color: 'var(--text-s)', lineHeight: 1.5, fontWeight: 300 }}>
                  {step.description}
                </p>
              )}
              {step.techTag && (
                <div className="pipeline-tech-tag" style={{ marginTop: 8, display: 'inline-block', borderColor: `${accentColor}40`, color: accentColor }}>
                  {step.techTag}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        /* ── DESKTOP FLOW ── */
        .pipeline-flow {
          display: flex;
          align-items: flex-start;
          gap: 0;
          width: 100%;
        }

        .pipeline-row-item {
          display: flex;
          align-items: center;
          flex: 1;
        }

        .pipeline-connector-wrap {
          width: 60px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          margin-top: -40px;
        }

        .pipeline-node-card {
          flex: 1;
          background: rgba(10, 15, 20, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 14px;
          padding: 24px 20px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          transition: border-color 0.3s ease, transform 0.3s ease;
          min-height: 180px;
          justify-content: flex-start;
        }

        .pipeline-node-card:hover {
          border-color: rgba(15, 159, 112, 0.25);
          transform: translateY(-3px);
        }

        .pipeline-node-icon {
          font-size: 28px;
          line-height: 1;
          margin-bottom: 4px;
        }

        .pipeline-step-num {
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .pipeline-node-title {
          font-family: var(--display);
          font-size: 13px;
          font-weight: 600;
          color: var(--text);
          margin: 0;
          line-height: 1.3;
        }

        .pipeline-node-desc {
          font-size: 11px;
          line-height: 1.5;
          color: var(--text-m);
          margin: 0;
          font-weight: 300;
          text-align: center;
        }

        .pipeline-tech-tag {
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          border: 1px solid;
          padding: 3px 8px;
          border-radius: 4px;
          margin-top: 4px;
        }

        /* ── MOBILE FLOW ── */
        .pipeline-flow-mobile {
          display: none;
          flex-direction: column;
          gap: 0;
        }

        .pipeline-mobile-item {
          display: flex;
          gap: 16px;
          align-items: flex-start;
        }

        .pipeline-mobile-left {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex-shrink: 0;
          width: 40px;
        }

        .pipeline-mobile-icon {
          font-size: 22px;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(15, 159, 112, 0.06);
          border: 1px solid rgba(15, 159, 112, 0.15);
          border-radius: 10px;
          flex-shrink: 0;
        }

        .pipeline-mobile-line {
          width: 1px;
          flex-grow: 1;
          min-height: 24px;
          margin: 6px 0;
        }

        .pipeline-mobile-content {
          padding-bottom: 24px;
          flex: 1;
        }

        @media (max-width: 768px) {
          .pipeline-flow { display: none; }
          .pipeline-flow-mobile { display: flex; }
        }
      ` }} />
    </div>
  )
}
