'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface Locale {
  code: string
  label: string
}

interface LanguageSwitcherProps {
  activeLocales: Locale[]
  currentLocale: string
}

function ChevronDown({ rotated }: { rotated: boolean }) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      style={{
        display: 'inline-block',
        transform: rotated ? 'rotate(180deg)' : 'none',
        transition: 'transform 0.2s cubic-bezier(0.4,0,0.2,1)',
        flexShrink: 0,
      }}
    >
      <path
        d="M2 3.5L5 6.5L8 3.5"
        stroke="#171717"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function DropdownOption({
  locale,
  isCurrent,
  onSelect,
}: {
  locale: Locale
  isCurrent: boolean
  onSelect: (code: string) => void
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <button
      role="option"
      aria-selected={isCurrent}
      onClick={() => onSelect(locale.code)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        width: '100%',
        padding: '8px 12px',
        borderRadius: 7,
        border: 'none',
        cursor: 'pointer',
        fontFamily: 'var(--font-inter, "Inter", sans-serif)',
        fontSize: 14,
        fontWeight: isCurrent ? 600 : 400,
        color: '#171717',
        background: hovered ? 'rgba(0,0,0,0.04)' : 'transparent',
        transition: 'background 0.12s',
        textAlign: 'left',
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.04em', minWidth: 22 }}>
        {locale.code.toUpperCase()}
      </span>
      <span style={{ opacity: 0.55, fontSize: 13 }}>{locale.label}</span>
      {isCurrent && (
        <svg style={{ marginLeft: 'auto', flexShrink: 0 }} width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M2.5 7l3 3 6-6" stroke="#171717" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  )
}

export function LanguageSwitcher({ activeLocales, currentLocale }: LanguageSwitcherProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function switchLocale(code: string) {
    if (code === currentLocale) { setOpen(false); return }
    const segments = pathname.split('/')
    segments[1] = code
    const newPath = segments.join('/') || `/${code}`
    document.cookie = `NEXT_LOCALE=${code}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`
    setOpen(false)
    router.push(newPath)
  }

  if (activeLocales.length < 2) return null

  const current = activeLocales.find((l) => l.code === currentLocale) ?? activeLocales[0]

  return (
    <div ref={ref} style={{ position: 'relative', flexShrink: 0 }}>
      <button
        onClick={() => setOpen(!open)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Language selector"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          padding: '5px 10px',
          borderRadius: 6,
          height: 32,
          fontSize: 13,
          fontWeight: 600,
          fontFamily: 'var(--font-inter, "Inter", sans-serif)',
          letterSpacing: '0.04em',
          background: '#ffffff',
          color: '#171717',
          border: '1px solid #171717',
          cursor: 'pointer',
          transition: 'background 0.15s',
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.04)' }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '#ffffff' }}
      >
        {current.code.toUpperCase()}
        <ChevronDown rotated={open} />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Select language"
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: '50%',
            transform: 'translateX(-50%)',
            minWidth: 160,
            background: '#ffffff',
            border: '1px solid #e5e5e5',
            borderRadius: 10,
            boxShadow: '0 8px 24px -4px rgba(0,0,0,0.12), 0 2px 8px -2px rgba(0,0,0,0.06)',
            padding: 6,
            zIndex: 200,
          }}
        >
          {activeLocales.map((locale) => (
            <DropdownOption
              key={locale.code}
              locale={locale}
              isCurrent={locale.code === currentLocale}
              onSelect={switchLocale}
            />
          ))}
        </div>
      )}
    </div>
  )
}
