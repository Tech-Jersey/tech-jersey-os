// CaseStudies — Impact metrics, deployment stories, and system architecture
import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminOrEditor, isPublic } from '../access/roles'

export const CaseStudies: CollectionConfig = {
  slug: 'case-studies',
  labels: { singular: 'Case Study', plural: 'Case Studies' },
  admin: {
    useAsTitle: 'client',
    defaultColumns: ['client', 'industry', 'featured', 'updatedAt'],
    description: 'Real deployment results and client transformation stories.',
  },
  access: {
    create: isAdmin,
    read: isPublic,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  fields: [
    // ── CORE IDENTITY ──
    {
      name: 'client',
      type: 'text',
      label: 'Client Name',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'URL Slug',
      required: true,
      unique: true,
      admin: { description: 'e.g. "luxury-real-estate-dubai" — lowercase, hyphen-separated.' },
    },
    {
      name: 'industry',
      type: 'select',
      label: 'Industry',
      options: [
        { label: 'Real Estate', value: 'real-estate' },
        { label: 'Education', value: 'education' },
        { label: 'Retail & Luxury', value: 'retail' },
        { label: 'Healthcare', value: 'healthcare' },
        { label: 'Finance', value: 'finance' },
        { label: 'Technology', value: 'technology' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'relatedServices',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      label: 'Related Studio Capabilities',
      admin: {
        description: 'Select the services deployed in this case study (links bi-directionally).',
      },
    },
    {
      name: 'summary',
      type: 'textarea',
      label: 'Brief Summary',
      admin: { description: 'Shown on cards. Max 180 characters for clean display.' },
    },

    // ── CHALLENGE & SOLUTION ──
    {
      name: 'challenge',
      type: 'richText',
      label: 'The Challenge',
    },
    {
      name: 'solution',
      type: 'richText',
      label: 'The Solution',
    },

    // ── IMPACT METRICS ──
    {
      name: 'metrics',
      type: 'array',
      label: 'Impact Metrics',
      admin: { description: 'Up to 4 metrics shown in the hero panel. First metric is the headline metric on cards.' },
      fields: [
        { name: 'value', type: 'text', label: 'Metric Value (e.g. 72%, ₹1.8L, 4.8hrs)', required: true },
        { name: 'label', type: 'text', label: 'Metric Label (e.g. Lead Response Time Reduced)', required: true },
        { name: 'context', type: 'text', label: 'Context (optional tooltip, e.g. from 4hrs to 8mins)' },
      ],
    },

    // ── PROCESS STEPS (dynamic architecture pipeline) ──
    {
      name: 'processSteps',
      type: 'array',
      label: 'System Architecture Steps',
      admin: {
        description: 'Steps shown in the deployment pipeline diagram. If empty, a generic 4-step flow is shown.',
      },
      fields: [
        { name: 'icon', type: 'text', label: 'Emoji or Symbol (e.g. 📥, 🧠, 🔄)', required: true },
        { name: 'title', type: 'text', label: 'Step Title', required: true },
        { name: 'description', type: 'textarea', label: 'Step Description (1–2 sentences)' },
        { name: 'techTag', type: 'text', label: 'Technology Tag (e.g. n8n, OpenAI, HubSpot, Twilio)' },
      ],
    },

    // ── DEPLOYMENT TIMELINE ──
    {
      name: 'timeline',
      type: 'array',
      label: 'Deployment Timeline',
      admin: { description: 'Optional milestone diary shown below the pipeline diagram.' },
      fields: [
        { name: 'phase', type: 'text', label: 'Phase Label (e.g. Week 1, Day 3, Month 2)', required: true },
        { name: 'milestone', type: 'text', label: 'Milestone Achieved', required: true },
        { name: 'detail', type: 'text', label: 'Detail (optional short note)' },
      ],
    },

    // ── RESULTS NARRATIVE ──
    {
      name: 'resultsNarrative',
      type: 'richText',
      label: 'Results & Outcome Narrative',
      admin: { description: 'Long-form results story shown after the pipeline. Optional.' },
    },

    // ── FOUNDER / STUDIO QUOTE ──
    {
      name: 'founderQuote',
      type: 'group',
      label: 'Studio Quote',
      admin: { description: 'Optional editorial pull-quote between the challenge/solution section and CTA.' },
      fields: [
        { name: 'quote', type: 'textarea', label: 'Quote Text' },
        { name: 'attribution', type: 'text', label: 'Speaker (e.g. Dhruv — Founder, Tech Jersey)', defaultValue: 'Dhruv — Founder, Tech Jersey Studio' },
      ],
    },

    // ── DISPLAY SETTINGS ──
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Show on Homepage',
      defaultValue: false,
    },
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
      label: 'Cover Image',
    },
    {
      name: 'accentColor',
      type: 'text',
      label: 'Accent Color (optional hex for hero background tint)',
      admin: { description: 'e.g. #0f9f70 — leave blank to use default green.' },
    },

    // ── SEO ──
    {
      name: 'seo',
      type: 'group',
      label: 'SEO',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Meta Title',
          admin: { description: 'Defaults to "Client: Summary — Tech Jersey Studio" if empty.' },
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Meta Description',
          admin: { description: 'Defaults to summary field if empty.' },
        },
      ],
    },
  ],
}
