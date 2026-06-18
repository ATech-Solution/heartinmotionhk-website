#!/usr/bin/env python3
"""
Schema migration runner — pure Python, no npm, no native Node binaries.
Python3 + sqlite3 are available on any Ubuntu server.
All operations are idempotent (safe to run on every deploy).
"""
import sqlite3
import os
import sys

db_url = os.environ.get("DATABASE_URL", "file:./data/payload.db")
# Strip the "file:" prefix and any leading slashes for relative paths
db_path = db_url.replace("file://", "").replace("file:", "")

print(f"[migrate-db] Connecting to {db_path}")

try:
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
except Exception as e:
    print(f"[migrate-db] ERROR: Cannot open database: {e}", file=sys.stderr)
    sys.exit(1)


def table_exists(name):
    row = conn.execute(
        "SELECT name FROM sqlite_master WHERE type='table' AND name=?", (name,)
    ).fetchone()
    return row is not None


def column_exists(table, column):
    rows = conn.execute(f"PRAGMA table_info(`{table}`)").fetchall()
    return any(r["name"] == column for r in rows)


def add_column(table, column, definition):
    if not column_exists(table, column):
        print(f"[migrate-db]   + {table}.{column}")
        conn.execute(f"ALTER TABLE `{table}` ADD `{column}` {definition}")


# ── ai_settings table ────────────────────────────────────────────────────────
if not table_exists("ai_settings"):
    print("[migrate-db] Creating ai_settings table...")
    conn.execute("""
        CREATE TABLE IF NOT EXISTS `ai_settings` (
            `id`                 integer PRIMARY KEY NOT NULL,
            `enabled`            integer DEFAULT 1,
            `anthropic_api_key`  text,
            `model`              text DEFAULT 'claude-haiku-4-5-20251001',
            `updated_at`         text,
            `created_at`         text
        )
    """)

# ── header: language switcher columns ────────────────────────────────────────
if table_exists("header"):
    add_column("header", "language_switcher_en_label", "text DEFAULT 'EN'")
    add_column("header", "language_switcher_zh_label", "text DEFAULT '简中'")
    add_column("header", "language_switcher_show",     "integer DEFAULT 1")

# ── contact form: formLabels columns ─────────────────────────────────────────
form_tables = [
    "pages_blocks_contact_form_locales",
    "_pages_v_blocks_contact_form_locales",
]
form_cols = [
    ("form_labels_full_name",            "text DEFAULT 'Full Name'"),
    ("form_labels_email",                "text DEFAULT 'Email Address'"),
    ("form_labels_phone",                "text DEFAULT 'Phone Number'"),
    ("form_labels_subject",              "text DEFAULT 'Subject'"),
    ("form_labels_message",              "text DEFAULT 'Tell us how we can help'"),
    ("form_labels_submit",               "text DEFAULT 'Submit'"),
    ("form_labels_sending",              "text DEFAULT 'Sending…'"),
    ("form_labels_success_title",        "text DEFAULT 'Thank you!'"),
    ("form_labels_success_message",      "text DEFAULT 'Your message has been sent. We''ll be in touch soon.'"),
    ("form_labels_error_message",        "text DEFAULT 'Something went wrong. Please try again.'"),
    ("form_labels_validation_required",  "text DEFAULT 'This field is required.'"),
    ("form_labels_validation_email",     "text DEFAULT 'Please enter a valid email address.'"),
    ("form_labels_validation_phone",     "text DEFAULT 'Please enter a valid phone number.'"),
]
for tbl in form_tables:
    if table_exists(tbl):
        for col, defn in form_cols:
            add_column(tbl, col, defn)

# ── hero locales: subheadline_mobile ────────────────────────────────────────
for tbl in ("pages_blocks_hero_locales", "_pages_v_blocks_hero_locales"):
    if table_exists(tbl):
        add_column(tbl, "subheadline_mobile", "text")

# ── real_challenge locales: body_mobile ─────────────────────────────────────
for tbl in ("pages_blocks_real_challenge_locales", "_pages_v_blocks_real_challenge_locales"):
    if table_exists(tbl):
        add_column(tbl, "body_mobile", "text")

# ── about_him locales: body ──────────────────────────────────────────────────
for tbl in ("pages_blocks_about_him_locales", "_pages_v_blocks_about_him_locales"):
    if table_exists(tbl):
        add_column(tbl, "body", "text")

# ── booking_session: button_url ──────────────────────────────────────────────
for tbl in ("pages_blocks_booking_session", "_pages_v_blocks_booking_session"):
    if table_exists(tbl):
        add_column(tbl, "button_url", "text")

# ── booking_session locales: section_title, section_subtitle, quote, body, button_label ──
booking_session_locale_cols = [
    ("section_title",  "text DEFAULT 'Booking Session'"),
    ("section_subtitle", "text"),
    ("quote",          "text"),
    ("body",           "text"),
    ("button_label",   "text DEFAULT 'Book a session'"),
]
for tbl in ("pages_blocks_booking_session_locales", "_pages_v_blocks_booking_session_locales"):
    if table_exists(tbl):
        for col, defn in booking_session_locale_cols:
            add_column(tbl, col, defn)

# ── values_values: icon_id ───────────────────────────────────────────────────
for tbl in ("pages_blocks_values_values", "_pages_v_blocks_values_values"):
    if table_exists(tbl):
        add_column(tbl, "icon_id", "integer REFERENCES `media`(`id`) ON DELETE set null")

# ── testimonials: order ──────────────────────────────────────────────────────
if table_exists("testimonials"):
    add_column("testimonials", "order", "numeric DEFAULT 0")

# ── general_settings: admin_logo_id ─────────────────────────────────────────
if table_exists("general_settings"):
    add_column("general_settings", "admin_logo_id", "integer REFERENCES `media`(`id`) ON DELETE set null")

# ── maintenance_settings: logo_id ────────────────────────────────────────────
if table_exists("maintenance_settings"):
    add_column("maintenance_settings", "logo_id", "integer REFERENCES `media`(`id`) ON DELETE set null")

# ── localized URL fields: cta_url in block locales tables ───────────────────
cta_url_tables = [
    "pages_blocks_hero_locales",
    "pages_blocks_cta_locales",
    "pages_blocks_services_overview_locales",
    "_pages_v_blocks_hero_locales",
    "_pages_v_blocks_cta_locales",
    "_pages_v_blocks_services_overview_locales",
]
for tbl in cta_url_tables:
    if table_exists(tbl):
        add_column(tbl, "cta_url", "text")

# about_shortcut has a default
for tbl in ("pages_blocks_about_shortcut_locales", "_pages_v_blocks_about_shortcut_locales"):
    if table_exists(tbl):
        add_column(tbl, "cta_url", "text DEFAULT '/about'")

# booking_session services: whatsapp_url and email
for tbl in ("pages_blocks_booking_session_services_locales", "_pages_v_blocks_booking_session_services_locales"):
    if table_exists(tbl):
        add_column(tbl, "whatsapp_url", "text")
        add_column(tbl, "email", "text")

# Copy existing non-localized cta_url values into en locale rows (data preservation)
copy_map = [
    ("pages_blocks_hero_locales",              "pages_blocks_hero",              "cta_url"),
    ("pages_blocks_cta_locales",               "pages_blocks_cta",               "cta_url"),
    ("pages_blocks_services_overview_locales", "pages_blocks_services_overview", "cta_url"),
    ("pages_blocks_about_shortcut_locales",    "pages_blocks_about_shortcut",    "cta_url"),
]
for locale_tbl, parent_tbl, col in copy_map:
    if table_exists(locale_tbl) and table_exists(parent_tbl) and column_exists(parent_tbl, col):
        print(f"[migrate-db]   copy {parent_tbl}.{col} → {locale_tbl} (en)")
        conn.execute(f"""
            UPDATE `{locale_tbl}`
            SET `{col}` = (
                SELECT `{col}` FROM `{parent_tbl}`
                WHERE `{parent_tbl}`.`id` = `{locale_tbl}`.`_parent_id`
            )
            WHERE `_locale` = 'en' AND `{col}` IS NULL
        """)

for locale_tbl, parent_tbl in [
    ("pages_blocks_booking_session_services_locales", "pages_blocks_booking_session_services"),
]:
    if table_exists(locale_tbl) and table_exists(parent_tbl):
        for col in ("whatsapp_url", "email"):
            if column_exists(parent_tbl, col):
                print(f"[migrate-db]   copy {parent_tbl}.{col} → {locale_tbl} (en)")
                conn.execute(f"""
                    UPDATE `{locale_tbl}`
                    SET `{col}` = (
                        SELECT `{col}` FROM `{parent_tbl}`
                        WHERE `{parent_tbl}`.`id` = `{locale_tbl}`.`_parent_id`
                    )
                    WHERE `_locale` = 'en' AND `{col}` IS NULL
                """)

conn.commit()
conn.close()
print("[migrate-db] All schema migrations complete.")
