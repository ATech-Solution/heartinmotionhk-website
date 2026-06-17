import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { searchPlugin } from '@payloadcms/plugin-search'
import { importExportPlugin } from '@payloadcms/plugin-import-export'
import { multilanguagePlugin } from './plugins/multilanguagePlugin'

import { Users } from '@/collections/Users'
import { Pages } from '@/collections/Pages'
import { Media } from '@/collections/Media'
import { Services } from '@/collections/Services'
import { Testimonials } from '@/collections/Testimonials'
import { GeneralSettings } from '@/globals/GeneralSettings'
import { MaintenanceSettings } from '@/globals/MaintenanceSettings'
import { Header } from '@/globals/Header'
import { Footer } from '@/globals/Footer'
import { notifyContactFormSubmission } from '@/hooks/notifyContactFormSubmission'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000',
  secret: process.env.PAYLOAD_SECRET || 'fallback-dev-secret',
  sharp,

  // ── Database ──────────────────────────────────────────
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URL || 'file:./data/payload.db',
    },
  }),

  // ── Editor ────────────────────────────────────────────
  editor: lexicalEditor(),

  // ── Localization ──────────────────────────────────────
  localization: {
    locales: [
      { label: 'English', code: 'en' },
      { label: '繁體中文 (HK)', code: 'zh-HK' },
    ],
    defaultLocale: 'en',
    fallback: true,
  },

  // ── Email (AWS SES via SMTP) ──────────────────────────
  email: nodemailerAdapter({
    defaultFromAddress: process.env.EMAIL_FROM ?? 'noreply@heartinmotionhk.com',
    defaultFromName: process.env.EMAIL_FROM_NAME ?? 'Heart in Motion HK',
    transportOptions: {
      host: process.env.AWS_SES_SMTP_HOST || 'localhost',
      port: Number(process.env.AWS_SES_SMTP_PORT || 587),
      secure: Number(process.env.AWS_SES_SMTP_PORT || 587) === 465,
      auth: {
        user: process.env.AWS_SES_SMTP_USER || '',
        pass: process.env.AWS_SES_SMTP_PASSWORD || '',
      },
    },
  }),

  // ── Collections ───────────────────────────────────────
  collections: [Users, Pages, Media, Services, Testimonials],

  // ── Globals ───────────────────────────────────────────
  globals: [GeneralSettings, MaintenanceSettings, Header, Footer],

  // ── Plugins ───────────────────────────────────────────
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
        access: {
          read: () => true,
          create: () => true,
        },
        admin: {
          hidden: true,
        },
      },
      formSubmissionOverrides: {
        labels: {
          singular: 'Form Submission',
          plural: 'Form Submissions',
        },
        access: {
          create: () => true,
        },
        admin: {
          defaultColumns: ['form', 'createdAt'],
          description: 'All contact form submissions from the website.',
        },
        hooks: {
          afterChange: [notifyContactFormSubmission],
        },
      },
    }),
    redirectsPlugin({
      collections: ['pages'],
      overrides: {
        admin: {
          hidden: true,
        },
      },
    }),
    nestedDocsPlugin({
      collections: ['pages'],
    }),
    searchPlugin({
      collections: ['pages', 'services'],
      defaultPriorities: {
        pages: 10,
        services: 8,
      },
      searchOverrides: {
        admin: {
          hidden: true,
        },
      },
    }),
    importExportPlugin({}),
    multilanguagePlugin(),
  ],

  // ── Admin ─────────────────────────────────────────────
  admin: {
    user: 'users',
    // prefillOnly: true → only pre-fills the login form; does NOT bypass authentication
    // autoLogin: { email: 'tan@atech.software', prefillOnly: false },
    meta: {
      titleSuffix: '— Heart in Motion HK',
    },
    components: {
      beforeLogin: ['@/components/admin/BeforeLogin'],
      views: {
        backupRestore: {
          Component: '@/components/admin/BackupRestoreView',
          path: '/backup',
        },
      },
    },
  },

  // ── TypeScript codegen ────────────────────────────────
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  // ── Upload limits ─────────────────────────────────────
  upload: {
    limits: {
      fileSize: 10_000_000,
    },
  },
})
