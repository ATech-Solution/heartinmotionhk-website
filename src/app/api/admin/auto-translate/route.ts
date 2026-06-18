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

// Translate a single collection document and save zh-CN to published state.
// Returns the number of fields translated.
async function translateDoc(
  payload: Awaited<ReturnType<typeof getPayload>>,
  collection: string,
  docId: string | number,
  apiKey: string,
  model: string,
): Promise<number> {
  const doc = await payload.findByID({
    collection: collection as any,
    id: docId as any,
    locale: 'en' as any,
    depth: 0,
    overrideAccess: true,
  })

  const { translated, count } = await translateWithClaude(
    doc as Record<string, unknown>,
    apiKey,
    model,
  )

  for (const key of STRIP_KEYS) delete (translated as Record<string, unknown>)[key]

  // Save directly to the published document (no draft: true) so autosave
  // draft versions cannot overwrite this locale's content.
  await payload.update({
    collection: collection as any,
    id: docId as any,
    locale: 'zh-CN' as any,
    data: translated as Record<string, unknown>,
    overrideAccess: true,
  })

  return count
}

// Extract relationship IDs from page blocks for known collection fields.
function extractRelationshipIds(
  doc: Record<string, unknown>,
): { collection: string; ids: (string | number)[] }[] {
  const result: Record<string, Set<string | number>> = {}

  const blocks = Array.isArray(doc.layout) ? (doc.layout as any[]) : []
  for (const block of blocks) {
    // TestimonialsBlock → relationTo: 'testimonials'
    if (block.blockType === 'testimonials' && Array.isArray(block.testimonials)) {
      if (!result['testimonials']) result['testimonials'] = new Set()
      for (const t of block.testimonials) {
        const id = typeof t === 'object' && t !== null ? t.id : t
        if (id != null) result['testimonials'].add(id)
      }
    }
    // ServicesOverviewBlock → relationTo: 'services'
    if (block.blockType === 'services-overview' && Array.isArray(block.services)) {
      if (!result['services']) result['services'] = new Set()
      for (const s of block.services) {
        const id = typeof s === 'object' && s !== null ? s.id : s
        if (id != null) result['services'].add(id)
      }
    }
    // BookingSessionBlock services array is inline (not a relationship)
  }

  return Object.entries(result).map(([collection, ids]) => ({
    collection,
    ids: [...ids],
  }))
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
  const apiKey = aiSettings.anthropicApiKey

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
        apiKey,
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

    // Collection document — translate the page itself
    const doc = await payload.findByID({
      collection: collection as any,
      id: id!,
      locale: 'en' as any,
      depth: 0,
      overrideAccess: true,
    })

    const { translated, count } = await translateWithClaude(
      doc as Record<string, unknown>,
      apiKey,
      model,
    )
    for (const key of STRIP_KEYS) delete (translated as Record<string, unknown>)[key]

    await payload.update({
      collection: collection as any,
      id: id!,
      locale: 'zh-CN' as any,
      data: translated as Record<string, unknown>,
      overrideAccess: true,
    })

    // Also translate any related documents referenced in the page's blocks
    // (Testimonials, Services) so all visible content is translated.
    const related = extractRelationshipIds(doc as Record<string, unknown>)
    let relatedCount = 0
    for (const { collection: relCollection, ids } of related) {
      for (const relId of ids) {
        try {
          relatedCount += await translateDoc(payload, relCollection, relId, apiKey, model)
        } catch (err) {
          console.error(`[auto-translate] Failed to translate ${relCollection}/${relId}:`, err)
        }
      }
    }

    return NextResponse.json({ success: true, fieldsTranslated: count + relatedCount })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Translation failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
