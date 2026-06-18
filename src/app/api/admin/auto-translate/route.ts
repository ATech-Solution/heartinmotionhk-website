import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
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

// Translate a single related-collection document (Testimonials, Services) and
// save zh-CN to published state. These collections have no draft mode so
// draft:true is not used. Returns the number of fields translated.
async function translateDoc(
  payload: Awaited<ReturnType<typeof getPayload>>,
  collection: string,
  docId: string | number,
  apiKey: string,
  model: string,
): Promise<number> {
  // Fetch English source (for translation) and zh-CN doc (as apply-base).
  // Applying translations to the zh-CN doc ensures the block IDs we pass back
  // to Payload match what is already in the DB, so Payload can UPDATE locale
  // rows in-place rather than DELETE + INSERT (which would wipe out en locale rows).
  const [enDoc, zhDoc] = await Promise.all([
    payload.findByID({
      collection: collection as any,
      id: docId as any,
      locale: 'en' as any,
      depth: 0,
      overrideAccess: true,
    }),
    payload.findByID({
      collection: collection as any,
      id: docId as any,
      locale: 'zh-CN' as any,
      depth: 0,
      overrideAccess: true,
    }),
  ])

  const { translated, count } = await translateWithClaude(
    enDoc as Record<string, unknown>,
    apiKey,
    model,
    zhDoc as Record<string, unknown>,
  )

  for (const key of STRIP_KEYS) delete (translated as Record<string, unknown>)[key]

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
    // ServiceDetailBlock → relationTo: 'services' (used on the Services page)
    if (block.blockType === 'service-detail' && Array.isArray(block.services)) {
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

      // Bust cache for all locales so the public frontend picks up the change.
      revalidatePath('/zh-CN', 'layout')
      revalidatePath('/en', 'layout')
      revalidatePath('/', 'layout')

      return NextResponse.json({ success: true, fieldsTranslated: count })
    }

    // Collection document — translate the page itself.
    // Fetch both en (translation source) and zh-CN (apply-base) in parallel.
    // Applying translations to the zh-CN doc ensures block IDs match the DB so
    // Payload can UPDATE locale rows in-place rather than DELETE + INSERT (which
    // would silently clear en locale rows for nested array items like values[]).
    const [doc, zhDoc] = await Promise.all([
      payload.findByID({
        collection: collection as any,
        id: id!,
        locale: 'en' as any,
        depth: 0,
        overrideAccess: true,
      }),
      payload.findByID({
        collection: collection as any,
        id: id!,
        locale: 'zh-CN' as any,
        depth: 0,
        overrideAccess: true,
      }),
    ])

    const { translated, count, fieldMap } = await translateWithClaude(
      doc as Record<string, unknown>,
      apiKey,
      model,
      zhDoc as Record<string, unknown>,
    )
    console.log(`[auto-translate] Extracted ${count} strings from ${collection}/${id}`)
    // Log first 5 extracted fields so we can verify headline was picked up
    const sampleEntries = Object.entries(fieldMap).slice(0, 5)
    console.log('[auto-translate] Sample extracted:', JSON.stringify(Object.fromEntries(sampleEntries)))

    for (const key of STRIP_KEYS) delete (translated as Record<string, unknown>)[key]

    // Log what Claude actually returned (first 10 translated values) so we can
    // confirm translation is working before any save attempt.
    const translationSample = Object.entries(fieldMap)
      .slice(0, 10)
      .map(([k, orig]) => {
        const translated_val = (translated as any)[k.split('.')[0]] !== undefined
          ? `(check translated doc)` : orig
        return `  ${k}: "${orig}"`
      })
    console.log('[auto-translate] Original strings (first 10):')
    translationSample.forEach(l => console.log(l))

    // Log the translated layout block fields to confirm Claude translated them
    const translatedLayout = (translated as any).layout
    if (Array.isArray(translatedLayout)) {
      translatedLayout.slice(0, 3).forEach((blk: any, i: number) => {
        const fields = ['headline', 'heading', 'subheadline', 'subheading', 'ctaLabel', 'sectionTitle']
        for (const f of fields) {
          if (blk[f] !== undefined) {
            console.log(`[auto-translate] Block[${i}] ${blk.blockType}.${f}: "${blk[f]}"`)
          }
        }
      })
    }

    // DUAL SAVE: write zh-CN to published first, then also create a draft version.
    //
    // Why dual save:
    //   • Saving to published (draft:false) ensures zh-CN lands in the base
    //     locale table (pages_locales / pages_blocks_*_locales). Payload uses
    //     this as the snapshot source when autosave creates subsequent drafts, so
    //     zh-CN carries forward automatically.
    //   • Saving to draft (draft:true) creates a new version that becomes the
    //     LATEST draft. The Payload admin always shows the latest draft, so this
    //     makes the zh-CN content immediately visible on redirect.
    //
    // Together they survive autosave: even if autosave fires in the 2 s window
    // between our draft save and the redirect, the new autosave version reads
    // zh-CN from the published base and includes it.

    // Step 1 — published save (anchors zh-CN in the base document)
    await payload.update({
      collection: collection as any,
      id: id!,
      locale: 'zh-CN' as any,
      data: translated as Record<string, unknown>,
      overrideAccess: true,
    })
    console.log('[auto-translate] Published zh-CN saved.')

    // Step 2 — draft save (makes admin show zh-CN immediately on redirect)
    await payload.update({
      collection: collection as any,
      id: id!,
      locale: 'zh-CN' as any,
      data: translated as Record<string, unknown>,
      overrideAccess: true,
      draft: true,
    })
    console.log('[auto-translate] Draft zh-CN saved.')


    // Verify: fetch published zh-CN to confirm the save is working
    try {
      const verifyDoc = await payload.findByID({
        collection: collection as any,
        id: id!,
        locale: 'zh-CN' as any,
        depth: 0,
        overrideAccess: true,
        draft: false,
      })
      const vLayout = (verifyDoc as any)?.layout
      let verifyMsg = `title: "${(verifyDoc as any)?.title}"`
      if (Array.isArray(vLayout)) {
        vLayout.slice(0, 4).forEach((blk: any, i: number) => {
          const top = blk?.headline ?? blk?.heading ?? blk?.sectionTitle ?? ''
          if (top) verifyMsg += ` | block[${i}](${blk.blockType}) text: "${top}"`
          // Log nested array items (e.g. ValuesBlock.values[].title)
          const nestedArrayKeys = ['values', 'accordionItems', 'services', 'certImages']
          for (const k of nestedArrayKeys) {
            if (Array.isArray(blk[k])) {
              blk[k].slice(0, 2).forEach((item: any, j: number) => {
                const itemText = item?.title ?? item?.name ?? item?.alt ?? ''
                verifyMsg += ` | block[${i}].${k}[${j}].title: "${itemText}"`
              })
            }
          }
        })
      }
      console.log(`[auto-translate] VERIFY published zh-CN — ${verifyMsg}`)
    } catch (verifyErr) {
      console.warn('[auto-translate] Verify fetch failed:', verifyErr)
    }

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

    // Bust Next.js page cache so the public frontend immediately shows zh-CN.
    // Use 'layout' type to invalidate every page under each locale prefix
    // (home, /about, /services, /contact, etc.), not just the root path.
    revalidatePath('/zh-CN', 'layout')
    revalidatePath('/en', 'layout')
    revalidatePath('/', 'layout')

    return NextResponse.json({ success: true, fieldsTranslated: count + relatedCount })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Translation failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
