import type { Block } from 'payload'

const visibilityGroup = {
  name: 'visibility',
  type: 'group' as const,
  label: 'Visibility',
  admin: { description: 'Control which viewports this block appears on.' },
  fields: [
    { name: 'showOnDesktop', type: 'checkbox' as const, defaultValue: true, label: 'Show on Desktop (≥1024px)' },
    { name: 'showOnTablet', type: 'checkbox' as const, defaultValue: true, label: 'Show on Tablet (768–1023px)' },
    { name: 'showOnMobile', type: 'checkbox' as const, defaultValue: true, label: 'Show on Mobile (<768px)' },
  ],
}

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
      name: 'sectionIntro',
      type: 'richText',
      label: 'Section Intro',
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
          name: 'decorativeImage',
          type: 'upload',
          label: 'Decorative Illustration',
          relationTo: 'media',
          admin: { description: 'Optional decorative illustration shown beside this card (e.g. tree, birds, stones).' },
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
    visibilityGroup,
  ],
}
