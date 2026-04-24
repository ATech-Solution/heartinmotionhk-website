'use client'

import { useState } from 'react'

export default function BackupRestoreView() {
  const [restoreFile, setRestoreFile] = useState<File | null>(null)
  const [restoreLoading, setRestoreLoading] = useState(false)
  const [restoreMessage, setRestoreMessage] = useState<string | null>(null)
  const [restoreError, setRestoreError] = useState<string | null>(null)

  async function handleRestore(e: React.FormEvent) {
    e.preventDefault()
    if (!restoreFile) return
    setRestoreLoading(true)
    setRestoreMessage(null)
    setRestoreError(null)

    const form = new FormData()
    form.append('database', restoreFile)

    try {
      const res = await fetch('/api/admin/restore', { method: 'POST', body: form })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error ?? 'Restore failed')
      setRestoreMessage(data.message)
    } catch (err: any) {
      setRestoreError(err.message)
    } finally {
      setRestoreLoading(false)
    }
  }

  return (
    <div style={{ padding: '2rem', maxWidth: 600 }}>
      <h1 style={{ fontFamily: 'Caveat, cursive', fontSize: 32, marginBottom: 8 }}>
        Backup & Restore
      </h1>
      <p style={{ color: '#666', marginBottom: 32, fontSize: 14 }}>
        Download a full database backup or restore from a previous backup file.
      </p>

      {/* Backup */}
      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Download Backup</h2>
        <p style={{ fontSize: 13, color: '#888', marginBottom: 16 }}>
          Downloads the current SQLite database as a <code>.db</code> file. Use for full system backups.
        </p>
        <a
          href="/api/admin/backup"
          download
          style={{
            display: 'inline-block',
            padding: '10px 24px',
            background: '#6dbfb8',
            color: 'white',
            borderRadius: 999,
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: 14,
          }}
        >
          ↓ Download Database Backup
        </a>
      </section>

      {/* Restore */}
      <section>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Restore from Backup</h2>
        <p style={{ fontSize: 13, color: '#e53e3e', marginBottom: 16, background: '#fff5f5', padding: '8px 12px', borderRadius: 8, border: '1px solid #fed7d7' }}>
          ⚠️ Warning: This will replace the current database. A pre-restore backup is created automatically. Restart the server after restoring.
        </p>
        <form onSubmit={handleRestore} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            type="file"
            accept=".db"
            onChange={(e) => setRestoreFile(e.target.files?.[0] ?? null)}
            style={{ fontSize: 13 }}
          />
          <button
            type="submit"
            disabled={!restoreFile || restoreLoading}
            style={{
              padding: '10px 24px',
              background: restoreFile ? '#e53e3e' : '#ccc',
              color: 'white',
              border: 'none',
              borderRadius: 999,
              fontWeight: 600,
              fontSize: 14,
              cursor: restoreFile ? 'pointer' : 'not-allowed',
              width: 'fit-content',
            }}
          >
            {restoreLoading ? 'Restoring…' : '↑ Restore Database'}
          </button>
        </form>
        {restoreMessage && (
          <p style={{ color: '#38a169', marginTop: 12, fontSize: 14 }}>✅ {restoreMessage}</p>
        )}
        {restoreError && (
          <p style={{ color: '#e53e3e', marginTop: 12, fontSize: 14 }}>❌ {restoreError}</p>
        )}
      </section>
    </div>
  )
}
