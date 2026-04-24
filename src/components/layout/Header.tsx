'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { LocaleSwitcher } from '@/components/language/LocaleSwitcher'

const SOCIAL_ICONS: Record<string, string> = {
  facebook: 'f',
  linkedin: 'in',
  instagram: '📷',
  whatsapp: '💬',
}

interface NavItem {
  label?: string
  linkType?: string
  page?: { slug?: string } | null
  url?: string
}

interface CtaButton {
  label?: string
  url?: string
  style?: string
}

interface HeaderProps {
  header?: {
    logo?: any
    navItems?: NavItem[]
    ctaButtons?: CtaButton[]
  } | null
  general?: any
  locale?: string
}

function getPagePath(slug?: string) {
  if (!slug || slug === 'home') return '/'
  return `/${slug}`
}

export function SiteHeader({ header, general, locale }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const logoUrl = header?.logo?.url ?? null
  const navItems = header?.navItems ?? []
  const ctaButtons = header?.ctaButtons ?? []

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-brand-beige-dark shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          {logoUrl ? (
            <Image src={logoUrl} alt={general?.siteName ?? 'Heart in Motion HK'} width={120} height={48} className="h-12 w-auto object-contain" />
          ) : (
            <span className="font-display text-xl text-brand-dark">Heart in Motion</span>
          )}
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item, i) => {
            const href = item.linkType === 'external'
              ? (item.url ?? '#')
              : getPagePath(typeof item.page === 'object' ? item.page?.slug : undefined)
            return (
              <Link
                key={i}
                href={href}
                className="text-sm text-brand-dark/70 hover:text-brand-teal transition-colors duration-150 font-medium"
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* CTA Buttons + Locale */}
        <div className="hidden md:flex items-center gap-3">
          <LocaleSwitcher currentLocale={locale ?? 'en'} />
          {ctaButtons.map((btn, i) => (
            <a
              key={i}
              href={btn.url ?? '#'}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-150
                ${btn.style === 'secondary'
                  ? 'bg-brand-yellow text-brand-dark hover:bg-brand-yellow-light'
                  : 'bg-brand-teal text-white hover:bg-brand-teal-dark'
                }`}
            >
              {btn.label}
              <span className="text-base leading-none">›</span>
            </a>
          ))}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 text-brand-dark"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <div className="w-5 space-y-1.5">
            <span className={`block h-0.5 bg-current transition-all duration-200 ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block h-0.5 bg-current transition-all duration-200 ${mobileOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 bg-current transition-all duration-200 ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </div>
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-brand-beige-dark bg-white px-6 py-4 space-y-3">
          {navItems.map((item, i) => {
            const href = item.linkType === 'external'
              ? (item.url ?? '#')
              : getPagePath(typeof item.page === 'object' ? item.page?.slug : undefined)
            return (
              <Link
                key={i}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="block text-sm text-brand-dark/70 hover:text-brand-teal py-1"
              >
                {item.label}
              </Link>
            )
          })}
          <div className="pt-2 flex flex-col gap-2">
            {ctaButtons.map((btn, i) => (
              <a
                key={i}
                href={btn.url ?? '#'}
                className={`text-center px-4 py-2.5 rounded-full text-sm font-semibold
                  ${btn.style === 'secondary'
                    ? 'bg-brand-yellow text-brand-dark'
                    : 'bg-brand-teal text-white'
                  }`}
              >
                {btn.label}
              </a>
            ))}
            <LocaleSwitcher currentLocale={locale ?? 'en'} />
          </div>
        </div>
      )}
    </header>
  )
}
