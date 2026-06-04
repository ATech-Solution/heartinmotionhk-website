import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

type ColRow = { name: string }

async function hasCol(db: MigrateUpArgs['db'], table: string, col: string): Promise<boolean> {
  const rows: ColRow[] = await db.all(sql`PRAGMA table_info(${sql.raw(table)})`)
  return rows.some((r) => r.name === col)
}

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // ── New tables (dev-push may have already created them) ─────────────────
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`pages_blocks_about_shortcut\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`cta_url\` text DEFAULT '/about',
  	\`visibility_show_on_desktop\` integer DEFAULT false,
  	\`visibility_show_on_tablet\` integer DEFAULT true,
  	\`visibility_show_on_mobile\` integer DEFAULT true,
  	\`block_name\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_about_shortcut_order_idx\` ON \`pages_blocks_about_shortcut\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_about_shortcut_parent_id_idx\` ON \`pages_blocks_about_shortcut\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_about_shortcut_path_idx\` ON \`pages_blocks_about_shortcut\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_about_shortcut_image_idx\` ON \`pages_blocks_about_shortcut\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`pages_blocks_about_shortcut_locales\` (
  	\`heading\` text DEFAULT 'About Heart In Motion',
  	\`body\` text,
  	\`cta_label\` text DEFAULT 'About us',
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_about_shortcut\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX IF NOT EXISTS \`pages_blocks_about_shortcut_locales_locale_parent_id_unique\` ON \`pages_blocks_about_shortcut_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_pages_v_blocks_about_shortcut\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`cta_url\` text DEFAULT '/about',
  	\`visibility_show_on_desktop\` integer DEFAULT false,
  	\`visibility_show_on_tablet\` integer DEFAULT true,
  	\`visibility_show_on_mobile\` integer DEFAULT true,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_about_shortcut_order_idx\` ON \`_pages_v_blocks_about_shortcut\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_about_shortcut_parent_id_idx\` ON \`_pages_v_blocks_about_shortcut\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_about_shortcut_path_idx\` ON \`_pages_v_blocks_about_shortcut\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_about_shortcut_image_idx\` ON \`_pages_v_blocks_about_shortcut\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`_pages_v_blocks_about_shortcut_locales\` (
  	\`heading\` text DEFAULT 'About Heart In Motion',
  	\`body\` text,
  	\`cta_label\` text DEFAULT 'About us',
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_about_shortcut\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX IF NOT EXISTS \`_pages_v_blocks_about_shortcut_locales_locale_parent_id_unique\` ON \`_pages_v_blocks_about_shortcut_locales\` (\`_locale\`,\`_parent_id\`);`)

  // ── Drop old tables (dev-push may have removed them already) ────────────
  await db.run(sql`DROP TABLE IF EXISTS \`pages_blocks_coaching_experience_certifications\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`pages_blocks_coaching_experience_certifications_locales\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`pages_blocks_about_him_core_values\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`pages_blocks_about_him_core_values_locales\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`_pages_v_blocks_coaching_experience_certifications\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`_pages_v_blocks_coaching_experience_certifications_locales\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`_pages_v_blocks_about_him_core_values\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`_pages_v_blocks_about_him_core_values_locales\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`services_bullet_points\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`general_settings_social_links\`;`)

  // ── Recreate pages_blocks_values_values (remove icon_id column) ─────────
  // Guard: only recreate if icon_id still exists (dev-push may have already removed it)
  if (await hasCol(db, 'pages_blocks_values_values', 'icon_id')) {
    await db.run(sql`DROP TABLE IF EXISTS \`__new_pages_blocks_values_values\`;`)
    await db.run(sql`PRAGMA foreign_keys=OFF;`)
    await db.run(sql`CREATE TABLE \`__new_pages_blocks_values_values\` (
    	\`_order\` integer NOT NULL,
    	\`_parent_id\` text NOT NULL,
    	\`id\` text PRIMARY KEY NOT NULL,
    	\`decorative_image_id\` integer,
    	\`color\` text DEFAULT 'teal',
    	FOREIGN KEY (\`decorative_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
    	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_values\`(\`id\`) ON UPDATE no action ON DELETE cascade
    );
    `)
    await db.run(sql`INSERT INTO \`__new_pages_blocks_values_values\`("_order", "_parent_id", "id", "decorative_image_id", "color") SELECT "_order", "_parent_id", "id", "decorative_image_id", "color" FROM \`pages_blocks_values_values\`;`)
    await db.run(sql`DROP TABLE \`pages_blocks_values_values\`;`)
    await db.run(sql`ALTER TABLE \`__new_pages_blocks_values_values\` RENAME TO \`pages_blocks_values_values\`;`)
    await db.run(sql`PRAGMA foreign_keys=ON;`)
  }
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_values_values_order_idx\` ON \`pages_blocks_values_values\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_values_values_parent_id_idx\` ON \`pages_blocks_values_values\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_values_values_decorative_image_idx\` ON \`pages_blocks_values_values\` (\`decorative_image_id\`);`)

  // ── Recreate pages_blocks_contact_form (remove form_id column) ──────────
  // Guard: only recreate if form_id still exists
  if (await hasCol(db, 'pages_blocks_contact_form', 'form_id')) {
    await db.run(sql`DROP TABLE IF EXISTS \`__new_pages_blocks_contact_form\`;`)
    await db.run(sql`CREATE TABLE \`__new_pages_blocks_contact_form\` (
    	\`_order\` integer NOT NULL,
    	\`_parent_id\` integer NOT NULL,
    	\`_path\` text NOT NULL,
    	\`id\` text PRIMARY KEY NOT NULL,
    	\`side_image_id\` integer,
    	\`visibility_show_on_desktop\` integer DEFAULT true,
    	\`visibility_show_on_tablet\` integer DEFAULT true,
    	\`visibility_show_on_mobile\` integer DEFAULT true,
    	\`block_name\` text,
    	FOREIGN KEY (\`side_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
    	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
    );
    `)
    await db.run(sql`INSERT INTO \`__new_pages_blocks_contact_form\`("_order", "_parent_id", "_path", "id", "side_image_id", "visibility_show_on_desktop", "visibility_show_on_tablet", "visibility_show_on_mobile", "block_name") SELECT "_order", "_parent_id", "_path", "id", "side_image_id", "visibility_show_on_desktop", "visibility_show_on_tablet", "visibility_show_on_mobile", "block_name" FROM \`pages_blocks_contact_form\`;`)
    await db.run(sql`DROP TABLE \`pages_blocks_contact_form\`;`)
    await db.run(sql`ALTER TABLE \`__new_pages_blocks_contact_form\` RENAME TO \`pages_blocks_contact_form\`;`)
  }
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_contact_form_order_idx\` ON \`pages_blocks_contact_form\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_contact_form_parent_id_idx\` ON \`pages_blocks_contact_form\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_contact_form_path_idx\` ON \`pages_blocks_contact_form\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_contact_form_side_image_idx\` ON \`pages_blocks_contact_form\` (\`side_image_id\`);`)

  // ── Recreate _pages_v_blocks_values_values ──────────────────────────────
  // Guard: only recreate if icon_id still exists
  if (await hasCol(db, '_pages_v_blocks_values_values', 'icon_id')) {
    await db.run(sql`DROP TABLE IF EXISTS \`__new__pages_v_blocks_values_values\`;`)
    await db.run(sql`CREATE TABLE \`__new__pages_v_blocks_values_values\` (
    	\`_order\` integer NOT NULL,
    	\`_parent_id\` integer NOT NULL,
    	\`id\` integer PRIMARY KEY NOT NULL,
    	\`decorative_image_id\` integer,
    	\`color\` text DEFAULT 'teal',
    	\`_uuid\` text,
    	FOREIGN KEY (\`decorative_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
    	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_values\`(\`id\`) ON UPDATE no action ON DELETE cascade
    );
    `)
    await db.run(sql`INSERT INTO \`__new__pages_v_blocks_values_values\`("_order", "_parent_id", "id", "decorative_image_id", "color", "_uuid") SELECT "_order", "_parent_id", "id", "decorative_image_id", "color", "_uuid" FROM \`_pages_v_blocks_values_values\`;`)
    await db.run(sql`DROP TABLE \`_pages_v_blocks_values_values\`;`)
    await db.run(sql`ALTER TABLE \`__new__pages_v_blocks_values_values\` RENAME TO \`_pages_v_blocks_values_values\`;`)
  }
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_values_values_order_idx\` ON \`_pages_v_blocks_values_values\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_values_values_parent_id_idx\` ON \`_pages_v_blocks_values_values\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_values_values_decorative_image_idx\` ON \`_pages_v_blocks_values_values\` (\`decorative_image_id\`);`)

  // ── Recreate _pages_v_blocks_contact_form ───────────────────────────────
  // Guard: only recreate if form_id still exists
  if (await hasCol(db, '_pages_v_blocks_contact_form', 'form_id')) {
    await db.run(sql`DROP TABLE IF EXISTS \`__new__pages_v_blocks_contact_form\`;`)
    await db.run(sql`CREATE TABLE \`__new__pages_v_blocks_contact_form\` (
    	\`_order\` integer NOT NULL,
    	\`_parent_id\` integer NOT NULL,
    	\`_path\` text NOT NULL,
    	\`id\` integer PRIMARY KEY NOT NULL,
    	\`side_image_id\` integer,
    	\`visibility_show_on_desktop\` integer DEFAULT true,
    	\`visibility_show_on_tablet\` integer DEFAULT true,
    	\`visibility_show_on_mobile\` integer DEFAULT true,
    	\`_uuid\` text,
    	\`block_name\` text,
    	FOREIGN KEY (\`side_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
    	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
    );
    `)
    await db.run(sql`INSERT INTO \`__new__pages_v_blocks_contact_form\`("_order", "_parent_id", "_path", "id", "side_image_id", "visibility_show_on_desktop", "visibility_show_on_tablet", "visibility_show_on_mobile", "_uuid", "block_name") SELECT "_order", "_parent_id", "_path", "id", "side_image_id", "visibility_show_on_desktop", "visibility_show_on_tablet", "visibility_show_on_mobile", "_uuid", "block_name" FROM \`_pages_v_blocks_contact_form\`;`)
    await db.run(sql`DROP TABLE \`_pages_v_blocks_contact_form\`;`)
    await db.run(sql`ALTER TABLE \`__new__pages_v_blocks_contact_form\` RENAME TO \`_pages_v_blocks_contact_form\`;`)
  }
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_contact_form_order_idx\` ON \`_pages_v_blocks_contact_form\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_contact_form_parent_id_idx\` ON \`_pages_v_blocks_contact_form\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_contact_form_path_idx\` ON \`_pages_v_blocks_contact_form\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`_pages_v_blocks_contact_form_side_image_idx\` ON \`_pages_v_blocks_contact_form\` (\`side_image_id\`);`)

  // ── Add new columns (skip if already added by dev-push) ─────────────────
  if (!await hasCol(db, 'pages_blocks_hero_locales', 'subheadline_mobile'))
    await db.run(sql`ALTER TABLE \`pages_blocks_hero_locales\` ADD \`subheadline_mobile\` text;`)

  if (!await hasCol(db, 'pages_blocks_real_challenge_locales', 'body_mobile'))
    await db.run(sql`ALTER TABLE \`pages_blocks_real_challenge_locales\` ADD \`body_mobile\` text;`)

  if (!await hasCol(db, 'pages_blocks_about_him_locales', 'body'))
    await db.run(sql`ALTER TABLE \`pages_blocks_about_him_locales\` ADD \`body\` text;`)

  if (!await hasCol(db, '_pages_v_blocks_hero_locales', 'subheadline_mobile'))
    await db.run(sql`ALTER TABLE \`_pages_v_blocks_hero_locales\` ADD \`subheadline_mobile\` text;`)

  if (!await hasCol(db, '_pages_v_blocks_real_challenge_locales', 'body_mobile'))
    await db.run(sql`ALTER TABLE \`_pages_v_blocks_real_challenge_locales\` ADD \`body_mobile\` text;`)

  if (!await hasCol(db, '_pages_v_blocks_about_him_locales', 'body'))
    await db.run(sql`ALTER TABLE \`_pages_v_blocks_about_him_locales\` ADD \`body\` text;`)

  if (!await hasCol(db, 'testimonials', 'order'))
    await db.run(sql`ALTER TABLE \`testimonials\` ADD \`order\` numeric DEFAULT 0;`)

  // ── Drop stale columns (skip if already removed by dev-push) ────────────
  if (await hasCol(db, 'testimonials', 'rating'))
    await db.run(sql`ALTER TABLE \`testimonials\` DROP COLUMN \`rating\`;`)

  if (await hasCol(db, 'testimonials', 'featured'))
    await db.run(sql`ALTER TABLE \`testimonials\` DROP COLUMN \`featured\`;`)

  if (!await hasCol(db, 'general_settings', 'admin_logo_id'))
    await db.run(sql`ALTER TABLE \`general_settings\` ADD \`admin_logo_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`general_settings_admin_logo_idx\` ON \`general_settings\` (\`admin_logo_id\`);`)

  if (!await hasCol(db, 'maintenance_settings', 'logo_id'))
    await db.run(sql`ALTER TABLE \`maintenance_settings\` ADD \`logo_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`maintenance_settings_logo_idx\` ON \`maintenance_settings\` (\`logo_id\`);`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`pages_blocks_coaching_experience_certifications\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`year\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_coaching_experience\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_coaching_experience_certifications_order_idx\` ON \`pages_blocks_coaching_experience_certifications\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_coaching_experience_certifications_parent_id_idx\` ON \`pages_blocks_coaching_experience_certifications\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`pages_blocks_coaching_experience_certifications_locales\` (
  	\`title\` text,
  	\`institution\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_coaching_experience_certifications\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX IF NOT EXISTS \`pages_blocks_coaching_experience_certifications_locales_locale_parent_id_unique\` ON \`pages_blocks_coaching_experience_certifications_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`pages_blocks_about_him_core_values\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_about_him\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_about_him_core_values_order_idx\` ON \`pages_blocks_about_him_core_values\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`pages_blocks_about_him_core_values_parent_id_idx\` ON \`pages_blocks_about_him_core_values\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`pages_blocks_about_him_core_values_locales\` (
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_about_him_core_values\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX IF NOT EXISTS \`pages_blocks_about_him_core_values_locales_locale_parent_id_unique\` ON \`pages_blocks_about_him_core_values_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`services_bullet_points\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`point\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`services\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`services_bullet_points_order_idx\` ON \`services_bullet_points\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`services_bullet_points_parent_id_idx\` ON \`services_bullet_points\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`services_bullet_points_locale_idx\` ON \`services_bullet_points\` (\`_locale\`);`)
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`general_settings_social_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`platform\` text NOT NULL,
  	\`url\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`general_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`general_settings_social_links_order_idx\` ON \`general_settings_social_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`general_settings_social_links_parent_id_idx\` ON \`general_settings_social_links\` (\`_parent_id\`);`)
  await db.run(sql`DROP TABLE IF EXISTS \`pages_blocks_about_shortcut\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`pages_blocks_about_shortcut_locales\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`_pages_v_blocks_about_shortcut\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`_pages_v_blocks_about_shortcut_locales\`;`)
}
