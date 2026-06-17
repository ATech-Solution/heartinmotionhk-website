'use client'

import React, { useEffect, useState } from 'react'

type LocaleStatus = { total: number; translated: number }
type TranslationResults = Record<string, Record<string, LocaleStatus>>

interface StatusData {
  locales: string[]
  results: TranslationResults
}

const COLLECTION_LABELS: Record<string, string> = {
  pages: 'Pages',
  services: 'Services',
}

function StatusBadge({ status }: { status: LocaleStatus }) {
  if (status.total === 0) return <span style={{ color: '#9ca3af', fontSize: 13 }}>—</span>

  const pct = Math.round((status.translated / status.total) * 100)
  const color = pct === 100 ? '#16a34a' : pct >= 50 ? '#d97706' : '#dc2626'
  const icon = pct === 100 ? '✅' : pct >= 50 ? '⚠️' : '❌'

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <span>{icon}</span>
      <span style={{ fontSize: 13, color }}>
        {status.translated}/{status.total} ({pct}%)
      </span>
    </span>
  )
}

export function TranslationManagerView() {
  const [data, setData] = useState<StatusData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/plugins/multilanguage/translation-status?locales=en,zh-HK')
      .then((r) => r.json())
      .then(setData)
      .catch(() => setError('Failed to load translation status'))
      .finally(() => setLoading(false))
  }, [])

  const containerStyle: React.CSSProperties = { padding: '32px 40px', maxWidth: 900, fontFamily: 'system-ui, sans-serif' }
  const headingStyle: React.CSSProperties = { fontSize: 22, fontWeight: 700, marginBottom: 8, color: '#111' }
  const tableStyle: React.CSSProperties = { width: '100%', borderCollapse: 'collapse', marginTop: 24 }
  const thStyle: React.CSSProperties = { textAlign: 'left', padding: '10px 16px', background: '#f9fafb', borderBottom: '1px solid #e5e7eb', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6b7280' }
  const tdStyle: React.CSSProperties = { padding: '12px 16px', borderBottom: '1px solid #f3f4f6', verticalAlign: 'middle' }

  if (loading) return <div style={containerStyle}><h1 style={headingStyle}>Translation Manager</h1><p style={{ color: '#6b7280', marginTop: 24 }}>Loading…</p></div>
  if (error || !data) return <div style={containerStyle}><h1 style={headingStyle}>Translation Manager</h1><p style={{ color: '#dc2626', marginTop: 24 }}>{error ?? 'No data'}</p></div>

  const locales = data.locales.length > 0 ? data.locales : ['en', 'zh-HK']

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>Translation Manager</h1>
      <p style={{ color: '#6b7280', marginBottom: 0, fontSize: 14 }}>Translation completeness per collection and locale.</p>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Collection</th>
            {locales.map((loc) => <th key={loc} style={{ ...thStyle, textAlign: 'center' }}>{loc.toUpperCase()}</th>)}
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(data.results).map(([collection, localeMap]) => (
            <tr key={collection}>
              <td style={{ ...tdStyle, fontWeight: 600 }}>{COLLECTION_LABELS[collection] ?? collection}</td>
              {locales.map((loc) => (
                <td key={loc} style={{ ...tdStyle, textAlign: 'center' }}>
                  <StatusBadge status={localeMap[loc] ?? { total: 0, translated: 0 }} />
                </td>
              ))}
              <td style={tdStyle}>
                <a href={`/admin/collections/${collection}`} style={{ fontSize: 13, color: '#2563eb', textDecoration: 'none', fontWeight: 500 }}>
                  Translate →
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: 32, display: 'flex', gap: 24, fontSize: 13, color: '#9ca3af' }}>
        <span>✅ 100% translated</span>
        <span>⚠️ Partial</span>
        <span>❌ Not translated</span>
      </div>
    </div>
  )
}
