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
      name: 'socialLinks',
      type: 'array',
      fields: [
        {
          name: 'platform',
          type: 'select',
          required: true,
          options: [
            { label: 'Facebook', value: 'facebook' },
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'Instagram', value: 'instagram' },
            { label: 'WhatsApp', value: 'whatsapp' },
            { label: 'YouTube', value: 'youtube' },
          ],
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
      ],
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
  ],
}
