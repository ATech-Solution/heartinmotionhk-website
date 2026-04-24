import type { Block } from 'payload'

export const HeroBlock: Block = {
  slug: 'hero',
  labels: { singular: 'Hero', plural: 'Heroes' },
  fields: [
    {
      name: 'headline',
      type: 'text',
      localized: true,
      required: true,
    },
    {
      name: 'subheadline',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'bannerImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'mobileBannerImage',
      type: 'upload',
      relationTo: 'media',
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
  ],
}
