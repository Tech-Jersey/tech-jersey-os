interface TimelineEvent {
  phase: string
  milestone: string
  detail?: string
}

interface DeploymentTimelineProps {
  events: TimelineEvent[]
  accentColor?: string
}

export default function DeploymentTimeline({ events, accentColor = 'var(--em)' }: DeploymentTimelineProps) {
  if (!events || events.length === 0) return null

  return (
    <div style={{ width: '100%', overflowX: 'auto', paddingBottom: 8 }}>
      <div className="timeline-track">
        {events.map((event, idx) => (
          <div key={idx} className="timeline-event">
            {/* Connecting line (not before first) */}
            {idx > 0 && (
              <div className="timeline-connector" style={{ background: `${accentColor}25` }} />
            )}

            {/* Event dot */}
            <div className="timeline-dot" style={{ borderColor: accentColor, background: idx === 0 ? accentColor : 'var(--bg)' }} />

            {/* Event content */}
            <div className="timeline-content">
              <div className="timeline-phase" style={{ color: accentColor }}>
                {event.phase}
              </div>
              <div className="timeline-milestone">
                {event.milestone}
              </div>
              {event.detail && (
                <div className="timeline-detail">{event.detail}</div>
              )}
            </div>
          </div>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .timeline-track {
          display: flex;
          align-items: flex-start;
          gap: 0;
          min-width: max-content;
          padding: 8px 0 16px 0;
        }

        .timeline-event {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          position: relative;
          min-width: 160px;
          max-width: 200px;
        }

        .timeline-connector {
          position: absolute;
          top: 6px;
          left: -50%;
          width: 100%;
          height: 1px;
        }

        .timeline-dot {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 2px solid;
          margin-bottom: 16px;
          flex-shrink: 0;
          position: relative;
          z-index: 1;
          transition: transform 0.2s ease;
        }

        .timeline-event:hover .timeline-dot {
          transform: scale(1.3);
        }

        .timeline-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding-right: 24px;
        }

        .timeline-phase {
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .timeline-milestone {
          font-family: var(--display);
          font-size: 13px;
          font-weight: 600;
          color: var(--text);
          line-height: 1.3;
        }

        .timeline-detail {
          font-size: 11px;
          color: var(--text-m);
          line-height: 1.4;
          font-weight: 300;
        }
      ` }} />
    </div>
  )
}
