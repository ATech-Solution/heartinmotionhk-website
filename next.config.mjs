import { withPayload } from '@payloadcms/next/withPayload'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
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
        hostname: process.env.NEXT_PUBLIC_DOMAIN_PROD || 'heartinmotionhk.com',
      },
    ],
  },
  // Ensure libsql native binaries are included in standalone output.
  // withPayload's outputFileTracingIncludes uses non-glob module names that
  // @vercel/nft can't resolve, so we add explicit globs here.
  outputFileTracingIncludes: {
    '**/*': [
      './node_modules/libsql/**',
      './node_modules/@libsql/client/**',
      './node_modules/@libsql/core/**',
      './node_modules/@libsql/linux-x64-gnu/**',
      './node_modules/@libsql/linux-x64-musl/**',
      './node_modules/@libsql/linux-arm64-gnu/**',
      './node_modules/@libsql/linux-arm64-musl/**',
    ],
  },
  outputFileTracingRoot: path.join(__dirname, './'),
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
