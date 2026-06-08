// Services — The full studio capability set
import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminOrEditor, isPublic } from '../access/roles'

export const Services: CollectionConfig = {
  slug: 'services',
  labels: { singular: 'Service', plural: 'Services' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'order', 'featured'],
    description: 'All studio capabilities shown on the website.',
  },
  access: {
    create: isAdmin,
    read: isPublic,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Service Title',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'URL Slug',
      required: true,
      unique: true,
      admin: { description: 'e.g. whatsapp-automation, custom-websites, ai-tools' },
    },
    {
      name: 'category',
      type: 'select',
      label: 'Category',
      options: [
        { label: 'Automation', value: 'automation' },
        { label: 'Web Development', value: 'web' },
        { label: 'Mobile Apps', value: 'apps' },
        { label: 'AI Tools', value: 'ai' },
        { label: 'Workflows', value: 'workflow' },
        { label: 'Business Operating System', value: 'bos' },
        { label: 'Internal Systems', value: 'internal' },
      ],
    },
    {
      name: 'tagline',
      type: 'text',
      label: 'Short Tagline',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description (for service cards)',
    },
    {
      name: 'longDescription',
      type: 'richText',
      label: 'Full Description (for detail page)',
    },
    {
      name: 'keyCapabilities',
      type: 'array',
      label: 'Key Capabilities / Bullet Points',
      fields: [
        { name: 'point', type: 'text', label: 'Capability', required: true },
      ],
    },
    {
      name: 'order',
      type: 'number',
      label: 'Display Order',
      defaultValue: 10,
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Show on Homepage',
      defaultValue: true,
    },
    {
      name: 'icon',
      type: 'text',
      label: 'Icon Name or SVG Tag',
    },
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
      label: 'Service Thumbnail Image',
    },
    {
      name: 'ctaText',
      type: 'text',
      label: 'CTA Button Text',
      defaultValue: 'Build This System',
    },
    {
      name: 'demoType',
      type: 'select',
      label: 'Interactive Demo Type',
      options: [
        { label: 'None', value: 'none' },
        { label: 'WhatsApp Simulator', value: 'whatsapp' },
        { label: 'CRM Workflow Simulator', value: 'crm' },
        { label: 'Document AI Demo', value: 'document-ai' },
        { label: 'E-commerce Demo', value: 'ecommerce' },
      ],
      defaultValue: 'none',
      admin: { description: 'Which interactive demo to show in the hero section' },
    },
    {
      name: 'heroTrustRow',
      type: 'array',
      label: 'Hero Trust Row Items',
      maxRows: 4,
      admin: { description: 'Small trust badges shown below hero CTA (e.g. "100% Lead Tracking")' },
      fields: [
        { name: 'text', type: 'text', label: 'Trust Text', required: true },
      ],
    },
    {
      name: 'problemStatements',
      type: 'array',
      label: 'Problem Statements',
      admin: { description: 'Pain points shown in the "Problem" section' },
      fields: [
        { name: 'icon', type: 'text', label: 'Emoji Icon', required: true },
        { name: 'title', type: 'text', label: 'Problem Title', required: true },
        { name: 'description', type: 'textarea', label: 'Problem Description', required: true },
        { name: 'impactMetric', type: 'text', label: 'Impact Metric (e.g. "₹3.2L+ lost/month")' },
      ],
    },
    {
      name: 'integrations',
      type: 'array',
      label: 'Integration Partners',
      admin: { description: 'Tools/platforms this service integrates with' },
      fields: [
        { name: 'name', type: 'text', label: 'Integration Name', required: true },
        { name: 'icon', type: 'text', label: 'Emoji or Icon', required: true },
        { name: 'category', type: 'text', label: 'Category (e.g. CRM, Messaging)' },
      ],
    },
    {
      name: 'faqs',
      type: 'array',
      label: 'Frequently Asked Questions',
      fields: [
        { name: 'question', type: 'text', label: 'Question', required: true },
        { name: 'answer', type: 'textarea', label: 'Answer', required: true },
      ],
    },
    {
      name: 'roiMetrics',
      type: 'array',
      label: 'ROI Metrics',
      minRows: 3,
      maxRows: 4,
      fields: [
        { name: 'value', type: 'text', label: 'Metric Value', required: true },
        { name: 'label', type: 'text', label: 'Metric Label', required: true },
        { name: 'description', type: 'textarea', label: 'Description', required: true },
      ],
    },
    {
      name: 'caseStudySnapshot',
      type: 'group',
      label: 'Case Study Snapshot',
      fields: [
        { name: 'clientName', type: 'text', label: 'Client / Business Name' },
        { name: 'metricValue', type: 'text', label: 'Highlight Metric Value (e.g. ₹1.8L+ or 90%)' },
        { name: 'metricLabel', type: 'text', label: 'Highlight Metric Label (e.g. Saved Monthly)' },
        { name: 'summary', type: 'textarea', label: 'Snapshot Summary Quote/Text' },
        { name: 'caseStudyLink', type: 'text', label: 'Link to Full Case Study' },
      ],
    },
    {
      name: 'seo',
      type: 'group',
      label: 'SEO',
      fields: [
        { name: 'title', type: 'text', label: 'Meta Title' },
        { name: 'description', type: 'textarea', label: 'Meta Description' },
      ],
    },
  ],
}
