'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { trackNavCTAClicked } from '@/lib/analytics'

export default function StickyAuditCTA() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Show CTA after user scrolls 350px
      if (window.scrollY > 350) {
        setVisible(true)
      } else {
        setVisible(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    // Run once on load
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!visible) return null

  return (
    <>
      <div className="sticky-audit-wrapper">
        <div className="sticky-audit-card">
          <div className="pulse-indicator" />
          <div className="sticky-audit-text">
            <span className="sticky-audit-title">Free AI Automation Audit</span>
            <span className="sticky-audit-sub">≈ 2 Minute Audit · Instant Score · Saves ₹40k+</span>
          </div>
          <Link
            href="/audit"
            id="sticky-float-audit-cta"
            className="sticky-audit-btn"
            onClick={() => trackNavCTAClicked('sticky_float')}
          >
            Start Free ↗
          </Link>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .sticky-audit-wrapper {
          position: fixed;
          bottom: 32px;
          right: 32px;
          z-index: 999;
          animation: slideUp 0.4s cubic-bezier(0.19, 1, 0.22, 1) forwards;
          pointer-events: auto;
        }

        .sticky-audit-card {
          background: rgba(10, 15, 20, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(15, 159, 112, 0.25);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(15, 159, 112, 0.1);
          border-radius: 16px;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          max-width: 420px;
          transition: border-color 0.3s ease;
        }

        .sticky-audit-card:hover {
          border-color: rgba(15, 159, 112, 0.5);
        }

        .pulse-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--em);
          box-shadow: 0 0 0 0 rgba(15, 159, 112, 0.7);
          animation: pulseGreen 2s infinite;
          flex-shrink: 0;
        }

        .sticky-audit-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .sticky-audit-title {
          font-family: var(--display);
          font-size: 14px;
          font-weight: 600;
          color: var(--text);
        }

        .sticky-audit-sub {
          font-family: var(--body);
          font-size: 11px;
          font-weight: 400;
          color: var(--text-s);
          white-space: nowrap;
        }

        .sticky-audit-btn {
          font-family: var(--body);
          font-size: 12px;
          font-weight: 700;
          color: #000;
          background: linear-gradient(135deg, var(--em), #4fffca);
          padding: 10px 18px;
          border-radius: 8px;
          text-decoration: none;
          white-space: nowrap;
          transition: transform 0.2s ease, opacity 0.2s ease;
        }

        .sticky-audit-btn:hover {
          transform: scale(1.03);
          opacity: 0.95;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulseGreen {
          0% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(15, 159, 112, 0.7);
          }
          70% {
            transform: scale(1);
            box-shadow: 0 0 0 8px rgba(15, 159, 112, 0);
          }
          100% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(15, 159, 112, 0);
          }
        }

        @media (max-width: 768px) {
          .sticky-audit-wrapper {
            bottom: 0;
            left: 0;
            right: 0;
            padding: 12px 16px;
            background: rgba(5, 5, 5, 0.95);
            backdrop-filter: blur(15px);
            border-top: 1px solid rgba(15, 159, 112, 0.2);
            animation: slideUpMobile 0.4s cubic-bezier(0.19, 1, 0.22, 1) forwards;
          }

          .sticky-audit-card {
            background: none;
            backdrop-filter: none;
            -webkit-backdrop-filter: none;
            border: none;
            box-shadow: none;
            padding: 0;
            max-width: 100%;
            width: 100%;
            justify-content: space-between;
          }

          .sticky-audit-text {
            gap: 1px;
          }

          .sticky-audit-title {
            font-size: 13px;
          }

          .sticky-audit-sub {
            font-size: 10px;
          }

          .sticky-audit-btn {
            padding: 8px 14px;
            font-size: 11px;
          }
        }

        @keyframes slideUpMobile {
          from {
            opacity: 0;
            transform: translateY(100%);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}} />
    </>
  )
}
