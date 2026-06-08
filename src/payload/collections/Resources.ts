// Resources — Lead magnet gated downloads (blueprints, checklists, ROI calculators)
import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminOrEditor, isPublic } from '../access/roles'

export const Resources: CollectionConfig = {
  slug: 'resources',
  labels: { singular: 'Resource', plural: 'Resources' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'featured', 'downloadCount', 'updatedAt'],
    description: 'Lead magnet resources. Visitors download by submitting their email (gated).',
  },
  access: {
    create: isAdmin,
    read: isPublic,        // Cards visible to all; download gated via API
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  fields: [
    // ── CORE ──
    {
      name: 'title',
      type: 'text',
      label: 'Resource Title',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'URL Slug',
      required: true,
      unique: true,
      admin: { description: 'e.g. "whatsapp-automation-blueprint" — lowercase, hyphen-separated.' },
    },
    {
      name: 'category',
      type: 'select',
      label: 'Category',
      options: [
        { label: 'Blueprint', value: 'blueprint' },
        { label: 'ROI Calculator', value: 'roi_calculator' },
        { label: 'Checklist', value: 'checklist' },
        { label: 'Guide', value: 'guide' },
        { label: 'Case Study PDF', value: 'case_study_pdf' },
      ],
      defaultValue: 'guide',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Short Description',
      admin: { description: 'Shown on the resource card. Max 160 characters.' },
    },
    {
      name: 'valueProposition',
      type: 'array',
      label: 'What You\'ll Learn (bullet points)',
      fields: [
        { name: 'point', type: 'text', label: 'Point', required: true },
      ],
    },

    // ── MEDIA ──
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
      label: 'Thumbnail / Preview Image',
    },
    {
      name: 'file',
      type: 'upload',
      relationTo: 'media',
      label: 'PDF File (upload for gated download)',
      admin: { description: 'Leave empty to show "Coming Soon" state on the card.' },
    },

    // ── SETTINGS ──
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Feature on /resources page (top position)',
      defaultValue: false,
    },
    {
      name: 'available',
      type: 'checkbox',
      label: 'Available for Download',
      defaultValue: false,
      admin: {
        description: 'When unchecked, shows "Coming Soon" state. Turn on when PDF is uploaded and ready.',
      },
    },
    {
      name: 'downloadCount',
      type: 'number',
      label: 'Download Count (auto-incremented)',
      defaultValue: 0,
      admin: { readOnly: true },
    },
    {
      name: 'relatedService',
      type: 'relationship',
      relationTo: 'services',
      label: 'Related Studio Service',
      admin: { description: 'Links this resource to a service page (shown as a cross-link).' },
    },
    {
      name: 'nurtureTag',
      type: 'text',
      label: 'n8n Nurture Sequence Tag',
      admin: { description: 'Tag sent to n8n when this resource is downloaded. Used to trigger the correct nurture sequence.' },
    },
  ],
}
