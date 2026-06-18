import '../../globals.css'
import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { unstable_noStore as noStore } from 'next/cache'
import { Caveat, Inter } from 'next/font/google'
import { SiteHeader } from '@/components/layout/Header'
import { SiteFooter } from '@/components/layout/Footer'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const caveat = Caveat({ subsets: ['latin'], variable: '--font-caveat', display: 'swap' })

export const metadata: Metadata = {
  title: { default: 'Heart in Motion HK', template: '%s — Heart in Motion HK' },
  description: 'Step Forward with Your Heart',
}

const SUPPORTED_LOCALES = ['en', 'zh-CN'] as const
type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  noStore()
  const { locale: rawLocale } = await params
  const locale: SupportedLocale = (SUPPORTED_LOCALES as readonly string[]).includes(rawLocale)
    ? (rawLocale as SupportedLocale)
    : 'en'

  if (!SUPPORTED_LOCALES.includes(rawLocale as SupportedLocale)) {
    redirect(`/en`)
  }

  const cookieStore = await cookies()
  const hasAdminToken = cookieStore.has('payload-token')
  const payload = await getPayload({ config })

  if (!hasAdminToken) {
    let maintenanceEnabled = false
    try {
      const maintenance = await payload.findGlobal({ slug: 'maintenance-settings', locale })
      maintenanceEnabled = Boolean((maintenance as any)?.enabled)
    } catch {
      // fail-open
    }
    if (maintenanceEnabled) redirect('/maintenance')
  }

  // Wrap global fetches so a missing DB column (pending migration) never crashes the whole page.
  // SiteHeader and SiteFooter both handle null props gracefully via optional chaining.
  let header: any = null
  let footer: any = null
  let general: any = null
  try {
    ;[header, footer, general] = await Promise.all([
      payload.findGlobal({ slug: 'header', locale }),
      payload.findGlobal({ slug: 'footer', locale }),
      payload.findGlobal({ slug: 'general-settings', locale }),
    ])
  } catch (err) {
    console.error('[layout] Failed to load globals — DB migration may be pending:', err)
  }

  return (
    <html lang={locale === 'zh-CN' ? 'zh-Hans' : 'en'} className={`${inter.variable} ${caveat.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="font-body bg-white text-black antialiased">
        <SiteHeader header={header} general={general} locale={locale} />
        <main>{children}</main>
        <SiteFooter footer={footer} general={general} />
      </body>
    </html>
  )
}
