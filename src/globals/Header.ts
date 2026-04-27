import type { GlobalConfig } from 'payload'
import { isAdminOrEditor } from '@/access/isAdminOrEditor'
import { isPublic } from '@/access/isPublic'
import { revalidateGlobal } from '@/hooks/revalidateGlobal'

export const Header: GlobalConfig = {
  slug: 'header',
  label: 'Header',
  admin: { group: 'Navigation' },
  access: {
    read: isPublic,
    update: isAdminOrEditor,
  },
  hooks: {
    afterChange: [revalidateGlobal],
  },
  fields: [
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'navItems',
      type: 'array',
      label: 'Navigation Items',
      maxRows: 10,
      fields: [
        {
          name: 'label',
          type: 'text',
          localized: true,
          required: true,
        },
        {
          name: 'linkType',
          type: 'select',
          defaultValue: 'page',
          options: [
            { label: 'Internal Page', value: 'page' },
            { label: 'External URL', value: 'external' },
          ],
        },
        {
          name: 'page',
          type: 'relationship',
          relationTo: 'pages',
          admin: {
            condition: (_, siblingData) => siblingData?.linkType === 'page',
          },
        },
        {
          name: 'url',
          type: 'text',
          admin: {
            condition: (_, siblingData) => siblingData?.linkType === 'external',
          },
        },
      ],
    },
    {
      name: 'ctaButtons',
      type: 'array',
      label: 'CTA Buttons (Desktop)',
      maxRows: 3,
      fields: [
        {
          name: 'label',
          type: 'text',
          localized: true,
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
        {
          name: 'style',
          type: 'select',
          defaultValue: 'primary',
          options: [
            { label: 'Primary (Teal)', value: 'primary' },
            { label: 'Secondary (Yellow)', value: 'secondary' },
          ],
        },
      ],
    },
    {
      name: 'mobileCta',
      type: 'group',
      label: 'Mobile CTA Buttons',
      admin: { description: 'Two action buttons shown in the mobile menu.' },
      fields: [
        {
          name: 'connectLabel',
          type: 'text',
          localized: true,
          defaultValue: "Let's connect",
          label: 'Connect Button Label',
        },
        {
          name: 'connectUrl',
          type: 'text',
          label: 'Connect Button URL',
          admin: { description: 'e.g. booking/calendar link' },
        },
        {
          name: 'emailLabel',
          type: 'text',
          localized: true,
          defaultValue: 'Email me',
          label: 'Email Button Label',
        },
        {
          name: 'emailUrl',
          type: 'text',
          label: 'Email Button URL',
          admin: { description: 'e.g. mailto: link' },
        },
      ],
    },
  ],
}
