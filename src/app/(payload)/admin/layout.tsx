import '@payloadcms/next/css'
import React from 'react'
import { RootLayout, handleServerFunctions } from '@payloadcms/next/layouts'
import config from '@payload-config'
import { importMap } from './importMap'

type Args = {
  children: React.ReactNode
}

const serverFunction = async (args: any) => {
  'use server'
  return handleServerFunctions({ ...args, config, importMap })
}

export default function AdminLayout({ children }: Args) {
  return (
    <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
      {children}
    </RootLayout>
  )
}
