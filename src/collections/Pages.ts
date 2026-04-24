import type { CollectionConfig } from 'payload'
import { isAdmin } from '@/access/isAdmin'
import { isAdminOrEditor } from '@/access/isAdminOrEditor'
import { revalidatePage } from '@/hooks/revalidatePage'
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
import { ServiceDetailBlock } from '@/blocks/ServiceDetailBlock'
import { ContactFormBlock } from '@/blocks/ContactFormBlock'

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: { singular: 'Page', plural: 'Pages' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', '_status', 'updatedAt'],
    livePreview: {
      url: ({ data, locale }) => {
        const base = process.env.PAYLOAD_PUBLIC_SERVER_URL ?? 'http://localhost:3000'
        const slug = data?.slug === 'home' ? '' : (data?.slug ?? '')
        const localeParam = locale?.code ? `&locale=${locale.code}` : ''
        return `${base}/api/preview?slug=${slug}${localeParam}`
      },
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
      name: 'slug',
      type: 'select',
      required: true,
      unique: true,
      options: [
        { label: 'Home', value: 'home' },
        { label: 'About', value: 'about' },
        { label: 'Services', value: 'services' },
        { label: 'Contact', value: 'contact' },
        { label: 'Privacy Policy', value: 'privacy-policy' },
        { label: 'Terms & Conditions', value: 'terms' },
        { label: 'Maintenance', value: 'maintenance' },
      ],
      admin: { position: 'sidebar' },
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
        ServiceDetailBlock,
        ContactFormBlock,
      ],
    },
  ],
}
