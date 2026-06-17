import type { Config, Plugin } from 'payload'
import { LanguageSettingsGlobal } from './multilanguage/LanguageSettingsGlobal'
import { seedMultilanguage } from './multilanguage/seed'

export const MULTILANGUAGE_PLUGIN_SLUG = 'multilanguage'

export const multilanguagePlugin = (): Plugin =>
  (incomingConfig: Config): Config => {
    return {
      ...incomingConfig,

      globals: [...(incomingConfig.globals ?? []), LanguageSettingsGlobal],

      onInit: async (payload) => {
        if (incomingConfig.onInit) await incomingConfig.onInit(payload)
        if (process.env.NEXT_PHASE === 'phase-production-build') return
        await seedMultilanguage(payload)
      },
    }
  }
