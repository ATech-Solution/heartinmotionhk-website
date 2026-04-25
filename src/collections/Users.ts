import type { CollectionConfig } from 'payload'
import { isAdmin } from '@/access/isAdmin'
import { isAdminOrEditor } from '@/access/isAdminOrEditor'
import { isAdminOrSelf } from '@/access/isAdminOrSelf'
import { isPublic } from '@/access/isPublic'
import { forgotPasswordEmailTemplate } from '@/hooks/emailTemplates/forgotPassword'
import { verifyEmailTemplate } from '@/hooks/emailTemplates/verifyEmail'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'User', plural: 'Users' },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'role'],
  },
  auth: {
    tokenExpiration: 7200,
    verify: {
      generateEmailHTML: ({ token, user }) =>
        verifyEmailTemplate({ token, user: { email: user.email as string, name: user.name as string | undefined } }),
      generateEmailSubject: () => 'Verify your Heart in Motion HK account',
    },
    forgotPassword: {
      generateEmailHTML: (args) =>
        forgotPasswordEmailTemplate({ token: (args as any).token, user: { email: (args as any).user?.email as string, name: (args as any).user?.name as string | undefined } }),
      generateEmailSubject: () => 'Reset your Heart in Motion HK password',
    },
    maxLoginAttempts: 5,
    lockTime: 600_000,
  },
  access: {
    create: isPublic,
    read: isAdminOrEditor,
    update: isAdminOrSelf,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'viewer',
      options: [
        { label: 'Administrator', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'Viewer', value: 'viewer' },
      ],
      access: {
        read: isAdmin,
        update: isAdmin,
      },
      admin: { position: 'sidebar' },
    },
  ],
}
