'use client'

import { Crown, User, LogOut, Settings } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useUserPlan } from '@/hooks/useUserPlan'
import ProgramCounter from './ProgramCounter'
import { useState } from 'react'

export default function PlanStatusIndicator() {
  const { user, signOut } = useAuth()
  const { plan, programsViewed, maxViews, remainingViews } = useUserPlan()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  if (!user) {
    return null
  }

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <div className="relative">
      {/* User Menu Button */}
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        {/* Plan Status */}
        {plan === 'premium' ? (
          <div className="flex items-center bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 text-yellow-800 dark:text-yellow-200 px-3 py-1 rounded-full">
            <Crown className="h-4 w-4 mr-1" />
            <span className="text-sm font-medium">Premium</span>
          </div>
        ) : (
          <ProgramCounter
            plan={plan}
            programsViewed={programsViewed}
            maxViews={maxViews}
            remainingViews={remainingViews}
            className="hidden sm:flex"
          />
        )}

        {/* User Avatar */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden md:block">
            {user.email}
          </span>
        </div>
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsDropdownOpen(false)}
          />
          
          {/* Menu */}
          <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20">
            <div className="p-4">
              {/* User Info */}
              <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{user.email}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {plan === 'premium' ? 'Premium Member' : 'Free Plan'}
                  </p>
                </div>
              </div>

              {/* Plan Status */}
              {plan === 'free' && (
                <div className="mb-4">
                  <ProgramCounter
                    plan={plan}
                    programsViewed={programsViewed}
                    maxViews={maxViews}
                    remainingViews={remainingViews}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    {remainingViews > 0 
                      ? `${remainingViews} program${remainingViews === 1 ? '' : 's'} remaining`
                      : 'Upgrade to view more programs'
                    }
                  </p>
                </div>
              )}

              {plan === 'premium' && (
                <div className="mb-4">
                  <div className="flex items-center bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 text-yellow-800 dark:text-yellow-200 px-3 py-2 rounded-lg">
                    <Crown className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">Premium Access</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Unlimited program access
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-2">
                <a
                  href="/account"
                  className="w-full flex items-center space-x-2 px-3 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <Settings className="h-4 w-4" />
                  <span>Account Settings</span>
                </a>
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}