import type { CollectionConfig } from 'payload'
import { isAdmin } from '@/access/isAdmin'
import { isAdminOrEditor } from '@/access/isAdminOrEditor'
import { isPublic } from '@/access/isPublic'

export const Services: CollectionConfig = {
  slug: 'services',
  labels: { singular: 'Service', plural: 'Services' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'order'],
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
      localized: true,
      required: true,
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Executive & Leadership Coaching', value: 'executive-leadership' },
        { label: 'Individual Coaching & Development', value: 'individual' },
        { label: 'Program & Change Delivery', value: 'program-change' },
      ],
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'description',
      type: 'richText',
      localized: true,
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },
  ],
}
