'use client'
import { useState } from 'react'
import { trackContactFormSubmitted, trackContactFormError } from '@/lib/analytics'

const OBJECTIVES = [
  { label: 'WhatsApp Automation', value: 'whatsapp_automation' },
  { label: 'CRM Sync', value: 'crm_sync' },
  { label: 'AI Lead Qualification', value: 'ai_qualification' },
  { label: 'Booking System', value: 'booking' },
  { label: 'Custom Website', value: 'website' },
  { label: 'Business OS', value: 'bos' },
  { label: 'Comprehensive Audit', value: 'audit' },
]

export default function BriefForm() {
  const [selected, setSelected] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form))
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, objective: selected }),
      })
      if (res.ok) {
        setStatus('success')
        form.reset()
        setSelected('')
        trackContactFormSubmitted(selected || 'unspecified')
      } else {
        setStatus('error')
        trackContactFormError()
      }
    } catch {
      setStatus('error')
      trackContactFormError()
    }
  }

  if (status === 'success') {
    return (
      <div style={{ paddingTop: 24 }}>
        <h3 style={{ fontFamily: 'var(--display)', fontSize: 36, fontWeight: 300, letterSpacing: -1, marginBottom: 12 }}>
          Request <span style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', color: 'var(--text-s)' }}>Received.</span>
        </h3>
        <p style={{ fontSize: 16, color: 'var(--text-s)', fontWeight: 300 }}>
          Our team is reviewing your brief. We'll reach out within 24 hours to schedule a consultation.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>

      {/* Name */}
      <div>
        <label className="lux-label" htmlFor="brief-name">Your Name</label>
        <input id="brief-name" className="lux-input" name="name" required placeholder="Full name" />
      </div>

      {/* Contact */}
      <div>
        <label className="lux-label" htmlFor="brief-email">Contact Details</label>
        <input id="brief-email" className="lux-input" name="email" type="email" required placeholder="Email address" style={{ marginBottom: 24 }} />
        <input id="brief-phone" className="lux-input" name="phone" type="tel" placeholder="WhatsApp number" />
      </div>

      {/* Company */}
      <div>
        <label className="lux-label" htmlFor="brief-company">Business Name</label>
        <input id="brief-company" className="lux-input" name="company" placeholder="Your company or brand" />
      </div>

      {/* Objective */}
      <div>
        <label className="lux-label">Primary Objective</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 16 }}>
          {OBJECTIVES.map(o => (
            <button
              key={o.value}
              type="button"
              onClick={() => setSelected(o.value)}
              style={{
                padding: '10px 20px',
                border: `1px solid ${selected === o.value ? 'var(--text)' : 'var(--border-light)'}`,
                background: selected === o.value ? 'var(--text)' : 'transparent',
                color: selected === o.value ? 'var(--bg)' : 'var(--text-s)',
                fontFamily: 'var(--body)',
                fontSize: 13,
                borderRadius: 6,
                cursor: 'pointer',
                transition: 'all 0.3s',
              }}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      {/* Message */}
      <div>
        <label className="lux-label" htmlFor="brief-message">Current Friction</label>
        <textarea
          id="brief-message"
          className="lux-textarea"
          name="message"
          required
          placeholder="Briefly describe your current workflows and where you lose time or money..."
        />
      </div>

      {/* Submit */}
      <div>
        <button
          type="submit"
          id="brief-submit-btn"
          className="btn-primary"
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Processing...' : 'Submit Brief'}
        </button>
        {status === 'error' && (
          <p style={{ marginTop: 12, fontSize: 13, color: 'var(--text-s)' }}>
            Error submitting. Please try WhatsApp directly.
          </p>
        )}
      </div>

    </form>
  )
}
