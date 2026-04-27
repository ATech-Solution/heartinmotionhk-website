import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`pages_blocks_booking_session_services\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`whatsapp_url\` text,
  	\`email\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_booking_session\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_booking_session_services_order_idx\` ON \`pages_blocks_booking_session_services\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_booking_session_services_parent_id_idx\` ON \`pages_blocks_booking_session_services\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_booking_session_services_locales\` (
  	\`name\` text,
  	\`description\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_booking_session_services\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_blocks_booking_session_services_locales_locale_parent_id_unique\` ON \`pages_blocks_booking_session_services_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_booking_session_services\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`whatsapp_url\` text,
  	\`email\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_booking_session\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_booking_session_services_order_idx\` ON \`_pages_v_blocks_booking_session_services\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_booking_session_services_parent_id_idx\` ON \`_pages_v_blocks_booking_session_services\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_booking_session_services_locales\` (
  	\`name\` text,
  	\`description\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_booking_session_services\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_pages_v_blocks_booking_session_services_locales_locale_parent_id_unique\` ON \`_pages_v_blocks_booking_session_services_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_booking_session_locales\` ADD \`section_title\` text DEFAULT 'Booking Session';`)
  await db.run(sql`ALTER TABLE \`pages_blocks_booking_session_locales\` ADD \`section_subtitle\` text;`)
  await db.run(sql`ALTER TABLE \`pages_blocks_booking_session_locales\` DROP COLUMN \`quote\`;`)
  await db.run(sql`ALTER TABLE \`pages_blocks_booking_session_locales\` DROP COLUMN \`body\`;`)
  await db.run(sql`ALTER TABLE \`pages_blocks_booking_session_locales\` DROP COLUMN \`button_label\`;`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_booking_session_locales\` ADD \`section_title\` text DEFAULT 'Booking Session';`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_booking_session_locales\` ADD \`section_subtitle\` text;`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_booking_session_locales\` DROP COLUMN \`quote\`;`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_booking_session_locales\` DROP COLUMN \`body\`;`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_booking_session_locales\` DROP COLUMN \`button_label\`;`)
  await db.run(sql`ALTER TABLE \`pages_blocks_booking_session\` DROP COLUMN \`button_url\`;`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_booking_session\` DROP COLUMN \`button_url\`;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`pages_blocks_booking_session_services\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_booking_session_services_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_booking_session_services\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_booking_session_services_locales\`;`)
  await db.run(sql`ALTER TABLE \`pages_blocks_booking_session\` ADD \`button_url\` text;`)
  await db.run(sql`ALTER TABLE \`pages_blocks_booking_session_locales\` ADD \`quote\` text;`)
  await db.run(sql`ALTER TABLE \`pages_blocks_booking_session_locales\` ADD \`body\` text;`)
  await db.run(sql`ALTER TABLE \`pages_blocks_booking_session_locales\` ADD \`button_label\` text DEFAULT 'Book a session';`)
  await db.run(sql`ALTER TABLE \`pages_blocks_booking_session_locales\` DROP COLUMN \`section_title\`;`)
  await db.run(sql`ALTER TABLE \`pages_blocks_booking_session_locales\` DROP COLUMN \`section_subtitle\`;`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_booking_session\` ADD \`button_url\` text;`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_booking_session_locales\` ADD \`quote\` text;`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_booking_session_locales\` ADD \`body\` text;`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_booking_session_locales\` ADD \`button_label\` text DEFAULT 'Book a session';`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_booking_session_locales\` DROP COLUMN \`section_title\`;`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_booking_session_locales\` DROP COLUMN \`section_subtitle\`;`)
}
