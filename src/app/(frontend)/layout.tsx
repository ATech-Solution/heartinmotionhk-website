import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { cookies } from 'next/headers'
import { Caveat, Inter } from 'next/font/google'
import '@/app/globals.css'
import { SiteHeader } from '@/components/layout/Header'
import { SiteFooter } from '@/components/layout/Footer'

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

export const metadata: Metadata = {
  title: { default: 'Heart in Motion HK', template: '%s — Heart in Motion HK' },
  description: 'Step Forward with Your Heart',
}

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const locale = (cookieStore.get('NEXT_LOCALE')?.value ?? 'en') as 'en' | 'zh-HK'

  const payload = await getPayload({ config })

  const [header, footer, general] = await Promise.all([
    payload.findGlobal({ slug: 'header', locale }),
    payload.findGlobal({ slug: 'footer', locale }),
    payload.findGlobal({ slug: 'general-settings', locale }),
  ])

  return (
    <html lang={locale === 'zh-HK' ? 'zh-HK' : 'en'} className={`${inter.variable} ${caveat.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="font-body bg-brand-beige text-brand-dark antialiased">
        <SiteHeader header={header} general={general} locale={locale} />
        <main>{children}</main>
        <SiteFooter footer={footer} general={general} />
      </body>
    </html>
  )
}
