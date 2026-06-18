import type { GlobalConfig } from 'payload'
import { isAdmin } from '@/access/isAdmin'
import { isPublic } from '@/access/isPublic'
import { revalidateGlobal } from '@/hooks/revalidateGlobal'

export const GeneralSettings: GlobalConfig = {
  slug: 'general-settings',
  label: 'General Settings',
  admin: { group: 'Settings' },
  access: {
    read: isPublic,
    update: isAdmin,
  },
  hooks: {
    afterChange: [revalidateGlobal],
  },
  fields: [
    {
      name: 'adminLogo',
      type: 'upload',
      relationTo: 'media',
      label: 'Admin Logo',
      admin: { description: 'Logo displayed on the admin login page.' },
    },
    {
      name: 'siteName',
      type: 'text',
      defaultValue: 'Heart in Motion HK',
    },
    {
      name: 'siteTagline',
      type: 'text',
      localized: true,
    },
    {
      name: 'contactEmail',
      type: 'email',
    },
    {
      name: 'contactPhone',
      type: 'text',
    },
    {
      name: 'contactAddress',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'bookingUrl',
      type: 'text',
      label: "Let's Connect URL",
    },
    {
      name: 'emailMeUrl',
      type: 'text',
      label: 'Email Me URL',
    },
    {
      type: 'collapsible',
      label: 'Email Configuration',
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'emailFromName',
          type: 'text',
          defaultValue: 'Heart in Motion HK',
        },
        {
          name: 'emailFromAddress',
          type: 'email',
        },
      ],
    },
    {
      name: 'aiTranslatePanel',
      type: 'ui',
      admin: {
        position: 'sidebar',
        components: { Field: '@/components/admin/AutoTranslatePanel' },
      },
    },
  ],
}
