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
    {
      name: 'formLabels',
      type: 'group',
      label: 'Form Labels',
      admin: {
        description: 'Translatable labels for every field and button in the contact form.',
      },
      fields: [
        { name: 'fullName',       type: 'text', localized: true, defaultValue: 'Full Name' },
        { name: 'email',          type: 'text', localized: true, defaultValue: 'Email Address' },
        { name: 'phone',          type: 'text', localized: true, defaultValue: 'Phone Number' },
        { name: 'subject',        type: 'text', localized: true, defaultValue: 'Subject' },
        { name: 'message',        type: 'text', localized: true, defaultValue: 'Tell us how we can help' },
        { name: 'submit',         type: 'text', localized: true, defaultValue: 'Submit' },
        { name: 'sending',        type: 'text', localized: true, defaultValue: 'Sending…' },
        { name: 'successTitle',   type: 'text', localized: true, defaultValue: 'Thank you!' },
        { name: 'successMessage',      type: 'text', localized: true, defaultValue: "Your message has been sent. We'll be in touch soon." },
        { name: 'errorMessage',        type: 'text', localized: true, defaultValue: 'Something went wrong. Please try again.' },
        { name: 'validationRequired',  type: 'text', localized: true, defaultValue: 'This field is required.' },
        { name: 'validationEmail',     type: 'text', localized: true, defaultValue: 'Please enter a valid email address.' },
        { name: 'validationPhone',     type: 'text', localized: true, defaultValue: 'Please enter a valid phone number.' },
      ],
    },
    visibilityGroup,
  ],
}
