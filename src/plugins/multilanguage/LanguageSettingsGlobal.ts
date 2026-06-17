import type { GlobalConfig } from 'payload'

export const LanguageSettingsGlobal: GlobalConfig = {
  slug: 'language-settings',
  label: 'Language Settings',
  access: {
    read: () => true,
    update: ({ req }) => req.user?.role === 'admin',
  },
  admin: {
    group: 'System',
    description: 'Configure multilanguage routing, switcher, and active locales.',
  },
  fields: [
    {
      name: 'activeLocales',
      type: 'array',
      label: 'Active Locales',
      admin: {
        description:
          'Enable or disable specific locales. Must match locales in payload.config.ts.',
      },
      defaultValue: [
        { code: 'en', label: 'English', enabled: true },
        { code: 'zh-HK', label: '繁體中文 (HK)', enabled: true },
      ],
      fields: [
        {
          name: 'code',
          type: 'text',
          label: 'Locale Code',
          required: true,
          admin: { description: 'e.g. en, zh-HK — must match a code in payload.config.ts' },
        },
        {
          name: 'label',
          type: 'text',
          label: 'Display Label',
          required: true,
        },
        {
          name: 'enabled',
          type: 'checkbox',
          label: 'Enabled',
          defaultValue: true,
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'defaultLocale',
          type: 'text',
          label: 'Default Locale',
          defaultValue: 'en',
          admin: { width: '50%' },
        },
        {
          name: 'autoDetect',
          type: 'checkbox',
          label: 'Auto-detect from Browser',
          defaultValue: true,
          admin: { width: '50%' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'showSwitcher',
          type: 'checkbox',
          label: 'Show Language Switcher',
          defaultValue: true,
          admin: { width: '50%' },
        },
        {
          name: 'switcherPosition',
          type: 'select',
          label: 'Switcher Position',
          defaultValue: 'header',
          options: [
            { label: 'Header', value: 'header' },
            { label: 'Footer', value: 'footer' },
          ],
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'hreflangEnabled',
      type: 'checkbox',
      label: 'Inject hreflang Tags',
      defaultValue: true,
      admin: {
        description: 'Add <link rel="alternate" hreflang="..."> tags for multilanguage SEO.',
      },
    },
  ],
}
