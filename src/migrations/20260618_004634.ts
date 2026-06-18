import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

// SQLite has no ADD COLUMN IF NOT EXISTS — check PRAGMA table_info first
async function hasColumn(db: MigrateUpArgs['db'], table: string, column: string): Promise<boolean> {
  const rows = await db.all(sql`PRAGMA table_info(${sql.raw(table)})`)
  return (rows as Array<{ name: string }>).some((r) => r.name === column)
}

async function addColumnIfMissing(
  db: MigrateUpArgs['db'],
  table: string,
  column: string,
  definition: string,
): Promise<void> {
  if (!(await hasColumn(db, table, column))) {
    await db.run(sql.raw(`ALTER TABLE \`${table}\` ADD \`${column}\` ${definition}`))
  }
}

export async function up({ db }: MigrateUpArgs): Promise<void> {
  const tables = ['pages_blocks_contact_form_locales', '_pages_v_blocks_contact_form_locales']
  const columns: [string, string][] = [
    ['form_labels_full_name',          "text DEFAULT 'Full Name'"],
    ['form_labels_email',              "text DEFAULT 'Email Address'"],
    ['form_labels_phone',              "text DEFAULT 'Phone Number'"],
    ['form_labels_subject',            "text DEFAULT 'Subject'"],
    ['form_labels_message',            "text DEFAULT 'Tell us how we can help'"],
    ['form_labels_submit',             "text DEFAULT 'Submit'"],
    ['form_labels_sending',            "text DEFAULT 'Sending…'"],
    ['form_labels_success_title',      "text DEFAULT 'Thank you!'"],
    ['form_labels_success_message',    "text DEFAULT 'Your message has been sent. We''ll be in touch soon.'"],
    ['form_labels_error_message',      "text DEFAULT 'Something went wrong. Please try again.'"],
    ['form_labels_validation_required',"text DEFAULT 'This field is required.'"],
    ['form_labels_validation_email',   "text DEFAULT 'Please enter a valid email address.'"],
    ['form_labels_validation_phone',   "text DEFAULT 'Please enter a valid phone number.'"],
  ]

  for (const table of tables) {
    for (const [col, def] of columns) {
      await addColumnIfMissing(db, table, col, def)
    }
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  const tables = ['pages_blocks_contact_form_locales', '_pages_v_blocks_contact_form_locales']
  const columns = [
    'form_labels_full_name', 'form_labels_email', 'form_labels_phone',
    'form_labels_subject', 'form_labels_message', 'form_labels_submit',
    'form_labels_sending', 'form_labels_success_title', 'form_labels_success_message',
    'form_labels_error_message', 'form_labels_validation_required',
    'form_labels_validation_email', 'form_labels_validation_phone',
  ]
  for (const table of tables) {
    for (const col of columns) {
      try {
        await db.run(sql.raw(`ALTER TABLE \`${table}\` DROP COLUMN \`${col}\``))
      } catch {
        // Column may not exist — ignore
      }
    }
  }
}
