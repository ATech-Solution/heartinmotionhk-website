import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug') ?? ''
  const locale = searchParams.get('locale') ?? 'en'

  const draft = await draftMode()
  draft.enable()

  const path = slug === '' || slug === 'home' ? '/' : `/${slug}`
  const localeQuery = locale !== 'en' ? `?locale=${locale}` : ''
  redirect(`${path}${localeQuery}`)
}

export async function DELETE() {
  const draft = await draftMode()
  draft.disable()
  return new Response('Draft mode disabled')
}
