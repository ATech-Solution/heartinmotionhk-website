import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { translateWithClaude } from '@/lib/translateWithClaude'

export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })

    // Authenticate
    const { user } = await payload.auth({ headers: request.headers })
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, collection } = body as { id: string; collection: string }

    if (!id || !collection) {
      return NextResponse.json({ error: 'Missing id or collection' }, { status: 400 })
    }

    // Fetch AI settings
    const aiSettings = await payload.findGlobal({ slug: 'ai-settings' as any })
    const settings = aiSettings as any

    if (settings?.enabled === false) {
      return NextResponse.json(
        { error: 'AI translation is disabled. Enable it in Admin → Globals → AI Settings.' },
        { status: 403 },
      )
    }

    const apiKey: string | undefined = settings?.anthropicApiKey
    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            'No Anthropic API key configured. Go to Admin → Globals → AI Settings to add your key.',
        },
        { status: 403 },
      )
    }

    const model: string = settings?.model ?? 'claude-haiku-4-5-20251001'

    // Fetch English document
    const doc = await payload.findByID({
      collection: collection as any,
      id,
      locale: 'en' as any,
      depth: 3,
    })

    if (!doc) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    // Translate
    const { translated, count } = await translateWithClaude(
      doc as Record<string, unknown>,
      apiKey,
      model,
    )

    // Strip Payload-internal fields before saving
    const {
      id: _id,
      _status,
      createdAt,
      updatedAt,
      __v,
      ...data
    } = translated as any

    // Save as zh-HK draft
    await payload.update({
      collection: collection as any,
      id,
      locale: 'zh-HK' as any,
      data,
      draft: true,
    })

    return NextResponse.json({ success: true, fieldsTranslated: count })
  } catch (err: any) {
    console.error('[auto-translate]', err)
    return NextResponse.json(
      { error: err?.message ?? 'Translation failed' },
      { status: 500 },
    )
  }
}
