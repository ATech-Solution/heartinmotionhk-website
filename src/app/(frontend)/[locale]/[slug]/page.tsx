import { getPayload } from 'payload'
import config from '@payload-config'
import { draftMode } from 'next/headers'
import { RenderBlocks } from '@/components/Blocks/RenderBlocks'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'
export const dynamicParams = true

type Props = { params: Promise<{ locale: string; slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'pages',
      where: { slug: { equals: slug }, _status: { equals: 'published' } },
      locale: locale as any,
      depth: 0,
      limit: 1,
    })
    const doc = result.docs[0]
    if (!doc) return {}
    return {
      title: (doc as any)?.meta?.title ?? (doc as any)?.title ?? slug,
      description: (doc as any)?.meta?.description ?? '',
      openGraph: { images: (doc as any)?.meta?.image?.url ? [(doc as any).meta.image.url] : [] },
    }
  } catch {
    return {}
  }
}

export default async function DynamicPage({ params }: Props) {
  const { locale, slug } = await params
  const { isEnabled: isDraft } = await draftMode()

  let page: any = null
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'pages',
      where: {
        slug: { equals: slug },
        ...(isDraft ? {} : { _status: { equals: 'published' } }),
      },
      locale: locale as any,
      depth: 3,
      limit: 1,
    })
    page = result.docs[0] ?? null
  } catch (err) {
    console.error('[DynamicPage] Failed to fetch page data — DB migration may be pending:', err)
  }

  if (!page) notFound()
  return <RenderBlocks blocks={(page.layout as any) ?? []} richTextContent={(page as any).content} />
}
