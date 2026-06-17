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
