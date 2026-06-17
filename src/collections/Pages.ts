import type { CollectionConfig } from 'payload'
import { isAdmin } from '@/access/isAdmin'
import { isAdminOrEditor } from '@/access/isAdminOrEditor'
import { revalidatePage } from '@/hooks/revalidatePage'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { HeroBlock } from '@/blocks/HeroBlock'
import { RealChallengeBlock } from '@/blocks/RealChallengeBlock'
import { HeartTeamCoachingBlock } from '@/blocks/HeartTeamCoachingBlock'
import { ValuesBlock } from '@/blocks/ValuesBlock'
import { CTABlock } from '@/blocks/CTABlock'
import { ServicesOverviewBlock } from '@/blocks/ServicesOverviewBlock'
import { TestimonialsBlock } from '@/blocks/TestimonialsBlock'
import { AboutMeBlock } from '@/blocks/AboutMeBlock'
import { CoachingExperienceBlock } from '@/blocks/CoachingExperienceBlock'
import { AboutHeartInMotionBlock } from '@/blocks/AboutHeartInMotionBlock'
import { AboutShortcutBlock } from '@/blocks/AboutShortcutBlock'
import { ServiceDetailBlock } from '@/blocks/ServiceDetailBlock'
import { ContactFormBlock } from '@/blocks/ContactFormBlock'
import { BookingSessionBlock } from '@/blocks/BookingSessionBlock'

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: { singular: 'Page', plural: 'Pages' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', '_status', 'updatedAt'],
    components: {
      beforeList: ['@/components/admin/AutoTranslateBulkAction'],
    },
  },
  versions: {
    drafts: {
      autosave: { interval: 2000 },
    },
    maxPerDoc: 50,
  },
  access: {
    create: isAdminOrEditor,
    read: ({ req: { user } }) => {
      if (user) return true
      return { _status: { equals: 'published' } }
    },
    update: isAdminOrEditor,
    delete: isAdmin,
    readVersions: isAdminOrEditor,
  },
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (!data.slug && data.title) {
          data.slug = slugify(data.title)
        }
        return data
      },
    ],
    afterChange: [revalidatePage],
  },
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
      editor: lexicalEditor(),
      admin: {
        description: 'Shown on the page when no layout blocks are added',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Auto-generated from the title. Edit to override.',
      },
    },
    {
      name: 'aiTranslatePanel',
      type: 'ui',
      admin: {
        position: 'sidebar',
        components: {
          Field: '@/components/admin/AutoTranslatePanel',
        },
      },
    },
    {
      name: 'layout',
      type: 'blocks',
      blocks: [
        HeroBlock,
        RealChallengeBlock,
        HeartTeamCoachingBlock,
        ValuesBlock,
        CTABlock,
        ServicesOverviewBlock,
        TestimonialsBlock,
        AboutMeBlock,
        CoachingExperienceBlock,
        AboutHeartInMotionBlock,
        AboutShortcutBlock,
        ServiceDetailBlock,
        ContactFormBlock,
        BookingSessionBlock,
      ],
    },
  ],
}
