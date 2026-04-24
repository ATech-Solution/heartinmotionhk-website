import type { CollectionAfterChangeHook } from 'payload'

export const revalidatePage: CollectionAfterChangeHook = async ({ doc, req }) => {
  if (doc._status === 'published') {
    const slug = doc.slug === 'home' ? '/' : `/${doc.slug}`
    const revalidateUrl =
      `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/api/revalidate` +
      `?secret=${process.env.REVALIDATE_SECRET}&path=${encodeURIComponent(slug)}`

    try {
      await fetch(revalidateUrl, { method: 'POST' })
    } catch (err) {
      req.payload.logger.error({ err }, 'revalidatePage: failed to revalidate')
    }
  }
  return doc
}
