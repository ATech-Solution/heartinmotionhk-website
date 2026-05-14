import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Add order column to testimonials — missing from initial schema
  const cols: { name: string }[] = await db.all(sql`PRAGMA table_info(testimonials)`)
  if (!cols.some((c) => c.name === 'order')) {
    await db.run(sql`ALTER TABLE \`testimonials\` ADD COLUMN \`order\` numeric DEFAULT 0;`)
  }
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // SQLite does not support DROP COLUMN reliably; leave the column in place
}
