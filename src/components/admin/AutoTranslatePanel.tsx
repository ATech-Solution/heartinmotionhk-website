'use client'

import { useState } from 'react'
import { useDocumentInfo } from '@payloadcms/ui'

export default function AutoTranslatePanel() {
  const { id, collectionSlug } = useDocumentInfo()
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleTranslate() {
    if (!id) return
    setStatus('loading')
    setMessage('')
    try {
      const res = await fetch('/api/admin/auto-translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, collection: collectionSlug }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Translation failed')
      setStatus('success')
      setMessage(`${data.fieldsTranslated} fields translated. Switch to 繁中 tab to review.`)
      setTimeout(() => {
        setStatus('idle')
        setMessage('')
      }, 8000)
    } catch (err) {
      setStatus('error')
      setMessage(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  if (!id) return null

  return (
    <div
      style={{
        padding: '12px 16px',
        marginBottom: 16,
        background: '#f0f4ff',
        border: '1px solid #c7d5f0',
        borderRadius: 8,
        fontFamily: 'sans-serif',
      }}
    >
      <p style={{ fontSize: 13, fontWeight: 600, margin: '0 0 10px 0', color: '#1a3a6e' }}>
        🌐 AI Translation
      </p>
      <button
        onClick={handleTranslate}
        disabled={status === 'loading'}
        style={{
          padding: '8px 16px',
          background: status === 'loading' ? '#9aaecf' : '#2563eb',
          color: '#fff',
          border: 'none',
          borderRadius: 6,
          cursor: status === 'loading' ? 'not-allowed' : 'pointer',
          fontSize: 13,
          fontWeight: 500,
          width: '100%',
        }}
      >
        {status === 'loading' ? '⏳ Translating…' : 'Translate to 繁體中文'}
      </button>
      {message && (
        <p
          style={{
            marginTop: 10,
            marginBottom: 0,
            fontSize: 12,
            color: status === 'error' ? '#b91c1c' : '#15803d',
            lineHeight: 1.4,
          }}
        >
          {status === 'error' ? '❌ ' : '✅ '}
          {message}
        </p>
      )}
    </div>
  )
}
