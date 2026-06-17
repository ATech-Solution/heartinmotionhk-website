import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { translateWithClaude } from '@/lib/translateWithClaude'

export const maxDuration = 60

export async function POST(request: NextRequest) {
  const payload = await getPayload({ config: configPromise })

  // Authenticate
  const { user } = await payload.auth({ headers: request.headers })
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { id, collection } = body

  if (!id || !collection) {
    return NextResponse.json({ error: 'Missing id or collection' }, { status: 400 })
  }

  // Check AI settings
  const aiSettings = await payload.findGlobal({ slug: 'ai-settings', overrideAccess: true })
  if (!aiSettings.enabled) {
    return NextResponse.json({ error: 'AI translation is disabled' }, { status: 403 })
  }
  if (!aiSettings.anthropicApiKey) {
    return NextResponse.json(
      { error: 'No API key set. Go to Admin → Globals → AI Settings to add one.' },
      { status: 403 },
    )
  }

  try {
    // Fetch English source document
    const doc = await payload.findByID({
      collection,
      id,
      locale: 'en',
      depth: 3,
      overrideAccess: true,
    })

    const { translated, count } = await translateWithClaude(
      doc as Record<string, unknown>,
      aiSettings.anthropicApiKey,
      aiSettings.model ?? 'claude-haiku-4-5-20251001',
    )

    // Strip internal Payload fields before saving
    const STRIP = ['id', '_id', '_status', 'createdAt', 'updatedAt', '__v']
    for (const key of STRIP) {
      delete (translated as Record<string, unknown>)[key]
    }

    await payload.update({
      collection,
      id,
      locale: 'zh-HK',
      data: translated as Record<string, unknown>,
      draft: true,
      overrideAccess: true,
    })

    return NextResponse.json({ success: true, fieldsTranslated: count })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Translation failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
