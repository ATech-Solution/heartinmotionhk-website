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

export const BookingSessionBlock: Block = {
  slug: 'booking-session',
  labels: { singular: 'Booking Session', plural: 'Booking Sessions' },
  fields: [
    {
      name: 'sectionTitle',
      type: 'text',
      localized: true,
      required: true,
      defaultValue: 'Booking Session',
      admin: { description: 'Main heading for the section' },
    },
    {
      name: 'sectionSubtitle',
      type: 'textarea',
      localized: true,
      admin: { description: 'Introductory paragraph below the heading' },
    },
    {
      name: 'services',
      type: 'array',
      label: 'Services',
      minRows: 1,
      admin: { description: 'List of services shown as booking cards' },
      fields: [
        {
          name: 'name',
          type: 'text',
          localized: true,
          required: true,
          label: 'Service Name',
        },
        {
          name: 'description',
          type: 'textarea',
          localized: true,
          label: 'Description',
        },
        {
          name: 'whatsappUrl',
          type: 'text',
          label: 'WhatsApp URL',
          admin: { description: 'e.g. https://wa.me/85212345678' },
        },
        {
          name: 'email',
          type: 'text',
          label: 'Booking Email URL',
          admin: { description: 'Email address for booking this service. e.g. contact@heartinmotionhk.com' },
        },
      ],
    },
    visibilityGroup,
  ],
}
