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
      name: 'body',
      type: 'richText',
      localized: true,
      admin: { description: 'Optional introductory paragraph shown below the heading.' },
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
    // {
    //   name: 'coreValues',
    //   type: 'array',
    //   label: 'Core Values',
    //   fields: [
    //     {
    //       name: 'value',
    //       type: 'text',
    //       localized: true,
    //       required: true,
    //     },
    //   ],
    // },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    visibilityGroup,
  ],
}
