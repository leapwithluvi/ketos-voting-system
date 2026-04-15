import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // serverActions sudah stable di Next.js 15, tidak perlu di experimental
  serverExternalPackages: ['winston', 'bcryptjs'],
  images: {
    remotePatterns: [],
    formats: ['image/avif', 'image/webp'],
  },
  // Security headers handled via middleware + helmet
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob:",
              "connect-src 'self'",
            ].join('; '),
          },
        ],
      },
    ]
  },
}

export default nextConfig
