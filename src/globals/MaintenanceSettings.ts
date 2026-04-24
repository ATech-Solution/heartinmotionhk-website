import type { GlobalConfig } from 'payload'
import { isAdmin } from '@/access/isAdmin'
import { isAdminOrEditor } from '@/access/isAdminOrEditor'

export const MaintenanceSettings: GlobalConfig = {
  slug: 'maintenance-settings',
  label: 'Maintenance Mode',
  admin: { group: 'Settings' },
  access: {
    read: isAdminOrEditor,
    update: isAdmin,
  },
  fields: [
    {
      name: 'enabled',
      type: 'checkbox',
      label: 'Enable Maintenance Mode',
      defaultValue: false,
      admin: {
        description:
          'When enabled, all visitors without an admin session will be redirected to the maintenance page.',
      },
    },
    {
      name: 'title',
      type: 'text',
      localized: true,
      defaultValue: 'We are under maintenance',
    },
    {
      name: 'message',
      type: 'richText',
      localized: true,
    },
    {
      name: 'estimatedReturn',
      type: 'text',
      localized: true,
      label: 'Estimated Return (e.g. "Back on 1 May 2026")',
    },
  ],
}
