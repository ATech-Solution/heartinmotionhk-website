import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Step 1 — add cta_url / whatsapp_url / email to all _locales tables
  await db.run(sql`ALTER TABLE \`pages_blocks_hero_locales\` ADD \`cta_url\` text;`)
  await db.run(sql`ALTER TABLE \`pages_blocks_cta_locales\` ADD \`cta_url\` text;`)
  await db.run(sql`ALTER TABLE \`pages_blocks_services_overview_locales\` ADD \`cta_url\` text;`)
  await db.run(sql`ALTER TABLE \`pages_blocks_about_shortcut_locales\` ADD \`cta_url\` text DEFAULT '/about';`)
  await db.run(sql`ALTER TABLE \`pages_blocks_booking_session_services_locales\` ADD \`whatsapp_url\` text;`)
  await db.run(sql`ALTER TABLE \`pages_blocks_booking_session_services_locales\` ADD \`email\` text;`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_hero_locales\` ADD \`cta_url\` text;`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_cta_locales\` ADD \`cta_url\` text;`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_services_overview_locales\` ADD \`cta_url\` text;`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_about_shortcut_locales\` ADD \`cta_url\` text DEFAULT '/about';`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_booking_session_services_locales\` ADD \`whatsapp_url\` text;`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_booking_session_services_locales\` ADD \`email\` text;`)

  // Step 2 — copy existing (non-localized) values into the 'en' locale rows
  // so no data is lost when we drop the old columns.
  await db.run(sql`UPDATE \`pages_blocks_hero_locales\`
    SET \`cta_url\` = (SELECT \`cta_url\` FROM \`pages_blocks_hero\` WHERE \`pages_blocks_hero\`.\`id\` = \`pages_blocks_hero_locales\`.\`_parent_id\`)
    WHERE \`_locale\` = 'en';`)
  await db.run(sql`UPDATE \`pages_blocks_cta_locales\`
    SET \`cta_url\` = (SELECT \`cta_url\` FROM \`pages_blocks_cta\` WHERE \`pages_blocks_cta\`.\`id\` = \`pages_blocks_cta_locales\`.\`_parent_id\`)
    WHERE \`_locale\` = 'en';`)
  await db.run(sql`UPDATE \`pages_blocks_services_overview_locales\`
    SET \`cta_url\` = (SELECT \`cta_url\` FROM \`pages_blocks_services_overview\` WHERE \`pages_blocks_services_overview\`.\`id\` = \`pages_blocks_services_overview_locales\`.\`_parent_id\`)
    WHERE \`_locale\` = 'en';`)
  await db.run(sql`UPDATE \`pages_blocks_about_shortcut_locales\`
    SET \`cta_url\` = (SELECT \`cta_url\` FROM \`pages_blocks_about_shortcut\` WHERE \`pages_blocks_about_shortcut\`.\`id\` = \`pages_blocks_about_shortcut_locales\`.\`_parent_id\`)
    WHERE \`_locale\` = 'en';`)
  await db.run(sql`UPDATE \`pages_blocks_booking_session_services_locales\`
    SET \`whatsapp_url\` = (SELECT \`whatsapp_url\` FROM \`pages_blocks_booking_session_services\` WHERE \`pages_blocks_booking_session_services\`.\`id\` = \`pages_blocks_booking_session_services_locales\`.\`_parent_id\`),
        \`email\` = (SELECT \`email\` FROM \`pages_blocks_booking_session_services\` WHERE \`pages_blocks_booking_session_services\`.\`id\` = \`pages_blocks_booking_session_services_locales\`.\`_parent_id\`)
    WHERE \`_locale\` = 'en';`)
  // Same for version tables
  await db.run(sql`UPDATE \`_pages_v_blocks_hero_locales\`
    SET \`cta_url\` = (SELECT \`cta_url\` FROM \`_pages_v_blocks_hero\` WHERE \`_pages_v_blocks_hero\`.\`id\` = \`_pages_v_blocks_hero_locales\`.\`_parent_id\`)
    WHERE \`_locale\` = 'en';`)
  await db.run(sql`UPDATE \`_pages_v_blocks_cta_locales\`
    SET \`cta_url\` = (SELECT \`cta_url\` FROM \`_pages_v_blocks_cta\` WHERE \`_pages_v_blocks_cta\`.\`id\` = \`_pages_v_blocks_cta_locales\`.\`_parent_id\`)
    WHERE \`_locale\` = 'en';`)
  await db.run(sql`UPDATE \`_pages_v_blocks_services_overview_locales\`
    SET \`cta_url\` = (SELECT \`cta_url\` FROM \`_pages_v_blocks_services_overview\` WHERE \`_pages_v_blocks_services_overview\`.\`id\` = \`_pages_v_blocks_services_overview_locales\`.\`_parent_id\`)
    WHERE \`_locale\` = 'en';`)
  await db.run(sql`UPDATE \`_pages_v_blocks_about_shortcut_locales\`
    SET \`cta_url\` = (SELECT \`cta_url\` FROM \`_pages_v_blocks_about_shortcut\` WHERE \`_pages_v_blocks_about_shortcut\`.\`id\` = \`_pages_v_blocks_about_shortcut_locales\`.\`_parent_id\`)
    WHERE \`_locale\` = 'en';`)
  await db.run(sql`UPDATE \`_pages_v_blocks_booking_session_services_locales\`
    SET \`whatsapp_url\` = (SELECT \`whatsapp_url\` FROM \`_pages_v_blocks_booking_session_services\` WHERE \`_pages_v_blocks_booking_session_services\`.\`id\` = \`_pages_v_blocks_booking_session_services_locales\`.\`_parent_id\`),
        \`email\` = (SELECT \`email\` FROM \`_pages_v_blocks_booking_session_services\` WHERE \`_pages_v_blocks_booking_session_services\`.\`id\` = \`_pages_v_blocks_booking_session_services_locales\`.\`_parent_id\`)
    WHERE \`_locale\` = 'en';`)

  // Step 3 — drop old non-localized columns now that data is safely copied
  await db.run(sql`ALTER TABLE \`pages_blocks_hero\` DROP COLUMN \`cta_url\`;`)
  await db.run(sql`ALTER TABLE \`pages_blocks_cta\` DROP COLUMN \`cta_url\`;`)
  await db.run(sql`ALTER TABLE \`pages_blocks_services_overview\` DROP COLUMN \`cta_url\`;`)
  await db.run(sql`ALTER TABLE \`pages_blocks_about_shortcut\` DROP COLUMN \`cta_url\`;`)
  await db.run(sql`ALTER TABLE \`pages_blocks_booking_session_services\` DROP COLUMN \`whatsapp_url\`;`)
  await db.run(sql`ALTER TABLE \`pages_blocks_booking_session_services\` DROP COLUMN \`email\`;`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_hero\` DROP COLUMN \`cta_url\`;`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_cta\` DROP COLUMN \`cta_url\`;`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_services_overview\` DROP COLUMN \`cta_url\`;`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_about_shortcut\` DROP COLUMN \`cta_url\`;`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_booking_session_services\` DROP COLUMN \`whatsapp_url\`;`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_booking_session_services\` DROP COLUMN \`email\`;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`pages_blocks_hero\` ADD \`cta_url\` text;`)
  await db.run(sql`ALTER TABLE \`pages_blocks_cta\` ADD \`cta_url\` text;`)
  await db.run(sql`ALTER TABLE \`pages_blocks_services_overview\` ADD \`cta_url\` text;`)
  await db.run(sql`ALTER TABLE \`pages_blocks_about_shortcut\` ADD \`cta_url\` text DEFAULT '/about';`)
  await db.run(sql`ALTER TABLE \`pages_blocks_booking_session_services\` ADD \`whatsapp_url\` text;`)
  await db.run(sql`ALTER TABLE \`pages_blocks_booking_session_services\` ADD \`email\` text;`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_hero\` ADD \`cta_url\` text;`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_cta\` ADD \`cta_url\` text;`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_services_overview\` ADD \`cta_url\` text;`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_about_shortcut\` ADD \`cta_url\` text DEFAULT '/about';`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_booking_session_services\` ADD \`whatsapp_url\` text;`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_booking_session_services\` ADD \`email\` text;`)
  await db.run(sql`ALTER TABLE \`pages_blocks_hero_locales\` DROP COLUMN \`cta_url\`;`)
  await db.run(sql`ALTER TABLE \`pages_blocks_cta_locales\` DROP COLUMN \`cta_url\`;`)
  await db.run(sql`ALTER TABLE \`pages_blocks_services_overview_locales\` DROP COLUMN \`cta_url\`;`)
  await db.run(sql`ALTER TABLE \`pages_blocks_about_shortcut_locales\` DROP COLUMN \`cta_url\`;`)
  await db.run(sql`ALTER TABLE \`pages_blocks_booking_session_services_locales\` DROP COLUMN \`whatsapp_url\`;`)
  await db.run(sql`ALTER TABLE \`pages_blocks_booking_session_services_locales\` DROP COLUMN \`email\`;`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_hero_locales\` DROP COLUMN \`cta_url\`;`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_cta_locales\` DROP COLUMN \`cta_url\`;`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_services_overview_locales\` DROP COLUMN \`cta_url\`;`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_about_shortcut_locales\` DROP COLUMN \`cta_url\`;`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_booking_session_services_locales\` DROP COLUMN \`whatsapp_url\`;`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_booking_session_services_locales\` DROP COLUMN \`email\`;`)
}
