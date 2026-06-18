import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const SUPPORTED_LOCALES = ['en', 'zh-CN'] as const
type Locale = (typeof SUPPORTED_LOCALES)[number]

const SKIP_PREFIXES = ['/admin', '/api', '/_next', '/maintenance']
const SKIP_EXTENSIONS = [
  '.ico', '.png', '.jpg', '.jpeg', '.svg', '.gif', '.webp',
  '.woff', '.woff2', '.ttf', '.otf', '.css', '.js',
]

function isSupportedLocale(segment: string): segment is Locale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(segment)
}

// Detect locale from browser's Accept-Language header only.
// No cookie — the URL prefix carries the locale once the user navigates.
// Browser language is the source of truth; English is the fallback.
function detectLocale(request: NextRequest): Locale {
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
      // zh-TW, zh-HK, zh-Hant, zh-Hans, zh → zh-CN
      if (code.toLowerCase().startsWith('zh')) return 'zh-CN'
    }
  }

  return 'en'
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (SKIP_PREFIXES.some((p) => pathname.startsWith(p))) return NextResponse.next()
  if (SKIP_EXTENSIONS.some((ext) => pathname.endsWith(ext))) return NextResponse.next()

  const segments = pathname.split('/').filter(Boolean)
  const alreadyLocalized = segments.length > 0 && isSupportedLocale(segments[0])

  let response: NextResponse

  if (alreadyLocalized) {
    response = NextResponse.next()
  } else {
    const locale = detectLocale(request)
    const url = request.nextUrl.clone()
    url.pathname = `/${locale}${pathname}`
    response = NextResponse.redirect(url, 307)
  }

  // Erase any NEXT_LOCALE cookie left over from the old cookie-based locale approach
  if (request.cookies.get('NEXT_LOCALE')) {
    response.cookies.set('NEXT_LOCALE', '', { path: '/', maxAge: 0 })
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
