import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  const pathParam = req.nextUrl.searchParams.get('path') ?? '/'
  const type = req.nextUrl.searchParams.get('type')

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
  }

  if (type === 'layout') {
    revalidatePath('/', 'layout')
  } else {
    revalidatePath(pathParam)
  }

  return NextResponse.json({ revalidated: true, path: pathParam })
}
