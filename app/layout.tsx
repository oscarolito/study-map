import './globals.css'
import type { Metadata } from 'next'
import { AuthProvider } from '@/contexts/AuthContext'
import { logEnvStatus } from '@/lib/env-check'

// Log environment status in development
if (process.env.NODE_ENV === 'development') {
  logEnvStatus()
}

export const metadata: Metadata = {
  title: 'Study Map - Explore Masters in Finance Worldwide',
  description: 'Interactive map to discover and compare Masters in Finance programs from top universities around the world.',
}

import { EnvDebug } from '@/components/EnvDebug'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <AuthProvider>
          {children}
        </AuthProvider>
        <EnvDebug />
      </body>
    </html>
  )
}