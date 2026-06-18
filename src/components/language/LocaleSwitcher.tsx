'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useTransition } from 'react'

interface LocaleSwitcherProps {
  currentLocale: string
  enLabel?: string | null
  zhLabel?: string | null
}

export function LocaleSwitcher({ currentLocale, enLabel, zhLabel }: LocaleSwitcherProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  function switchLocale(locale: string) {
    if (locale === currentLocale) return
    // Replace locale segment in path: /en/services → /zh-CN/services
    const segments = pathname.split('/')
    segments[1] = locale
    const newPath = segments.join('/') || `/${locale}`
    startTransition(() => {
      router.push(newPath)
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
        {enLabel || 'EN'}
      </button>
      <span className="text-brand-dark/30">|</span>
      <button
        onClick={() => switchLocale('zh-CN')}
        disabled={isPending}
        className={`px-2 py-1 rounded-md transition-colors duration-150 font-medium
          ${currentLocale === 'zh-CN'
            ? 'bg-brand-teal text-white'
            : 'text-brand-dark/50 hover:text-brand-dark'
          }`}
      >
        {zhLabel || '简中'}
      </button>
    </div>
  )
}
