import { getPayload } from 'payload'
import config from '@payload-config'
import { draftMode, cookies } from 'next/headers'
import { RenderBlocks } from '@/components/Blocks/RenderBlocks'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

// Render all dynamic pages on-demand — no static pre-build needed.
// Next.js will serve these as SSR requests without requiring a rebuild.
export const dynamic = 'force-dynamic'
export const dynamicParams = true

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const cookieStore = await cookies()
  const locale = (cookieStore.get('NEXT_LOCALE')?.value ?? 'en') as 'en' | 'zh-HK'
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug }, _status: { equals: 'published' } },
    locale,
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
}

export default async function DynamicPage({ params }: Props) {
  const { slug } = await params
  const { isEnabled: isDraft } = await draftMode()
  const cookieStore = await cookies()
  const locale = (cookieStore.get('NEXT_LOCALE')?.value ?? 'en') as 'en' | 'zh-HK'

  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'pages',
    where: {
      slug: { equals: slug },
      ...(isDraft ? {} : { _status: { equals: 'published' } }),
    },
    locale,
    depth: 3,
    limit: 1,
  })

  const page = result.docs[0]
  if (!page) notFound()

  return <RenderBlocks blocks={(page.layout as any) ?? []} richTextContent={(page as any).content} />
}
