import type { CollectionConfig } from 'payload'
import { isAdmin } from '@/access/isAdmin'
import { isAdminOrEditor } from '@/access/isAdminOrEditor'
import { isPublic } from '@/access/isPublic'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  labels: { singular: 'Testimonial', plural: 'Testimonials' },
  admin: {
    useAsTitle: 'authorName',
    defaultColumns: ['authorName', 'authorTitle', 'rating', 'featured'],
  },
  access: {
    create: isAdminOrEditor,
    read: isPublic,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'quote',
      type: 'textarea',
      localized: true,
      required: true,
    },
    {
      name: 'authorName',
      type: 'text',
      localized: true,
      required: true,
    },
    {
      name: 'authorTitle',
      type: 'text',
      localized: true,
    },
    {
      name: 'authorCompany',
      type: 'text',
      localized: true,
    },
    {
      name: 'rating',
      type: 'number',
      min: 1,
      max: 5,
      defaultValue: 5,
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
  ],
}
