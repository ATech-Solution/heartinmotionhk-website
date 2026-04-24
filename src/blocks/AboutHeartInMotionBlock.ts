import type { Block } from 'payload'

export const AboutHeartInMotionBlock: Block = {
  slug: 'about-him',
  labels: { singular: 'About Heart in Motion', plural: 'About Heart in Motion Sections' },
  fields: [
    {
      name: 'heading',
      type: 'text',
      localized: true,
      required: true,
    },
    {
      name: 'missionTitle',
      type: 'text',
      localized: true,
      defaultValue: 'Mission',
    },
    {
      name: 'mission',
      type: 'richText',
      localized: true,
    },
    {
      name: 'visionTitle',
      type: 'text',
      localized: true,
      defaultValue: 'Vision',
    },
    {
      name: 'vision',
      type: 'richText',
      localized: true,
    },
    {
      name: 'coreValues',
      type: 'array',
      label: 'Core Values',
      fields: [
        {
          name: 'value',
          type: 'text',
          localized: true,
          required: true,
        },
      ],
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
