import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'

export default async function BeforeLogin() {
  const payload = await getPayload({ config })
  const settings = await payload.findGlobal({
    slug: 'general-settings',
    depth: 1,
  })

  const logo = settings?.adminLogo as any
  if (!logo?.url) return null

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '1.5rem',
      }}
    >
      <img
        src={logo.url}
        alt={logo.alt ?? 'Admin Logo'}
        style={{ maxHeight: '80px', maxWidth: '200px', objectFit: 'contain' }}
      />
    </div>
  )
}
