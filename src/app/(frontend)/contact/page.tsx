import { getPayload } from 'payload'
import config from '@payload-config'
import { draftMode, cookies } from 'next/headers'
import { RenderBlocks } from '@/components/Blocks/RenderBlocks'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies()
  const locale = (cookieStore.get('NEXT_LOCALE')?.value ?? 'en') as 'en' | 'zh-HK'
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'contact' }, _status: { equals: 'published' } },
    locale, depth: 0, limit: 1,
  })
  const doc = result.docs[0]
  return {
    title: (doc as any)?.meta?.title ?? 'Contact Us',
    description: (doc as any)?.meta?.description ?? '',
  }
}

export default async function ContactPage() {
  const { isEnabled: isDraft } = await draftMode()
  const cookieStore = await cookies()
  const locale = (cookieStore.get('NEXT_LOCALE')?.value ?? 'en') as 'en' | 'zh-HK'

  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'contact' }, ...(isDraft ? {} : { _status: { equals: 'published' } }) },
    locale, depth: 3, limit: 1,
  })

  const page = result.docs[0]
  if (!page) notFound()

  return <RenderBlocks blocks={(page.layout as any) ?? []} />
}
