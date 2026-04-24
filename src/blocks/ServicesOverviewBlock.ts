import type { Block } from 'payload'

export const ServicesOverviewBlock: Block = {
  slug: 'services-overview',
  labels: { singular: 'Services Overview', plural: 'Services Overviews' },
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
