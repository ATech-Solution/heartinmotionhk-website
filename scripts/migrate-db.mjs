#!/usr/bin/env node
/**
 * Pure JavaScript migration runner — no TypeScript, no tsx, no esbuild.
 * Uses @libsql/client directly (same library Payload uses at runtime).
 * All migrations are idempotent: they check actual schema state before acting.
 */
import { createClient } from '@libsql/client'

const DB_URL = process.env.DATABASE_URL || 'file:./data/payload.db'
const client = createClient({ url: DB_URL })

async function exec(sql) {
  await client.execute(sql)
}

async function hasColumn(table, column) {
  const r = await client.execute(`PRAGMA table_info(\`${table}\`)`)
  return r.rows.some((row) => row.name === column)
}

async function hasTable(table) {
  const r = await client.execute(
    `SELECT name FROM sqlite_master WHERE type='table' AND name='${table}'`,
  )
  return r.rows.length > 0
}

async function main() {
  console.log('[migrate-db] Starting schema migrations...')

  // --- ai_settings table ---
  if (!(await hasTable('ai_settings'))) {
    console.log('[migrate-db] Creating ai_settings table...')
    await exec(`CREATE TABLE IF NOT EXISTS \`ai_settings\` (
      \`id\` integer PRIMARY KEY NOT NULL,
      \`enabled\` integer DEFAULT true,
      \`anthropic_api_key\` text,
      \`model\` text DEFAULT 'claude-haiku-4-5-20251001',
      \`updated_at\` text,
      \`created_at\` text
    )`)
  }

  // --- header: language_switcher columns ---
  if (await hasTable('header')) {
    if (!(await hasColumn('header', 'language_switcher_en_label'))) {
      console.log('[migrate-db] Adding header.language_switcher_en_label...')
      await exec(`ALTER TABLE \`header\` ADD \`language_switcher_en_label\` text DEFAULT 'EN'`)
    }
    if (!(await hasColumn('header', 'language_switcher_zh_label'))) {
      console.log('[migrate-db] Adding header.language_switcher_zh_label...')
      await exec(`ALTER TABLE \`header\` ADD \`language_switcher_zh_label\` text DEFAULT '简中'`)
    }
    if (!(await hasColumn('header', 'language_switcher_show'))) {
      console.log('[migrate-db] Adding header.language_switcher_show...')
      await exec(`ALTER TABLE \`header\` ADD \`language_switcher_show\` integer DEFAULT true`)
    }
  }

  // --- contact form: formLabels columns ---
  const formTables = [
    'pages_blocks_contact_form_locales',
    '_pages_v_blocks_contact_form_locales',
  ]
  const formCols = [
    ['form_labels_full_name',           "text DEFAULT 'Full Name'"],
    ['form_labels_email',               "text DEFAULT 'Email Address'"],
    ['form_labels_phone',               "text DEFAULT 'Phone Number'"],
    ['form_labels_subject',             "text DEFAULT 'Subject'"],
    ['form_labels_message',             "text DEFAULT 'Tell us how we can help'"],
    ['form_labels_submit',              "text DEFAULT 'Submit'"],
    ['form_labels_sending',             "text DEFAULT 'Sending…'"],
    ['form_labels_success_title',       "text DEFAULT 'Thank you!'"],
    ['form_labels_success_message',     "text DEFAULT 'Your message has been sent. We''ll be in touch soon.'"],
    ['form_labels_error_message',       "text DEFAULT 'Something went wrong. Please try again.'"],
    ['form_labels_validation_required', "text DEFAULT 'This field is required.'"],
    ['form_labels_validation_email',    "text DEFAULT 'Please enter a valid email address.'"],
    ['form_labels_validation_phone',    "text DEFAULT 'Please enter a valid phone number.'"],
  ]
  for (const table of formTables) {
    if (!(await hasTable(table))) continue
    for (const [col, def] of formCols) {
      if (!(await hasColumn(table, col))) {
        console.log(`[migrate-db] Adding ${table}.${col}...`)
        await exec(`ALTER TABLE \`${table}\` ADD \`${col}\` ${def}`)
      }
    }
  }

  // --- localized URL fields: cta_url in block locales tables ---
  // Added when ctaUrl, whatsappUrl, email were made localized: true
  const ctaUrlTables = [
    'pages_blocks_hero_locales',
    'pages_blocks_cta_locales',
    'pages_blocks_services_overview_locales',
    '_pages_v_blocks_hero_locales',
    '_pages_v_blocks_cta_locales',
    '_pages_v_blocks_services_overview_locales',
  ]
  for (const table of ctaUrlTables) {
    if (!(await hasTable(table))) continue
    if (!(await hasColumn(table, 'cta_url'))) {
      console.log(`[migrate-db] Adding ${table}.cta_url...`)
      await exec(`ALTER TABLE \`${table}\` ADD \`cta_url\` text`)
    }
  }

  // about_shortcut has a default value
  for (const table of ['pages_blocks_about_shortcut_locales', '_pages_v_blocks_about_shortcut_locales']) {
    if (!(await hasTable(table))) continue
    if (!(await hasColumn(table, 'cta_url'))) {
      console.log(`[migrate-db] Adding ${table}.cta_url...`)
      await exec(`ALTER TABLE \`${table}\` ADD \`cta_url\` text DEFAULT '/about'`)
    }
  }

  // booking_session services: whatsapp_url and email
  for (const table of ['pages_blocks_booking_session_services_locales', '_pages_v_blocks_booking_session_services_locales']) {
    if (!(await hasTable(table))) continue
    if (!(await hasColumn(table, 'whatsapp_url'))) {
      console.log(`[migrate-db] Adding ${table}.whatsapp_url...`)
      await exec(`ALTER TABLE \`${table}\` ADD \`whatsapp_url\` text`)
    }
    if (!(await hasColumn(table, 'email'))) {
      console.log(`[migrate-db] Adding ${table}.email...`)
      await exec(`ALTER TABLE \`${table}\` ADD \`email\` text`)
    }
  }

  // Copy existing non-localized cta_url values into en locale rows (data preservation)
  const copyMap = [
    ['pages_blocks_hero_locales', 'pages_blocks_hero', 'cta_url'],
    ['pages_blocks_cta_locales', 'pages_blocks_cta', 'cta_url'],
    ['pages_blocks_services_overview_locales', 'pages_blocks_services_overview', 'cta_url'],
    ['pages_blocks_about_shortcut_locales', 'pages_blocks_about_shortcut', 'cta_url'],
  ]
  for (const [localeTable, parentTable, col] of copyMap) {
    if (!(await hasTable(localeTable)) || !(await hasTable(parentTable))) continue
    if (!(await hasColumn(parentTable, col))) continue  // already dropped — migration already ran
    console.log(`[migrate-db] Copying ${parentTable}.${col} → ${localeTable} (en)...`)
    await exec(`UPDATE \`${localeTable}\`
      SET \`${col}\` = (SELECT \`${col}\` FROM \`${parentTable}\` WHERE \`${parentTable}\`.\`id\` = \`${localeTable}\`.\`_parent_id\`)
      WHERE \`_locale\` = 'en' AND \`${col}\` IS NULL`)
  }

  for (const table of ['pages_blocks_booking_session_services']) {
    const localeTable = `${table}_locales`
    if (!(await hasTable(localeTable)) || !(await hasTable(table))) continue
    for (const col of ['whatsapp_url', 'email']) {
      if (!(await hasColumn(table, col))) continue  // already dropped
      console.log(`[migrate-db] Copying ${table}.${col} → ${localeTable} (en)...`)
      await exec(`UPDATE \`${localeTable}\`
        SET \`${col}\` = (SELECT \`${col}\` FROM \`${table}\` WHERE \`${table}\`.\`id\` = \`${localeTable}\`.\`_parent_id\`)
        WHERE \`_locale\` = 'en' AND \`${col}\` IS NULL`)
    }
  }

  console.log('[migrate-db] All schema migrations complete.')
  client.close()
}

main().catch((err) => {
  console.error('[migrate-db] Migration failed:', err)
  process.exit(1)
})
