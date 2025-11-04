'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MapPin, Moon, Sun, Menu, X, RefreshCw } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import PlanStatusIndicator from './PlanStatusIndicator'

interface HeaderProps {
  onRefresh?: () => void
  lastUpdated?: Date | null
}

function AuthenticatedContent() {
  const { user } = useAuth()
  
  if (!user) {
    return (
      <div className="flex items-center space-x-3">
        <Link 
          href="/login" 
          className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 font-medium"
        >
          Sign In
        </Link>
        <Link 
          href="/register" 
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Get Started
        </Link>
      </div>
    )
  }

  return <PlanStatusIndicator />
}

export default function Header({ onRefresh, lastUpdated }: HeaderProps) {
  const [isDark, setIsDark] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleDarkMode = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <MapPin className="h-8 w-8 text-primary-600" />
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Study Map</h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/map" className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400">
            Explore
          </Link>
          <Link href="/pricing" className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400">
            Pricing
          </Link>
          <a href="#about" className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400">
            About
          </a>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              title="Refresh data"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
          )}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </nav>

        {/* User Status */}
        <AuthenticatedContent />

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="md:hidden mt-4 pb-4 border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="flex flex-col space-y-3">
            <Link 
              href="/map" 
              className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400"
              onClick={() => setIsMenuOpen(false)}
            >
              Explore
            </Link>
            <Link 
              href="/pricing" 
              className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
            <a 
              href="#about" 
              className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </a>
            <button
              onClick={toggleDarkMode}
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-300"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          </div>
        </nav>
      )}
    </header>
  )
}