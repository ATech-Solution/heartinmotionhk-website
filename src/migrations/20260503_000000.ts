import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // SQLite has no ADD COLUMN IF NOT EXISTS; skip if already present (dev-push may have applied it)
  const cols: { name: string }[] = await db.all(sql`PRAGMA table_info(general_settings)`)
  if (!cols.some((c) => c.name === 'admin_logo_id')) {
    await db.run(
      sql`ALTER TABLE \`general_settings\` ADD COLUMN \`admin_logo_id\` integer REFERENCES \`media\`(\`id\`) ON DELETE set null;`,
    )
  }
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`general_settings_admin_logo_idx\` ON \`general_settings\` (\`admin_logo_id\`);`,
  )
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP INDEX IF EXISTS \`general_settings_admin_logo_idx\`;`)
}
