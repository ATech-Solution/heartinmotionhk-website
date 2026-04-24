import type { Block } from 'payload'

export const ValuesBlock: Block = {
  slug: 'values',
  labels: { singular: 'Values Grid', plural: 'Values Grids' },
  fields: [
    {
      name: 'heading',
      type: 'text',
      localized: true,
    },
    {
      name: 'values',
      type: 'array',
      minRows: 1,
      maxRows: 8,
      fields: [
        {
          name: 'title',
          type: 'text',
          localized: true,
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          localized: true,
        },
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'color',
          type: 'select',
          defaultValue: 'teal',
          options: [
            { label: 'Teal', value: 'teal' },
            { label: 'Yellow', value: 'yellow' },
            { label: 'Pink', value: 'pink' },
            { label: 'Blue', value: 'blue' },
          ],
        },
      ],
    },
  ],
}
