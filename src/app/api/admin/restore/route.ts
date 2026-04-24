import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import fs from 'fs'
import path from 'path'

export async function POST(req: NextRequest) {
  const payload = await getPayload({ config })

  // Verify admin session
  try {
    const { user } = await payload.auth({ headers: req.headers })
    if (!user || (user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await req.formData()
  const file = formData.get('database') as File | null
  if (!file) {
    return NextResponse.json({ error: 'No database file provided' }, { status: 400 })
  }

  if (!file.name.endsWith('.db')) {
    return NextResponse.json({ error: 'File must be a .db file' }, { status: 400 })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const dbPath = path.resolve(process.cwd(), 'data', 'payload.db')
  const backupPath = path.resolve(process.cwd(), 'data', `payload-pre-restore-${Date.now()}.db`)

  // Create backup of current DB before restoring
  if (fs.existsSync(dbPath)) {
    fs.copyFileSync(dbPath, backupPath)
  }

  fs.writeFileSync(dbPath, buffer)

  return NextResponse.json({ success: true, message: 'Database restored. Restart the server to apply changes.' })
}
