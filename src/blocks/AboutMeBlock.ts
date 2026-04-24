import type { Block } from 'payload'

export const AboutMeBlock: Block = {
  slug: 'about-me',
  labels: { singular: 'About Me', plural: 'About Me Sections' },
  fields: [
    {
      name: 'heading',
      type: 'text',
      localized: true,
      required: true,
    },
    {
      name: 'body',
      type: 'richText',
      localized: true,
    },
    {
      name: 'profileImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'certImages',
      type: 'array',
      label: 'Certificate Images',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'alt',
          type: 'text',
          localized: true,
        },
      ],
    },
  ],
}
