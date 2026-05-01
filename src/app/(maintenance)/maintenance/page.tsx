import { getPayload } from 'payload'
import config from '@payload-config'
import { cookies } from 'next/headers'
import { RichText } from '@/components/ui/RichText'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Under Maintenance' }

export default async function MaintenancePage() {
  const cookieStore = await cookies()
  const locale = (cookieStore.get('NEXT_LOCALE')?.value ?? 'en') as 'en' | 'zh-HK'

  let logo = null
  let title = 'We are under maintenance'
  let message = null
  let estimatedReturn = null

  try {
    const payload = await getPayload({ config })
    const settings = await payload.findGlobal({ slug: 'maintenance-settings', locale })
    title = (settings as any)?.title ?? title
    message = (settings as any)?.message
    estimatedReturn = (settings as any)?.estimatedReturn
    logo = (settings as any)?.logo
  } catch {
    // Proceed with defaults if Payload is unavailable
  }

  return (
    <div className="min-h-screen bg-brand-beige flex items-center justify-center px-6">
      <div className="max-w-2xl text-center">
        <div className="text-6xl mb-6">{logo ? <img src={logo.url} alt={logo.alt} className="max-h-24 mx-auto" /> : '🔧'}</div>
        <h1 className="font-display text-4xl md:text-5xl text-brand-dark mb-4">{title}</h1>
        {message && (
          <div className="text-black text-base leading-relaxed mb-6">
            <RichText content={message} />
          </div>
        )}
        {estimatedReturn && (
          <p className="text-md font-bold text-black font-medium">{estimatedReturn}</p>
        )}
      </div>
    </div>
  )
}
