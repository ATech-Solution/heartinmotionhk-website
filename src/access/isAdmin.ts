import type { AccessArgs } from 'payload'

export const isAdmin = ({ req: { user } }: AccessArgs): boolean =>
  Boolean(user?.role === 'admin')
