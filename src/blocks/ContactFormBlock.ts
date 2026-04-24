import type { Block } from 'payload'

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
      name: 'form',
      type: 'relationship',
      relationTo: 'forms',
      required: true,
    },
  ],
}
