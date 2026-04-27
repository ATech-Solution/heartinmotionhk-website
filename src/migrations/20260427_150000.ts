import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Drop old tables — children first, then parents
  await db.run(sql`DROP TABLE IF EXISTS \`_pages_v_blocks_booking_session_services_locales\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`_pages_v_blocks_booking_session_services\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`_pages_v_blocks_booking_session_locales\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`_pages_v_blocks_booking_session\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`pages_blocks_booking_session_services_locales\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`pages_blocks_booking_session_services\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`pages_blocks_booking_session_locales\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`pages_blocks_booking_session\`;`)

  // pages_blocks_booking_session
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`pages_blocks_booking_session\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`visibility_show_on_desktop\` integer DEFAULT true,
  	\`visibility_show_on_tablet\` integer DEFAULT true,
  	\`visibility_show_on_mobile\` integer DEFAULT true,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_booking_session_order_idx\` ON \`pages_blocks_booking_session\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_booking_session_parent_id_idx\` ON \`pages_blocks_booking_session\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_booking_session_path_idx\` ON \`pages_blocks_booking_session\` (\`_path\`);`)

  // pages_blocks_booking_session_locales
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`pages_blocks_booking_session_locales\` (
  	\`section_title\` text NOT NULL,
  	\`section_subtitle\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_booking_session\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );`)
  await db.run(sql`CREATE UNIQUE INDEX IF NOT EXISTS \`pages_blocks_booking_session_locales_locale_parent_id_unique\` ON \`pages_blocks_booking_session_locales\` (\`_locale\`,\`_parent_id\`);`)

  // pages_blocks_booking_session_services
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`pages_blocks_booking_session_services\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`whatsapp_url\` text,
  	\`email\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_booking_session\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_booking_session_services_order_idx\` ON \`pages_blocks_booking_session_services\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_booking_session_services_parent_id_idx\` ON \`pages_blocks_booking_session_services\` (\`_parent_id\`);`)

  // pages_blocks_booking_session_services_locales
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`pages_blocks_booking_session_services_locales\` (
  	\`name\` text NOT NULL,
  	\`description\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_booking_session_services\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );`)
  await db.run(sql`CREATE UNIQUE INDEX IF NOT EXISTS \`pages_blocks_booking_session_services_locales_locale_parent_id_unique\` ON \`pages_blocks_booking_session_services_locales\` (\`_locale\`,\`_parent_id\`);`)

  // _pages_v_blocks_booking_session
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_pages_v_blocks_booking_session\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`visibility_show_on_desktop\` integer DEFAULT true,
  	\`visibility_show_on_tablet\` integer DEFAULT true,
  	\`visibility_show_on_mobile\` integer DEFAULT true,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_booking_session_order_idx\` ON \`_pages_v_blocks_booking_session\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_booking_session_parent_id_idx\` ON \`_pages_v_blocks_booking_session\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_booking_session_path_idx\` ON \`_pages_v_blocks_booking_session\` (\`_path\`);`)

  // _pages_v_blocks_booking_session_locales
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_pages_v_blocks_booking_session_locales\` (
  	\`section_title\` text NOT NULL,
  	\`section_subtitle\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_booking_session\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );`)
  await db.run(sql`CREATE UNIQUE INDEX IF NOT EXISTS \`_pages_v_blocks_booking_session_locales_locale_parent_id_unique\` ON \`_pages_v_blocks_booking_session_locales\` (\`_locale\`,\`_parent_id\`);`)

  // _pages_v_blocks_booking_session_services
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_pages_v_blocks_booking_session_services\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_uuid\` text,
  	\`whatsapp_url\` text,
  	\`email\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_booking_session\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_booking_session_services_order_idx\` ON \`_pages_v_blocks_booking_session_services\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_booking_session_services_parent_id_idx\` ON \`_pages_v_blocks_booking_session_services\` (\`_parent_id\`);`)

  // _pages_v_blocks_booking_session_services_locales
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_pages_v_blocks_booking_session_services_locales\` (
  	\`name\` text NOT NULL,
  	\`description\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_booking_session_services\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );`)
  await db.run(sql`CREATE UNIQUE INDEX IF NOT EXISTS \`_pages_v_blocks_booking_session_services_locales_locale_parent_id_unique\` ON \`_pages_v_blocks_booking_session_services_locales\` (\`_locale\`,\`_parent_id\`);`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE IF EXISTS \`_pages_v_blocks_booking_session_services_locales\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`_pages_v_blocks_booking_session_services\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`_pages_v_blocks_booking_session_locales\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`_pages_v_blocks_booking_session\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`pages_blocks_booking_session_services_locales\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`pages_blocks_booking_session_services\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`pages_blocks_booking_session_locales\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`pages_blocks_booking_session\`;`)
}
