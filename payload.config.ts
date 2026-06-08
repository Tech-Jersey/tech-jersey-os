import { buildConfig } from 'payload'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'

// Collections
import { Pages } from './src/payload/collections/Pages'
import { Services } from './src/payload/collections/Services'
import { BlogPosts } from './src/payload/collections/BlogPosts'
import { CaseStudies } from './src/payload/collections/CaseStudies'
import { Leads } from './src/payload/collections/Leads'
import { Testimonials } from './src/payload/collections/Testimonials'
import { Resources } from './src/payload/collections/Resources'

// Globals
import { GlobalSettings } from './src/payload/globals/GlobalSettings'

// RBAC helpers
import { isAdmin, isAdminOrEditor, isPublic } from './src/payload/access/roles'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// ── PRODUCTION ENVIRONMENT GUARD ────────────────────────────────────────────
// Fail hard and loud in production if critical env vars are absent or
// still set to the default fallback value. This prevents the server from
// booting with an insecure session secret that could allow cookie forgery.
if (process.env.NODE_ENV === 'production') {
  const REQUIRED_ENV = ['PAYLOAD_SECRET', 'DATABASE_URI', 'NEXT_PUBLIC_SERVER_URL']
  const missing = REQUIRED_ENV.filter((key) => !process.env[key])
  if (missing.length) {
    throw new Error(
      `[Tech Jersey] FATAL: Missing required environment variables in production: ${missing.join(', ')}`
    )
  }
  if (process.env.PAYLOAD_SECRET === 'techjersey-change-me-in-production') {
    throw new Error(
      '[Tech Jersey] FATAL: Default PAYLOAD_SECRET detected in production. Set a strong, unique secret.'
    )
  }
}

export default buildConfig({
  admin: {
    user: 'users',
    meta: {
      titleSuffix: '— Tech Jersey Studio',
      icons: [{ rel: 'icon', type: 'image/png', url: '/images/favicon.png' }],
      openGraph: {
        images: [{ url: '/images/og-admin.jpg' }],
      },
    },
  },

  collections: [
    // Auth — Users
    {
      slug: 'users',
      auth: true,
      admin: { useAsTitle: 'email', group: 'Admin' },
      access: {
        create: isPublic,
        read: isPublic,
        update: isPublic,
        delete: isPublic,
      },
      fields: [
        { name: 'name', type: 'text', label: 'Full Name' },
        {
          name: 'role',
          type: 'select',
          label: 'Role',
          defaultValue: 'editor',
          options: [
            { label: 'Admin', value: 'admin' },
            { label: 'Editor', value: 'editor' },
            { label: 'Viewer', value: 'viewer' },
          ],
        },
      ],
    },

    // Content
    { ...Pages, admin: { ...Pages.admin, group: 'Content' } },
    { ...Services, admin: { ...Services.admin, group: 'Marketing' } },
    { ...BlogPosts, admin: { ...BlogPosts.admin, group: 'Content' } },
    { ...CaseStudies, admin: { ...CaseStudies.admin, group: 'Marketing' } },
    { ...Resources, admin: { ...Resources.admin, group: 'Marketing' } },
    { ...Leads, admin: { ...Leads.admin, group: 'Admin' } },
    { ...Testimonials, admin: { ...Testimonials.admin, group: 'Marketing' } },

    // Media
    {
      slug: 'media',
      admin: { group: 'Content' },
      access: {
        create: isAdminOrEditor,
        read: isPublic,
        update: isAdminOrEditor,
        delete: isAdmin,
      },
      upload: {
        staticDir: path.resolve(dirname, 'public/media'),
        imageSizes: [
          { name: 'thumbnail', width: 400, height: 300, crop: 'center' },
          { name: 'card', width: 800, height: 600, crop: 'center' },
          { name: 'feature', width: 1600, height: 900, crop: 'center' },
        ],
        adminThumbnail: 'thumbnail',
        mimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/svg+xml', 'image/webp', 'image/avif'],
      },
      fields: [
        { name: 'alt', type: 'text', label: 'Alt Text' },
        { name: 'caption', type: 'text', label: 'Caption' },
      ],
    },
  ],

  globals: [GlobalSettings],

  editor: lexicalEditor({}),

  db: (() => {
    const uri = process.env.DATABASE_URI || 'file:./payload.db'
    if (uri.startsWith('mongodb://') || uri.startsWith('mongodb+srv://')) {
      return mongooseAdapter({
        url: uri,
      })
    }
    return sqliteAdapter({
      client: {
        url: uri,
      },
    })
  })(),

  // Non-nullable assertion: the startup guard above ensures this is set in
  // production. In development, fall back to local secret for convenience.
  secret: process.env.PAYLOAD_SECRET || 'techjersey-dev-secret-only',

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  graphQL: {
    schemaOutputFile: path.resolve(dirname, 'generated-schema.graphql'),
  },

  cors: [
    'http://localhost:3000',
    process.env.NEXT_PUBLIC_SERVER_URL || '',
  ].filter(Boolean),

  csrf: [
    'http://localhost:3000',
    process.env.NEXT_PUBLIC_SERVER_URL || '',
  ].filter(Boolean),
})
