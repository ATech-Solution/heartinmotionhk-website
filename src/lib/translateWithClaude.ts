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
  if (SKIP_KEY_SUFFIXES.some((s) => key.endsWith(s) || key.toLowerCase().endsWith(s.toLowerCase()))) return true
  return false
}

function shouldSkipValue(value: string): boolean {
  if (value.trim().length === 0) return true
  if (SKIP_VALUE_PATTERNS.some((p) => p.test(value.trim()))) return true
  if (BRAND_NAMES.some((b) => value === b)) return true
  return false
}

export function extractStrings(
  obj: unknown,
  prefix = '',
  map: Record<string, string> = {},
): Record<string, string> {
  if (!obj || typeof obj !== 'object') return map

  if (Array.isArray(obj)) {
    obj.forEach((item, i) => extractStrings(item, prefix ? `${prefix}.${i}` : String(i), map))
    return map
  }

  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    if (shouldSkipKey(key)) continue
    const path = prefix ? `${prefix}.${key}` : key

    if (typeof value === 'string') {
      if (!shouldSkipValue(value)) {
        map[path] = value
      }
    } else if (value && typeof value === 'object') {
      extractStrings(value, path, map)
    }
  }

  return map
}

export function applyTranslations(
  obj: unknown,
  translations: Record<string, string>,
  prefix = '',
): unknown {
  if (!obj || typeof obj !== 'object') return obj

  if (Array.isArray(obj)) {
    return obj.map((item, i) =>
      applyTranslations(item, translations, prefix ? `${prefix}.${i}` : String(i)),
    )
  }

  const clone: Record<string, unknown> = { ...(obj as Record<string, unknown>) }
  for (const key of Object.keys(clone)) {
    const path = prefix ? `${prefix}.${key}` : key
    if (translations[path] !== undefined) {
      clone[key] = translations[path]
    } else if (clone[key] && typeof clone[key] === 'object') {
      clone[key] = applyTranslations(clone[key], translations, path)
    }
  }
  return clone
}

async function callClaude(
  client: Anthropic,
  model: string,
  fieldMap: Record<string, string>,
  strict = false,
): Promise<Record<string, string>> {
  const system = `You are a professional translator specialising in Traditional Chinese (zh-HK).
Translate the JSON values from English to Traditional Chinese (zh-HK).
Return ONLY a valid JSON object with identical keys and translated values — no markdown, no explanation.
Do not translate: "Heart in Motion HK", URLs, email addresses, phone numbers, or technical identifiers.
Preserve all whitespace and newlines exactly as in the source.${strict ? '\n\nCRITICAL: Output ONLY raw JSON. No code blocks. No extra text.' : ''}`

  const response = await client.messages.create({
    model,
    max_tokens: 4096,
    temperature: 0,
    system,
    messages: [{ role: 'user', content: JSON.stringify(fieldMap, null, 2) }],
  })

  const raw = (response.content[0] as Anthropic.TextBlock).text.trim()

  // Strip ```json ... ``` wrapper if present
  const jsonMatch = raw.match(/```(?:json)?\s*([\s\S]+?)\s*```/)
  const jsonStr = jsonMatch ? jsonMatch[1] : raw

  return JSON.parse(jsonStr)
}

export async function translateWithClaude(
  doc: Record<string, unknown>,
  apiKey: string,
  model: string,
): Promise<{ translated: Record<string, unknown>; count: number }> {
  const fieldMap = extractStrings(doc)
  const count = Object.keys(fieldMap).length

  if (count === 0) return { translated: doc, count: 0 }

  const client = new Anthropic({ apiKey })

  let translations: Record<string, string>
  try {
    translations = await callClaude(client, model, fieldMap, false)
  } catch {
    // Retry with stricter prompt
    try {
      translations = await callClaude(client, model, fieldMap, true)
    } catch (retryErr) {
      throw new Error(
        `Claude returned invalid JSON after retry: ${(retryErr as Error).message}`,
      )
    }
  }

  const translated = applyTranslations(doc, translations) as Record<string, unknown>
  return { translated, count }
}
