import type { GlobalConfig } from 'payload'
import { isAdmin } from '@/access/isAdmin'
import { isAdminOrEditor } from '@/access/isAdminOrEditor'
import { revalidateGlobal } from '@/hooks/revalidateGlobal'

export const MaintenanceSettings: GlobalConfig = {
  slug: 'maintenance-settings',
  label: 'Maintenance Mode',
  admin: {
    group: 'Settings',
    description: 'Control the public maintenance page shown to visitors when the site is offline.',
    livePreview: {
      url: ({ locale }) => {
        const base =
          process.env.NEXT_PUBLIC_SITE_URL ||
          process.env.NEXT_PUBLIC_SITE_URL_DEV ||
          'http://localhost:3000'
        return `${base}/maintenance`
      },
    },
  },
  access: {
    read: isAdminOrEditor,
    update: isAdmin,
  },
  hooks: {
    afterChange: [revalidateGlobal],
  },
  fields: [
    {
      name: 'enabled',
      type: 'checkbox',
      label: 'Enable Maintenance Mode',
      defaultValue: false,
      admin: {
        description:
          '⚠️ When enabled, all public visitors (without an admin session) are redirected to the maintenance page. Admins logged in can still access the site normally.',
      },
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'title',
      type: 'text',
      localized: true,
      label: 'Page Title',
      defaultValue: 'We are under maintenance',
    },
    {
      name: 'message',
      type: 'richText',
      localized: true,
      label: 'Message',
      admin: {
        description: 'Optional message shown below the title. Supports rich text formatting.',
      },
    },
    {
      name: 'estimatedReturn',
      type: 'text',
      localized: true,
      label: 'Estimated Return',
      admin: {
        description: 'e.g. "Back on 1 May 2026 at 10:00 AM HKT"',
        placeholder: 'Back on 1 May 2026',
      },
    },
  ],
}
