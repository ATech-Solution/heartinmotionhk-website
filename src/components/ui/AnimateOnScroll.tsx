'use client'

import { useEffect, useRef } from 'react'

type Animation = 'fade' | 'fade-up' | 'fade-left' | 'fade-right'

interface Props {
  children: React.ReactNode
  animation?: Animation
  delay?: number
  className?: string
  as?: keyof React.JSX.IntrinsicElements
}

export function AnimateOnScroll({ children, animation = 'fade-up', delay = 0, className = '', as: Tag = 'div' }: Props) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delay) {
            setTimeout(() => el.classList.add('him-visible'), delay)
          } else {
            el.classList.add('him-visible')
          }
          observer.unobserve(el)
        }
      },
      { threshold: 0.12 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [delay])

  const animClass = `him-animate him-${animation}`

  return (
    // @ts-ignore — dynamic tag is fine here
    <Tag ref={ref} className={`${animClass} ${className}`}>
      {children}
    </Tag>
  )
}
