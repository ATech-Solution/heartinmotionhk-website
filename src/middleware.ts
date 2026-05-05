import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Paths that bypass the maintenance check entirely
const BYPASS_PREFIXES = [
  '/admin',
  '/_next',
  '/api',
  '/font',
  '/icon',
  '/images',
  '/media',
  '/favicon.ico',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Maintenance page itself must never be redirected (would loop)
  if (pathname === '/maintenance') return NextResponse.next()

  // Static assets, API routes, admin panel — skip check
  if (BYPASS_PREFIXES.some((p) => pathname.startsWith(p))) return NextResponse.next()

  // Logged-in admins always see the live site
  if (request.cookies.has('payload-token')) return NextResponse.next()

  // Fast path: env var override (no DB call, instant effect on server restart)
  if (process.env.MAINTENANCE_MODE === 'true') {
    return NextResponse.redirect(new URL('/maintenance', request.url))
  }

  // Dynamic path: check DB state via the maintenance-check API (force-dynamic, no cache)
  try {
    const apiUrl = new URL('/api/maintenance-check', request.url).toString()
    const res = await fetch(apiUrl, { cache: 'no-store' })
    if (res.ok) {
      const data = (await res.json()) as { enabled: boolean }
      if (data.enabled) {
        return NextResponse.redirect(new URL('/maintenance', request.url))
      }
    }
  } catch {
    // Fail-open: if the check fails, allow the request through
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
