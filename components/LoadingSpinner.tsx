'use client'

import { MapPin } from 'lucide-react'

export default function LoadingSpinner() {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="relative">
          <MapPin className="h-12 w-12 text-primary-600 mx-auto animate-bounce" />
          <div className="absolute inset-0 h-12 w-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto"></div>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-4 mb-2">
          Loading Study Map
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Fetching the latest Masters programs data...
        </p>
      </div>
    </div>
  )
}