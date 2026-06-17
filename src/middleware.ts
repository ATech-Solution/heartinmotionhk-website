import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const SUPPORTED_LOCALES = ['en', 'zh-HK'] as const
type Locale = (typeof SUPPORTED_LOCALES)[number]

const SKIP_PREFIXES = [
  '/admin',
  '/api',
  '/_next',
  '/maintenance',
]

const SKIP_EXTENSIONS = ['.ico', '.png', '.jpg', '.jpeg', '.svg', '.gif', '.webp', '.woff', '.woff2', '.ttf', '.otf', '.css', '.js']

function isSupportedLocale(segment: string): segment is Locale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(segment)
}

function detectLocale(request: NextRequest, defaultLocale: Locale = 'en'): Locale {
  // 1. Cookie
  const cookie = request.cookies.get('NEXT_LOCALE')?.value
  if (cookie && isSupportedLocale(cookie)) return cookie

  // 2. Accept-Language header
  const acceptLang = request.headers.get('accept-language')
  if (acceptLang) {
    const languages = acceptLang
      .split(',')
      .map((lang) => {
        const [code, q] = lang.trim().split(';q=')
        return { code: code?.trim() ?? '', q: q ? parseFloat(q) : 1 }
      })
      .sort((a, b) => b.q - a.q)

    for (const { code } of languages) {
      if (isSupportedLocale(code)) return code
      // Match zh-TW, zh-HK, zh-Hant etc. → zh-HK
      if (code.toLowerCase().startsWith('zh')) return 'zh-HK'
    }
  }

  return defaultLocale
}

async function getLocaleConfig(origin: string): Promise<{
  isActive: boolean
  autoDetect: boolean
  defaultLocale: Locale
}> {
  try {
    const res = await fetch(`${origin}/api/plugins/multilanguage/settings`, {
      cache: 'no-store',
    })
    if (!res.ok) return { isActive: false, autoDetect: false, defaultLocale: 'en' }
    const data = await res.json()
    return {
      isActive: Boolean(data.isActive),
      autoDetect: Boolean(data.autoDetect),
      defaultLocale: isSupportedLocale(data.defaultLocale) ? data.defaultLocale : 'en',
    }
  } catch {
    return { isActive: false, autoDetect: false, defaultLocale: 'en' }
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip admin, api, _next, static files, and maintenance page
  if (SKIP_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next()
  }
  if (SKIP_EXTENSIONS.some((ext) => pathname.endsWith(ext))) {
    return NextResponse.next()
  }

  // If first segment is already a supported locale, pass through
  const segments = pathname.split('/').filter(Boolean)
  if (segments.length > 0 && isSupportedLocale(segments[0])) {
    return NextResponse.next()
  }

  // Fetch plugin config (fail-open: defaults to inactive if fetch fails)
  const origin = request.nextUrl.origin
  const pluginConfig = await getLocaleConfig(origin)

  if (pluginConfig.isActive) {
    // Detect locale when autoDetect is on, otherwise use defaultLocale
    const locale = pluginConfig.autoDetect
      ? detectLocale(request, pluginConfig.defaultLocale)
      : pluginConfig.defaultLocale

    const url = request.nextUrl.clone()
    url.pathname = `/${locale}${pathname}`
    return NextResponse.redirect(url, 307)
  } else {
    // Plugin inactive: silently rewrite to /en (no visible redirect)
    const url = request.nextUrl.clone()
    url.pathname = `/en${pathname}`
    return NextResponse.rewrite(url)
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
