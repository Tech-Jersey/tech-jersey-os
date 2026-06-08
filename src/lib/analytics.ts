// ─────────────────────────────────────────────────────────────────────────────
// TECH JERSEY — ANALYTICS UTILITY
// Thin wrapper over GA4 (gtag) and PostHog (if configured).
// All calls are no-ops when the relevant IDs are not set.
// ─────────────────────────────────────────────────────────────────────────────

/* ── GA4 type shim (gtag is injected via script tag in layout.tsx) ── */
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    posthog?: {
      capture: (event: string, props?: Record<string, unknown>) => void
      identify: (id: string, props?: Record<string, unknown>) => void
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CORE EVENT TRACKER
// Fires both GA4 and PostHog with the same payload
// ─────────────────────────────────────────────────────────────────────────────

export type AnalyticsProps = Record<string, string | number | boolean | undefined>

export function trackEvent(eventName: string, props?: AnalyticsProps): void {
  if (typeof window === 'undefined') return

  // GA4
  if (window.gtag) {
    window.gtag('event', eventName, props ?? {})
  }

  // PostHog
  if (window.posthog) {
    window.posthog.capture(eventName, props)
  }
}

export function identifyUser(id: string, traits?: AnalyticsProps): void {
  if (typeof window === 'undefined') return
  if (window.posthog) {
    window.posthog.identify(id, traits)
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// AUDIT FUNNEL EVENTS
// Named constants prevent typos across the codebase
// ─────────────────────────────────────────────────────────────────────────────

/** User lands on /audit page */
export function trackAuditStarted(): void {
  trackEvent('audit_started')
}

/** User progresses to a new question step */
export function trackAuditStep(stepNumber: number, questionId: string): void {
  trackEvent('audit_step_viewed', { step: stepNumber, question_id: questionId })
}

/** User selects / deselects an option */
export function trackAuditAnswer(questionId: string, value: string, selected: boolean): void {
  trackEvent('audit_answer_selected', {
    question_id: questionId,
    answer_value: value,
    selected,
  })
}

/** User reaches the contact info step */
export function trackAuditContactStep(): void {
  trackEvent('audit_contact_step_reached')
}

/** User submits the audit form */
export function trackAuditSubmitted(name: string): void {
  trackEvent('audit_submitted', { has_name: Boolean(name) })
}

/** Audit results returned successfully */
export function trackAuditCompleted(score: number, severity: string, savingsINR: number): void {
  trackEvent('audit_completed', {
    score,
    severity,
    estimated_savings_inr: savingsINR,
  })
}

/** User clicks the primary CTA (booking or WhatsApp) */
export function trackAuditCTAClicked(ctaType: 'booking' | 'whatsapp' | 'contact'): void {
  trackEvent('audit_cta_clicked', { cta_type: ctaType })
}

/** User downloads the PDF report */
export function trackAuditReportDownloaded(): void {
  trackEvent('audit_report_downloaded')
}

/** User restarts the audit */
export function trackAuditRestarted(): void {
  trackEvent('audit_restarted')
}

// ─────────────────────────────────────────────────────────────────────────────
// CONTACT FORM EVENTS
// ─────────────────────────────────────────────────────────────────────────────

export function trackContactFormSubmitted(objective: string): void {
  trackEvent('contact_form_submitted', { objective })
}

export function trackContactFormError(): void {
  trackEvent('contact_form_error')
}

// ─────────────────────────────────────────────────────────────────────────────
// NAVIGATION EVENTS
// ─────────────────────────────────────────────────────────────────────────────

export function trackNavCTAClicked(location: string): void {
  trackEvent('nav_cta_clicked', { location })
}


// ─────────────────────────────────────────────────────────────────────────────
// SERVICE DEMO EVENTS
// ─────────────────────────────────────────────────────────────────────────────

/** User runs the CRM pipeline demo */
export function trackCRMPipelineRun(): void {
  trackEvent('crm_pipeline_demo_run')
}

/** User adjusts the revenue calculator sliders */
export function trackCRMCalculatorUsed(monthlyRecovery: number, annualRecovery: number): void {
  trackEvent('crm_calculator_used', {
    monthly_recovery: monthlyRecovery,
    annual_recovery: annualRecovery,
  })
}

/** User clicks a demo CTA within a service page */
export function trackServiceDemoInteraction(serviceSlug: string, demoType: string): void {
  trackEvent('service_demo_interaction', {
    service_slug: serviceSlug,
    demo_type: demoType,
  })
}

