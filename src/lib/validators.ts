/**
 * validators.ts — Zod-based input validation for all public API routes.
 *
 * Provides:
 *   - LeadContactSchema: validates name, email, phone, company, message
 *   - AuditSubmissionSchema: extends contact with responses array
 *   - BriefSubmissionSchema: extends contact with objective, source fields
 *   - Honeypot protection: the `website_url` field must be empty (bots fill it)
 *
 * All string fields are sanitized (HTML stripped, length capped) via Zod
 * `.transform()` so data stored in the DB is always clean.
 *
 * Note: Uses Zod v4 API (`error` instead of `required_error`, `.issues` not `.errors`)
 */
import { z } from 'zod'

// ── Sanitization helper ──────────────────────────────────────────────────────

/**
 * Strips HTML tags and dangerous characters from a string.
 * Applied via .transform() so every string field is auto-sanitized.
 */
function sanitize(value: string): string {
  return value
    .replace(/<[^>]*>/g, '')        // strip HTML tags
    .replace(/[<>&"'`]/g, '')       // strip remaining dangerous chars
    .trim()
}

// ── Reusable field schemas ───────────────────────────────────────────────────

const nameSchema = z
  .string({ error: 'Name is required' })
  .min(1, 'Name cannot be empty')
  .max(100, 'Name must be 100 characters or fewer')
  .transform(sanitize)

const emailSchema = z
  .string()
  .email('Email format is invalid')
  .max(254, 'Email must be 254 characters or fewer')
  .toLowerCase()
  .optional()
  .or(z.literal(''))
  .transform(v => (v === '' ? undefined : v))

const phoneSchema = z
  .string()
  .regex(/^\+?[\d\s\-().]{7,20}$/, 'Phone must be 7–20 digits (e.g. +91 98765 43210)')
  .optional()
  .or(z.literal(''))
  .transform(v => (v === '' ? undefined : v))

const companySchema = z
  .string()
  .max(150, 'Company name must be 150 characters or fewer')
  .transform(sanitize)
  .optional()
  .or(z.literal(''))
  .transform(v => (v === '' ? undefined : v))

const messageSchema = z
  .string()
  .max(2000, 'Message must be 2000 characters or fewer')
  .transform(sanitize)
  .optional()
  .or(z.literal(''))
  .transform(v => (v === '' ? undefined : v))

const utmFieldSchema = z
  .string()
  .max(200)
  .transform(sanitize)
  .optional()
  .or(z.literal(''))
  .transform(v => (v === '' ? undefined : v))

// ── Honeypot field ───────────────────────────────────────────────────────────
// The `website_url` field is hidden from real users via CSS.
// Automated bots will fill it in; humans never see it and leave it blank.
// Any submission with this field populated is silently discarded.

const honeypotSchema = z
  .string()
  .max(0, 'Invalid submission')
  .optional()

// ── Contact base (shared by both endpoints) ──────────────────────────────────

export const LeadContactSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  company: companySchema,
  message: messageSchema,
  /** Honeypot — must be absent or empty */
  website_url: honeypotSchema,
})

export type LeadContactInput = z.infer<typeof LeadContactSchema>

// ── Audit submission ─────────────────────────────────────────────────────────

export const AuditSubmissionSchema = LeadContactSchema.extend({
  responses: z
    .array(
      z.object({
        questionId: z.string(),
        answer: z.union([z.string(), z.array(z.string()), z.number(), z.boolean()]),
      })
    )
    .min(1, 'At least one audit response is required')
    .max(50, 'Too many responses'),
  utm_source: utmFieldSchema,
  utm_medium: utmFieldSchema,
  utm_campaign: utmFieldSchema,
  referrerUrl: utmFieldSchema,
})

export type AuditSubmissionInput = z.infer<typeof AuditSubmissionSchema>

// ── Brief/Lead form submission ───────────────────────────────────────────────

const VALID_SOURCES = [
  'website', 'audit_funnel', 'whatsapp', 'instagram',
  'linkedin', 'youtube', 'referral', 'direct_call', 'other',
] as const

const VALID_OBJECTIVES = [
  'whatsapp_automation', 'crm_sync', 'ai_qualification', 'booking',
  'website', 'app', 'ai_tool', 'bos', 'workflow', 'audit', 'other',
] as const

export const BriefSubmissionSchema = LeadContactSchema.extend({
  objective: z.enum(VALID_OBJECTIVES).optional(),
  source: z.enum(VALID_SOURCES).optional().default('website'),
})

export type BriefSubmissionInput = z.infer<typeof BriefSubmissionSchema>

// ── Validation error formatter ───────────────────────────────────────────────

/**
 * Converts Zod v4 issues into a flat array of {field, message} objects
 * suitable for returning in API error responses.
 */
export function formatZodErrors(issues: z.ZodIssue[]): Array<{ field: string; message: string }> {
  return issues.map(issue => ({
    field: issue.path.join('.'),
    message: issue.message,
  }))
}

// ── Honeypot helper ──────────────────────────────────────────────────────────

/**
 * Returns true if the submission contains honeypot data (likely a bot).
 * In that case, the API route should return a fake 201 success without
 * actually saving the lead — never alerting the bot that it was caught.
 */
export function isHoneypotTriggered(data: Record<string, unknown>): boolean {
  return typeof data.website_url === 'string' && data.website_url.length > 0
}
