import type { Block } from 'payload'

export const ServiceDetailBlock: Block = {
  slug: 'service-detail',
  labels: { singular: 'Service Detail', plural: 'Service Details' },
  fields: [
    {
      name: 'heading',
      type: 'text',
      localized: true,
    },
    {
      name: 'subheading',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'services',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
    },
  ],
}
