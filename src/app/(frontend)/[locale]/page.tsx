import { getPayload } from 'payload'
import config from '@payload-config'
import { draftMode } from 'next/headers'
import { RenderBlocks } from '@/components/Blocks/RenderBlocks'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'home' }, _status: { equals: 'published' } },
    locale: locale as any,
    depth: 0,
    limit: 1,
  })
  const doc = result.docs[0]
  return {
    title: (doc as any)?.meta?.title ?? 'Home',
    description: (doc as any)?.meta?.description ?? 'Step Forward with Your Heart',
    openGraph: { images: (doc as any)?.meta?.image?.url ? [(doc as any).meta.image.url] : [] },
  }
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  const { isEnabled: isDraft } = await draftMode()
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'pages',
    where: {
      slug: { equals: 'home' },
      ...(isDraft ? {} : { _status: { equals: 'published' } }),
    },
    locale: locale as any,
    depth: 3,
    limit: 1,
  })
  const page = result.docs[0]
  if (!page) notFound()
  return <RenderBlocks blocks={(page.layout as any) ?? []} richTextContent={(page as any).content} />
}
