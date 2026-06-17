# AI Auto-Translation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "Translate to 繁體中文" button to the Pages editor and a bulk translate panel above the Pages list — both use the Claude API to translate English content field-by-field and save a zh-HK draft.

**Architecture:** Field-map extraction walks the document recursively, collects all translatable strings into a flat `{ "dot.path": "value" }` map, sends the entire page to Claude in one API call, re-applies translations by path, saves as `locale: 'zh-HK'` draft. API key and model are stored in a new `AISettings` Payload global.

**Tech Stack:** Next.js 15 App Router, Payload CMS 3.x, `@anthropic-ai/sdk`, SQLite, TypeScript.

---

## File Map

| File | Action | Purpose |
|---|---|---|
| `src/globals/AISettings.ts` | Create | Payload global: API key, model, enabled flag |
| `src/lib/translateWithClaude.ts` | Create | Field extraction + Claude API call + re-apply |
| `src/app/api/admin/auto-translate/route.ts` | Create | POST endpoint — auth, fetch doc, translate, save |
| `src/components/admin/AutoTranslatePanel.tsx` | Create | Editor sidebar button (beforeTabs) |
| `src/components/admin/AutoTranslateBulkPanel.tsx` | Create | List view "Translate All" panel (beforeList) |
| `src/globals/index.ts` or `src/payload.config.ts` | Modify | Register AISettings global |
| `src/collections/Pages.ts` | Modify | Register AutoTranslatePanel + AutoTranslateBulkPanel |

---

## Task 1: Install Anthropic SDK

**Files:**
- Modify: `package.json` (via npm)

- [ ] **Step 1: Install the SDK**

```bash
npm install @anthropic-ai/sdk
```

Expected output: `added 1 package` (or similar). No errors.

- [ ] **Step 2: Verify the types are available**

```bash
node -e "const a = require('@anthropic-ai/sdk'); console.log('OK', typeof a.default)"
```

Expected: `OK function`

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: install @anthropic-ai/sdk for AI translation"
```

---

## Task 2: AISettings Global

**Files:**
- Create: `src/globals/AISettings.ts`
- Modify: `src/payload.config.ts`

- [ ] **Step 1: Create the global**

```ts
// src/globals/AISettings.ts
import type { GlobalConfig } from 'payload'
import { isAdmin } from '@/access/isAdmin'

export const AISettings: GlobalConfig = {
  slug: 'ai-settings',
  label: 'AI Settings',
  admin: { group: 'Settings' },
  access: {
    read: isAdmin,
    update: isAdmin,
  },
  fields: [
    {
      name: 'enabled',
      type: 'checkbox',
      label: 'Enable AI Translation',
      defaultValue: true,
      admin: {
        description: 'When disabled, the Translate button is hidden from all editors.',
      },
    },
    {
      name: 'anthropicApiKey',
      type: 'text',
      label: 'Anthropic API Key',
      admin: {
        description: 'Your sk-ant-... key from console.anthropic.com. Stored in the database.',
      },
    },
    {
      name: 'model',
      type: 'select',
      label: 'Claude Model',
      defaultValue: 'claude-haiku-4-5-20251001',
      options: [
        {
          label: 'Claude Haiku (fast, cost-effective — recommended)',
          value: 'claude-haiku-4-5-20251001',
        },
        {
          label: 'Claude Sonnet (higher quality)',
          value: 'claude-sonnet-4-6',
        },
      ],
    },
  ],
}
```

- [ ] **Step 2: Register in payload.config.ts**

In `src/payload.config.ts`, add the import and register in globals:

```ts
// Add import near other global imports:
import { AISettings } from '@/globals/AISettings'

// In buildConfig globals array, add AISettings:
globals: [GeneralSettings, MaintenanceSettings, Header, Footer, AISettings],
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | grep -v "^$"
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/globals/AISettings.ts src/payload.config.ts
git commit -m "feat: add AISettings global for Anthropic API key + model config"
```

---

## Task 3: Translation Helper

**Files:**
- Create: `src/lib/translateWithClaude.ts`

- [ ] **Step 1: Create the helper**

```ts
// src/lib/translateWithClaude.ts
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
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | grep -v "^$"
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/translateWithClaude.ts
git commit -m "feat: add translateWithClaude helper — field extraction, Claude API, re-apply"
```

---

## Task 4: Auto-Translate API Route

**Files:**
- Create: `src/app/api/admin/auto-translate/route.ts`

- [ ] **Step 1: Create the route**

```ts
// src/app/api/admin/auto-translate/route.ts
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
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | grep -v "^$"
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/admin/auto-translate/route.ts
git commit -m "feat: add /api/admin/auto-translate POST route"
```

---

## Task 5: AutoTranslatePanel (Editor Sidebar)

**Files:**
- Create: `src/components/admin/AutoTranslatePanel.tsx`
- Modify: `src/collections/Pages.ts`

- [ ] **Step 1: Create the panel component**

```tsx
// src/components/admin/AutoTranslatePanel.tsx
'use client'

import { useState } from 'react'
import { useDocumentInfo } from '@payloadcms/ui'

export default function AutoTranslatePanel() {
  const { id } = useDocumentInfo()
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleTranslate() {
    if (!id) return
    setStatus('loading')
    setMessage('')
    try {
      const res = await fetch('/api/admin/auto-translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, collection: 'pages' }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Translation failed')
      setStatus('success')
      setMessage(`✅ ${data.fieldsTranslated} fields translated. Switch to 繁中 tab to review.`)
      setTimeout(() => { setStatus('idle'); setMessage('') }, 8000)
    } catch (err: any) {
      setStatus('error')
      setMessage(err.message ?? 'Something went wrong')
    }
  }

  if (!id) return null

  return (
    <div
      style={{
        padding: '12px 16px',
        marginBottom: 16,
        background: '#f0f4ff',
        border: '1px solid #c7d5f0',
        borderRadius: 8,
        fontFamily: 'sans-serif',
      }}
    >
      <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 10, color: '#1a3a6e', margin: '0 0 10px 0' }}>
        🌐 AI Translation
      </p>
      <button
        onClick={handleTranslate}
        disabled={status === 'loading'}
        style={{
          padding: '8px 16px',
          background: status === 'loading' ? '#9aaecf' : '#2563eb',
          color: '#fff',
          border: 'none',
          borderRadius: 6,
          cursor: status === 'loading' ? 'not-allowed' : 'pointer',
          fontSize: 13,
          fontWeight: 500,
          width: '100%',
        }}
      >
        {status === 'loading' ? '⏳ Translating…' : 'Translate to 繁體中文'}
      </button>
      {message && (
        <p
          style={{
            marginTop: 10,
            marginBottom: 0,
            fontSize: 12,
            color: status === 'error' ? '#b91c1c' : '#15803d',
            lineHeight: 1.4,
          }}
        >
          {status === 'error' ? '❌ ' : ''}{message}
        </p>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Register in Pages.ts**

In `src/collections/Pages.ts`, update the `admin` block to add the component:

```ts
admin: {
  useAsTitle: 'title',
  defaultColumns: ['title', 'slug', '_status', 'updatedAt'],
  components: {
    edit: {
      beforeTabs: ['@/components/admin/AutoTranslatePanel'],
    },
  },
},
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | grep -v "^$"
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/admin/AutoTranslatePanel.tsx src/collections/Pages.ts
git commit -m "feat: add AutoTranslatePanel to Pages editor sidebar"
```

---

## Task 6: AutoTranslateBulkPanel (List View)

**Files:**
- Create: `src/components/admin/AutoTranslateBulkPanel.tsx`
- Modify: `src/collections/Pages.ts`

- [ ] **Step 1: Create the bulk panel component**

```tsx
// src/components/admin/AutoTranslateBulkPanel.tsx
'use client'

import { useState } from 'react'

type Page = { id: string; title?: string }

export default function AutoTranslateBulkPanel() {
  const [status, setStatus] = useState<'idle' | 'running' | 'done'>('idle')
  const [progress, setProgress] = useState({ current: 0, total: 0 })
  const [errors, setErrors] = useState<string[]>([])
  const [showPanel, setShowPanel] = useState(false)

  async function fetchAllPages(): Promise<Page[]> {
    const res = await fetch('/api/pages?limit=100&depth=0', { credentials: 'include' })
    const data = await res.json()
    return (data?.docs ?? []) as Page[]
  }

  async function handleTranslateAll() {
    setStatus('running')
    setErrors([])
    const pages = await fetchAllPages()
    setProgress({ current: 0, total: pages.length })

    const errs: string[] = []
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i]
      setProgress({ current: i + 1, total: pages.length })
      try {
        const res = await fetch('/api/admin/auto-translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: page.id, collection: 'pages' }),
        })
        const data = await res.json()
        if (!res.ok) errs.push(`"${page.title ?? page.id}": ${data.error}`)
      } catch (err: any) {
        errs.push(`"${page.title ?? page.id}": ${err.message}`)
      }
    }

    setErrors(errs)
    setStatus('done')
  }

  function handleReset() {
    setStatus('idle')
    setProgress({ current: 0, total: 0 })
    setErrors([])
    setShowPanel(false)
  }

  if (!showPanel) {
    return (
      <div style={{ padding: '8px 0', marginBottom: 8 }}>
        <button
          onClick={() => setShowPanel(true)}
          style={{
            padding: '6px 14px',
            background: '#7c3aed',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          🌐 Translate All Pages → 繁中
        </button>
      </div>
    )
  }

  return (
    <div
      style={{
        padding: '14px 16px',
        marginBottom: 16,
        background: '#faf5ff',
        border: '1px solid #d8b4fe',
        borderRadius: 8,
        fontFamily: 'sans-serif',
      }}
    >
      <p style={{ fontWeight: 600, fontSize: 13, margin: '0 0 8px 0', color: '#5b21b6' }}>
        🌐 Translate All Pages to 繁體中文
      </p>

      {status === 'idle' && (
        <>
          <p style={{ fontSize: 12, color: '#6b7280', margin: '0 0 12px 0' }}>
            This will translate ALL pages using Claude AI and save zh-HK drafts. Existing translations will be overwritten.
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={handleTranslateAll}
              style={{
                padding: '7px 16px',
                background: '#7c3aed',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              Start Translation
            </button>
            <button
              onClick={() => setShowPanel(false)}
              style={{
                padding: '7px 14px',
                background: '#e5e7eb',
                color: '#374151',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer',
                fontSize: 13,
              }}
            >
              Cancel
            </button>
          </div>
        </>
      )}

      {status === 'running' && (
        <p style={{ fontSize: 13, color: '#5b21b6', margin: 0 }}>
          ⏳ Translating {progress.current} / {progress.total} pages…
        </p>
      )}

      {status === 'done' && (
        <>
          <p style={{ fontSize: 13, color: '#15803d', margin: '0 0 6px 0' }}>
            ✅ {progress.total - errors.length} / {progress.total} pages translated.
          </p>
          {errors.length > 0 && (
            <ul style={{ fontSize: 12, color: '#b91c1c', margin: '0 0 10px 0', paddingLeft: 16 }}>
              {errors.map((e, i) => <li key={i}>{e}</li>)}
            </ul>
          )}
          <button
            onClick={handleReset}
            style={{
              padding: '6px 14px',
              background: '#e5e7eb',
              color: '#374151',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: 13,
            }}
          >
            Close
          </button>
        </>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Register in Pages.ts**

Update `admin.components` in `src/collections/Pages.ts` to add the bulk panel to the list view:

```ts
admin: {
  useAsTitle: 'title',
  defaultColumns: ['title', 'slug', '_status', 'updatedAt'],
  components: {
    edit: {
      beforeTabs: ['@/components/admin/AutoTranslatePanel'],
    },
    beforeList: ['@/components/admin/AutoTranslateBulkPanel'],
  },
},
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | grep -v "^$"
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/admin/AutoTranslateBulkPanel.tsx src/collections/Pages.ts
git commit -m "feat: add AutoTranslateBulkPanel to Pages list view"
```

---

## Task 7: Migration for ai_settings Table

**Files:**
- Modify: `src/migrations/index.ts` (Payload auto-generates the migration file)

- [ ] **Step 1: Generate the migration**

```bash
npm run payload migrate:create -- --name ai_settings
```

Expected: creates a new file `src/migrations/TIMESTAMP_ai_settings.ts` + JSON snapshot.

- [ ] **Step 2: Run the migration**

```bash
npm run migrate
```

Expected: `INFO: Migrated: TIMESTAMP_ai_settings` and `INFO: Done.`

- [ ] **Step 3: Commit**

```bash
git add src/migrations/
git commit -m "feat: add ai_settings migration"
```

---

## Task 8: End-to-End Verification

**No code changes — manual testing steps.**

- [ ] **Step 1: Start the dev server**

```bash
npm run dev
```

- [ ] **Step 2: Set API key in admin**

Go to `http://localhost:3000/admin` → Globals → AI Settings → paste a valid `sk-ant-...` key → Save.

- [ ] **Step 3: Test editor panel**

Open any page in the Pages collection editor. Verify:
- "🌐 AI Translation" panel is visible above the tabs
- Click "Translate to 繁體中文" → spinner appears
- After ~10-30s → success message appears
- Switch locale tab to zh-HK → verify Chinese content in text fields

- [ ] **Step 4: Test bulk panel**

Go to Pages list view. Verify:
- "🌐 Translate All Pages → 繁中" button is visible
- Click → confirmation panel expands
- Click "Start Translation" → progress counter increments
- After completion → success summary shows

- [ ] **Step 5: Test error states**

- Remove API key in AI Settings → click translate → error message: "No Anthropic API key configured"
- Disable AI translation in AI Settings → verify button is hidden (no API key set triggers the error; `enabled: false` is checked server-side)

- [ ] **Step 6: Commit final verification note**

```bash
git commit --allow-empty -m "chore: AI auto-translation feature verified end-to-end"
```
