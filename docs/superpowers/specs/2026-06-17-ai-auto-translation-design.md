# AI Auto-Translation — Design Spec

**Date:** 2026-06-17
**Project:** heartinmotionhk-website
**Feature:** AI-powered English → Traditional Chinese (zh-HK) translation in Payload admin

---

## Goal

Add a one-click "Translate to 繁體中文" button to the Pages editor sidebar and a bulk action in the Pages list view. Both use the Claude API to translate all English content field-by-field and save the result as a zh-HK draft — without the editor writing a single Chinese character.

---

## Approach

**Flat field-map extraction (Approach A):** Recursively walk the Payload document tree, extract all translatable string values into a flat `{ "dot.path": "value" }` map, send the entire map to Claude in one API call, receive back the same map with zh-HK values, re-apply by path, save as `locale: 'zh-HK'` draft.

---

## Architecture

### Files Created / Modified

| File | Action | Purpose |
|---|---|---|
| `src/globals/AISettings.ts` | Create | Payload global — API key, model, enabled flag |
| `src/components/admin/AutoTranslatePanel.tsx` | Create | Editor sidebar component — translate button + status |
| `src/components/admin/AutoTranslateBulkAction.tsx` | Create | List view bulk action — translate selected pages |
| `src/app/api/admin/auto-translate/route.ts` | Create | POST endpoint — orchestrates fetch → translate → save |
| `src/lib/translateWithClaude.ts` | Create | Core helper — field extraction, Claude call, re-apply |
| `src/payload.config.ts` | Modify | Register AISettings global, inject panel into Pages |
| `src/collections/Pages.ts` | Modify | Register AutoTranslatePanel + bulk action |
| `.env.example` | Modify | No change (key stored in DB via AISettings global) |

---

## Component Design

### AISettings Global (`src/globals/AISettings.ts`)

- **slug:** `ai-settings`
- **access:** read + update = admin only (`isAdmin`)
- **Fields:**
  - `anthropicApiKey` — text, required. Masked display. Stores `sk-ant-...` key.
  - `model` — select: `claude-haiku-4-5-20251001` (default, fast/cheap) | `claude-sonnet-4-6` (higher quality)
  - `enabled` — checkbox, default `true`. Disabling hides translate button from all editors.
- **Admin URL:** `/admin → Globals → AI Settings`

---

### Translation Helper (`src/lib/translateWithClaude.ts`)

Three-phase pipeline:

**Phase 1 — Extract**
Recursively walks the document object collecting all `string` leaf values into a flat map keyed by dot-path:
```
{
  "title": "Step Forward with Your Heart",
  "layout.0.heading": "The Real Challenge",
  "layout.0.subheading": "Most teams...",
  "meta.title": "Home — Heart in Motion HK"
}
```

**Skipped paths** (never translated):
- `slug`, `id`, `blockType`, `blockName`, `_status`, `locale`
- Values matching URL pattern (`/^https?:\/\//`)
- Values matching email pattern (`/@.+\..+/`)
- Values matching phone pattern (`/^\+?[\d\s\-()]+$/`)
- Keys ending in `Url`, `url`, `href`, `email`, `phone`, `whatsapp`
- The brand name `"Heart in Motion HK"` (preserved as-is)

**Phase 2 — Translate**
Single Claude API call with:
```
System: You are a professional translator specialising in Traditional Chinese (zh-HK).
Translate the JSON values from English to Traditional Chinese (zh-HK).
Return valid JSON with identical keys and translated values only.
Do not translate: proper nouns, brand names, URLs, email addresses, or phone numbers.
Preserve all formatting characters (\n, spaces, punctuation style).

User: <flat field map JSON>
```
- Model: from AISettings (haiku default)
- Max tokens: 4096
- Temperature: 0 (deterministic output)
- Timeout: 30 seconds

**Phase 3 — Re-apply**
Merges translated values back into a deep clone of the original document by dot-path. Strips payload-internal fields (`id`, `_status`, `createdAt`, `updatedAt`, `_id`, `__v`) before saving.

**Retry:** If Claude returns invalid JSON, retries once. If still invalid, throws with the raw response for debugging.

---

### Auto-Translate API Route (`src/app/api/admin/auto-translate/route.ts`)

**Endpoint:** `POST /api/admin/auto-translate`

**Request body:**
```json
{ "id": "doc-id-here", "collection": "pages" }
```

**Steps:**
1. Authenticate request — require valid Payload session cookie (admin or editor)
2. Fetch `AISettings` global — check `enabled`, get `anthropicApiKey` + `model`
3. Fetch English document: `payload.findByID({ collection, id, locale: 'en', depth: 3 })`
4. Call `translateWithClaude(doc, apiKey, model)`
5. Save translated doc: `payload.update({ collection, id, locale: 'zh-HK', data: translated, draft: true })`
6. Return `{ success: true, fieldsTranslated: N }`

**Error responses:**
- `400` — missing `id` or `collection`
- `401` — not authenticated
- `403` — `AISettings.enabled = false` or no API key set
- `500` — Claude API error or save failure (includes message)

---

### AutoTranslatePanel (`src/components/admin/AutoTranslatePanel.tsx`)

**Injected via:** `admin.components.edit.beforeTabs` on Pages collection

**Uses:** Payload's `useDocumentInfo()` hook to get current document `id`

**UI States:**

| State | Display |
|---|---|
| Idle | Button: "Translate to 繁體中文" + globe icon |
| Loading | Button disabled, spinner: "Translating…" |
| Success | ✅ "Translation saved as draft — switch to 繁中 tab to review" (clears after 8s) |
| Error | ❌ Error message (persists until dismissed or next attempt) |
| Hidden | When `AISettings.enabled = false` or user lacks update access |

Panel is rendered as a styled card above the document tabs, consistent with the existing `BackupRestoreView` admin styling.

---

### AutoTranslateBulkAction (`src/components/admin/AutoTranslateBulkAction.tsx`)

**Injected via:** `admin.components` bulk action slot on Pages collection

**Behaviour:**
- Appears when 1+ pages selected in list view
- Label: `"Translate → 繁中"`
- Translates pages sequentially (not parallel) to avoid Anthropic rate limits
- Progress display: `"Translating 2 / 5…"`
- Continues on individual failures, collects errors
- Summary on completion: `"5 pages translated successfully. 1 error: [page title]"`
- Always overwrites existing zh-HK content

---

## Error Handling Summary

| Scenario | Behaviour |
|---|---|
| No API key set | Clear message: "Set API key in Admin → Globals → AI Settings" |
| `enabled = false` | Button hidden; bulk action hidden |
| Claude returns invalid JSON | Retry once; if still invalid, show raw error |
| Network timeout (30s) | Show timeout error; document unchanged |
| Partial bulk failure | Continue to next page; report failures in summary |
| User not authenticated | 401 returned; panel shows auth error |

---

## Translation Quality Notes

- **Lexical rich text:** The `layout` array contains all blocks. Text within Lexical rich text nodes is at `layout.N.content.root.children.M.children.K.text` — the recursive extractor handles any depth.
- **Brand name preservation:** `"Heart in Motion HK"` is explicitly excluded from translation in the system prompt.
- **Fallback:** Payload's `localization.fallback: true` means untranslated fields still show English to site visitors — no broken pages from partial translation.
- **Draft-first:** Saved as draft, not published. Editor reviews before publishing.

---

## Testing Checklist

1. Open a Page in admin editor → "Translate to 繁體中文" button visible
2. Click → spinner appears → success message after ~10s
3. Switch to zh-HK locale tab → all text fields show Chinese content
4. Publish draft → visit `/zh-HK/[slug]` → Chinese content renders
5. Bulk action: select 3 pages → "Translate → 繁中" → progress counter → summary
6. Disable plugin in AI Settings → button disappears from editor
7. Remove API key → button shows "Set API key" error on click
8. Very large page → translates within 30s or shows timeout error gracefully
