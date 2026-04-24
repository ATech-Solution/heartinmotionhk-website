import type { Block } from 'payload'

export const TestimonialsBlock: Block = {
  slug: 'testimonials',
  labels: { singular: 'Testimonials Slider', plural: 'Testimonials Sliders' },
  fields: [
    {
      name: 'heading',
      type: 'text',
      localized: true,
    },
    {
      name: 'testimonials',
      type: 'relationship',
      relationTo: 'testimonials',
      hasMany: true,
    },
  ],
}
