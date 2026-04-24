import type { Block } from 'payload'

export const HeartTeamCoachingBlock: Block = {
  slug: 'heart-team-coaching',
  labels: { singular: 'Heart Team Coaching', plural: 'Heart Team Coaching Sections' },
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
  ],
}
