import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export const revalidate = 120

const TRANSLATABLE_COLLECTIONS = ['pages', 'services'] as const

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const locales = (searchParams.get('locales') ?? 'en,zh-HK').split(',').filter(Boolean)

    const payload = await getPayload({ config })
    const results: Record<string, Record<string, { total: number; translated: number }>> = {}

    for (const collection of TRANSLATABLE_COLLECTIONS) {
      results[collection] = {}

      for (const locale of locales) {
        const res = await payload.find({
          collection: collection as any,
          locale: locale as any,
          limit: 0,
          depth: 0,
        })
        const total = res.totalDocs

        const translated = await payload.find({
          collection: collection as any,
          locale: locale as any,
          where: { title: { not_equals: '' } },
          limit: 0,
          depth: 0,
        })

        results[collection][locale] = { total, translated: translated.totalDocs }
      }
    }

    return NextResponse.json({ locales, results })
  } catch {
    return NextResponse.json({ locales: [], results: {} })
  }
}
