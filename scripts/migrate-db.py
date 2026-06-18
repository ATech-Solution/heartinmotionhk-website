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

conn.commit()
conn.close()
print("[migrate-db] All schema migrations complete.")
