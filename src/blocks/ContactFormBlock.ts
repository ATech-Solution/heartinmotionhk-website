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

export const ContactFormBlock: Block = {
  slug: 'contact-form',
  labels: { singular: 'Contact Form', plural: 'Contact Forms' },
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
      name: 'sideImage',
      type: 'upload',
      relationTo: 'media',
    },
    // {
    //   name: 'form',
    //   type: 'relationship',
    //   relationTo: 'forms',
    //   required: true,
    // },
    visibilityGroup,
  ],
}
