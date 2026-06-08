// ─────────────────────────────────────────────────────────────────────────────
// TECH JERSEY — AI AUDIT ENGINE  v2
// Pure scoring logic. No side effects. No API calls. Fully testable.
// Changes v2:
//   - Savings expressed in INR (₹) natively
//   - Business-oriented score labels
//   - Score-severity mapping for lead priority
// ─────────────────────────────────────────────────────────────────────────────

export type AuditResponse = {
  questionId: string
  answer: string | string[]
}

export type AuditResult = {
  score: number                       // 0–100 Automation Readiness Score
  scoreLabel: string                  // Business-oriented label
  scoreSeverity: 'critical' | 'high' | 'medium' | 'low'
  opportunities: string[]             // Detected bottlenecks
  recommendedSystems: string[]        // Specific products/systems
  estimatedMonthlySavingsINR: number  // ₹ per month
  summaryLine: string                 // One-sentence interpretation
}

// ─────────────────────────────────────────────────────────────────────────────
// QUESTION DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────

export const AUDIT_QUESTIONS = [
  {
    id: 'team_size',
    question: 'How many people handle customer inquiries in your business?',
    type: 'single' as const,
    options: [
      { label: 'Just me', value: 'solo' },
      { label: '2–5 people', value: 'small' },
      { label: '6–20 people', value: 'medium' },
      { label: '20+ people', value: 'large' },
    ],
  },
  {
    id: 'lead_volume',
    question: 'How many inbound leads or inquiries do you receive per week?',
    type: 'single' as const,
    options: [
      { label: 'Less than 10', value: 'low' },
      { label: '10–50', value: 'medium' },
      { label: '50–200', value: 'high' },
      { label: '200+', value: 'very_high' },
    ],
  },
  {
    id: 'response_time',
    question: 'How long does it typically take to respond to a new inquiry?',
    type: 'single' as const,
    options: [
      { label: 'Within 1 hour', value: 'fast' },
      { label: 'Same day', value: 'moderate' },
      { label: '1–3 days', value: 'slow' },
      { label: 'More than 3 days', value: 'very_slow' },
    ],
  },
  {
    id: 'current_tools',
    question: 'Which tools do you currently use for lead management?',
    type: 'multi' as const,
    options: [
      { label: 'WhatsApp (manual)', value: 'whatsapp_manual' },
      { label: 'Spreadsheets / Excel', value: 'spreadsheets' },
      { label: 'CRM (Zoho, HubSpot, etc.)', value: 'crm' },
      { label: 'Email only', value: 'email' },
      { label: 'Nothing formal', value: 'none' },
    ],
  },
  {
    id: 'pain_points',
    question: 'Which of these are causing you the most friction? (Select all that apply)',
    type: 'multi' as const,
    options: [
      { label: 'Missing / losing leads', value: 'lost_leads' },
      { label: 'Slow follow-ups', value: 'slow_followup' },
      { label: 'Manual data entry', value: 'manual_entry' },
      { label: 'No pipeline visibility', value: 'no_pipeline' },
      { label: 'Repetitive customer questions', value: 'repetitive_questions' },
      { label: 'Poor booking / scheduling', value: 'booking_issues' },
    ],
  },
  {
    id: 'channels',
    question: 'Which channels do your leads come through?',
    type: 'multi' as const,
    options: [
      { label: 'WhatsApp', value: 'whatsapp' },
      { label: 'Instagram DM', value: 'instagram' },
      { label: 'Website form', value: 'website' },
      { label: 'Phone calls', value: 'phone' },
      { label: 'Email', value: 'email' },
      { label: 'Walk-ins', value: 'walkin' },
    ],
  },
  {
    id: 'monthly_revenue',
    question: 'What is your approximate monthly revenue range?',
    type: 'single' as const,
    options: [
      { label: 'Under ₹1 Lakh', value: 'starter' },
      { label: '₹1L – ₹5L', value: 'growing' },
      { label: '₹5L – ₹20L', value: 'established' },
      { label: '₹20L+', value: 'enterprise' },
    ],
  },
  {
    id: 'automation_interest',
    question: 'Which automation systems interest you most?',
    type: 'multi' as const,
    options: [
      { label: 'AI WhatsApp Chatbot', value: 'whatsapp_bot' },
      { label: 'Automated Lead Qualification', value: 'lead_qual' },
      { label: 'CRM Integration', value: 'crm_sync' },
      { label: 'Booking / Appointment System', value: 'booking' },
      { label: 'Document Analysis / AI', value: 'doc_ai' },
      { label: 'Custom Dashboard / Reporting', value: 'dashboard' },
    ],
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// SCORING MATRIX
// ─────────────────────────────────────────────────────────────────────────────

const SCORE_MATRIX: Record<string, Record<string, number>> = {
  team_size:     { solo: 5,  small: 10, medium: 15, large: 20 },
  lead_volume:   { low: 5,   medium: 10, high: 15, very_high: 20 },
  response_time: { fast: 5,  moderate: 8, slow: 15, very_slow: 20 },
  current_tools: { whatsapp_manual: 5, spreadsheets: 8, crm: 3, email: 6, none: 10 },
  pain_points:   { lost_leads: 4, slow_followup: 3, manual_entry: 3, no_pipeline: 3, repetitive_questions: 3, booking_issues: 4 },
  channels:      { whatsapp: 4, instagram: 4, website: 3, phone: 3, email: 3, walkin: 2 },
  monthly_revenue: { starter: 5, growing: 10, established: 15, enterprise: 20 },
  automation_interest: { whatsapp_bot: 3, lead_qual: 3, crm_sync: 3, booking: 3, doc_ai: 3, dashboard: 3 },
}

// ─────────────────────────────────────────────────────────────────────────────
// BUSINESS-ORIENTED SCORE LABELS (v2)
// Labels focus on urgency and business outcome — not technical readiness
// ─────────────────────────────────────────────────────────────────────────────

function getScoreLabel(score: number): { label: string; severity: AuditResult['scoreSeverity']; summary: string } {
  if (score >= 75) return {
    label: 'Critical — Revenue Is Leaking Right Now',
    severity: 'critical',
    summary: 'Your business is actively losing revenue to manual processes. Every day without automation costs you measurable money.',
  }
  if (score >= 50) return {
    label: 'High ROI — Strong Automation Opportunity',
    severity: 'high',
    summary: 'You have clear, high-value automation opportunities that can save significant time and money within the next 30 days.',
  }
  if (score >= 25) return {
    label: 'Quick Wins Available — Start Here',
    severity: 'medium',
    summary: 'A few targeted automation tools would create meaningful efficiency gains and free up hours of manual work each week.',
  }
  return {
    label: 'Foundation Stage — Build Smart From The Start',
    severity: 'low',
    summary: 'Your business is at the right stage to set up solid automation foundations before scaling — the best time to start is now.',
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// OPPORTUNITY DETECTION
// ─────────────────────────────────────────────────────────────────────────────

const OPPORTUNITY_MAP: Record<string, string> = {
  lost_leads:             '🔴 You are losing leads due to delayed manual follow-up',
  slow_followup:          '🟡 Response time gap is allowing competitors to capture your leads',
  manual_entry:           '🟡 Manual data entry is creating errors and costing hours per week',
  no_pipeline:            '🔴 No pipeline visibility means you cannot forecast or protect revenue',
  repetitive_questions:   '🟢 High ROI opportunity: automate answers to FAQs via AI chatbot',
  booking_issues:         '🟡 Booking friction is causing appointment drop-offs',
  whatsapp_manual:        '🔴 Manual WhatsApp management cannot scale with your lead volume',
  spreadsheets:           '🟡 Spreadsheet-based CRM creates data loss risk and blocks automation',
  none:                   '🔴 No formal lead tracking system — high risk of ongoing revenue leakage',
  very_slow:              '🔴 3+ day response time is costing you 60–80% of inbound leads',
  slow:                   '🟡 Same-day responses are still too slow for high-intent buyers',
}

// ─────────────────────────────────────────────────────────────────────────────
// SYSTEM RECOMMENDATION ENGINE
// ─────────────────────────────────────────────────────────────────────────────

const SYSTEM_MAP: Record<string, string> = {
  whatsapp_bot:    'Enterprise WhatsApp AI Bot — 24/7 automated qualification & response',
  lead_qual:       'AI Lead Qualification System — Score and route leads automatically',
  crm_sync:        'CRM Integration Engine — Bi-directional sync with Zoho / HubSpot',
  booking:         'Smart Booking System — Calendar-integrated automated scheduling',
  doc_ai:          'Document Analysis Tool — Instant invoice, contract & PDF processing',
  dashboard:       'Business Intelligence Dashboard — Real-time operational metrics',
  whatsapp_manual: 'Enterprise WhatsApp AI Bot — Replace manual WhatsApp with AI',
  lost_leads:      'AI Lead Qualification System — Never lose a lead again',
  no_pipeline:     'Business Intelligence Dashboard — Full pipeline visibility',
  very_slow:       'Enterprise WhatsApp AI Bot — Sub-30 second response guarantee',
}

// ─────────────────────────────────────────────────────────────────────────────
// INR SAVINGS ESTIMATOR (v2)
// Calculates directly in Indian Rupees using local revenue brackets
// ─────────────────────────────────────────────────────────────────────────────

function estimateSavingsINR(responses: AuditResponse[]): number {
  const revResponse = responses.find(r => r.questionId === 'monthly_revenue')

  // Base monthly savings potential by revenue bracket (INR)
  const baseINR =
    revResponse?.answer === 'enterprise'  ? 250_000 :
    revResponse?.answer === 'established' ? 100_000 :
    revResponse?.answer === 'growing'     ?  40_000 : 15_000

  let savings = 0

  // Pain multiplier: each pain point adds ~20% of base
  const painResponse = responses.find(r => r.questionId === 'pain_points')
  const pains = Array.isArray(painResponse?.answer) ? painResponse!.answer as string[] : []
  savings += pains.length * baseINR * 0.2

  // Tool inefficiency: manual / no tools add significant savings
  const toolResponse = responses.find(r => r.questionId === 'current_tools')
  const tools = Array.isArray(toolResponse?.answer) ? toolResponse!.answer as string[] : []
  if (tools.includes('none'))              savings += baseINR * 0.5
  if (tools.includes('spreadsheets'))      savings += baseINR * 0.3
  if (tools.includes('whatsapp_manual'))   savings += baseINR * 0.4

  // Response time penalty: slow response = significant lead loss cost
  const rtResponse = responses.find(r => r.questionId === 'response_time')
  if (rtResponse?.answer === 'very_slow')  savings += baseINR * 0.6
  else if (rtResponse?.answer === 'slow')  savings += baseINR * 0.3

  // Cap at 3× base to keep realistic
  return Math.round(Math.min(savings, baseINR * 3) / 1000) * 1000
}

// ─────────────────────────────────────────────────────────────────────────────
// SCORE NORMALISER
// ─────────────────────────────────────────────────────────────────────────────

function normalizeScore(raw: number, max: number): number {
  return Math.min(100, Math.round((raw / max) * 100))
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN SCORING FUNCTION
// ─────────────────────────────────────────────────────────────────────────────

export function computeAuditResult(responses: AuditResponse[]): AuditResult {
  let rawScore = 0
  let maxPossible = 0
  const opportunities = new Set<string>()
  const systems = new Set<string>()

  for (const response of responses) {
    const matrix = SCORE_MATRIX[response.questionId]
    if (!matrix) continue

    const answers = Array.isArray(response.answer) ? response.answer : [response.answer]
    const questionMax = Math.max(...Object.values(matrix))
    maxPossible += questionMax

    for (const answer of answers) {
      rawScore += matrix[answer] || 0

      const opp = OPPORTUNITY_MAP[answer]
      if (opp) opportunities.add(opp)

      const sys = SYSTEM_MAP[answer]
      if (sys) systems.add(sys)
    }
  }

  // Add system recs from interest selections
  const interestResponse = responses.find(r => r.questionId === 'automation_interest')
  if (interestResponse) {
    const interests = Array.isArray(interestResponse.answer)
      ? interestResponse.answer as string[]
      : [interestResponse.answer as string]
    for (const interest of interests) {
      const sys = SYSTEM_MAP[interest]
      if (sys) systems.add(sys)
    }
  }

  const score = maxPossible > 0 ? normalizeScore(rawScore, maxPossible) : 0
  const { label, severity, summary } = getScoreLabel(score)

  return {
    score,
    scoreLabel: label,
    scoreSeverity: severity,
    opportunities: Array.from(opportunities).slice(0, 6),
    recommendedSystems: Array.from(systems).slice(0, 4),
    estimatedMonthlySavingsINR: estimateSavingsINR(responses),
    summaryLine: summary,
  }
}
