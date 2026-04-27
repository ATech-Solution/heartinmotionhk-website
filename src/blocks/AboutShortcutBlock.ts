import type { Block } from 'payload'

const visibilityGroup = {
  name: 'visibility',
  type: 'group' as const,
  label: 'Visibility',
  admin: { description: 'Control which viewports this block appears on.' },
  fields: [
    { name: 'showOnDesktop', type: 'checkbox' as const, defaultValue: false, label: 'Show on Desktop (≥1024px)' },
    { name: 'showOnTablet', type: 'checkbox' as const, defaultValue: true, label: 'Show on Tablet (768–1023px)' },
    { name: 'showOnMobile', type: 'checkbox' as const, defaultValue: true, label: 'Show on Mobile (<768px)' },
  ],
}

export const AboutShortcutBlock: Block = {
  slug: 'about-shortcut',
  labels: { singular: 'About Shortcut', plural: 'About Shortcuts' },
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: false,
      admin: { description: 'Decorative image shown alongside the shortcut text.' },
    },
    {
      name: 'heading',
      type: 'text',
      localized: true,
      required: true,
      defaultValue: 'About Heart In Motion',
    },
    {
      name: 'body',
      type: 'richText',
      localized: true,
      required: false,
    },
    {
      name: 'ctaLabel',
      type: 'text',
      localized: true,
      defaultValue: 'About us',
    },
    {
      name: 'ctaUrl',
      type: 'text',
      defaultValue: '/about',
    },
    visibilityGroup,
  ],
}
