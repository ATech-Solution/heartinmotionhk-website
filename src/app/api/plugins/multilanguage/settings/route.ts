import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export const revalidate = 60

export async function GET() {
  try {
    const payload = await getPayload({ config })

    const settings = await payload.findGlobal({ slug: 'language-settings' as any })

    return NextResponse.json({
      isActive: true,
      autoDetect: (settings as any)?.autoDetect ?? true,
      defaultLocale: (settings as any)?.defaultLocale ?? 'en',
      activeLocales: ((settings as any)?.activeLocales ?? [])
        .filter((l: any) => l.enabled)
        .map((l: any) => ({ code: l.code, label: l.label })),
    })
  } catch {
    return NextResponse.json({ isActive: false, autoDetect: false, defaultLocale: 'en', activeLocales: [] })
  }
}
