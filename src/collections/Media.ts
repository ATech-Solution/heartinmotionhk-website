import type { CollectionConfig } from 'payload'
import { isAdminOrEditor } from '@/access/isAdminOrEditor'
import { isPublic } from '@/access/isPublic'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Media', plural: 'Media' },
  upload: {
    staticDir: process.env.PAYLOAD_MEDIA_DIR ?? 'public/media',
    focalPoint: true,
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
      { name: 'card', width: 768, height: 512, position: 'centre' },
      { name: 'hero', width: 1440, height: 600, position: 'centre' },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*', 'image/gif'],
  },
  access: {
    create: isAdminOrEditor,
    read: isPublic,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      localized: true,
    },
    {
      name: 'caption',
      type: 'text',
      localized: true,
    },
  ],
}
