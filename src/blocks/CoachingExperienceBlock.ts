import type { Block } from 'payload'

export const CoachingExperienceBlock: Block = {
  slug: 'coaching-experience',
  labels: { singular: 'Coaching Experience', plural: 'Coaching Experience Sections' },
  fields: [
    {
      name: 'heading',
      type: 'text',
      localized: true,
      required: true,
    },
    {
      name: 'certifications',
      type: 'array',
      label: 'Certifications',
      fields: [
        {
          name: 'title',
          type: 'text',
          localized: true,
          required: true,
        },
        {
          name: 'institution',
          type: 'text',
          localized: true,
        },
        {
          name: 'year',
          type: 'text',
        },
      ],
    },
    {
      name: 'accordionItems',
      type: 'array',
      label: 'Accordion Items',
      fields: [
        {
          name: 'title',
          type: 'text',
          localized: true,
          required: true,
        },
        {
          name: 'content',
          type: 'richText',
          localized: true,
        },
      ],
    },
  ],
}
