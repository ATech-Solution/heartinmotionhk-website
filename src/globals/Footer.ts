import type { GlobalConfig } from 'payload'
import { isAdminOrEditor } from '@/access/isAdminOrEditor'
import { isPublic } from '@/access/isPublic'
import { revalidateGlobal } from '@/hooks/revalidateGlobal'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: 'Footer',
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
      name: 'navLinks',
      type: 'array',
      label: 'Footer Navigation Links',
      fields: [
        {
          name: 'label',
          type: 'text',
          localized: true,
          required: true,
        },
        {
          name: 'page',
          type: 'relationship',
          relationTo: 'pages',
        },
        {
          name: 'url',
          type: 'text',
          admin: { description: 'Use if linking to an external URL instead of a page' },
        },
      ],
    },
    {
      name: 'socialLinks',
      type: 'array',
      label: 'Social Media Links',
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
      name: 'copyrightText',
      type: 'text',
      localized: true,
      defaultValue: '©2026 Heart in Motion — All Rights Reserved',
    },
    {
      name: 'privacyPolicy',
      type: 'group',
      label: 'Privacy Policy',
      admin: {
        description: 'Content shown in the Privacy Policy popup',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          localized: true,
          defaultValue: 'Privacy policy',
        },
        {
          name: 'content',
          type: 'richText',
          localized: true,
          editor: lexicalEditor(),
        },
      ],
    },
    {
      name: 'termsConditions',
      type: 'group',
      label: 'Terms & Conditions',
      admin: {
        description: 'Content shown in the Terms & Conditions popup',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          localized: true,
          defaultValue: 'Terms & Conditions',
        },
        {
          name: 'content',
          type: 'richText',
          localized: true,
          editor: lexicalEditor(),
        },
      ],
    },
  ],
}
