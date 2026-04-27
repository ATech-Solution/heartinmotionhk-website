import { withPayload } from '@payloadcms/next/withPayload'

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    silenceDeprecations: ['import', 'legacy-js-api'],
  },
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
    // @payloadcms/ui ships .scss files alongside its dist JS.
    // Those styles are pre-compiled into @payloadcms/ui/dist/styles.css so the
    // raw .scss imports can be ignored. Use a function test to avoid triggering
    // Next.js's canMatchCss detection (which would strip all built-in CSS loaders).
    config.module.rules.unshift({
      test: (filePath) =>
        filePath.endsWith('.scss') &&
        filePath.includes('node_modules') &&
        filePath.includes('@payloadcms'),
      use: 'ignore-loader',
    })
    return config
  },
}

export default withPayload(nextConfig)
