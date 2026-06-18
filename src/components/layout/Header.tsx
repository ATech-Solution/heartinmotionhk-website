'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LocaleSwitcher } from '@/components/language/LocaleSwitcher'

interface NavItem {
  label?: string
  linkType?: string | null
  page?: { slug?: string } | number | null
  url?: string | null
  id?: string | null
}

interface CtaButton {
  label?: string
  url?: string | null
  style?: string | null
  id?: string | null
}

interface MobileCta {
  connectLabel?: string | null
  connectUrl?: string | null
  emailLabel?: string | null
  emailUrl?: string | null
}

interface Locale {
  code: string
  label: string
}

interface HeaderProps {
  header?: {
    logo?: any
    navItems?: NavItem[] | null
    ctaButtons?: CtaButton[] | null
    mobileCta?: MobileCta | null
    languageSwitcher?: { show?: boolean | null; enLabel?: string | null; zhLabel?: string | null } | null
  } | null
  general?: any
  locale?: string
  activeLocales?: Locale[]
}

function getPagePath(slug?: string, locale = 'en') {
  if (!slug || slug === 'home') return `/${locale}`
  return `/${locale}/${slug}`
}

export function SiteHeader({ header, general, locale, activeLocales = [] }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  const logoUrl = header?.logo?.url ?? null
  const navItems = header?.navItems ?? []
  const ctaButtons = header?.ctaButtons ?? []
  const mobileCta = header?.mobileCta
  const showSwitcher = header?.languageSwitcher?.show !== false
  const enLabel = header?.languageSwitcher?.enLabel || 'EN'
  const zhLabel = header?.languageSwitcher?.zhLabel || '简中'

  const siteName = general?.siteName ?? null
  const siteTagline = general?.siteTagline ?? null
  const connectUrl = mobileCta?.connectUrl ?? general?.bookingUrl ?? '#'
  const emailUrl = mobileCta?.emailUrl ?? (general?.contactEmail ? `mailto:${general.contactEmail}` : '#')
  const connectLabel = mobileCta?.connectLabel ?? "Let's connect"
  const emailLabel = mobileCta?.emailLabel ?? 'Email me'

  return (
    <header className="sticky top-0 z-50 headerBlock">
      {/* Desktop header — beige background */}
      <div className="hidden lg:block bg-[#f5eded] h-[110px]">
        <div className="max-w-[1250px] mx-auto px-12 lg:px-12 xl:px-0 xl:px-0 h-full flex items-center justify-between">
          {/* Logo */}
          <Link href={`/${locale ?? 'en'}`} className="flex items-center gap-2.5 flex-shrink-0">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={general?.siteName ?? 'Heart in Motion HK'}
                width={168}
                height={50}
                className="h-12 w-auto object-contain"
              />
            ) : (
              <span className="font-display text-[27px] text-[#3f3e3e] leading-tight">
                {siteName}<br/>
                {siteTagline}
              </span>
            )}
          </Link>

          <div className="flex gap-[20px] md:gap-[20px] lg:gap-[20px] xl:gap-[60px]">
            {/* Desktop Nav */}
            <nav className="flex items-center gap-[20px] md:gap-[20px] lg:gap-[20px] xl:gap-[60px]">
              {navItems.map((item, i) => {
                const href =
                  item.linkType === 'external'
                    ? (item.url ?? '#')
                    : getPagePath(typeof item.page === 'object' ? item.page?.slug : undefined, locale ?? 'en')
                const isActive = pathname === href
                return (
                  <Link
                    key={i}
                    href={href}
                    className={`text-[18px] text-[#000033] transition-colors duration-150 hover:font-scale ${
                      isActive ? 'font-bold' : 'font-normal'
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>

            {/* Locale switcher */}
            <div className="flex items-center gap-3">
              {showSwitcher && (
                <div>
                  <LocaleSwitcher currentLocale={locale ?? 'en'} enLabel={enLabel} zhLabel={zhLabel} />
                </div>
              )}
              <div className="px-4 flex gap-3">
                {ctaButtons.length > 0 ? (
                  ctaButtons.map((btn, i) => {
                    const isPrimary = (btn.style ?? 'primary') === 'primary'
                    return (
                      <div key={btn.id ?? i} className="group transition-all duration-300">
                        <a
                          href={btn.url ?? '#'}
                          className={`flex items-center justify-center px-4 xl:px-6 lg:gap-1 xl:gap-5 h-10 rounded-[15px] text-[14px] lg:text-[14px] xl:text-[16px] font-bold text-black group-hover:text-white transition-all ${
                            isPrimary
                              ? 'bg-[#8ec0bd] group-hover:bg-[#6C9A97]'
                              : 'bg-[#fae17a] group-hover:bg-[#9C8A40]'
                          }`}
                        >
                          {btn.label}
                          <img src="/icon/angle-right.svg" alt="" className="w-[20px] h-[20px] flex-shrink-0 group-hover:invert [filter:drop-shadow(0.5px_0px_0px_black)_drop-shadow(-0.5px_0px_0px_black)] transition-all" aria-hidden="true" />
                        </a>
                      </div>
                    )
                  })
                ) : (
                  <>
                    <div className="group transition-all duration-300">
                      <a
                        href={connectUrl}
                        className="flex items-center justify-center px-4 xl:px-6 lg:gap-1 xl:gap-5 h-10 bg-[#8ec0bd] rounded-[15px] text-[14px] lg:text-[14px] xl:text-[16px] font-bold text-black group-hover:text-white group-hover:bg-[#6C9A97]"
                      >
                        {connectLabel}
                        <img src="/icon/angle-right.svg" alt="" className="w-[20px] h-[20px] flex-shrink-0 group-hover:invert [filter:drop-shadow(0.5px_0px_0px_black)_drop-shadow(-0.5px_0px_0px_black)] transition-all" aria-hidden="true" />
                      </a>
                    </div>
                    <div className="group transition-all duration-300">
                      <a
                        href={emailUrl}
                        className="flex items-center justify-center px-6 xl:px-6 lg:gap-1 xl:gap-5 h-10 bg-[#fae17a] rounded-[15px] text-[14px] lg:text-[14px] xl:text-[16px] font-bold text-black group-hover:text-white group-hover:bg-[#9C8A40]"
                      >
                        {emailLabel}
                        <img src="/icon/angle-right.svg" alt="" className="w-[20px] h-[20px] flex-shrink-0 group-hover:invert [filter:drop-shadow(0.5px_0px_0px_black)_drop-shadow(-0.5px_0px_0px_black)] transition-all" aria-hidden="true" />
                      </a>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        
        </div>
      </div>

      {/* Tablet header */}
      <div className="hidden md:flex lg:hidden bg-[#f5eded] h-[80px] items-center px-8 justify-between">
        <Link href={`/${locale ?? 'en'}`} className="flex items-center gap-2 flex-shrink-0">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={general?.siteName ?? 'Heart in Motion HK'}
              width={168}
              height={50}
              className="h-10 w-auto object-contain"
            />
          ) : (
            <span className="font-display text-[22px] text-[#3f3e3e] leading-tight">
              {siteName}<br />
              {siteTagline}
            </span>
          )}
        </Link>

        <nav className="flex items-center gap-6">
          {navItems.map((item, i) => {
            const href =
              item.linkType === 'external'
                ? (item.url ?? '#')
                : getPagePath(typeof item.page === 'object' ? item.page?.slug : undefined, locale)
            const isActive = pathname === href
            return (
              <Link
                key={i}
                href={href}
                className={`text-[15px] text-[#000033] transition-colors hover:text-brand-teal ${
                  isActive ? 'font-bold' : 'font-normal'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        {showSwitcher && (
          <div>
            <LocaleSwitcher currentLocale={locale ?? 'en'} enLabel={enLabel} zhLabel={zhLabel} />
          </div>
        )}

      </div>

      {/* Mobile header — white background */}
      <div className="md:hidden bg-white h-[80px] flex items-center px-4 justify-between">
        {/* Logo */}
        <Link href={locale ? `/${locale}` : '/'} className="flex items-center gap-2.5 flex-shrink-0">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={general?.siteName ?? 'Heart in Motion HK'}
              width={168}
              height={50}
              className="h-12 w-auto object-contain"
            />
          ) : (
            <span className="font-display text-[27px] text-[#3f3e3e] leading-tight">
              {siteName}<br />
              {siteTagline}
            </span>
          )}
        </Link>

        {/* Hamburger */}
        <button
          className="py-2 px-1.5 text-black bg-[#f2f2f2] rounded-sm"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <div className="w-5 space-y-[3px]">
            <span
              className={`block h-0.75 rounded-sm bg-current transition-all duration-200 origin-center ${
                mobileOpen ? 'rotate-45 translate-y-[6px]' : ''
              }`}
            />
            <span
              className={`block h-0.75 rounded-sm bg-current transition-all duration-200 ${
                mobileOpen ? 'opacity-0 scale-x-0' : ''
              }`}
            />
            <span
              className={`block h-0.75 rounded-sm bg-current transition-all duration-200 origin-center ${
                mobileOpen ? '-rotate-45 -translate-y-[6px]' : ''
              }`}
            />
          </div>
        </button>
      </div>

      {/* Mobile menu drawer */}
      <div
        className={`md:hidden bg-white overflow-hidden transition-all duration-300 ease-in-out ${
          mobileOpen ? 'max-h-[600px] opacity-100 duration-500 ease-in-out' : 'max-h-0 opacity-0 duration-300 ease-in-out'
        }`}
      >
        {/* Nav links */}
        <nav className="space-y-1">
          {navItems.map((item, i) => {
            const href =
              item.linkType === 'external'
                ? (item.url ?? '#')
                : getPagePath(typeof item.page === 'object' ? item.page?.slug : undefined, locale)
            const isActive = pathname === href
            return (
              <Link
                key={i}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`block text-[18px] font-bold transition-colors px-8 py-6 ${
                  isActive ? 'bg-[#3f444c] text-white' : 'bg-white text-black'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        {showSwitcher && (
          <div className="pt-2 border-t border-gray-100 w-[100px] mx-auto">
            <LocaleSwitcher currentLocale={locale ?? 'en'} enLabel={enLabel} zhLabel={zhLabel} />
          </div>
        )}
      </div>

      {/* Mobile CTA bar — always visible below mobile navbar */}
      <div className="mobile-cta lg:hidden bg-white px-4 pb-3 flex flex-col gap-3 pt-3">
        <a
          href={connectUrl}
          className="flex items-center justify-center gap-5 h-10 bg-[#8ec0bd] rounded-[15px] text-[16px] font-bold text-black"
        >
          {connectLabel}
          <img src="/icon/angle-right.svg" alt="" className="w-[20px] h-[20px] flex-shrink-0 [filter:drop-shadow(0.5px_0px_0px_black)_drop-shadow(-0.5px_0px_0px_black)]" aria-hidden="true" />
        </a>
        <a
          href={emailUrl}
          className="flex items-center justify-center gap-5 h-10 bg-[#fae17a] rounded-[15px] text-[16px] font-bold text-black"
        >
          {emailLabel}
          <img src="/icon/angle-right.svg" alt="" className="w-[20px] h-[20px] flex-shrink-0 [filter:drop-shadow(0.5px_0px_0px_black)_drop-shadow(-0.5px_0px_0px_black)]" aria-hidden="true" />
        </a>
      </div>

      
    </header>
  )
}
