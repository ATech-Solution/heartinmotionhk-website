import type { GlobalAfterChangeHook } from 'payload'

export const revalidateGlobal: GlobalAfterChangeHook = async ({ req }) => {
  if (!process.env.PAYLOAD_PUBLIC_SERVER_URL || !process.env.REVALIDATE_SECRET) return

  const revalidateUrl =
    `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/api/revalidate` +
    `?secret=${process.env.REVALIDATE_SECRET}&path=%2F&type=layout`

  try {
    await fetch(revalidateUrl, { method: 'POST' })
  } catch (err) {
    req.payload.logger.error({ err }, 'revalidateGlobal: failed to revalidate layout')
  }
}
