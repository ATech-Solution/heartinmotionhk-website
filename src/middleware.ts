import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Maintenance mode is handled in src/app/(frontend)/layout.tsx via direct
// Payload DB access (Node.js runtime). The middleware has no reliable way to
// reach the database from the Edge runtime, so no maintenance redirect here.

export function middleware(_request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
