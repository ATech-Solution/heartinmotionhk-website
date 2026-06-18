import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

async function hasColumn(db: MigrateUpArgs['db'], table: string, column: string): Promise<boolean> {
  const rows = await db.all(sql`PRAGMA table_info(${sql.raw(table)})`)
  return (rows as Array<{ name: string }>).some((r) => r.name === column)
}

export async function up({ db }: MigrateUpArgs): Promise<void> {
  if (!(await hasColumn(db, 'header', 'language_switcher_show'))) {
    await db.run(sql`ALTER TABLE \`header\` ADD \`language_switcher_show\` integer DEFAULT true;`)
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  try { await db.run(sql`ALTER TABLE \`header\` DROP COLUMN \`language_switcher_show\`;`) } catch {}
}
