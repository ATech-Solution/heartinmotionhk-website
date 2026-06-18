import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { translateWithClaude } from '@/lib/translateWithClaude'

export const maxDuration = 300

const STRIP_KEYS = ['id', '_id', '_status', 'createdAt', 'updatedAt', '__v']

export async function GET(request: NextRequest) {
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers: request.headers })
  if (!user) return NextResponse.json({ enabled: false })
  const aiSettings = await payload.findGlobal({ slug: 'ai-settings' as any, overrideAccess: true })
  return NextResponse.json({ enabled: Boolean(aiSettings.enabled) })
}

export async function POST(request: NextRequest) {
  const payload = await getPayload({ config: configPromise })

  const { user } = await payload.auth({ headers: request.headers })
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { id, collection, globalSlug } = body as {
    id?: string
    collection?: string
    globalSlug?: string
  }

  const isGlobal = Boolean(globalSlug)
  if (!isGlobal && (!id || !collection)) {
    return NextResponse.json({ error: 'Missing id or collection' }, { status: 400 })
  }

  const aiSettings = await payload.findGlobal({ slug: 'ai-settings' as any, overrideAccess: true })
  if (!aiSettings.enabled) {
    return NextResponse.json({ error: 'AI translation is disabled' }, { status: 403 })
  }
  if (!aiSettings.anthropicApiKey) {
    return NextResponse.json(
      { error: 'No API key set. Go to Admin → Globals → AI Settings to add one.' },
      { status: 403 },
    )
  }

  const model = aiSettings.model ?? 'claude-haiku-4-5-20251001'

  try {
    if (isGlobal) {
      const doc = await payload.findGlobal({
        slug: globalSlug as any,
        locale: 'en' as any,
        depth: 0,
        overrideAccess: true,
      })

      const { translated, count } = await translateWithClaude(
        doc as Record<string, unknown>,
        aiSettings.anthropicApiKey,
        model,
      )

      for (const key of STRIP_KEYS) delete (translated as Record<string, unknown>)[key]

      await payload.updateGlobal({
        slug: globalSlug as any,
        locale: 'zh-CN' as any,
        data: translated as Record<string, unknown>,
        overrideAccess: true,
      })

      return NextResponse.json({ success: true, fieldsTranslated: count })
    }

    // Collection document
    const doc = await payload.findByID({
      collection: collection as any,
      id: id!,
      locale: 'en' as any,
      depth: 0,
      overrideAccess: true,
    })

    const { translated, count } = await translateWithClaude(
      doc as Record<string, unknown>,
      aiSettings.anthropicApiKey,
      model,
    )

    for (const key of STRIP_KEYS) delete (translated as Record<string, unknown>)[key]

    await payload.update({
      collection: collection as any,
      id: id!,
      locale: 'zh-CN' as any,
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
