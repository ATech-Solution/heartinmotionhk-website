import Anthropic from '@anthropic-ai/sdk'

const SKIP_KEYS = new Set([
  'id', '_id', 'blockType', 'blockName', 'slug', '_status', 'locale',
  'createdAt', 'updatedAt', '__v', 'mimeType', 'filename', 'filesize',
  'width', 'height', 'focalX', 'focalY', 'relationTo',
])

const SKIP_KEY_SUFFIXES = ['Url', 'url', 'href', 'email', 'phone', 'whatsapp', 'src', 'alt']

const SKIP_VALUE_PATTERNS = [
  /^https?:\/\//,
  /^mailto:/,
  /@[a-z0-9.-]+\.[a-z]{2,}/i,
  /^\+?[\d\s\-().]{7,}$/,
  /^#[0-9a-f]{3,8}$/i,
]

const BRAND_NAMES = ['Heart in Motion HK']

function shouldSkipKey(key: string): boolean {
  if (SKIP_KEYS.has(key)) return true
  return SKIP_KEY_SUFFIXES.some((s) => key.endsWith(s))
}

function shouldSkipValue(val: string): boolean {
  if (BRAND_NAMES.includes(val)) return true
  return SKIP_VALUE_PATTERNS.some((p) => p.test(val))
}

export function extractStrings(
  obj: unknown,
  prefix = '',
  map: Record<string, string> = {},
): Record<string, string> {
  if (obj === null || obj === undefined) return map
  if (typeof obj === 'string') {
    if (obj.trim() && !shouldSkipValue(obj)) {
      map[prefix] = obj
    }
    return map
  }
  if (Array.isArray(obj)) {
    obj.forEach((item, i) => extractStrings(item, prefix ? `${prefix}.${i}` : String(i), map))
    return map
  }
  if (typeof obj === 'object') {
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
      if (shouldSkipKey(k)) continue
      const path = prefix ? `${prefix}.${k}` : k
      extractStrings(v, path, map)
    }
  }
  return map
}

export function applyTranslations(
  obj: unknown,
  translations: Record<string, string>,
  prefix = '',
): unknown {
  if (obj === null || obj === undefined) return obj
  if (typeof obj === 'string') {
    return translations[prefix] !== undefined ? translations[prefix] : obj
  }
  if (Array.isArray(obj)) {
    return obj.map((item, i) =>
      applyTranslations(item, translations, prefix ? `${prefix}.${i}` : String(i)),
    )
  }
  if (typeof obj === 'object') {
    const result: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
      const path = prefix ? `${prefix}.${k}` : k
      result[k] = applyTranslations(v, translations, path)
    }
    return result
  }
  return obj
}

async function callClaude(
  client: Anthropic,
  model: string,
  fieldMap: Record<string, string>,
): Promise<Record<string, string>> {
  const response = await client.messages.create({
    model,
    max_tokens: 4096,
    temperature: 0,
    system: `You are a professional translator specialising in Traditional Chinese (zh-HK).
Translate the JSON values from English to Traditional Chinese (zh-HK).
Return valid JSON with identical keys and translated values only.
Do not translate: proper nouns, brand names, URLs, email addresses, or phone numbers.
Preserve all formatting characters (\\n, spaces, punctuation style).`,
    messages: [{ role: 'user', content: JSON.stringify(fieldMap) }],
  })

  const raw = response.content[0].type === 'text' ? response.content[0].text : ''
  // Strip markdown code fences if present
  const cleaned = raw.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/i, '').trim()
  return JSON.parse(cleaned)
}

export async function translateWithClaude(
  doc: Record<string, unknown>,
  apiKey: string,
  model: string,
): Promise<{ translated: Record<string, unknown>; count: number }> {
  const client = new Anthropic({ apiKey })
  const fieldMap = extractStrings(doc)
  const count = Object.keys(fieldMap).length

  if (count === 0) return { translated: doc, count: 0 }

  let translations: Record<string, string>
  try {
    translations = await callClaude(client, model, fieldMap)
  } catch {
    // Retry once
    translations = await callClaude(client, model, fieldMap)
  }

  const translated = applyTranslations(doc, translations) as Record<string, unknown>
  return { translated, count }
}
