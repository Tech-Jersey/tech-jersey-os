// BlogPosts — Full publishing system with SEO
import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminOrEditor, isPublic } from '../access/roles'

export const BlogPosts: CollectionConfig = {
  slug: 'blog-posts',
  labels: { singular: 'Blog Post', plural: 'Blog Posts' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'status', 'publishedDate'],
    description: 'Journal articles, case studies, and educational content.',
  },
  access: {
    create: isAdminOrEditor,
    read: isPublic,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Post Title',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'URL Slug',
      required: true,
      unique: true,
    },
    {
      name: 'category',
      type: 'select',
      label: 'Category',
      options: [
        { label: 'Architecture', value: 'architecture' },
        { label: 'AI Logic', value: 'ai' },
        { label: 'Automation', value: 'automation' },
        { label: 'Case Study', value: 'case-study' },
        { label: 'Industry Insight', value: 'insight' },
      ],
    },
    {
      name: 'excerpt',
      type: 'textarea',
      label: 'Excerpt / Summary',
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Post Content',
    },
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
      label: 'Thumbnail / Cover Image',
    },
    {
      name: 'author',
      type: 'text',
      label: 'Author Name',
      defaultValue: 'Tech Jersey Studio',
    },
    {
      name: 'readTime',
      type: 'text',
      label: 'Read Time',
      admin: { description: 'e.g. "12 min read"' },
    },
    {
      name: 'publishedDate',
      type: 'date',
      label: 'Published Date',
      index: true,
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      defaultValue: 'draft',
      index: true,
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Archived', value: 'archived' },
      ],
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Feature on Homepage / Journal Index',
      defaultValue: false,
    },
    {
      name: 'seo',
      type: 'group',
      label: 'SEO',
      fields: [
        { name: 'title', type: 'text', label: 'Meta Title' },
        { name: 'description', type: 'textarea', label: 'Meta Description' },
        { name: 'ogImage', type: 'upload', relationTo: 'media', label: 'OG Share Image' },
      ],
    },
  ],
}
