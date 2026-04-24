import type { AccessArgs } from 'payload'

export const isAdminOrSelf = ({ req: { user }, id }: AccessArgs): boolean => {
  if (!user) return false
  if (user.role === 'admin') return true
  return String(user.id) === String(id)
}
