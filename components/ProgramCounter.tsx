'use client'

import { Crown, Eye } from 'lucide-react'
import Link from 'next/link'

interface ProgramCounterProps {
  plan: 'free' | 'premium'
  programsViewed: number
  maxViews: number
  remainingViews: number
  className?: string
}

export default function ProgramCounter({ 
  plan, 
  programsViewed, 
  maxViews, 
  remainingViews, 
  className = '' 
}: ProgramCounterProps) {
  if (plan === 'premium') {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="flex items-center bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 text-yellow-800 dark:text-yellow-200 px-3 py-1 rounded-full">
          <Crown className="h-4 w-4 mr-1" />
          <span className="text-sm font-medium">Premium</span>
        </div>
      </div>
    )
  }

  const progressPercentage = Math.min((programsViewed / maxViews) * 100, 100)
  const isNearLimit = remainingViews <= 1
  const isAtLimit = remainingViews === 0

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Counter Display */}
      <div className="flex items-center space-x-2">
        <Eye className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        <span className={`text-sm font-medium ${
          isAtLimit 
            ? 'text-red-600 dark:text-red-400' 
            : isNearLimit 
            ? 'text-orange-600 dark:text-orange-400'
            : 'text-gray-700 dark:text-gray-300'
        }`}>
          {programsViewed}/{maxViews} programs
        </span>
      </div>

      {/* Progress Bar */}
      <div className="flex-1 min-w-[80px] max-w-[120px]">
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              isAtLimit 
                ? 'bg-gradient-to-r from-red-500 to-red-600' 
                : isNearLimit 
                ? 'bg-gradient-to-r from-orange-500 to-orange-600'
                : 'bg-gradient-to-r from-primary-500 to-primary-600'
            }`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Upgrade Button */}
      {(isNearLimit || isAtLimit) && (
        <Link
          href="/pricing"
          className="text-xs bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-3 py-1 rounded-full font-medium transition-all duration-200 whitespace-nowrap"
        >
          Upgrade
        </Link>
      )}
    </div>
  )
}