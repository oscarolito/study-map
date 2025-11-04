/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    outputFileTracingRoot: undefined,
  },
  // Optimisation pour Render
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
}