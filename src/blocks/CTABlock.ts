import type { Block } from 'payload'

export const CTABlock: Block = {
  slug: 'cta',
  labels: { singular: 'Call to Action', plural: 'Calls to Action' },
  fields: [
    {
      name: 'heading',
      type: 'text',
      localized: true,
      required: true,
    },
    {
      name: 'subheading',
      type: 'text',
      localized: true,
    },
    {
      name: 'ctaLabel',
      type: 'text',
      localized: true,
    },
    {
      name: 'ctaUrl',
      type: 'text',
    },
    {
      name: 'background',
      type: 'select',
      defaultValue: 'teal',
      options: [
        { label: 'Teal', value: 'teal' },
        { label: 'Yellow', value: 'yellow' },
        { label: 'Beige', value: 'beige' },
      ],
    },
  ],
}
