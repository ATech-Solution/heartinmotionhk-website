import { getPayload } from 'payload'
import config from '@payload-config'
import { cookies } from 'next/headers'
import { RenderBlocks } from '@/components/Blocks/RenderBlocks'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Privacy Policy' }

export default async function PrivacyPolicyPage() {
  const cookieStore = await cookies()
  const locale = (cookieStore.get('NEXT_LOCALE')?.value ?? 'en') as 'en' | 'zh-HK'

  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'privacy-policy' }, _status: { equals: 'published' } },
    locale, depth: 3, limit: 1,
  })

  const page = result.docs[0]
  if (!page) notFound()

  return <RenderBlocks blocks={(page.layout as any) ?? []} />
}
