import { getPayload } from 'payload'
import config from '@payload-config'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const payload = await getPayload({ config })
    const settings = await payload.findGlobal({ slug: 'maintenance-settings' })
    return Response.json({ enabled: Boolean(settings?.enabled) })
  } catch {
    return Response.json({ enabled: false })
  }
}
