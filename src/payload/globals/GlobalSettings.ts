// GlobalSettings — editable from admin: branding, contact, SEO, social
import type { GlobalConfig } from 'payload'
import { isAdmin, isPublic } from '../access/roles'

export const GlobalSettings: GlobalConfig = {
  slug: 'global-settings',
  label: 'Global Settings',
  access: {
    read: isPublic,
    update: isAdmin,
  },
  fields: [
    // ── BRAND ──
    {
      name: 'brandName',
      type: 'text',
      label: 'Brand Name',
      defaultValue: 'Tech Jersey',
      required: true,
    },
    {
      name: 'brandStatement',
      type: 'textarea',
      label: 'Brand Statement',
      defaultValue: 'We design automation systems, websites, apps, AI tools, and business operating systems for modern enterprises.',
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Primary Logo (Dark Background)',
    },
    {
      name: 'logoDark',
      type: 'upload',
      relationTo: 'media',
      label: 'Logo Variant (Light Background)',
    },
    {
      name: 'favicon',
      type: 'upload',
      relationTo: 'media',
      label: 'Favicon (ICO or PNG)',
    },
    {
      name: 'ogImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Default OG Share Image',
    },

    // ── SEO DEFAULTS ──
    {
      name: 'seo',
      type: 'group',
      label: 'SEO Defaults',
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          label: 'Default Meta Title',
          defaultValue: 'Tech Jersey — Automation, Websites, Apps & AI Systems',
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          label: 'Default Meta Description',
          defaultValue: 'Tech Jersey builds premium automation systems, custom websites, AI tools, and business operating systems for modern enterprises.',
        },
      ],
    },

    // ── CONTACT ──
    {
      name: 'contact',
      type: 'group',
      label: 'Contact Information',
      fields: [
        {
          name: 'whatsapp',
          type: 'text',
          label: 'WhatsApp Number',
          defaultValue: '+917357971717',
        },
        {
          name: 'email',
          type: 'email',
          label: 'Contact Email',
          defaultValue: 'tech.jersey.d@gmail.com',
        },
        {
          name: 'city',
          type: 'text',
          label: 'City / Location',
        },
      ],
    },

    // ── PLATFORM LINKS (dynamic, for header/footer/social) ──
    {
      name: 'platformLinks',
      type: 'array',
      label: 'Platform Links',
      fields: [
        {
          name: 'platform',
          type: 'select',
          label: 'Platform',
          required: true,
          options: [
            { label: 'WhatsApp', value: 'whatsapp' },
            { label: 'Instagram', value: 'instagram' },
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'YouTube', value: 'youtube' },
            { label: 'Twitter / X', value: 'twitter' },
            { label: 'Facebook', value: 'facebook' },
            { label: 'GitHub', value: 'github' },
            { label: 'Other', value: 'other' },
          ],
        },
        {
          name: 'label',
          type: 'text',
          label: 'Display Label',
        },
        {
          name: 'url',
          type: 'text',
          label: 'URL / Link',
          required: true,
        },
        {
          name: 'enabled',
          type: 'checkbox',
          label: 'Show in Navigation',
          defaultValue: true,
        },
      ],
    },

    // ── NAV LINKS ──
    {
      name: 'navLinks',
      type: 'array',
      label: 'Header Navigation Links',
      fields: [
        { name: 'label', type: 'text', label: 'Link Label', required: true },
        { name: 'href', type: 'text', label: 'URL or Anchor', required: true },
      ],
    },

    // ── FOUNDER PROFILE ──
    {
      name: 'founder',
      type: 'group',
      label: 'Founder Profile',
      admin: {
        description: 'Displayed on the /about page. All fields are optional; defaults are used if empty.',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Founder Name',
          defaultValue: 'Dhruv',
        },
        {
          name: 'role',
          type: 'text',
          label: 'Role / Title',
          defaultValue: 'Founder & Lead Systems Architect',
        },
        {
          name: 'philosophy',
          type: 'textarea',
          label: 'Core Philosophy (Hero Quote)',
          defaultValue: 'Most businesses don\'t have a growth problem. They have a systems problem. We fix the systems.',
        },
        {
          name: 'bio',
          type: 'richText',
          label: 'Long-form Biography',
        },
        {
          name: 'photo',
          type: 'upload',
          relationTo: 'media',
          label: 'Founder Photo (portrait, min 800×1000px)',
        },
        {
          name: 'yearsExperience',
          type: 'text',
          label: 'Years Experience',
          defaultValue: '5+',
        },
        {
          name: 'clientsServed',
          type: 'text',
          label: 'Clients Served',
          defaultValue: '12+',
        },
        {
          name: 'revenueUnlocked',
          type: 'text',
          label: 'Revenue Unlocked (display string)',
          defaultValue: '₹40L+',
        },
        {
          name: 'linkedIn',
          type: 'text',
          label: 'LinkedIn URL',
        },
        {
          name: 'twitter',
          type: 'text',
          label: 'Twitter / X URL',
        },
        {
          name: 'instagram',
          type: 'text',
          label: 'Instagram URL',
        },
      ],
    },
    // ── N8N WEBHOOK & AUTOMATION SETTINGS ──
    {
      name: 'n8n',
      type: 'group',
      label: 'n8n Automation Settings',
      admin: {
        description: 'Configure your n8n workflows integration. Note: if these are left blank, the server will fall back to environment variables.',
      },
      fields: [
        {
          name: 'webhookUrl',
          type: 'text',
          label: 'n8n Webhook URL',
          admin: {
            placeholder: 'e.g. https://n8n.yourdomain.com/webhook/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
            description: 'This is the webhook endpoint triggered for lead and audit submissions.',
          },
        },
        {
          name: 'webhookSecret',
          type: 'text',
          label: 'n8n Webhook Secret (HMAC Signature Key)',
          admin: {
            placeholder: 'e.g. your-super-secure-shared-secret-key',
            description: 'Used to sign outgoing payloads and verify incoming callback signatures.',
          },
        },
      ],
    },
  ],
}


