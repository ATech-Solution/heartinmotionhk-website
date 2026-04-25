import type { Metadata } from 'next'
import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
import config from '@payload-config'
import { importMap } from '../importMap'

export const dynamic = 'force-dynamic'
export const revalidate = 0

type Props = {
  params: Promise<{ segments?: string[] }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  return generatePageMetadata({ config, params: params as any, searchParams: searchParams as any })
}

export default function Page({ params, searchParams }: Props) {
  return RootPage({ config, importMap, params: params as any, searchParams: searchParams as any })
}
