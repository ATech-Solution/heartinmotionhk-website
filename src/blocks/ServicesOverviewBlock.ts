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

export const ServicesOverviewBlock: Block = {
  slug: 'services-overview',
  labels: { singular: 'Services Overview', plural: 'Services Overviews' },
  fields: [
    {
      name: 'heading',
      type: 'text',
      localized: true,
    },
    {
      name: 'subheading',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'services',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
    },
    {
      name: 'ctaLabel',
      type: 'text',
      localized: true,
      label: 'Button Label',
      admin: { description: 'Text for the "View full services" button.' },
    },
    {
      name: 'ctaUrl',
      type: 'text',
      label: 'Button URL',
      localized: true,
    },
    visibilityGroup,
  ],
}
