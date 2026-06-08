// Testimonials — Client quotes and ratings
import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminOrEditor, isPublic } from '../access/roles'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  labels: { singular: 'Testimonial', plural: 'Testimonials' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'company', 'rating', 'featured'],
  },
  access: {
    create: isAdmin,
    read: isPublic,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Client Name',
      required: true,
    },
    {
      name: 'role',
      type: 'text',
      label: 'Role / Title',
    },
    {
      name: 'company',
      type: 'text',
      label: 'Company / Business',
    },
    {
      name: 'quote',
      type: 'textarea',
      label: 'Testimonial Quote',
      required: true,
    },
    {
      name: 'rating',
      type: 'select',
      label: 'Rating',
      defaultValue: '5',
      options: ['1', '2', '3', '4', '5'].map(n => ({ label: `${n} Star${n !== '1' ? 's' : ''}`, value: n })),
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      label: 'Client Photo',
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Show on Homepage',
      defaultValue: false,
    },
    {
      name: 'isDemo',
      type: 'checkbox',
      label: 'Is Demo/Seed',
      defaultValue: false,
      admin: {
        description: 'Excludes this testimonial automatically in production environments.',
      },
    },
    {
      name: 'order',
      type: 'number',
      label: 'Display Order',
      defaultValue: 10,
    },
  ],
}
