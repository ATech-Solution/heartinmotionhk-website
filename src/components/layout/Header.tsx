'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
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

interface HeaderProps {
  header?: {
    logo?: any
    navItems?: NavItem[] | null
    ctaButtons?: CtaButton[] | null
    mobileCta?: MobileCta | null
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
  const mobileCta = header?.mobileCta

  const connectUrl = mobileCta?.connectUrl ?? general?.bookingUrl ?? '#'
  const emailUrl = mobileCta?.emailUrl ?? (general?.contactEmail ? `mailto:${general.contactEmail}` : '#')
  const connectLabel = mobileCta?.connectLabel ?? "Let's connect"
  const emailLabel = mobileCta?.emailLabel ?? 'Email me'

  return (
    <header className="sticky top-0 z-50">
      {/* Desktop header — beige background */}
      <div className="hidden lg:block bg-[#f5eded] h-[110px]">
        <div className="max-w-[1440px] mx-auto px-16 h-full flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={general?.siteName ?? 'Heart in Motion HK'}
                width={56}
                height={50}
                className="h-12 w-auto object-contain"
              />
            ) : (
              <span className="font-display text-[27px] text-[#3f3e3e] leading-tight">
                heart<br />in motion
              </span>
            )}
          </Link>

          <div className="flex gap-[60px]">
            {/* Desktop Nav */}
            <nav className="flex items-center gap-[60px]">
              {navItems.map((item, i) => {
                const href =
                  item.linkType === 'external'
                    ? (item.url ?? '#')
                    : getPagePath(typeof item.page === 'object' ? item.page?.slug : undefined)
                const isFirst = i === 0
                return (
                  <Link
                    key={i}
                    href={href}
                    className={`text-[18px] text-[#000033] transition-colors duration-150 hover:text-brand-teal ${
                      isFirst ? 'font-bold' : 'font-normal'
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>

            {/* Locale switcher */}
            <div className="flex items-center gap-3">
              <div className='hidden'>
                <LocaleSwitcher currentLocale={locale ?? 'en'} />
              </div>
              <div className="px-4 flex gap-3">
                <a
                  href={connectUrl}
                  className="flex items-center justify-center gap-5 h-10 bg-[#8ec0bd] rounded-[15px] text-[16px] font-bold text-black px-8"
                >
                  {connectLabel}
                  <span className="rotate-[0deg] inline-block text-2xl font-bold">›</span>
                </a>
                <a
                  href={emailUrl}
                  className="flex items-center justify-center gap-5 h-10 bg-[#fae17a] rounded-[15px] text-[16px] font-bold text-black px-8"
                >
                  {emailLabel}
                  <span className="rotate-[0deg] inline-block text-2xl font-bold">›</span>
                </a>
              </div>
            </div>
          </div>
        
        </div>
      </div>

      {/* Tablet header */}
      <div className="hidden md:flex lg:hidden bg-[#f5eded] h-[80px] items-center px-8 justify-between">
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={general?.siteName ?? 'Heart in Motion HK'}
              width={44}
              height={40}
              className="h-10 w-auto object-contain"
            />
          ) : (
            <span className="font-display text-[22px] text-[#3f3e3e] leading-tight">
              heart in motion
            </span>
          )}
        </Link>

        <nav className="flex items-center gap-6">
          {navItems.map((item, i) => {
            const href =
              item.linkType === 'external'
                ? (item.url ?? '#')
                : getPagePath(typeof item.page === 'object' ? item.page?.slug : undefined)
            return (
              <Link
                key={i}
                href={href}
                className="text-[15px] text-[#000033] font-normal hover:text-brand-teal transition-colors"
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <LocaleSwitcher currentLocale={locale ?? 'en'} />
        
      </div>

      {/* Mobile header — white background */}
      <div className="md:hidden bg-white h-[80px] flex items-center px-4 justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={general?.siteName ?? 'Heart in Motion HK'}
              width={55}
              height={49}
              className="h-12 w-auto object-contain"
            />
          ) : (
            <span className="font-display text-[27px] text-[#3f3e3e] leading-tight">
              heart<br />in motion
            </span>
          )}
        </Link>

        {/* Hamburger */}
        <button
          className="p-2 text-brand-dark"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <div className="w-6 space-y-[5px]">
            <span
              className={`block h-0.5 bg-current transition-all duration-200 origin-center ${
                mobileOpen ? 'rotate-45 translate-y-[7px]' : ''
              }`}
            />
            <span
              className={`block h-0.5 bg-current transition-all duration-200 ${
                mobileOpen ? 'opacity-0 scale-x-0' : ''
              }`}
            />
            <span
              className={`block h-0.5 bg-current transition-all duration-200 origin-center ${
                mobileOpen ? '-rotate-45 -translate-y-[7px]' : ''
              }`}
            />
          </div>
        </button>
      </div>

      {/* Mobile CTA bar — always visible below mobile navbar */}
      <div className="lg:hidden bg-white px-4 pb-3 flex flex-col gap-3">
        <a
          href={connectUrl}
          className="flex items-center justify-center gap-5 h-10 bg-[#8ec0bd] rounded-[15px] text-[14px] font-bold text-black"
        >
          {connectLabel}
          <span className="rotate-[-90deg] inline-block text-sm">›</span>
        </a>
        <a
          href={emailUrl}
          className="flex items-center justify-center gap-5 h-10 bg-[#fae17a] rounded-[15px] text-[14px] font-bold text-black"
        >
          {emailLabel}
          <span className="rotate-[-90deg] inline-block text-sm">›</span>
        </a>
      </div>

      {/* Mobile menu drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-5 space-y-4 shadow-lg">
          {/* Nav links */}
          <nav className="space-y-1">
            {navItems.map((item, i) => {
              const href =
                item.linkType === 'external'
                  ? (item.url ?? '#')
                  : getPagePath(typeof item.page === 'object' ? item.page?.slug : undefined)
              return (
                <Link
                  key={i}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="block py-2.5 text-[16px] text-brand-dark hover:text-brand-teal transition-colors"
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="pt-2 border-t border-gray-100">
            <LocaleSwitcher currentLocale={locale ?? 'en'} />
          </div>
        </div>
      )}
    </header>
  )
}
