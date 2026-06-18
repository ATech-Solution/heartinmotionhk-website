import { getPayload } from 'payload'
import config from '@payload-config'
import type { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL_PROD ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'pages',
      where: { _status: { equals: 'published' } },
      limit: 100,
    })

    return result.docs.map((page) => {
      const slug = (page as any).slug
      const path = !slug || slug === 'home' ? '' : `/${slug}`
      return {
        url: `${baseUrl}${path}`,
        lastModified: new Date(page.updatedAt),
        changeFrequency: 'monthly' as const,
        priority: slug === 'home' ? 1.0 : 0.8,
        alternates: {
          languages: {
            en: `${baseUrl}${path}`,
            'zh-CN': `${baseUrl}${path}?locale=zh-CN`,
          },
        },
      }
    })
  } catch {
    return [{ url: baseUrl, lastModified: new Date() }]
  }
}
