'use client'

import { useRouter } from 'next/navigation'
import { useTransition } from 'react'

interface LocaleSwitcherProps {
  currentLocale: string
}

export function LocaleSwitcher({ currentLocale }: LocaleSwitcherProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function switchLocale(locale: string) {
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; SameSite=Lax`
    startTransition(() => {
      router.refresh()
    })
  }

  return (
    <div className="flex items-center gap-1 text-xs">
      <button
        onClick={() => switchLocale('en')}
        disabled={isPending}
        className={`px-2 py-1 rounded-md transition-colors duration-150 font-medium
          ${currentLocale === 'en'
            ? 'bg-brand-teal text-white'
            : 'text-brand-dark/50 hover:text-brand-dark'
          }`}
      >
        EN
      </button>
      <span className="text-brand-dark/30">|</span>
      <button
        onClick={() => switchLocale('zh-HK')}
        disabled={isPending}
        className={`px-2 py-1 rounded-md transition-colors duration-150 font-medium
          ${currentLocale === 'zh-HK'
            ? 'bg-brand-teal text-white'
            : 'text-brand-dark/50 hover:text-brand-dark'
          }`}
      >
        繁中
      </button>
    </div>
  )
}
