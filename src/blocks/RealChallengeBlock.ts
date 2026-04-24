import type { Block } from 'payload'

export const RealChallengeBlock: Block = {
  slug: 'real-challenge',
  labels: { singular: 'The Real Challenge', plural: 'The Real Challenge Sections' },
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
      name: 'animatedGif',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
