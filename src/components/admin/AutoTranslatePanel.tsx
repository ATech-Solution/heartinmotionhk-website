'use client'

import { useState, useEffect } from 'react'
import { useDocumentInfo } from '@payloadcms/ui'

export default function AutoTranslatePanel() {
  const { id, collectionSlug, globalSlug } = useDocumentInfo()
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [aiEnabled, setAiEnabled] = useState<boolean | null>(null)

  useEffect(() => {
    fetch('/api/admin/auto-translate')
      .then((r) => r.json())
      .then((d) => setAiEnabled(Boolean(d.enabled)))
      .catch(() => setAiEnabled(false))
  }, [])

  const isGlobal = Boolean(globalSlug)
  const canTranslate = isGlobal || Boolean(id)

  // Hidden while checking, and when disabled in AI Settings
  if (aiEnabled === null || !aiEnabled) return null

  async function handleTranslate() {
    if (!canTranslate) return
    setStatus('loading')
    setMessage('')
    try {
      const body = isGlobal
        ? { globalSlug }
        : { id, collection: collectionSlug }

      const res = await fetch('/api/admin/auto-translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Translation failed')
      setStatus('success')
      setMessage(`✅ ${data.fieldsTranslated} fields translated. Switching to 简体中文…`)
      // Redirect to zh-CN locale immediately so the admin loads the translated
      // draft before autosave can create a newer version without zh-CN data.
      setTimeout(() => {
        const url = new URL(window.location.href)
        url.searchParams.set('locale', 'zh-CN')
        window.location.href = url.toString()
      }, 1500)
    } catch (err) {
      setStatus('error')
      setMessage(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

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
      {!canTranslate ? (
        <p style={{ fontSize: 12, color: '#6b7280', margin: 0 }}>
          Save the document first to enable translation.
        </p>
      ) : (
        <>
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
            {status === 'loading' ? '⏳ Translating…' : 'Translate to 简体中文'}
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
        </>
      )}
    </div>
  )
}
