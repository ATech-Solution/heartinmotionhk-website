// Lightweight Payload config used only for `payload migrate`.
// Omits sharp, email, admin UI and hooks — none of these affect the DB schema.
// Schema-defining parts (collections, globals, plugins, localization, editor)
// must stay identical to payload.config.ts.
import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { searchPlugin } from '@payloadcms/plugin-search'
import { importExportPlugin } from '@payloadcms/plugin-import-export'

import { Users } from '@/collections/Users'
import { Pages } from '@/collections/Pages'
import { Media } from '@/collections/Media'
import { Services } from '@/collections/Services'
import { Testimonials } from '@/collections/Testimonials'
import { GeneralSettings } from '@/globals/GeneralSettings'
import { MaintenanceSettings } from '@/globals/MaintenanceSettings'
import { Header } from '@/globals/Header'
import { Footer } from '@/globals/Footer'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000',
  secret: process.env.PAYLOAD_SECRET || 'fallback-dev-secret',

  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URL || 'file:./data/payload.db',
    },
  }),

  editor: lexicalEditor(),

  localization: {
    locales: [
      { label: 'English', code: 'en' },
      { label: '繁體中文 (HK)', code: 'zh-HK' },
    ],
    defaultLocale: 'en',
    fallback: true,
  },

  collections: [Users, Pages, Media, Services, Testimonials],
  globals: [GeneralSettings, MaintenanceSettings, Header, Footer],

  plugins: [
    seoPlugin({
      collections: ['pages'],
      uploadsCollection: 'media',
      generateTitle: ({ doc }) => `${doc?.title} — Heart in Motion HK`,
      generateDescription: ({ doc }) => doc?.meta?.description ?? '',
    }),
    formBuilderPlugin({
      fields: {
        payment: false,
        state: false,
      },
      formOverrides: {
        access: { read: () => true },
        admin: { hidden: true },
      },
    }),
    redirectsPlugin({
      collections: ['pages'],
      overrides: { admin: { hidden: true } },
    }),
    nestedDocsPlugin({ collections: ['pages'] }),
    searchPlugin({
      collections: ['pages', 'services'],
      defaultPriorities: { pages: 10, services: 8 },
      searchOverrides: { admin: { hidden: true } },
    }),
    importExportPlugin({}),
  ],

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
