import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Remove the `icon` field from the values block's values sub-table.
  // The dev migration already applied this change; these statements are guarded so
  // running on a fresh DB is also safe.
  await db.run(sql`DROP INDEX IF EXISTS \`pages_blocks_values_values_icon_idx\`;`)
  await db.run(sql`ALTER TABLE \`pages_blocks_values_values\` DROP COLUMN IF EXISTS \`icon_id\`;`)

  // Mirror on the version-history tables
  await db.run(sql`DROP INDEX IF EXISTS \`_pages_v_blocks_values_values_icon_idx\`;`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_values_values\` DROP COLUMN IF EXISTS \`icon_id\`;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Re-add icon_id if rolling back
  await db.run(sql`ALTER TABLE \`pages_blocks_values_values\` ADD COLUMN \`icon_id\` integer REFERENCES \`media\`(\`id\`) ON DELETE set null;`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_values_values_icon_idx\` ON \`pages_blocks_values_values\` (\`icon_id\`);`)

  await db.run(sql`ALTER TABLE \`_pages_v_blocks_values_values\` ADD COLUMN \`icon_id\` integer REFERENCES \`media\`(\`id\`) ON DELETE set null;`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_values_values_icon_idx\` ON \`_pages_v_blocks_values_values\` (\`icon_id\`);`)
}
