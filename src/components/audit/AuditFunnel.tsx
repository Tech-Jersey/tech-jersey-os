'use client'

import { useState, useCallback } from 'react'
import AuditStep from './AuditStep'
import AuditResults from './AuditResults'
import { AUDIT_QUESTIONS, type AuditResponse, type AuditResult } from '@/lib/audit-engine'
import {
  trackAuditStarted, trackAuditStep, trackAuditAnswer,
  trackAuditContactStep, trackAuditSubmitted, trackAuditCompleted, trackAuditRestarted,
} from '@/lib/analytics'

// ─────────────────────────────────────────────────────────────────────────────
// CONTACT STEP — collected after all questions, before submission
// ─────────────────────────────────────────────────────────────────────────────

type ContactData = {
  name: string
  email: string
  phone: string
  company: string
}

function ContactStep({
  value,
  onChange,
  onSubmit,
  onBack,
  loading,
}: {
  value: ContactData
  onChange: (field: keyof ContactData, v: string) => void
  onSubmit: () => void
  onBack: () => void
  loading: boolean
}) {
  const canSubmit = value.name.trim().length > 0 && !loading

  return (
    <div className="audit-step-card">
      <div className="audit-step-num">Final Step — Contact Details</div>
      <h2 className="audit-step-q">Where should we send your results?</h2>

      <div className="audit-contact-grid">
        <div className="audit-field-wrap">
          <label className="audit-field-label" htmlFor="audit-name">Your Name *</label>
          <input
            id="audit-name"
            className="audit-input"
            type="text"
            placeholder="Full name"
            value={value.name}
            onChange={e => onChange('name', e.target.value)}
            required
            autoComplete="name"
          />
        </div>
        <div className="audit-field-wrap">
          <label className="audit-field-label" htmlFor="audit-company">Business / Company</label>
          <input
            id="audit-company"
            className="audit-input"
            type="text"
            placeholder="Business name"
            value={value.company}
            onChange={e => onChange('company', e.target.value)}
            autoComplete="organization"
          />
        </div>
        <div className="audit-field-wrap">
          <label className="audit-field-label" htmlFor="audit-email">Email Address</label>
          <input
            id="audit-email"
            className="audit-input"
            type="email"
            placeholder="you@company.com"
            value={value.email}
            onChange={e => onChange('email', e.target.value)}
            autoComplete="email"
          />
        </div>
        <div className="audit-field-wrap">
          <label className="audit-field-label" htmlFor="audit-phone">WhatsApp Number</label>
          <input
            id="audit-phone"
            className="audit-input"
            type="tel"
            placeholder="+91 XXXXX XXXXX"
            value={value.phone}
            onChange={e => onChange('phone', e.target.value)}
            autoComplete="tel"
          />
        </div>
      </div>

      <p style={{ fontSize: 12, color: 'var(--text-m)', marginBottom: 32, lineHeight: 1.6 }}>
        Your results are calculated instantly. We only use your contact details to follow up
        with your personalised automation blueprint — no spam, ever.
      </p>

      <div className="audit-nav">
        <button className="audit-btn-back" onClick={onBack} type="button">
          ← Back
        </button>
        <button
          className="audit-btn-submit"
          onClick={onSubmit}
          disabled={!canSubmit}
          type="button"
          id="audit-submit-btn"
        >
          {loading ? 'Calculating…' : '🤖 Generate My Audit Report →'}
        </button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// LOADING SCREEN
// ─────────────────────────────────────────────────────────────────────────────

function LoadingScreen() {
  return (
    <div className="audit-loading">
      <div className="audit-spinner" />
      <p>Analysing your business workflows…</p>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// STATE TYPES
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// STATE TYPES
// ─────────────────────────────────────────────────────────────────────────────

type FunnelState = 'questions' | 'contact' | 'loading' | 'results' | 'error'

// ─────────────────────────────────────────────────────────────────────────────
// MAIN FUNNEL ORCHESTRATOR
// ─────────────────────────────────────────────────────────────────────────────

export default function AuditFunnel() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string[]>>({})
  const [contact, setContact] = useState<ContactData>({ name: '', email: '', phone: '', company: '' })
  const [funnelState, setFunnelState] = useState<FunnelState>('questions')
  const [result, setResult] = useState<AuditResult | null>(null)
  const [leadId, setLeadId] = useState<string | undefined>(undefined)
  const [errorMsg, setErrorMsg] = useState('')

  // Fire started event once on mount
  useState(() => { trackAuditStarted() })

  const currentQuestion = AUDIT_QUESTIONS[step]
  const totalQuestions = AUDIT_QUESTIONS.length

  // ── Answer selection ──────────────────────────────────────────────────────
  const handleSelect = useCallback((value: string) => {
    const qId = currentQuestion.id
    if (currentQuestion.type === 'single') {
      setAnswers(prev => ({ ...prev, [qId]: [value] }))
      trackAuditAnswer(qId, value, true)
    } else {
      setAnswers(prev => {
        const current = prev[qId] || []
        const isRemoving = current.includes(value)
        trackAuditAnswer(qId, value, !isRemoving)
        return {
          ...prev,
          [qId]: isRemoving ? current.filter(v => v !== value) : [...current, value],
        }
      })
    }
  }, [currentQuestion])

  // ── Navigation ────────────────────────────────────────────────────────────
  const handleNext = useCallback(() => {
    if (step < totalQuestions - 1) {
      setStep(s => {
        const next = s + 1
        trackAuditStep(next + 1, AUDIT_QUESTIONS[next].id)
        return next
      })
    } else {
      trackAuditContactStep()
      setFunnelState('contact')
    }
  }, [step, totalQuestions])

  const handleBack = useCallback(() => {
    if (funnelState === 'contact') {
      setFunnelState('questions')
      setStep(totalQuestions - 1)
      return
    }
    if (step > 0) setStep(s => s - 1)
  }, [funnelState, step, totalQuestions])

  // ── Contact field update ──────────────────────────────────────────────────
  const handleContactChange = useCallback((field: keyof ContactData, value: string) => {
    setContact(prev => ({ ...prev, [field]: value }))
  }, [])

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = useCallback(async () => {
    if (!contact.name.trim()) return
    setFunnelState('loading')
    trackAuditSubmitted(contact.name)

    const responses: AuditResponse[] = AUDIT_QUESTIONS.map(q => ({
      questionId: q.id,
      answer: answers[q.id] || [],
    }))

    const searchParams = new URLSearchParams(window.location.search)

    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...contact,
          responses,
          utm_source: searchParams.get('utm_source') || undefined,
          utm_medium: searchParams.get('utm_medium') || undefined,
          utm_campaign: searchParams.get('utm_campaign') || undefined,
          referrerUrl: document.referrer || undefined,
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || 'Something went wrong. Please try again.')
        setFunnelState('error')
        return
      }

      setLeadId(data.leadId)
      setResult(data.audit)
      trackAuditCompleted(data.audit.score, data.audit.scoreSeverity, data.audit.estimatedMonthlySavingsINR)
      setFunnelState('results')
    } catch {
      setErrorMsg('Network error. Please check your connection and try again.')
      setFunnelState('error')
    }
  }, [contact, answers])

  // ── Restart ───────────────────────────────────────────────────────────────
  const handleRestart = useCallback(() => {
    setStep(0)
    setAnswers({})
    setContact({ name: '', email: '', phone: '', company: '' })
    setResult(null)
    setLeadId(undefined)
    setErrorMsg('')
    trackAuditRestarted()
    setFunnelState('questions')
  }, [])

  // ─────────────────────────────────────────────────────────────────────────
  // PROGRESS
  // ─────────────────────────────────────────────────────────────────────────
  const progressPercent =
    funnelState === 'results' ? 100 :
    funnelState === 'contact' ? 95 :
    Math.round(((step + 1) / (totalQuestions + 1)) * 90)

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Progress bar (hidden on results) */}
      {funnelState !== 'results' && (
        <div className="audit-progress-wrap">
          <div className="audit-progress-track">
            <div
              className="audit-progress-fill"
              style={{ width: `${progressPercent}%` }}
              role="progressbar"
              aria-valuenow={progressPercent}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
          <div className="audit-progress-label">
            <span>Automation Readiness Audit</span>
            <span>{progressPercent}% complete</span>
          </div>
        </div>
      )}

      {/* Question steps */}
      {funnelState === 'questions' && currentQuestion && (
        <AuditStep
          key={currentQuestion.id}
          stepNumber={step + 1}
          totalSteps={totalQuestions}
          question={currentQuestion.question}
          options={currentQuestion.options}
          type={currentQuestion.type}
          selectedValues={answers[currentQuestion.id] || []}
          onSelect={handleSelect}
          onNext={handleNext}
          onBack={handleBack}
          canGoBack={step > 0}
          nextLabel={step === totalQuestions - 1 ? 'Get My Score' : 'Continue'}
        />
      )}

      {/* Contact step */}
      {funnelState === 'contact' && (
        <ContactStep
          value={contact}
          onChange={handleContactChange}
          onSubmit={handleSubmit}
          onBack={handleBack}
          loading={false}
        />
      )}

      {/* Loading */}
      {funnelState === 'loading' && <LoadingScreen />}

      {/* Results */}
      {funnelState === 'results' && result && (
        <AuditResults
          result={result}
          name={contact.name}
          leadId={leadId}
          onRestart={handleRestart}
        />
      )}

      {/* Error */}
      {funnelState === 'error' && (
        <div
          style={{
            maxWidth: 480,
            margin: '0 auto',
            padding: '40px 24px',
            textAlign: 'center',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--display)',
              fontSize: 20,
              color: 'var(--text)',
              marginBottom: 12,
            }}
          >
            Something went wrong
          </p>
          <p style={{ fontSize: 14, color: 'var(--text-s)', marginBottom: 32 }}>
            {errorMsg}
          </p>
          <button className="audit-btn-next" onClick={handleRestart} type="button">
            Try Again
          </button>
        </div>
      )}
    </>
  )
}
