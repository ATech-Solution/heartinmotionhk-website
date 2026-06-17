import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`ai_settings\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`enabled\` integer DEFAULT true,
  	\`anthropic_api_key\` text,
  	\`model\` text DEFAULT 'claude-haiku-4-5-20251001',
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`DROP TABLE IF EXISTS \`language_settings_active_locales\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`language_settings\`;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE IF EXISTS \`ai_settings\`;`)
}
