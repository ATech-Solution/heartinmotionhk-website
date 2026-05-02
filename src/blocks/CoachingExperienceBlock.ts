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
    // {
    //   name: 'certifications',
    //   type: 'array',
    //   label: 'Certifications',
    //   fields: [
    //     {
    //       name: 'title',
    //       type: 'text',
    //       localized: true,
    //       required: true,
    //     },
    //     {
    //       name: 'institution',
    //       type: 'text',
    //       localized: true,
    //     },
    //     {
    //       name: 'year',
    //       type: 'text',
    //     },
    //   ],
    // },
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
    visibilityGroup,
  ],
}
