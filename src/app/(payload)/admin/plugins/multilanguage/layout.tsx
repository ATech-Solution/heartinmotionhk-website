import type { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = { title: 'Translation Manager — Heart in Motion HK Admin' }

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
