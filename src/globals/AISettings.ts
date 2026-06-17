import type { GlobalConfig } from 'payload'
import { isAdmin } from '@/access/isAdmin'

export const AISettings: GlobalConfig = {
  slug: 'ai-settings',
  label: 'AI Settings',
  admin: {
    group: 'Settings',
  },
  access: {
    read: isAdmin,
    update: isAdmin,
  },
  fields: [
    {
      name: 'enabled',
      type: 'checkbox',
      label: 'Enable AI Auto-Translation',
      defaultValue: true,
      admin: {
        description: 'When disabled, the translate button is hidden from all editors.',
      },
    },
    {
      name: 'anthropicApiKey',
      type: 'text',
      label: 'Anthropic API Key',
      admin: {
        description: 'Your Claude API key (sk-ant-...). Get one at console.anthropic.com.',
      },
    },
    {
      name: 'model',
      type: 'select',
      label: 'Model',
      defaultValue: 'claude-haiku-4-5-20251001',
      options: [
        {
          label: 'Claude Haiku (fast, cost-effective — recommended)',
          value: 'claude-haiku-4-5-20251001',
        },
        {
          label: 'Claude Sonnet (higher quality)',
          value: 'claude-sonnet-4-6',
        },
      ],
      admin: {
        description: 'Haiku is recommended for most translation tasks.',
      },
    },
  ],
}
