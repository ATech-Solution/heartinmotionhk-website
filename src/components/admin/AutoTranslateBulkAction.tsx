'use client'

import { useState } from 'react'
import { useSelection } from '@payloadcms/ui'

// Registered via beforeList on Pages collection — collection slug is always 'pages'
const COLLECTION = 'pages'

export default function AutoTranslateBulkAction() {
  const { selected, toggleAll } = useSelection()
  const [status, setStatus] = useState<'idle' | 'running' | 'done'>('idle')
  const [progress, setProgress] = useState(0)
  const [successCount, setSuccessCount] = useState(0)
  const [errors, setErrors] = useState<string[]>([])

  const selectedIds = Array.from(selected.entries())
    .filter(([, checked]) => checked)
    .map(([id]) => String(id))

  const total = selectedIds.length

  async function handleBulkTranslate() {
    if (total === 0) return
    setStatus('running')
    setProgress(0)
    setSuccessCount(0)
    setErrors([])

    let ok = 0
    const errs: string[] = []

    for (let i = 0; i < selectedIds.length; i++) {
      const id = selectedIds[i]
      try {
        const res = await fetch('/api/admin/auto-translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, collection: COLLECTION }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error ?? 'Translation failed')
        ok++
      } catch (err) {
        errs.push(`${id}: ${err instanceof Error ? err.message : 'failed'}`)
      }
      setProgress(i + 1)
    }

    setSuccessCount(ok)
    setErrors(errs)
    setStatus('done')
    toggleAll(false)
  }

  if (total === 0) return null

  if (status === 'running') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#1a3a6e' }}>
        <span>⏳ Translating {progress} / {total}…</span>
      </div>
    )
  }

  if (status === 'done') {
    return (
      <div style={{ fontSize: 13 }}>
        <span style={{ color: '#15803d' }}>
          ✅ {successCount} page{successCount !== 1 ? 's' : ''} translated.
        </span>
        {errors.length > 0 && (
          <span style={{ color: '#b91c1c', marginLeft: 8 }}>
            {errors.length} error{errors.length !== 1 ? 's' : ''}: {errors.join('; ')}
          </span>
        )}
        <button
          onClick={() => setStatus('idle')}
          style={{
            marginLeft: 12,
            fontSize: 12,
            cursor: 'pointer',
            background: 'none',
            border: 'none',
            color: '#6b7280',
            textDecoration: 'underline',
          }}
        >
          Dismiss
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={handleBulkTranslate}
      style={{
        padding: '6px 14px',
        background: '#2563eb',
        color: '#fff',
        border: 'none',
        borderRadius: 6,
        cursor: 'pointer',
        fontSize: 13,
        fontWeight: 500,
      }}
    >
      🌐 Translate → 繁中 ({total})
    </button>
  )
}
