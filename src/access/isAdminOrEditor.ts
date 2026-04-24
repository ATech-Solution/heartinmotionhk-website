import type { AccessArgs } from 'payload'

export const isAdminOrEditor = ({ req: { user } }: AccessArgs): boolean =>
  Boolean(user?.role === 'admin' || user?.role === 'editor')
