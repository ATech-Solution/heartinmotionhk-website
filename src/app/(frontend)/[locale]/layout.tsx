import '../../globals.css'
import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { redirect } from 'next/navigation'
import { Caveat, Inter } from 'next/font/google'
import { SiteHeader } from '@/components/layout/Header'
import { SiteFooter } from '@/components/layout/Footer'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-caveat',
  display: 'swap',
})

const SUPPORTED_LOCALES = ['en', 'zh-HK'] as const
type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]

export const metadata: Metadata = {
  title: { default: 'Heart in Motion HK', template: '%s — Heart in Motion HK' },
  description: 'Step Forward with Your Heart',
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale: rawLocale } = await params
  const locale = (SUPPORTED_LOCALES.includes(rawLocale as SupportedLocale) ? rawLocale : 'en') as SupportedLocale

  const cookieStore = await cookies()
  const hasAdminToken = cookieStore.has('payload-token')

  const payload = await getPayload({ config })

  const [header, footer, general, langSettings, maintenance] = await Promise.all([
    payload.findGlobal({ slug: 'header', locale }),
    payload.findGlobal({ slug: 'footer', locale }),
    payload.findGlobal({ slug: 'general-settings', locale }),
    payload.findGlobal({ slug: 'language-settings' as any }).catch(() => null),
    payload.findGlobal({ slug: 'maintenance-settings', locale }).catch(() => null),
  ])

  if (!hasAdminToken && Boolean((maintenance as any)?.enabled)) {
    redirect('/maintenance')
  }

  const activeLocales: { code: string; label: string }[] =
    ((langSettings as any)?.activeLocales ?? [])
      .filter((l: any) => l.enabled)
      .map((l: any) => ({ code: l.code, label: l.label }))

  const showSwitcher = (langSettings as any)?.showSwitcher !== false
  const hreflangEnabled = (langSettings as any)?.hreflangEnabled !== false
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? '').replace(/\/$/, '')

  return (
    <html lang={locale} className={`${inter.variable} ${caveat.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        {hreflangEnabled && siteUrl && activeLocales.map((l) => (
          <link key={l.code} rel="alternate" hrefLang={l.code} href={`${siteUrl}/${l.code}/`} />
        ))}
        {hreflangEnabled && siteUrl && (
          <link rel="alternate" hrefLang="x-default" href={`${siteUrl}/en/`} />
        )}
      </head>
      <body className="font-body bg-white text-black antialiased">
        <SiteHeader
          header={header}
          general={general}
          locale={locale}
          activeLocales={activeLocales}
          showSwitcher={showSwitcher}
        />
        <main>{children}</main>
        <SiteFooter footer={footer} general={general} />
      </body>
    </html>
  )
}
