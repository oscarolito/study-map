/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration simple pour Vercel
  experimental: {
    serverComponentsExternalPackages: ['firebase-admin']
  }
}

module.exports = nextConfig