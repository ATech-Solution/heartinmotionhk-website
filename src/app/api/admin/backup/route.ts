import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import fs from 'fs'
import path from 'path'

export async function GET(req: NextRequest) {
  const payload = await getPayload({ config })

  // Verify admin session
  const token = req.cookies.get('payload-token')?.value
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { user } = await payload.auth({ headers: req.headers })
    if (!user || (user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const dbPath = path.resolve(process.cwd(), 'data', 'payload.db')
  if (!fs.existsSync(dbPath)) {
    return NextResponse.json({ error: 'Database file not found' }, { status: 404 })
  }

  const file = fs.readFileSync(dbPath)
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')

  return new NextResponse(file, {
    status: 200,
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="payload-backup-${timestamp}.db"`,
      'Content-Length': String(file.length),
    },
  })
}
