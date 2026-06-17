# Multilanguage Plugin Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Install `plugins/plugin-multilanguage.zip` to add Traditional Chinese (zh-HK) alongside English with URL-based routing (`/en/`, `/zh-HK/`), browser auto-detection, admin Language Settings global, and a Translation Manager.

**Architecture:** Plugin files are extracted and adapted (project uses `getPayload`/`@payload-config`, not `getPayloadClient`). Frontend routes move under a `[locale]` segment so each page has two URLs. Middleware detects locale and redirects `/` → `/en/` or `/zh-HK/`. The LanguageSwitcher navigates to the same path under the new locale.

**Tech Stack:** Payload CMS 3.x, Next.js 15 App Router, SQLite (`@payloadcms/db-sqlite`), Playwright (e2e tests).

---

## File Map

| Action | File |
|---|---|
| Create | `src/plugins/multilanguagePlugin.ts` |
| Create | `src/plugins/multilanguage/LanguageSettingsGlobal.ts` |
| Create | `src/plugins/multilanguage/TranslationManagerView.tsx` |
| Create | `src/plugins/multilanguage/seed.ts` |
| Create | `src/components/language/LanguageSwitcher.tsx` |
| Create | `src/app/api/plugins/multilanguage/settings/route.ts` |
| Create | `src/app/api/plugins/multilanguage/translation-status/route.ts` |
| Create | `src/app/(payload)/admin/plugins/multilanguage/layout.tsx` |
| Create | `src/app/(payload)/admin/plugins/multilanguage/page.tsx` |
| Create | `src/migrations/20260617_000000_language_settings.ts` |
| Modify | `src/payload.config.ts` |
| Modify | `src/middleware.ts` |
| Modify | `src/app/(frontend)/layout.tsx` |
| Create | `src/app/(frontend)/[locale]/layout.tsx` |
| Move→Create | `src/app/(frontend)/[locale]/page.tsx` (was `(frontend)/page.tsx`) |
| Move→Create | `src/app/(frontend)/[locale]/home/page.tsx` (was `(frontend)/home/page.tsx`) |
| Move→Create | `src/app/(frontend)/[locale]/[slug]/page.tsx` (was `(frontend)/[slug]/page.tsx`) |
| Move→Create | `src/app/(frontend)/[locale]/services/page.tsx` |
| Move→Create | `src/app/(frontend)/[locale]/privacy-policy/page.tsx` |
| Move→Create | `src/app/(frontend)/[locale]/terms/page.tsx` |
| Move→Create | `src/app/(frontend)/[locale]/reset-password/page.tsx` |
| Delete | `src/app/(frontend)/page.tsx` |
| Delete | `src/app/(frontend)/home/page.tsx` |
| Delete | `src/app/(frontend)/[slug]/page.tsx` |
| Delete | `src/app/(frontend)/services/page.tsx` |
| Delete | `src/app/(frontend)/privacy-policy/page.tsx` |
| Delete | `src/app/(frontend)/terms/page.tsx` |
| Delete | `src/app/(frontend)/reset-password/page.tsx` |
| Delete | `src/components/language/LocaleSwitcher.tsx` |
| Modify | `src/components/layout/Header.tsx` |
| Modify | `e2e/page-loads.spec.ts` |
| Create | `e2e/multilanguage.spec.ts` |

---

## Task 1: Install plugin core files

**Files:**
- Create: `src/plugins/multilanguagePlugin.ts`
- Create: `src/plugins/multilanguage/LanguageSettingsGlobal.ts`
- Create: `src/plugins/multilanguage/seed.ts`

- [ ] **Step 1.1: Create plugin directories**

```bash
mkdir -p src/plugins/multilanguage
```

- [ ] **Step 1.2: Create `src/plugins/multilanguagePlugin.ts`**

```ts
import type { Config, Plugin } from 'payload'
import { LanguageSettingsGlobal } from './multilanguage/LanguageSettingsGlobal'
import { seedMultilanguage } from './multilanguage/seed'

export const MULTILANGUAGE_PLUGIN_SLUG = 'multilanguage'

export const multilanguagePlugin = (): Plugin =>
  (incomingConfig: Config): Config => {
    return {
      ...incomingConfig,

      globals: [...(incomingConfig.globals ?? []), LanguageSettingsGlobal],

      onInit: async (payload) => {
        if (incomingConfig.onInit) await incomingConfig.onInit(payload)
        if (process.env.NEXT_PHASE === 'phase-production-build') return
        await seedMultilanguage(payload)
      },
    }
  }
```

- [ ] **Step 1.3: Create `src/plugins/multilanguage/LanguageSettingsGlobal.ts`**

```ts
import type { GlobalConfig } from 'payload'

export const LanguageSettingsGlobal: GlobalConfig = {
  slug: 'language-settings',
  label: 'Language Settings',
  access: {
    read: () => true,
    update: ({ req }) => req.user?.role === 'admin',
  },
  admin: {
    group: 'System',
    description: 'Configure multilanguage routing, switcher, and active locales.',
  },
  fields: [
    {
      name: 'activeLocales',
      type: 'array',
      label: 'Active Locales',
      admin: {
        description:
          'Enable or disable specific locales. Must match locales in payload.config.ts.',
      },
      defaultValue: [
        { code: 'en', label: 'English', enabled: true },
        { code: 'zh-HK', label: '繁體中文 (HK)', enabled: true },
      ],
      fields: [
        {
          name: 'code',
          type: 'text',
          label: 'Locale Code',
          required: true,
          admin: { description: 'e.g. en, zh-HK — must match a code in payload.config.ts' },
        },
        {
          name: 'label',
          type: 'text',
          label: 'Display Label',
          required: true,
        },
        {
          name: 'enabled',
          type: 'checkbox',
          label: 'Enabled',
          defaultValue: true,
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'defaultLocale',
          type: 'text',
          label: 'Default Locale',
          defaultValue: 'en',
          admin: { width: '50%' },
        },
        {
          name: 'autoDetect',
          type: 'checkbox',
          label: 'Auto-detect from Browser',
          defaultValue: true,
          admin: { width: '50%' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'showSwitcher',
          type: 'checkbox',
          label: 'Show Language Switcher',
          defaultValue: true,
          admin: { width: '50%' },
        },
        {
          name: 'switcherPosition',
          type: 'select',
          label: 'Switcher Position',
          defaultValue: 'header',
          options: [
            { label: 'Header', value: 'header' },
            { label: 'Footer', value: 'footer' },
          ],
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'hreflangEnabled',
      type: 'checkbox',
      label: 'Inject hreflang Tags',
      defaultValue: true,
      admin: {
        description: 'Add <link rel="alternate" hreflang="..."> tags for multilanguage SEO.',
      },
    },
  ],
}
```

- [ ] **Step 1.4: Create `src/plugins/multilanguage/seed.ts`**

```ts
import type { Payload } from 'payload'

export async function seedMultilanguage(payload: Payload): Promise<void> {
  // Seed plugin entry into Plugins collection if it exists
  try {
    const existing = await payload.find({
      collection: 'plugins',
      where: { slug: { equals: 'multilanguage' } },
      limit: 1,
    })

    if (existing.totalDocs === 0) {
      await payload.create({
        collection: 'plugins',
        data: {
          name: 'Multilanguage',
          slug: 'multilanguage',
          pluginType: 'built-in',
          category: 'utility',
          status: 'active',
          version: '1.0.0',
          author: 'ATech',
          description:
            'Subdirectory locale routing (/en/, /zh-HK/), language switcher, browser auto-detection, and Translation Manager admin view.',
          autoActivate: true,
          features: [
            {
              featureName: 'Locale Routing',
              featureDescription: 'Subdirectory routing /en/ /zh-HK/ with middleware detection',
              featureType: 'hook',
            },
            {
              featureName: 'Language Switcher',
              featureDescription: 'Data-driven locale toggle in header, persists via cookie',
              featureType: 'script',
            },
            {
              featureName: 'Language Settings',
              featureDescription:
                'Admin-editable global: active locales, auto-detect, hreflang, switcher position',
              featureType: 'collection',
            },
            {
              featureName: 'Translation Manager',
              featureDescription:
                'Admin view at /admin/plugins/multilanguage showing translation completeness per collection',
              featureType: 'hook',
            },
          ],
        },
      })
      payload.logger.info('✅ Multilanguage plugin seeded into Plugins collection.')
    }
  } catch {
    // Plugins collection may not exist — silently skip
  }

  // Seed default LanguageSettings if empty
  try {
    const settings = await payload.findGlobal({ slug: 'language-settings' as any })
    const locales = (settings as any)?.activeLocales
    if (Array.isArray(locales) && locales.length > 0) return

    await payload.updateGlobal({
      slug: 'language-settings' as any,
      data: {
        activeLocales: [
          { code: 'en', label: 'English', enabled: true },
          { code: 'zh-HK', label: '繁體中文 (HK)', enabled: true },
        ],
        defaultLocale: 'en',
        autoDetect: true,
        showSwitcher: true,
        switcherPosition: 'header',
        hreflangEnabled: true,
      } as any,
    })
    payload.logger.info('✅ Multilanguage plugin: seeded default language settings.')
  } catch (err) {
    payload.logger.warn(
      `⚠ Multilanguage language settings seed skipped: ${(err as Error).message}`,
    )
  }
}
```

- [ ] **Step 1.5: Commit**

```bash
git add src/plugins/multilanguagePlugin.ts src/plugins/multilanguage/
git commit -m "feat: add multilanguage plugin core files (plugin entry, LanguageSettings global, seed)"
```

---

## Task 2: Install plugin UI and API files

**Files:**
- Create: `src/components/language/LanguageSwitcher.tsx`
- Create: `src/plugins/multilanguage/TranslationManagerView.tsx`
- Create: `src/app/api/plugins/multilanguage/settings/route.ts`
- Create: `src/app/api/plugins/multilanguage/translation-status/route.ts`
- Create: `src/app/(payload)/admin/plugins/multilanguage/layout.tsx`
- Create: `src/app/(payload)/admin/plugins/multilanguage/page.tsx`

- [ ] **Step 2.1: Create directories**

```bash
mkdir -p src/app/api/plugins/multilanguage/settings \
         src/app/api/plugins/multilanguage/translation-status \
         src/app/\(payload\)/admin/plugins/multilanguage
```

- [ ] **Step 2.2: Create `src/components/language/LanguageSwitcher.tsx`**

This replaces `LocaleSwitcher.tsx`. It navigates to `/${newLocale}/${restOfPath}` (URL-based) instead of just refreshing. Font is updated to use `var(--font-inter)` to match the project.

```tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface Locale {
  code: string
  label: string
}

interface LanguageSwitcherProps {
  activeLocales: Locale[]
  currentLocale: string
}

function ChevronDown({ rotated }: { rotated: boolean }) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      style={{
        display: 'inline-block',
        transform: rotated ? 'rotate(180deg)' : 'none',
        transition: 'transform 0.2s cubic-bezier(0.4,0,0.2,1)',
        flexShrink: 0,
      }}
    >
      <path
        d="M2 3.5L5 6.5L8 3.5"
        stroke="#171717"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function DropdownOption({
  locale,
  isCurrent,
  onSelect,
}: {
  locale: Locale
  isCurrent: boolean
  onSelect: (code: string) => void
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <button
      role="option"
      aria-selected={isCurrent}
      onClick={() => onSelect(locale.code)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        width: '100%',
        padding: '8px 12px',
        borderRadius: 7,
        border: 'none',
        cursor: 'pointer',
        fontFamily: 'var(--font-inter, "Inter", sans-serif)',
        fontSize: 14,
        fontWeight: isCurrent ? 600 : 400,
        color: '#171717',
        background: hovered ? 'rgba(0,0,0,0.04)' : 'transparent',
        transition: 'background 0.12s',
        textAlign: 'left',
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.04em', minWidth: 22 }}>
        {locale.code.toUpperCase()}
      </span>
      <span style={{ opacity: 0.55, fontSize: 13 }}>{locale.label}</span>
      {isCurrent && (
        <svg style={{ marginLeft: 'auto', flexShrink: 0 }} width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M2.5 7l3 3 6-6" stroke="#171717" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  )
}

export function LanguageSwitcher({ activeLocales, currentLocale }: LanguageSwitcherProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function switchLocale(code: string) {
    if (code === currentLocale) { setOpen(false); return }
    const segments = pathname.split('/')
    segments[1] = code
    const newPath = segments.join('/') || `/${code}`
    document.cookie = `NEXT_LOCALE=${code}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`
    setOpen(false)
    router.push(newPath)
  }

  if (activeLocales.length < 2) return null

  const current = activeLocales.find((l) => l.code === currentLocale) ?? activeLocales[0]

  return (
    <div ref={ref} style={{ position: 'relative', flexShrink: 0 }}>
      <button
        onClick={() => setOpen(!open)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Language selector"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          padding: '5px 10px',
          borderRadius: 6,
          height: 32,
          fontSize: 13,
          fontWeight: 600,
          fontFamily: 'var(--font-inter, "Inter", sans-serif)',
          letterSpacing: '0.04em',
          background: '#ffffff',
          color: '#171717',
          border: '1px solid #171717',
          cursor: 'pointer',
          transition: 'background 0.15s',
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.04)' }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '#ffffff' }}
      >
        {current.code.toUpperCase()}
        <ChevronDown rotated={open} />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Select language"
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: '50%',
            transform: 'translateX(-50%)',
            minWidth: 160,
            background: '#ffffff',
            border: '1px solid #e5e5e5',
            borderRadius: 10,
            boxShadow: '0 8px 24px -4px rgba(0,0,0,0.12), 0 2px 8px -2px rgba(0,0,0,0.06)',
            padding: 6,
            zIndex: 200,
          }}
        >
          {activeLocales.map((locale) => (
            <DropdownOption
              key={locale.code}
              locale={locale}
              isCurrent={locale.code === currentLocale}
              onSelect={switchLocale}
            />
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2.3: Create `src/plugins/multilanguage/TranslationManagerView.tsx`**

`TRANSLATABLE_COLLECTIONS` is scoped to this project's collections. The fetch URL uses `zh-HK` instead of `id`.

```tsx
'use client'

import React, { useEffect, useState } from 'react'

type LocaleStatus = { total: number; translated: number }
type TranslationResults = Record<string, Record<string, LocaleStatus>>

interface StatusData {
  locales: string[]
  results: TranslationResults
}

const COLLECTION_LABELS: Record<string, string> = {
  pages: 'Pages',
  services: 'Services',
  testimonials: 'Testimonials',
}

function StatusBadge({ status }: { status: LocaleStatus }) {
  if (status.total === 0) return <span style={{ color: '#9ca3af', fontSize: 13 }}>—</span>

  const pct = Math.round((status.translated / status.total) * 100)
  const color = pct === 100 ? '#16a34a' : pct >= 50 ? '#d97706' : '#dc2626'
  const icon = pct === 100 ? '✅' : pct >= 50 ? '⚠️' : '❌'

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <span>{icon}</span>
      <span style={{ fontSize: 13, color }}>
        {status.translated}/{status.total} ({pct}%)
      </span>
    </span>
  )
}

export function TranslationManagerView() {
  const [data, setData] = useState<StatusData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/plugins/multilanguage/translation-status?locales=en,zh-HK')
      .then((r) => r.json())
      .then(setData)
      .catch(() => setError('Failed to load translation status'))
      .finally(() => setLoading(false))
  }, [])

  const containerStyle: React.CSSProperties = { padding: '32px 40px', maxWidth: 900, fontFamily: 'system-ui, sans-serif' }
  const headingStyle: React.CSSProperties = { fontSize: 22, fontWeight: 700, marginBottom: 8, color: '#111' }
  const tableStyle: React.CSSProperties = { width: '100%', borderCollapse: 'collapse', marginTop: 24 }
  const thStyle: React.CSSProperties = { textAlign: 'left', padding: '10px 16px', background: '#f9fafb', borderBottom: '1px solid #e5e7eb', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6b7280' }
  const tdStyle: React.CSSProperties = { padding: '12px 16px', borderBottom: '1px solid #f3f4f6', verticalAlign: 'middle' }

  if (loading) return <div style={containerStyle}><h1 style={headingStyle}>Translation Manager</h1><p style={{ color: '#6b7280', marginTop: 24 }}>Loading…</p></div>
  if (error || !data) return <div style={containerStyle}><h1 style={headingStyle}>Translation Manager</h1><p style={{ color: '#dc2626', marginTop: 24 }}>{error ?? 'No data'}</p></div>

  const locales = data.locales.length > 0 ? data.locales : ['en', 'zh-HK']

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>Translation Manager</h1>
      <p style={{ color: '#6b7280', marginBottom: 0, fontSize: 14 }}>Translation completeness per collection and locale.</p>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Collection</th>
            {locales.map((loc) => <th key={loc} style={{ ...thStyle, textAlign: 'center' }}>{loc.toUpperCase()}</th>)}
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(data.results).map(([collection, localeMap]) => (
            <tr key={collection}>
              <td style={{ ...tdStyle, fontWeight: 600 }}>{COLLECTION_LABELS[collection] ?? collection}</td>
              {locales.map((loc) => (
                <td key={loc} style={{ ...tdStyle, textAlign: 'center' }}>
                  <StatusBadge status={localeMap[loc] ?? { total: 0, translated: 0 }} />
                </td>
              ))}
              <td style={tdStyle}>
                <a href={`/admin/collections/${collection}`} style={{ fontSize: 13, color: '#2563eb', textDecoration: 'none', fontWeight: 500 }}>
                  Translate →
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: 32, display: 'flex', gap: 24, fontSize: 13, color: '#9ca3af' }}>
        <span>✅ 100% translated</span>
        <span>⚠️ Partial</span>
        <span>❌ Not translated</span>
      </div>
    </div>
  )
}
```

- [ ] **Step 2.4: Create `src/app/api/plugins/multilanguage/settings/route.ts`**

Adapted from plugin — uses `getPayload`/`@payload-config` (this project has no `lib/payload.ts`).

```ts
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export const revalidate = 60

export async function GET() {
  try {
    const payload = await getPayload({ config })

    const pluginsResult = await payload.find({
      collection: 'plugins',
      where: { slug: { equals: 'multilanguage' }, status: { equals: 'active' } },
      limit: 1,
    }).catch(() => ({ docs: [] }))

    const isActive = (pluginsResult as any).docs?.length > 0

    const settings = await payload.findGlobal({ slug: 'language-settings' as any })

    return NextResponse.json({
      isActive: true,
      autoDetect: (settings as any)?.autoDetect ?? true,
      defaultLocale: (settings as any)?.defaultLocale ?? 'en',
      activeLocales: ((settings as any)?.activeLocales ?? [])
        .filter((l: any) => l.enabled)
        .map((l: any) => ({ code: l.code, label: l.label })),
    })
  } catch {
    return NextResponse.json({ isActive: false, autoDetect: false, defaultLocale: 'en', activeLocales: [] })
  }
}
```

Note: `isActive` is forced `true` once the global exists — plugin activation is managed through Language Settings admin UI rather than the Plugins collection (which may not exist in this project).

- [ ] **Step 2.5: Create `src/app/api/plugins/multilanguage/translation-status/route.ts`**

Scoped to this project's collections: `pages` and `services`. Uses `getPayload`/`@payload-config`.

```ts
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
```

- [ ] **Step 2.6: Create `src/app/(payload)/admin/plugins/multilanguage/layout.tsx`**

Simplified — no `getFaviconUrl` dependency (doesn't exist in this project).

```tsx
import type { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = { title: 'Translation Manager — Heart in Motion HK Admin' }

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
```

- [ ] **Step 2.7: Create `src/app/(payload)/admin/plugins/multilanguage/page.tsx`**

```tsx
import React from 'react'
import { TranslationManagerView } from '@/plugins/multilanguage/TranslationManagerView'

export default function MultiLanguageAdminPage() {
  return <TranslationManagerView />
}
```

- [ ] **Step 2.8: Commit**

```bash
git add src/components/language/LanguageSwitcher.tsx \
        src/plugins/multilanguage/TranslationManagerView.tsx \
        src/app/api/plugins/multilanguage/ \
        src/app/\(payload\)/admin/plugins/multilanguage/
git commit -m "feat: add multilanguage plugin UI, API routes, and admin Translation Manager"
```

---

## Task 3: Database migration for language_settings tables

**Files:**
- Create: `src/migrations/20260617_000000_language_settings.ts`

- [ ] **Step 3.1: Create `src/migrations/20260617_000000_language_settings.ts`**

Only the `language_settings` tables are created here. The plugin zip's migration also modifies `navigation`/`settings` tables that don't exist in this project — those are intentionally excluded.

```ts
import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`PRAGMA foreign_keys=OFF;`)

  await db.run(sql`CREATE TABLE IF NOT EXISTS \`language_settings\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`default_locale\` text DEFAULT 'en',
    \`auto_detect\` integer DEFAULT true,
    \`show_switcher\` integer DEFAULT true,
    \`switcher_position\` text DEFAULT 'header',
    \`hreflang_enabled\` integer DEFAULT true,
    \`_status\` text DEFAULT 'published',
    \`updated_at\` text,
    \`created_at\` text
  );`)

  await db.run(sql`CREATE INDEX IF NOT EXISTS \`language_settings__status_idx\` ON \`language_settings\` (\`_status\`);`)

  await db.run(sql`CREATE TABLE IF NOT EXISTS \`language_settings_active_locales\` (
    \`_order\` integer NOT NULL,
    \`_parent_id\` integer NOT NULL,
    \`id\` text PRIMARY KEY NOT NULL,
    \`code\` text NOT NULL,
    \`label\` text NOT NULL,
    \`enabled\` integer DEFAULT true,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`language_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );`)

  await db.run(sql`CREATE INDEX IF NOT EXISTS \`language_settings_active_locales_order_idx\` ON \`language_settings_active_locales\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`language_settings_active_locales_parent_id_idx\` ON \`language_settings_active_locales\` (\`_parent_id\`);`)

  await db.run(sql`PRAGMA foreign_keys=ON;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`DROP TABLE IF EXISTS \`language_settings_active_locales\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`language_settings\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
}
```

- [ ] **Step 3.2: Register plugin in `src/payload.config.ts`**

Add import at top of the plugins import block:

```ts
import { multilanguagePlugin } from './plugins/multilanguagePlugin'
```

Add as last item in `plugins` array:

```ts
plugins: [
  seoPlugin({ ... }),
  formBuilderPlugin({ ... }),
  redirectsPlugin({ ... }),
  nestedDocsPlugin({ ... }),
  searchPlugin({ ... }),
  importExportPlugin({}),
  multilanguagePlugin(),   // ← add this line
],
```

- [ ] **Step 3.3: Run migration**

```bash
npm run migrate
```

Expected: output shows `20260617_000000_language_settings` applied successfully. If dev server is running, stop it first.

- [ ] **Step 3.4: Verify tables were created**

```bash
sqlite3 data/payload.db ".tables" | tr ' ' '\n' | grep language
```

Expected output includes:
```
language_settings
language_settings_active_locales
```

- [ ] **Step 3.5: Commit**

```bash
git add src/migrations/20260617_000000_language_settings.ts src/payload.config.ts
git commit -m "feat: add language_settings migration and register multilanguagePlugin in payload config"
```

---

## Task 4: Convert (frontend)/layout.tsx to passthrough + create [locale]/layout.tsx

**Files:**
- Modify: `src/app/(frontend)/layout.tsx`
- Create: `src/app/(frontend)/[locale]/layout.tsx`

- [ ] **Step 4.1: Write e2e test for locale layout (failing)**

Create `e2e/multilanguage.spec.ts`:

```ts
import { test, expect } from '@playwright/test'

test.describe('Locale routing', () => {
  test('/ redirects to /en/', async ({ page }) => {
    const response = await page.goto('/', { waitUntil: 'domcontentloaded' })
    expect(page.url()).toMatch(/\/en(\/|$)/)
  })

  test('/en/ renders home page content', async ({ page }) => {
    await page.goto('/en/', { waitUntil: 'domcontentloaded' })
    await expect(page.locator('body')).not.toContainText('Application error')
    const header = page.locator('header')
    await expect(header).toBeVisible()
  })

  test('/zh-HK/ renders page without error', async ({ page }) => {
    await page.goto('/zh-HK/', { waitUntil: 'domcontentloaded' })
    await expect(page.locator('body')).not.toContainText('Application error')
  })

  test('language switcher is visible', async ({ page }) => {
    await page.goto('/en/', { waitUntil: 'domcontentloaded' })
    const switcher = page.locator('[aria-label="Language selector"]')
    await expect(switcher).toBeVisible()
  })

  test('switching to zh-HK navigates to /zh-HK/', async ({ page }) => {
    await page.goto('/en/', { waitUntil: 'domcontentloaded' })
    const switcher = page.locator('[aria-label="Language selector"]')
    await switcher.click()
    const zhOption = page.locator('[role="option"]').filter({ hasText: 'ZH-HK' })
    await zhOption.click()
    await page.waitForURL(/\/zh-HK\//)
    expect(page.url()).toMatch(/\/zh-HK\//)
  })
})
```

- [ ] **Step 4.2: Run test to confirm it fails**

```bash
npx playwright test e2e/multilanguage.spec.ts --reporter=line 2>&1 | head -30
```

Expected: FAILED — routes don't exist yet.

- [ ] **Step 4.3: Rewrite `src/app/(frontend)/layout.tsx` as thin passthrough**

```tsx
export default function FrontendGroupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
```

- [ ] **Step 4.4: Create `src/app/(frontend)/[locale]/layout.tsx`**

This takes over everything from the old `(frontend)/layout.tsx`: fonts, maintenance check, header, footer. It reads `locale` from route params and also fetches Language Settings to get `activeLocales`/`showSwitcher` for the Header.

```tsx
import '../../globals.css'
import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { redirect } from 'next/navigation'
import { unstable_noStore as noStore } from 'next/cache'
import { Caveat, Inter } from 'next/font/google'
import { SiteHeader } from '@/components/layout/Header'
import { SiteFooter } from '@/components/layout/Footer'
import { cookies } from 'next/headers'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-caveat',
  display: 'swap',
})

const SUPPORTED_LOCALES = ['en', 'zh-HK'] as const
type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]

export const metadata: Metadata = {
  title: { default: 'Heart in Motion HK', template: '%s — Heart in Motion HK' },
  description: 'Step Forward with Your Heart',
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  noStore()
  const { locale: rawLocale } = await params
  const locale = (SUPPORTED_LOCALES.includes(rawLocale as SupportedLocale) ? rawLocale : 'en') as SupportedLocale

  const cookieStore = await cookies()
  const hasAdminToken = cookieStore.has('payload-token')

  const payload = await getPayload({ config })

  if (!hasAdminToken) {
    let maintenanceEnabled = false
    try {
      const maintenance = await payload.findGlobal({ slug: 'maintenance-settings', locale })
      maintenanceEnabled = Boolean((maintenance as any)?.enabled)
    } catch {
      // Fail-open
    }
    if (maintenanceEnabled) redirect('/maintenance')
  }

  const [header, footer, general, langSettings] = await Promise.all([
    payload.findGlobal({ slug: 'header', locale }),
    payload.findGlobal({ slug: 'footer', locale }),
    payload.findGlobal({ slug: 'general-settings', locale }),
    payload.findGlobal({ slug: 'language-settings' as any }).catch(() => null),
  ])

  const activeLocales: { code: string; label: string }[] =
    ((langSettings as any)?.activeLocales ?? [])
      .filter((l: any) => l.enabled)
      .map((l: any) => ({ code: l.code, label: l.label }))

  const showSwitcher = (langSettings as any)?.showSwitcher !== false
  const hreflangEnabled = (langSettings as any)?.hreflangEnabled !== false
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? ''

  return (
    <html lang={locale} className={`${inter.variable} ${caveat.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        {hreflangEnabled && activeLocales.map((l) => (
          <link key={l.code} rel="alternate" hreflang={l.code} href={`${siteUrl}/${l.code}/`} />
        ))}
        {hreflangEnabled && (
          <link rel="alternate" hreflang="x-default" href={`${siteUrl}/en/`} />
        )}
      </head>
      <body className="font-body bg-white text-black antialiased">
        <SiteHeader
          header={header}
          general={general}
          locale={locale}
          activeLocales={activeLocales}
          showSwitcher={showSwitcher}
        />
        <main>{children}</main>
        <SiteFooter footer={footer} general={general} />
      </body>
    </html>
  )
}
```

- [ ] **Step 4.5: Commit (partial — routes not moved yet, tests still fail)**

```bash
git add src/app/\(frontend\)/layout.tsx src/app/\(frontend\)/\[locale\]/ e2e/multilanguage.spec.ts
git commit -m "feat: add [locale] layout and convert frontend root layout to passthrough"
```

---

## Task 5: Move page files into [locale]/ folder

**Files:**
- Create: `src/app/(frontend)/[locale]/page.tsx`
- Create: `src/app/(frontend)/[locale]/home/page.tsx`
- Create: `src/app/(frontend)/[locale]/[slug]/page.tsx`
- Create: `src/app/(frontend)/[locale]/services/page.tsx`
- Create: `src/app/(frontend)/[locale]/privacy-policy/page.tsx`
- Create: `src/app/(frontend)/[locale]/terms/page.tsx`
- Create: `src/app/(frontend)/[locale]/reset-password/page.tsx`
- Delete: all old versions

- [ ] **Step 5.1: Create `src/app/(frontend)/[locale]/page.tsx`** (was `(frontend)/page.tsx`)

Locale comes from `params.locale`, not cookie. No `cookies()` import needed.

```tsx
import { getPayload } from 'payload'
import config from '@payload-config'
import { draftMode } from 'next/headers'
import { RenderBlocks } from '@/components/Blocks/RenderBlocks'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'home' }, _status: { equals: 'published' } },
    locale: locale as any,
    depth: 0,
    limit: 1,
  })
  const doc = result.docs[0]
  return {
    title: (doc as any)?.meta?.title ?? 'Home',
    description: (doc as any)?.meta?.description ?? 'Step Forward with Your Heart',
    openGraph: { images: (doc as any)?.meta?.image?.url ? [(doc as any).meta.image.url] : [] },
  }
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  const { isEnabled: isDraft } = await draftMode()

  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'pages',
    where: {
      slug: { equals: 'home' },
      ...(isDraft ? {} : { _status: { equals: 'published' } }),
    },
    locale: locale as any,
    depth: 3,
    limit: 1,
  })

  const page = result.docs[0]
  if (!page) notFound()

  return <RenderBlocks blocks={(page.layout as any) ?? []} richTextContent={(page as any).content} />
}
```

- [ ] **Step 5.2: Create `src/app/(frontend)/[locale]/home/page.tsx`** (redirect to locale root)

```tsx
import { redirect } from 'next/navigation'

type Props = { params: Promise<{ locale: string }> }

export default async function HomeRedirect({ params }: Props) {
  const { locale } = await params
  redirect(`/${locale}`)
}
```

- [ ] **Step 5.3: Create `src/app/(frontend)/[locale]/[slug]/page.tsx`**

```tsx
import { getPayload } from 'payload'
import config from '@payload-config'
import { draftMode } from 'next/headers'
import { RenderBlocks } from '@/components/Blocks/RenderBlocks'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'
export const dynamicParams = true

type Props = {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug }, _status: { equals: 'published' } },
    locale: locale as any,
    depth: 0,
    limit: 1,
  })
  const doc = result.docs[0]
  if (!doc) return {}
  return {
    title: (doc as any)?.meta?.title ?? (doc as any)?.title ?? slug,
    description: (doc as any)?.meta?.description ?? '',
    openGraph: { images: (doc as any)?.meta?.image?.url ? [(doc as any).meta.image.url] : [] },
  }
}

export default async function DynamicPage({ params }: Props) {
  const { locale, slug } = await params
  const { isEnabled: isDraft } = await draftMode()

  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'pages',
    where: {
      slug: { equals: slug },
      ...(isDraft ? {} : { _status: { equals: 'published' } }),
    },
    locale: locale as any,
    depth: 3,
    limit: 1,
  })

  const page = result.docs[0]
  if (!page) notFound()

  return <RenderBlocks blocks={(page.layout as any) ?? []} richTextContent={(page as any).content} />
}
```

- [ ] **Step 5.4: Create `src/app/(frontend)/[locale]/services/page.tsx`**

```tsx
import { getPayload } from 'payload'
import config from '@payload-config'
import { draftMode } from 'next/headers'
import { RenderBlocks } from '@/components/Blocks/RenderBlocks'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'services' }, _status: { equals: 'published' } },
    locale: locale as any, depth: 0, limit: 1,
  })
  const doc = result.docs[0]
  return {
    title: (doc as any)?.meta?.title ?? 'Services',
    description: (doc as any)?.meta?.description ?? '',
  }
}

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params
  const { isEnabled: isDraft } = await draftMode()
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'services' }, ...(isDraft ? {} : { _status: { equals: 'published' } }) },
    locale: locale as any, depth: 3, limit: 1,
  })
  const page = result.docs[0]
  if (!page) notFound()
  return <RenderBlocks blocks={(page.layout as any) ?? []} richTextContent={(page as any).content} />
}
```

- [ ] **Step 5.5: Create `src/app/(frontend)/[locale]/privacy-policy/page.tsx`**

```tsx
import { getPayload } from 'payload'
import config from '@payload-config'
import { RenderBlocks } from '@/components/Blocks/RenderBlocks'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

type Props = { params: Promise<{ locale: string }> }

export const metadata: Metadata = { title: 'Privacy Policy' }

export default async function PrivacyPolicyPage({ params }: Props) {
  const { locale } = await params
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'privacy-policy' }, _status: { equals: 'published' } },
    locale: locale as any, depth: 3, limit: 1,
  })
  const page = result.docs[0]
  if (!page) notFound()
  return <RenderBlocks blocks={(page.layout as any) ?? []} richTextContent={(page as any).content} />
}
```

- [ ] **Step 5.6: Create `src/app/(frontend)/[locale]/terms/page.tsx`**

```tsx
import { getPayload } from 'payload'
import config from '@payload-config'
import { RenderBlocks } from '@/components/Blocks/RenderBlocks'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

type Props = { params: Promise<{ locale: string }> }

export const metadata: Metadata = { title: 'Terms & Conditions' }

export default async function TermsPage({ params }: Props) {
  const { locale } = await params
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'terms' }, _status: { equals: 'published' } },
    locale: locale as any, depth: 3, limit: 1,
  })
  const page = result.docs[0]
  if (!page) notFound()
  return <RenderBlocks blocks={(page.layout as any) ?? []} richTextContent={(page as any).content} />
}
```

- [ ] **Step 5.7: Create `src/app/(frontend)/[locale]/reset-password/page.tsx`**

This is a client page — no locale data fetching needed, just move it.

```tsx
'use client'

import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

function ResetPasswordForm() {
  const params = useSearchParams()
  const router = useRouter()
  const token = params.get('token')

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!token) { setError('Invalid or missing reset token.'); return }
    if (password !== confirm) { setError('Passwords do not match.'); return }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/users/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.errors?.[0]?.message ?? 'Failed to reset password.')
      }
      setSuccess(true)
      setTimeout(() => router.push('/admin'), 2000)
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-beige flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <h1 className="font-display text-4xl text-brand-dark mb-2">Reset Password</h1>
        <p className="text-brand-dark/60 text-sm mb-8">Enter a new password for your account.</p>

        {success ? (
          <div className="bg-brand-teal/10 border border-brand-teal rounded-2xl p-6 text-center">
            <p className="text-brand-teal font-semibold">Password reset successfully!</p>
            <p className="text-sm text-brand-dark/60 mt-1">Redirecting to admin…</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-card p-8 space-y-5">
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1.5">New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full px-4 py-2.5 border border-brand-beige-dark rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/40"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1.5">Confirm Password</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-brand-beige-dark rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/40"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-brand-teal text-white rounded-full font-semibold text-sm hover:bg-brand-teal-dark transition-colors duration-200 disabled:opacity-50"
            >
              {loading ? 'Resetting…' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  )
}
```

- [ ] **Step 5.8: Delete old page files**

```bash
rm src/app/\(frontend\)/page.tsx \
   src/app/\(frontend\)/home/page.tsx \
   src/app/\(frontend\)/\[slug\]/page.tsx \
   src/app/\(frontend\)/services/page.tsx \
   src/app/\(frontend\)/privacy-policy/page.tsx \
   src/app/\(frontend\)/terms/page.tsx \
   src/app/\(frontend\)/reset-password/page.tsx
```

Also delete empty directories left behind:

```bash
rmdir src/app/\(frontend\)/home \
      src/app/\(frontend\)/\[slug\] \
      src/app/\(frontend\)/services \
      src/app/\(frontend\)/privacy-policy \
      src/app/\(frontend\)/terms \
      src/app/\(frontend\)/reset-password 2>/dev/null || true
```

- [ ] **Step 5.9: Commit**

```bash
git add src/app/\(frontend\)/\[locale\]/
git rm src/app/\(frontend\)/page.tsx \
       src/app/\(frontend\)/home/page.tsx \
       src/app/\(frontend\)/\[slug\]/page.tsx \
       src/app/\(frontend\)/services/page.tsx \
       src/app/\(frontend\)/privacy-policy/page.tsx \
       src/app/\(frontend\)/terms/page.tsx \
       src/app/\(frontend\)/reset-password/page.tsx
git commit -m "feat: move all frontend pages under [locale]/ route segment"
```

---

## Task 6: Update middleware for locale detection and routing

**Files:**
- Modify: `src/middleware.ts`

- [ ] **Step 6.1: Replace `src/middleware.ts`**

```ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const SUPPORTED_LOCALES = ['en', 'zh-HK'] as const
type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]

function isSupportedLocale(value: string): value is SupportedLocale {
  return SUPPORTED_LOCALES.includes(value as SupportedLocale)
}

interface LocaleConfig {
  isActive: boolean
  autoDetect: boolean
  defaultLocale: string
}

async function getLocaleConfig(origin: string): Promise<LocaleConfig> {
  try {
    const res = await fetch(`${origin}/api/plugins/multilanguage/settings`, {
      cache: 'no-store',
    })
    if (!res.ok) throw new Error('settings fetch failed')
    return await res.json()
  } catch {
    return { isActive: true, autoDetect: true, defaultLocale: 'en' }
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Pass through: admin, API, Next.js internals, static assets, maintenance
  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/maintenance') ||
    pathname.match(/\.([^/]+)$/)
  ) {
    return NextResponse.next()
  }

  // Already has a locale prefix → pass through
  const firstSegment = pathname.split('/').filter(Boolean)[0] ?? ''
  if (isSupportedLocale(firstSegment)) {
    return NextResponse.next()
  }

  // Detect locale
  const localeConfig = await getLocaleConfig(request.nextUrl.origin)

  let locale: SupportedLocale = (
    isSupportedLocale(localeConfig.defaultLocale) ? localeConfig.defaultLocale : 'en'
  ) as SupportedLocale

  // 1. Cookie takes precedence
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value
  if (cookieLocale && isSupportedLocale(cookieLocale)) {
    locale = cookieLocale
  } else if (localeConfig.autoDetect) {
    // 2. Accept-Language header
    const acceptLang = request.headers.get('accept-language') ?? ''
    const preferred = acceptLang
      .split(',')
      .map((l) => l.split(';')[0]?.trim())
      .find((lang) => {
        if (!lang) return false
        // Match exact (e.g. zh-HK) or prefix (e.g. zh → zh-HK)
        if (isSupportedLocale(lang)) return true
        const prefix = lang.slice(0, 2).toLowerCase()
        return prefix === 'zh'
      })

    if (preferred) {
      if (isSupportedLocale(preferred)) {
        locale = preferred
      } else if (preferred.startsWith('zh')) {
        locale = 'zh-HK'
      }
    }
  }

  const localePath = pathname === '/' ? '' : pathname
  const redirectUrl = new URL(`/${locale}${localePath}`, request.url)
  redirectUrl.search = request.nextUrl.search
  return NextResponse.redirect(redirectUrl, 307)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
```

- [ ] **Step 6.2: Start dev server and manually verify redirect**

```bash
npm run dev
```

In a browser (or with curl):

```bash
curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" http://localhost:3000/
```

Expected: `307 http://localhost:3000/en/`

```bash
curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" -H "Accept-Language: zh-HK,zh;q=0.9" http://localhost:3000/
```

Expected: `307 http://localhost:3000/zh-HK/`

- [ ] **Step 6.3: Commit**

```bash
git add src/middleware.ts
git commit -m "feat: add locale detection middleware — detects Accept-Language, redirects / to /en/ or /zh-HK/"
```

---

## Task 7: Update Header — add LanguageSwitcher + locale-aware nav links

**Files:**
- Modify: `src/components/layout/Header.tsx`
- Delete: `src/components/language/LocaleSwitcher.tsx`

The Header is a client component. Changes needed:
1. Import `LanguageSwitcher` instead of `LocaleSwitcher`
2. Add `activeLocales` and `showSwitcher` to props interface
3. Update `getPagePath` to include locale prefix
4. Replace 3× `LocaleSwitcher` instances with `LanguageSwitcher`
5. Update 3× logo `href="/"` to `href={\`/${locale}\`}`
6. Update 3× `getPagePath(...)` calls to pass `locale`

- [ ] **Step 7.1: Update import at top of `src/components/layout/Header.tsx`**

Replace:
```ts
import { LocaleSwitcher } from '@/components/language/LocaleSwitcher'
```

With:
```ts
import { LanguageSwitcher } from '@/components/language/LanguageSwitcher'
```

- [ ] **Step 7.2: Update the `HeaderProps` interface in `src/components/layout/Header.tsx`**

Replace:
```ts
interface HeaderProps {
  header?: {
    logo?: any
    navItems?: NavItem[] | null
    ctaButtons?: CtaButton[] | null
    mobileCta?: MobileCta | null
  } | null
  general?: any
  locale?: string
}
```

With:
```ts
interface HeaderProps {
  header?: {
    logo?: any
    navItems?: NavItem[] | null
    ctaButtons?: CtaButton[] | null
    mobileCta?: MobileCta | null
  } | null
  general?: any
  locale?: string
  activeLocales?: { code: string; label: string }[]
  showSwitcher?: boolean
}
```

- [ ] **Step 7.3: Update `getPagePath` in `src/components/layout/Header.tsx`**

Replace:
```ts
function getPagePath(slug?: string) {
  if (!slug || slug === 'home') return '/'
  return `/${slug}`
}
```

With:
```ts
function getPagePath(slug: string | undefined, locale: string) {
  if (!slug || slug === 'home') return `/${locale}`
  return `/${locale}/${slug}`
}
```

- [ ] **Step 7.4: Update `SiteHeader` function signature to destructure new props**

Replace:
```ts
export function SiteHeader({ header, general, locale }: HeaderProps) {
```

With:
```ts
export function SiteHeader({ header, general, locale, activeLocales = [], showSwitcher = true }: HeaderProps) {
```

- [ ] **Step 7.5: Update all 3 logo `href="/"` links to include locale**

There are 3 logo `<Link href="/">` occurrences (desktop, tablet, mobile sections). Replace each:

```tsx
<Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
```

With:

```tsx
<Link href={`/${locale ?? 'en'}`} className="flex items-center gap-2.5 flex-shrink-0">
```

Do this for all 3 occurrences (desktop logo uses `gap-2.5`, tablet uses `gap-2`, mobile also uses `gap-2.5` — same replacement, check line numbers 69, 165, 212 approximately).

- [ ] **Step 7.6: Update all 3 `getPagePath(...)` calls to include locale**

Each occurrence looks like:
```ts
: getPagePath(typeof item.page === 'object' ? item.page?.slug : undefined)
```

Replace with:
```ts
: getPagePath(typeof item.page === 'object' ? item.page?.slug : undefined, locale ?? 'en')
```

Do this for all 3 occurrences (desktop nav, tablet nav, mobile nav).

- [ ] **Step 7.7: Replace all 3 `<LocaleSwitcher>` instances with `<LanguageSwitcher>`**

Replace each occurrence of:
```tsx
<LocaleSwitcher currentLocale={locale ?? 'en'} />
```

With:
```tsx
{showSwitcher && (
  <LanguageSwitcher activeLocales={activeLocales} currentLocale={locale ?? 'en'} />
)}
```

- [ ] **Step 7.8: Delete old `LocaleSwitcher`**

```bash
rm src/components/language/LocaleSwitcher.tsx
```

- [ ] **Step 7.9: Verify the page loads in browser**

With dev server running, visit `http://localhost:3000/en/` — expect:
- Page loads without errors
- Language switcher button visible in header (shows "EN" with dropdown arrow)
- Clicking switcher → dropdown shows "EN" and "ZH-HK" options
- Clicking "ZH-HK" → navigates to `http://localhost:3000/zh-HK/`

- [ ] **Step 7.10: Commit**

```bash
git rm src/components/language/LocaleSwitcher.tsx
git add src/components/layout/Header.tsx
git commit -m "feat: replace LocaleSwitcher with URL-navigating LanguageSwitcher, update nav links to include locale prefix"
```

---

## Task 8: Update e2e tests for new URL structure

**Files:**
- Modify: `e2e/page-loads.spec.ts`
- Modify: `e2e/navigation.spec.ts`

- [ ] **Step 8.1: Update `e2e/page-loads.spec.ts` page paths**

Replace the `pages` array:
```ts
const pages = [
  { name: 'Home',          path: '/' },
  { name: 'About',         path: '/about' },
  { name: 'Services',      path: '/services' },
  { name: 'Contact',       path: '/contact' },
  { name: 'Privacy Policy', path: '/privacy-policy' },
  { name: 'Terms',         path: '/terms' },
  { name: 'Reset Password', path: '/reset-password' },
]
```

With:
```ts
const pages = [
  { name: 'Home',          path: '/en/' },
  { name: 'About',         path: '/en/about' },
  { name: 'Services',      path: '/en/services' },
  { name: 'Contact',       path: '/en/contact' },
  { name: 'Privacy Policy', path: '/en/privacy-policy' },
  { name: 'Terms',         path: '/en/terms' },
  { name: 'Reset Password', path: '/en/reset-password' },
  { name: 'Home (zh-HK)',  path: '/zh-HK/' },
  { name: 'About (zh-HK)', path: '/zh-HK/about' },
]
```

Also update the site name test at the bottom:
```ts
test('Home page has site name or logo', async ({ page }) => {
  await page.goto('/en/')
```

- [ ] **Step 8.2: Update `e2e/navigation.spec.ts` goto calls**

Replace `await page.goto('/')` with `await page.goto('/en/')` throughout the file (navigation tests assume English locale).

- [ ] **Step 8.3: Run full e2e suite**

```bash
npx playwright test --reporter=line 2>&1 | tail -20
```

Expected: all tests pass, including the new `multilanguage.spec.ts` tests.

- [ ] **Step 8.4: Commit**

```bash
git add e2e/page-loads.spec.ts e2e/navigation.spec.ts
git commit -m "test: update e2e tests for locale-prefixed URLs (/en/, /zh-HK/)"
```

---

## Task 9: Final verification

- [ ] **Step 9.1: Run e2e multilanguage tests specifically**

```bash
npx playwright test e2e/multilanguage.spec.ts --reporter=line
```

Expected: all 5 tests pass.

- [ ] **Step 9.2: Check admin panel — Language Settings global**

Visit `http://localhost:3000/admin` → log in → navigate to **System → Language Settings**.

Verify:
- Active Locales: English (enabled) + 繁體中文 (HK) (enabled)
- Default Locale: en
- Auto-detect: checked
- Show Switcher: checked
- Switcher Position: Header
- hreflang Tags: checked

- [ ] **Step 9.3: Check admin panel — Translation Manager**

Visit `http://localhost:3000/admin/plugins/multilanguage`.

Verify: table shows Pages and Services collections with EN/ZH-HK status columns. ✅/⚠️/❌ icons visible.

- [ ] **Step 9.4: Check hreflang tags in page source**

```bash
curl -s http://localhost:3000/en/ | grep 'hreflang'
```

Expected output contains:
```html
<link rel="alternate" hreflang="en" href=".../en/"/>
<link rel="alternate" hreflang="zh-HK" href=".../zh-HK/"/>
<link rel="alternate" hreflang="x-default" href=".../en/"/>
```

- [ ] **Step 9.5: Test locale persistence (cookie)**

```bash
# Set cookie and verify redirect honours it
curl -s -o /dev/null -w "%{redirect_url}\n" -b "NEXT_LOCALE=zh-HK" http://localhost:3000/
```

Expected: `http://localhost:3000/zh-HK/`

- [ ] **Step 9.6: Update PROGRESS.md**

Update `PROGRESS.md`: mark multilanguage plugin as complete.

- [ ] **Step 9.7: Final commit**

```bash
git add PROGRESS.md
git commit -m "chore: mark multilanguage plugin implementation complete"
```

---

## Self-Review Notes

- All spec requirements covered:
  - URL routing ✅ (Task 4–6)
  - Browser auto-detect ✅ (Task 6 middleware)
  - Language Settings global ✅ (Task 1)
  - Translation Manager ✅ (Task 2)
  - LanguageSwitcher ✅ (Task 2, 7)
  - DB migration (language_settings only) ✅ (Task 3)
  - All pages moved to [locale]/ ✅ (Task 5)
  - hreflang tags ✅ (Task 4)
  - No field changes needed ✅ (confirmed in spec)
- `getPayloadClient` → `getPayload({ config })` adapted in all API routes
- `getFaviconUrl` stripped from admin layout (doesn't exist in project)
- `?locales=en,id` → `?locales=en,zh-HK` in TranslationManagerView
- `TRANSLATABLE_COLLECTIONS` scoped to `['pages', 'services']` (not `posts`/`portfolio`)
- `getPagePath` signature updated consistently in all 3 call sites
- e2e tests updated to reflect new URL structure
