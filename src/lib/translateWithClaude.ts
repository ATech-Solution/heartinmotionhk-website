import Anthropic from '@anthropic-ai/sdk'

const SKIP_KEYS = new Set([
  'id', '_id', 'blockType', 'blockName', 'slug', '_status', 'locale',
  'createdAt', 'updatedAt', '__v', 'mimeType', 'filename', 'filesize',
  'width', 'height', 'focalX', 'focalY', 'relationTo',
  // Select / enum field names — values are codes, not user-facing text
  'linkType', 'platform', 'style', 'status', 'type',
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

// Detect Lexical richText root objects (shape: { root: { type: 'root', children: [...] } })
function isLexicalRoot(val: unknown): val is { root: Record<string, unknown> } {
  if (typeof val !== 'object' || val === null) return false
  const obj = val as Record<string, unknown>
  return (
    'root' in obj &&
    typeof obj.root === 'object' &&
    obj.root !== null &&
    (obj.root as Record<string, unknown>).type === 'root'
  )
}

// Extract ONLY text content from Lexical leaf text nodes, leaving structural keys untouched
function extractLexicalStrings(
  node: unknown,
  prefix: string,
  map: Record<string, string>,
): void {
  if (!node || typeof node !== 'object') return
  const obj = node as Record<string, unknown>

  if (obj.type === 'text' && typeof obj.text === 'string' && obj.text.trim()) {
    if (!shouldSkipValue(obj.text)) {
      map[`${prefix}.__text`] = obj.text
    }
  }

  if (Array.isArray(obj.children)) {
    obj.children.forEach((child, i) => {
      extractLexicalStrings(child, `${prefix}.children.${i}`, map)
    })
  }
}

// Re-apply translations to Lexical text leaf nodes only
function applyLexicalTranslations(
  node: unknown,
  prefix: string,
  translations: Record<string, string>,
): unknown {
  if (!node || typeof node !== 'object') return node
  const obj = { ...(node as Record<string, unknown>) }

  if (obj.type === 'text' && typeof obj.text === 'string') {
    const key = `${prefix}.__text`
    if (translations[key] !== undefined) {
      obj.text = translations[key]
    }
  }

  if (Array.isArray(obj.children)) {
    obj.children = (obj.children as unknown[]).map((child, i) =>
      applyLexicalTranslations(child, `${prefix}.children.${i}`, translations),
    )
  }

  return obj
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

      if (isLexicalRoot(v)) {
        // Lexical richText: only extract text from leaf nodes
        extractLexicalStrings((v as { root: Record<string, unknown> }).root, `${path}.root`, map)
      } else {
        extractStrings(v, path, map)
      }
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

      if (isLexicalRoot(v)) {
        // Lexical richText: apply translations only to leaf text nodes
        const lexVal = v as { root: Record<string, unknown> }
        result[k] = {
          ...lexVal,
          root: applyLexicalTranslations(lexVal.root, `${path}.root`, translations),
        }
      } else {
        result[k] = applyTranslations(v, translations, path)
      }
    }
    return result
  }
  return obj
}

// Max fields per Claude call — keeps response well within 4096 tokens
const CHUNK_SIZE = 30

function extractJson(raw: string): Record<string, string> {
  // Strip markdown code fences
  let text = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim()

  // If Claude added preamble/postamble, extract the first {...} block
  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')
  if (start !== -1 && end !== -1 && end > start) {
    text = text.slice(start, end + 1)
  }

  return JSON.parse(text)
}

async function callClaude(
  client: Anthropic,
  model: string,
  fieldMap: Record<string, string>,
): Promise<Record<string, string>> {
  const response = await client.messages.create({
    model,
    max_tokens: 8096,
    temperature: 0,
    system: `You are a professional translator specialising in Simplified Chinese (zh-CN).
Translate the JSON values from English to Simplified Chinese (zh-CN).
Return ONLY valid JSON — no markdown, no explanation, no code fences — with identical keys and translated values.
Do not translate: proper nouns, brand names, URLs, email addresses, or phone numbers.
Preserve all formatting characters (\\n, spaces, punctuation style).`,
    messages: [{ role: 'user', content: JSON.stringify(fieldMap) }],
  })

  const raw = response.content[0].type === 'text' ? response.content[0].text : ''
  return extractJson(raw)
}

async function callClaudeWithRetry(
  client: Anthropic,
  model: string,
  fieldMap: Record<string, string>,
): Promise<Record<string, string>> {
  try {
    return await callClaude(client, model, fieldMap)
  } catch (firstErr) {
    // Retry once on any error (JSON parse failure, rate limit, timeout)
    try {
      return await callClaude(client, model, fieldMap)
    } catch {
      throw firstErr
    }
  }
}

export async function translateWithClaude(
  doc: Record<string, unknown>,
  apiKey: string,
  model: string,
): Promise<{ translated: Record<string, unknown>; count: number }> {
  const client = new Anthropic({ apiKey })
  const fieldMap = extractStrings(doc)
  const keys = Object.keys(fieldMap)
  const count = keys.length

  if (count === 0) return { translated: doc, count: 0 }

  // Split into chunks to avoid hitting Claude's output token limit
  const translations: Record<string, string> = {}
  for (let i = 0; i < keys.length; i += CHUNK_SIZE) {
    const chunkKeys = keys.slice(i, i + CHUNK_SIZE)
    const chunk: Record<string, string> = {}
    for (const k of chunkKeys) chunk[k] = fieldMap[k]!
    const result = await callClaudeWithRetry(client, model, chunk)
    Object.assign(translations, result)
  }

  const translated = applyTranslations(doc, translations) as Record<string, unknown>
  return { translated, count }
}
