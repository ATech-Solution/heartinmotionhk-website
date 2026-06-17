# Multilanguage Plugin — Design Spec

**Date:** 2026-06-17
**Project:** heartinmotionhk-website
**Author:** Brainstormed with Claude Code
**Plugin source:** `plugins/plugin-multilanguage.zip` (v1.0.0 by ATech)

---

## Goal

Add full bilingual support (English + Traditional Chinese 繁體中文) to the Heart in Motion HK website using the provided `plugin-multilanguage.zip`. Locales are visible in the URL path (`/en/`, `/zh-HK/`), browser language auto-detect is enabled, and an admin Translation Manager shows translation completeness per collection.

---

## Approach

**Approach A — Full plugin install, URL-based routing, all user-visible fields localized.**

- Each locale gets its own URL prefix: `/en/about`, `/zh-HK/about`
- Middleware detects browser `Accept-Language`, reads `NEXT_LOCALE` cookie, redirects to correct locale
- Plugin admin features: Language Settings global + Translation Manager
- All user-visible text fields already have `localized: true` — no field changes needed

---

## Architecture

### Route Structure

```
BEFORE                                AFTER
src/app/(frontend)/                   src/app/(frontend)/
  layout.tsx  (full layout)             layout.tsx  ← thin passthrough only
  page.tsx    (root redirect)           [locale]/
  home/page.tsx                           layout.tsx  ← full layout, reads params.locale
  [slug]/page.tsx                         home/page.tsx
  services/page.tsx                       [slug]/page.tsx
  privacy-policy/page.tsx                 services/page.tsx
  terms/page.tsx                          privacy-policy/page.tsx
  reset-password/page.tsx                 terms/page.tsx
                                          reset-password/page.tsx
```

The root `(frontend)/page.tsx` is removed — the `/` route is now handled entirely by middleware redirect.

### Middleware (`src/middleware.ts`)

1. Skip: `/admin*`, `/api*`, `/_next*`, static files (`*.ico`, `*.png`, etc.), `/maintenance`
2. If first path segment is already a supported locale (`en`, `zh-HK`) → pass through
3. Fetch `GET /api/plugins/multilanguage/settings` with `cache: 'no-store'` using `request.nextUrl.origin` (never hardcode URL)
4. If plugin `isActive`:
   - Detect locale priority: cookie (`NEXT_LOCALE`) → `Accept-Language` header → `defaultLocale` (`en`)
   - Redirect 307 to `/${locale}${pathname}`
5. If plugin inactive: silently rewrite to `/en${pathname}` (no visible redirect)

### `[locale]/layout.tsx`

Replaces the current `(frontend)/layout.tsx` as the full layout owner:
- Reads `locale` from `params.locale` (type: `'en' | 'zh-HK'`)
- Passes `locale` to all Payload data fetching (header, footer, general settings, maintenance check)
- Sets `<html lang={locale === 'zh-HK' ? 'zh-HK' : 'en'}>` and font class names
- Injects hreflang `<link>` tags when `hreflangEnabled` is true in Language Settings:
  ```html
  <link rel="alternate" hreflang="en" href="https://heartinmotionhk.com/en/[path]" />
  <link rel="alternate" hreflang="zh-HK" href="https://heartinmotionhk.com/zh-HK/[path]" />
  <link rel="alternate" hreflang="x-default" href="https://heartinmotionhk.com/en/[path]" />
  ```

### `(frontend)/layout.tsx`

Becomes a thin passthrough:
```tsx
export default function FrontendGroupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
```

---

## Plugin Files to Install

Copy from `plugins/plugin-multilanguage.zip` to the project:

| Source (zip) | Destination |
|---|---|
| `src/plugins/multilanguagePlugin.ts` | `src/plugins/multilanguagePlugin.ts` |
| `src/plugins/multilanguage/LanguageSettingsGlobal.ts` | `src/plugins/multilanguage/LanguageSettingsGlobal.ts` |
| `src/plugins/multilanguage/TranslationManagerView.tsx` | `src/plugins/multilanguage/TranslationManagerView.tsx` |
| `src/plugins/multilanguage/seed.ts` | `src/plugins/multilanguage/seed.ts` |
| `src/components/LanguageSwitcher.tsx` | `src/components/language/LanguageSwitcher.tsx` |
| `src/app/api/plugins/multilanguage/settings/route.ts` | `src/app/api/plugins/multilanguage/settings/route.ts` |
| `src/app/api/plugins/multilanguage/translation-status/route.ts` | `src/app/api/plugins/multilanguage/translation-status/route.ts` |
| `src/app/(payload)/admin/plugins/multilanguage/layout.tsx` | `src/app/(payload)/admin/plugins/multilanguage/layout.tsx` |
| `src/app/(payload)/admin/plugins/multilanguage/page.tsx` | `src/app/(payload)/admin/plugins/multilanguage/page.tsx` |

**Do NOT copy** `src/migrations/20260521_060000_multilanguage_locale_fields.ts` — it targets `navigation`/`settings` tables from a different project. Use only the `language_settings` table portion (see Migration section below).

---

## `payload.config.ts` Changes

1. Import `multilanguagePlugin`:
   ```ts
   import { multilanguagePlugin } from './plugins/multilanguagePlugin'
   ```

2. Add to `plugins` array (last):
   ```ts
   plugins: [
     seoPlugin(...),
     formBuilderPlugin(...),
     redirectsPlugin(...),
     nestedDocsPlugin(...),
     searchPlugin(...),
     importExportPlugin({}),
     multilanguagePlugin(),  // ← added
   ]
   ```

The `localization` block already has `en` + `zh-HK` — **no changes needed there**.

---

## Database Migration

Create a new migration file `src/migrations/20260617_000000_language_settings.ts` containing only the `language_settings` table creation from the plugin's migration (the `navigation`/`settings` portions are skipped — they reference tables that don't exist in this project).

The migration creates:
- `language_settings` table — stores plugin config (isActive, defaultLocale, autoDetect, showSwitcher, etc.)
- `language_settings_active_locales` table — array of enabled locale entries

Run after migration file is created:
```bash
npm run migrate
```

---

## Seed Defaults

Update `src/plugins/multilanguage/seed.ts` (after copying from zip) to use `zh-HK` instead of `id` (Indonesian) as the second locale default:

```ts
activeLocales: [
  { code: 'en', label: 'English', enabled: true },
  { code: 'zh-HK', label: '繁體中文 (HK)', enabled: true },
]
```

---

## LanguageSwitcher

Replace `src/components/language/LocaleSwitcher.tsx` usage with the new `LanguageSwitcher` from the plugin.

The plugin's `LanguageSwitcher`:
- Uses `usePathname()` to get current path
- Navigates to `/${newLocale}/${restOfPath}` on locale switch (URL-based, not just cookie refresh)
- Sets `NEXT_LOCALE` cookie alongside navigation
- Accepts `activeLocales` array + `currentLocale` string as props

Update `src/components/layout/Header` to:
1. Fetch Language Settings global to get `activeLocales`, `showSwitcher`
2. Pass `activeLocales.filter(l => l.enabled)` and `currentLocale` (from layout params) to `LanguageSwitcher`
3. Only render if `showSwitcher && activeLocales.length > 1`

---

## Pages — Locale Param

All page files under `(frontend)/[locale]/` read locale from params instead of cookie:

```tsx
// Before (cookie-based):
const locale = (cookieStore.get('NEXT_LOCALE')?.value ?? 'en') as 'en' | 'zh-HK'

// After (param-based):
const { locale } = await params  // params: { locale: string, slug?: string }
```

All Payload queries remain unchanged structurally — they already pass `locale` to `payload.find()` / `payload.findGlobal()`.

---

## Fields Localization

**No field changes needed.** All user-visible text fields across all 14 blocks, all collections (Pages, Services, Testimonials, Media), and all globals (Header, Footer, GeneralSettings, MaintenanceSettings) already have `localized: true`.

Unlocalized `text` fields are all structural (URLs, WhatsApp links, email addresses, enum selects) — correctly non-localized.

---

## Error Handling

- Middleware `getLocaleConfig` fetch failure: catch and default to `en` (fail-open, never block the page)
- Missing ZH-HK translation: Payload `fallback: true` in localization config returns English content automatically
- Invalid locale in URL (e.g., `/fr/about`): middleware does not intercept (first segment `fr` is not in `SUPPORTED_LOCALES`), Next.js 404s — acceptable behaviour

---

## Testing Checklist

1. Visit `heartinmotionhk.com/` with browser set to Chinese → redirects to `/zh-HK/`
2. Visit `heartinmotionhk.com/` with browser set to English → redirects to `/en/`
3. Click language switcher: EN ↔ 繁中 → URL changes, content locale changes
4. Refresh after switching → stays on selected locale (cookie preserved)
5. Visit `/admin → System → Language Settings` → see both locales, toggle settings
6. Visit `/admin/plugins/multilanguage` → Translation Manager shows all collections
7. Disable plugin in Language Settings → `/` redirects to `/en/` silently (no toggle visible)
8. Enter ZH-HK content for one page in admin → verify it shows at `/zh-HK/[page]`
9. Leave a page untranslated → verify English fallback appears at `/zh-HK/[page]`
10. hreflang tags in `<head>` on all pages when enabled in Language Settings

---

## Implementation Step Order

1. Extract plugin files into `src/plugins/`, `src/components/language/`, `src/app/api/plugins/multilanguage/`, `src/app/(payload)/admin/plugins/multilanguage/`
2. Update `src/plugins/multilanguage/seed.ts` — swap `id` locale for `zh-HK`
3. Register `multilanguagePlugin()` in `payload.config.ts`
4. Create `src/migrations/20260617_000000_language_settings.ts` (language_settings tables only)
5. Run `npm run migrate`
6. Convert `src/app/(frontend)/layout.tsx` → thin passthrough
7. Create `src/app/(frontend)/[locale]/layout.tsx` — full layout with locale from params
8. Move all page files into `src/app/(frontend)/[locale]/`
9. Update each page to read `locale` from `params` not cookie
10. Update `src/middleware.ts` — locale detection + redirect
11. Replace `LocaleSwitcher` with plugin `LanguageSwitcher` in Header component
12. Run dev server, verify all 10 test cases pass

---

## Files Changed/Created

| File | Action |
|---|---|
| `src/plugins/multilanguagePlugin.ts` | Create (from zip) |
| `src/plugins/multilanguage/LanguageSettingsGlobal.ts` | Create (from zip) |
| `src/plugins/multilanguage/TranslationManagerView.tsx` | Create (from zip) |
| `src/plugins/multilanguage/seed.ts` | Create (from zip) + update zh-HK default |
| `src/components/language/LanguageSwitcher.tsx` | Create (from zip) |
| `src/components/language/LocaleSwitcher.tsx` | Delete (replaced) |
| `src/app/api/plugins/multilanguage/settings/route.ts` | Create (from zip) |
| `src/app/api/plugins/multilanguage/translation-status/route.ts` | Create (from zip) |
| `src/app/(payload)/admin/plugins/multilanguage/layout.tsx` | Create (from zip) |
| `src/app/(payload)/admin/plugins/multilanguage/page.tsx` | Create (from zip) |
| `src/migrations/20260617_000000_language_settings.ts` | Create (language_settings tables) |
| `src/payload.config.ts` | Update — add multilanguagePlugin() |
| `src/middleware.ts` | Update — locale detection + redirect |
| `src/app/(frontend)/layout.tsx` | Update → thin passthrough |
| `src/app/(frontend)/[locale]/layout.tsx` | Create — full layout, locale from params |
| `src/app/(frontend)/[locale]/home/page.tsx` | Move + update locale source |
| `src/app/(frontend)/[locale]/[slug]/page.tsx` | Move + update locale source |
| `src/app/(frontend)/[locale]/services/page.tsx` | Move + update locale source |
| `src/app/(frontend)/[locale]/privacy-policy/page.tsx` | Move + update locale source |
| `src/app/(frontend)/[locale]/terms/page.tsx` | Move + update locale source |
| `src/app/(frontend)/[locale]/reset-password/page.tsx` | Move + update locale source |
| `src/app/(frontend)/page.tsx` | Delete — middleware handles root redirect |
| `src/components/layout/Header.tsx` | Update — use LanguageSwitcher with locale prop |
