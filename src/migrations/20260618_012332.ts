import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`header\` ADD \`language_switcher_en_label\` text DEFAULT 'EN';`)
  await db.run(sql`ALTER TABLE \`header\` ADD \`language_switcher_zh_label\` text DEFAULT '简中';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`header\` DROP COLUMN \`language_switcher_en_label\`;`)
  await db.run(sql`ALTER TABLE \`header\` DROP COLUMN \`language_switcher_zh_label\`;`)
}
