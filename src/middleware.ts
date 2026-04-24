import { NextRequest, NextResponse } from 'next/server'

// Paths that bypass the maintenance redirect
const BYPASS_PREFIXES = [
  '/admin',
  '/api/',
  '/_next/',
  '/favicon.ico',
  '/media/',
  '/maintenance',
  '/images/',
]

// Simple in-memory rate limiting for contact form (per IP, single-instance)
const rateMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 5
const RATE_WINDOW_MS = 60_000

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateMap.get(ip)
  if (!entry || entry.resetAt < now) {
    rateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS })
    return false
  }
  if (entry.count >= RATE_LIMIT) return true
  entry.count++
  return false
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Rate limit contact form submissions
  if (pathname === '/api/form-submissions' && req.method === 'POST') {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many submissions. Please try again later.' },
        { status: 429 },
      )
    }
  }

  // Skip maintenance check for bypass paths
  if (BYPASS_PREFIXES.some((p) => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  // Check if the visitor has a Payload admin session cookie
  const hasAdminSession = req.cookies.has('payload-token')
  if (hasAdminSession) return NextResponse.next()

  // Check maintenance mode (env var first for performance, then DB fallback cached 60s)
  const isMaintenanceEnv = process.env.MAINTENANCE_MODE === 'true'
  if (isMaintenanceEnv) {
    return NextResponse.redirect(new URL('/maintenance', req.url))
  }

  // Dynamic DB check (cached by /api/maintenance-check route for 60s)
  try {
    const checkUrl = `${req.nextUrl.origin}/api/maintenance-check`
    const res = await fetch(checkUrl, { next: { revalidate: 60 } })
    if (res.ok) {
      const { enabled } = (await res.json()) as { enabled: boolean }
      if (enabled) {
        return NextResponse.redirect(new URL('/maintenance', req.url))
      }
    }
  } catch {
    // If the check fails, allow the request through
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
