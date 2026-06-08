// Leads — CRM-lite collection with full lead management
import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminOrEditor, isLoggedIn, isPublic } from '../access/roles'
import { dispatchWebhook } from '@/lib/webhook'

export const Leads: CollectionConfig = {
  slug: 'leads',
  labels: { singular: 'Lead', plural: 'Leads' },
  defaultSort: '-createdAt',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'source', 'auditDetails.score', 'status', 'stage', 'priority', 'createdAt'],
    description: 'All inbound leads. Audit Funnel leads show an Automation Readiness Score (0–100). Higher = more urgent.',
  },
  access: {
    create: isPublic,        // allow public API creation
    read: isLoggedIn,        // any authenticated user can read
    update: isAdminOrEditor, // admin or editor can update
    delete: isAdmin,         // only admin can delete
  },
  fields: [
    // ── CONTACT INFO ──
    {
      name: 'name',
      type: 'text',
      label: 'Full Name',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email Address',
      index: true,
    },
    {
      name: 'phone',
      type: 'text',
      label: 'WhatsApp / Phone Number',
    },
    {
      name: 'company',
      type: 'text',
      label: 'Company / Business Name',
    },
    {
      name: 'location',
      type: 'text',
      label: 'City / Location',
    },

    // ── SOURCE & TRACKING ──
    {
      name: 'source',
      type: 'select',
      label: 'Lead Source',
      required: true,
      defaultValue: 'website',
      index: true,
      options: [
        { label: 'Website Form', value: 'website' },
        { label: 'AI Audit Funnel', value: 'audit_funnel' },
        { label: 'WhatsApp', value: 'whatsapp' },
        { label: 'Instagram', value: 'instagram' },
        { label: 'LinkedIn', value: 'linkedin' },
        { label: 'YouTube', value: 'youtube' },
        { label: 'Referral', value: 'referral' },
        { label: 'Direct Call', value: 'direct_call' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'objective',
      type: 'select',
      label: 'Primary Objective',
      options: [
        { label: 'WhatsApp Automation', value: 'whatsapp_automation' },
        { label: 'CRM Synchronization', value: 'crm_sync' },
        { label: 'AI Qualification System', value: 'ai_qualification' },
        { label: 'Booking System', value: 'booking' },
        { label: 'Custom Website', value: 'website' },
        { label: 'Mobile App', value: 'app' },
        { label: 'AI Tool / Chatbot', value: 'ai_tool' },
        { label: 'Business Operating System', value: 'bos' },
        { label: 'Workflow Automation', value: 'workflow' },
        { label: 'Comprehensive Audit', value: 'audit' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'message',
      type: 'textarea',
      label: 'Lead Message / Notes from Form',
    },

    // ── CRM FIELDS ──
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      defaultValue: 'new',
      index: true,
      options: [
        { label: '🟢 New', value: 'new' },
        { label: '🔵 Contacted', value: 'contacted' },
        { label: '🟡 In Progress', value: 'in_progress' },
        { label: '🟠 Proposal Sent', value: 'proposal_sent' },
        { label: '✅ Converted', value: 'converted' },
        { label: '❌ Lost', value: 'lost' },
        { label: '⏸️ On Hold', value: 'on_hold' },
      ],
    },
    {
      name: 'stage',
      type: 'select',
      label: 'Pipeline Stage',
      defaultValue: 'discovery',
      options: [
        { label: 'Discovery', value: 'discovery' },
        { label: 'Qualification', value: 'qualification' },
        { label: 'Demo / Call Booked', value: 'demo' },
        { label: 'Proposal / Quote', value: 'proposal' },
        { label: 'Negotiation', value: 'negotiation' },
        { label: 'Closed Won', value: 'closed_won' },
        { label: 'Closed Lost', value: 'closed_lost' },
      ],
    },
    {
      name: 'priority',
      type: 'select',
      label: 'Priority',
      defaultValue: 'medium',
      options: [
        { label: '🔴 High', value: 'high' },
        { label: '🟡 Medium', value: 'medium' },
        { label: '🟢 Low', value: 'low' },
      ],
    },
    {
      name: 'tags',
      type: 'array',
      label: 'Tags',
      fields: [
        {
          name: 'tag',
          type: 'text',
          label: 'Tag',
          required: true,
        },
      ],
    },
    {
      name: 'assignedTo',
      type: 'text',
      label: 'Assigned To',
    },

    // ── NOTES & FOLLOW UP ──
    {
      name: 'internalNotes',
      type: 'textarea',
      label: 'Internal Notes',
    },
    {
      name: 'followUpDate',
      type: 'date',
      label: 'Follow Up Date',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },

    // ── N8N INTEGRATION ──
    {
      name: 'n8nSent',
      type: 'checkbox',
      label: 'Sent to n8n Webhook',
      defaultValue: false,
      admin: { readOnly: true },
    },

    // ── AUDIT FUNNEL ──
    {
      name: 'auditDetails',
      type: 'group',
      label: 'AI Audit Results',
      admin: {
        description: 'Populated automatically when a lead completes the AI Audit Funnel.',
      },
      fields: [
        {
          name: 'score',
          type: 'number',
          label: 'Automation Readiness Score (0–100)',
          min: 0,
          max: 100,
          admin: { readOnly: true },
        },
        {
          name: 'opportunities',
          type: 'textarea',
          label: 'Opportunities Found (JSON array)',
          admin: { readOnly: true },
        },
        {
          name: 'recommendedSystems',
          type: 'textarea',
          label: 'Recommended Systems (JSON array)',
          admin: { readOnly: true },
        },
        {
          name: 'estimatedMonthlySavings',
          type: 'number',
          label: 'Estimated Monthly Savings (USD)',
          admin: { readOnly: true },
        },
        {
          name: 'responses',
          type: 'textarea',
          label: 'Raw Audit Responses (JSON)',
          admin: { readOnly: true },
        },
      ],
    },

    // ── BOOKING ──
    {
      name: 'bookingDetails',
      type: 'group',
      label: 'Call Booking',
      fields: [
        {
          name: 'meetingLink',
          type: 'text',
          label: 'Booking Calendar Link',
        },
        {
          name: 'meetingStatus',
          type: 'select',
          label: 'Meeting Status',
          defaultValue: 'not_booked',
          options: [
            { label: 'Not Booked', value: 'not_booked' },
            { label: 'Booking Link Sent', value: 'link_sent' },
            { label: 'Scheduled', value: 'scheduled' },
            { label: 'Completed', value: 'completed' },
            { label: 'No-Show', value: 'no_show' },
          ],
        },
      ],
    },

    // ── NURTURE ──
    {
      name: 'nurtureDetails',
      type: 'group',
      label: 'Nurture Tracking',
      fields: [
        {
          name: 'sequenceStage',
          type: 'text',
          label: 'Nurture Sequence Stage',
          admin: { readOnly: true, description: 'Updated by n8n callback at /api/leads/nurture' },
        },
        {
          name: 'lastEmailed',
          type: 'date',
          label: 'Last Emailed At',
          admin: { readOnly: true },
        },
        {
          name: 'unsubscribed',
          type: 'checkbox',
          label: 'Unsubscribed',
          defaultValue: false,
        },
        // ── Resource & WhatsApp tracking ──
        {
          name: 'resourceDownloaded',
          type: 'text',
          label: 'Resource Downloaded (slug)',
          admin: {
            readOnly: true,
            description: 'Auto-populated when lead downloads a resource from /resources.',
          },
        },
        {
          name: 'nurtureTag',
          type: 'text',
          label: 'Active Nurture Tag',
          admin: {
            readOnly: true,
            description: 'The n8n sequence currently assigned to this lead (e.g. resource_whatsapp-automation-blueprint).',
          },
        },
        {
          name: 'whatsappSent',
          type: 'checkbox',
          label: 'WhatsApp Message Sent',
          defaultValue: false,
          admin: { readOnly: true, description: 'Auto-updated by n8n callback.' },
        },
        {
          name: 'lastWhatsappAt',
          type: 'date',
          label: 'Last WhatsApp Sent At',
          admin: { readOnly: true },
        },
      ],
    },

    // ── UTM TRACKING ──
    {
      name: 'utmTracking',
      type: 'group',
      label: 'UTM & Attribution',
      fields: [
        { name: 'utm_source', type: 'text', label: 'UTM Source', admin: { readOnly: true } },
        { name: 'utm_medium', type: 'text', label: 'UTM Medium', admin: { readOnly: true } },
        { name: 'utm_campaign', type: 'text', label: 'UTM Campaign', admin: { readOnly: true } },
        { name: 'referrerUrl', type: 'text', label: 'Referrer URL', admin: { readOnly: true } },
      ],
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, operation }) => {
        if (operation !== 'create') return

        // SINGLE EVENT SOURCE: audit_funnel leads are handled entirely by
        // /api/audit which fires n8n with the enriched audit payload.
        // Skip the generic webhook here to prevent duplicate triggers.
        if (doc.source === 'audit_funnel') return

        const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL
        if (n8nWebhookUrl) {
          // Fire-and-forget: NEVER await inside a Payload hook.
          // Awaiting here blocks the database transaction thread until
          // the external HTTP request resolves — causing client timeouts
          // if n8n is slow or unreachable.
          dispatchWebhook(n8nWebhookUrl, {
            event: 'new_lead',
            lead: doc,
          })
        }
      },
    ],
  },
}
