// Pages — Modular, block-based page editing
import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminOrEditor, isPublic } from '../access/roles'

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: { singular: 'Page', plural: 'Pages' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'status'],
    description: 'All editable website pages with block-based content.',
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
      label: 'Page Title',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'URL Slug',
      required: true,
      unique: true,
      admin: { description: 'e.g. "home", "services", "about"' },
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
    },
    // ── Content Blocks ──
    {
      name: 'content',
      type: 'blocks',
      label: 'Page Content Blocks',
      blocks: [
        // HERO BLOCK
        {
          slug: 'hero',
          labels: { singular: 'Hero Block', plural: 'Hero Blocks' },
          fields: [
            { name: 'headline', type: 'text', label: 'Headline', required: true },
            { name: 'subheadline', type: 'text', label: 'Subheadline (Serif Accent)' },
            { name: 'description', type: 'textarea', label: 'Description / Subtext' },
            { name: 'ctaPrimary', type: 'text', label: 'Primary CTA Text' },
            { name: 'ctaPrimaryUrl', type: 'text', label: 'Primary CTA URL' },
            { name: 'ctaSecondary', type: 'text', label: 'Secondary CTA Text' },
            { name: 'ctaSecondaryUrl', type: 'text', label: 'Secondary CTA URL' },
            {
              name: 'show3DCore',
              type: 'checkbox',
              label: 'Show 3D Automation Core',
              defaultValue: true,
            },
          ],
        },
        // SERVICES GRID BLOCK
        {
          slug: 'services-grid',
          labels: { singular: 'Services Grid', plural: 'Services Grids' },
          fields: [
            { name: 'headline', type: 'text', label: 'Section Headline' },
            { name: 'subheadline', type: 'text', label: 'Serif Accent' },
            { name: 'description', type: 'textarea', label: 'Section Description' },
            {
              name: 'layout',
              type: 'select',
              label: 'Layout Style',
              defaultValue: 'grid',
              options: [
                { label: '2-Column Grid', value: 'grid' },
                { label: 'Alternating Asymmetric', value: 'asymmetric' },
              ],
            },
          ],
        },
        // PROCESS BLOCK
        {
          slug: 'process',
          labels: { singular: 'Process Section', plural: 'Process Sections' },
          fields: [
            { name: 'headline', type: 'text', label: 'Section Headline' },
            { name: 'subheadline', type: 'text', label: 'Serif Accent' },
            { name: 'description', type: 'textarea', label: 'Section Description' },
            {
              name: 'steps',
              type: 'array',
              label: 'Process Steps',
              fields: [
                { name: 'numeral', type: 'text', label: 'Numeral (e.g. I. or 01)' },
                { name: 'title', type: 'text', label: 'Step Title' },
                { name: 'description', type: 'textarea', label: 'Step Description' },
              ],
            },
          ],
        },
        // RESULTS BLOCK
        {
          slug: 'results',
          labels: { singular: 'Results / Impact Section', plural: 'Results Sections' },
          fields: [
            { name: 'headline', type: 'text', label: 'Section Headline' },
            { name: 'subheadline', type: 'text', label: 'Serif Accent' },
            { name: 'description', type: 'textarea', label: 'Section Description' },
          ],
        },
        // RICH TEXT BLOCK
        {
          slug: 'rich-text',
          labels: { singular: 'Rich Text Block', plural: 'Rich Text Blocks' },
          fields: [
            { name: 'content', type: 'richText', label: 'Content', required: true },
          ],
        },
        // CTA BLOCK
        {
          slug: 'cta',
          labels: { singular: 'CTA Section', plural: 'CTA Sections' },
          fields: [
            { name: 'headline', type: 'text', label: 'Headline', required: true },
            { name: 'subheadline', type: 'text', label: 'Serif Accent / Subheadline' },
            { name: 'ctaText', type: 'text', label: 'CTA Button Text' },
            { name: 'ctaUrl', type: 'text', label: 'CTA URL' },
          ],
        },
        // STATS BLOCK
        {
          slug: 'stats',
          labels: { singular: 'Stats Row', plural: 'Stats Rows' },
          fields: [
            {
              name: 'stats',
              type: 'array',
              label: 'Statistics',
              fields: [
                { name: 'value', type: 'text', label: 'Stat Value', required: true },
                { name: 'label', type: 'text', label: 'Stat Label', required: true },
              ],
            },
          ],
        },
      ],
    },
    // ── SEO ──
    {
      name: 'seo',
      type: 'group',
      label: 'SEO',
      fields: [
        { name: 'title', type: 'text', label: 'Meta Title' },
        { name: 'description', type: 'textarea', label: 'Meta Description' },
        { name: 'ogImage', type: 'upload', relationTo: 'media', label: 'OG Image' },
      ],
    },
  ],
}
