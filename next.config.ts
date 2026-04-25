import type { NextConfig } from 'next'
import { withPayload } from '@payloadcms/next/withPayload'

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
]

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: process.env.NEXT_PUBLIC_DOMAIN_PROD ?? 'heartinmotionhk.com',
      },
    ],
  },
  webpack: (config) => {
    // @payloadcms/ui ships .scss alongside its dist JS and imports them directly.
    // All those styles are already pre-compiled into @payloadcms/ui/dist/styles.css.
    // Return an empty module for those imports to prevent webpack parse failures.
    config.module.rules.unshift({
      test: /\.scss$/,
      include: /node_modules[\\/]@payloadcms/,
      use: 'ignore-loader',
    })
    return config
  },
}

export default withPayload(nextConfig)
