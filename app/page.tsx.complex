'use client'

import Link from 'next/link'
import { MapPin, Filter, Globe, GraduationCap, Crown, Check } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useUserPlan } from '../hooks/useUserPlan'

export default function HomePage() {
  const { user, loading } = useAuth()
  const { plan } = useUserPlan()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MapPin className="h-8 w-8 text-primary-600" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Study Map</h1>
          </div>
          <nav className="flex items-center space-x-6">
            <a href="#features" className="text-gray-600 hover:text-primary-600 dark:text-gray-300 hidden md:block">Features</a>
            <Link href="/pricing" className="text-gray-600 hover:text-primary-600 dark:text-gray-300">Pricing</Link>
            {!user ? (
              <div className="flex items-center space-x-3">
                <Link href="/login" className="text-gray-600 hover:text-primary-600 dark:text-gray-300">Sign In</Link>
                <Link href="/register" className="btn-primary">Get Started</Link>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">Welcome, {user.email}</span>
                <Link href="/map" className="btn-primary">Go to Map</Link>
                <button
                  onClick={async () => {
                    const { signOut } = await import('firebase/auth')
                    const { auth } = await import('@/lib/firebase')
                    await signOut(auth)
                    window.location.reload()
                  }}
                  className="text-gray-600 hover:text-gray-900 text-sm"
                >
                  Sign Out
                </button>
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Explore Masters in Finance
            <span className="text-primary-600 block">Worldwide</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Discover and compare top Masters in Finance programs from universities around the globe. 
            Find your perfect program with our interactive map and comprehensive filters.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            {user ? (
              <Link href="/map" className="btn-primary text-lg px-8 py-3 inline-flex items-center space-x-2">
                <Globe className="h-5 w-5" />
                <span>Continue Exploring</span>
              </Link>
            ) : (
              <>
                <Link href="/register" className="btn-primary text-lg px-8 py-3 inline-flex items-center space-x-2">
                  <Globe className="h-5 w-5" />
                  <span>Start Exploring</span>
                </Link>
                <Link href="/pricing" className="btn-secondary text-lg px-8 py-3 inline-flex items-center space-x-2">
                  <Crown className="h-5 w-5" />
                  <span>View Pricing</span>
                </Link>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">200+</div>
              <div className="text-gray-600 dark:text-gray-300">Programs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">50+</div>
              <div className="text-gray-600 dark:text-gray-300">Countries</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">100+</div>
              <div className="text-gray-600 dark:text-gray-300">Universities</div>
            </div>
          </div>
        </div>

        {/* Features */}
        <section id="features" className="max-w-6xl mx-auto mb-16">
          <h3 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Everything you need to find your perfect program
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card p-6 text-center">
              <MapPin className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold mb-3">Interactive Map</h4>
              <p className="text-gray-600 dark:text-gray-300">
                Explore programs geographically with our intuitive map interface
              </p>
            </div>
            
            <div className="card p-6 text-center">
              <Filter className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold mb-3">Smart Filters</h4>
              <p className="text-gray-600 dark:text-gray-300">
                Filter by country, duration, language, tuition, and rankings
              </p>
            </div>
            
            <div className="card p-6 text-center">
              <GraduationCap className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold mb-3">Detailed Info</h4>
              <p className="text-gray-600 dark:text-gray-300">
                Complete program details, admission requirements, and rankings
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        {!user || plan === 'free' ? (
          <section className="max-w-4xl mx-auto mb-16">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Choose Your Plan
              </h3>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Start exploring for free, upgrade for unlimited access
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Free Plan */}
              <div className="card p-8 text-center">
                <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Free</h4>
                <div className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  €0
                  <span className="text-lg font-normal text-gray-500 dark:text-gray-400">/forever</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center justify-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>5 program views</span>
                  </li>
                  <li className="flex items-center justify-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>Interactive map</span>
                  </li>
                  <li className="flex items-center justify-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>Basic filters</span>
                  </li>
                </ul>
                {!user ? (
                  <Link href="/register" className="btn-secondary w-full">
                    Get Started Free
                  </Link>
                ) : (
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Current Plan
                  </div>
                )}
              </div>

              {/* Premium Plan */}
              <div className="card p-8 text-center border-2 border-primary-500 relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Best Value
                  </span>
                </div>
                <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center">
                  <Crown className="h-6 w-6 text-yellow-500 mr-2" />
                  Premium
                </h4>
                <div className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  €20
                  <span className="text-lg font-normal text-gray-500 dark:text-gray-400">/one-time</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center justify-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>Unlimited program access</span>
                  </li>
                  <li className="flex items-center justify-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>Advanced comparison tools</span>
                  </li>
                  <li className="flex items-center justify-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>Detailed program insights</span>
                  </li>
                  <li className="flex items-center justify-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>Priority support</span>
                  </li>
                </ul>
                <Link href="/pricing" className="btn-primary w-full">
                  Upgrade to Premium
                </Link>
              </div>
            </div>
          </section>
        ) : null}
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-gray-600 dark:text-gray-400">
        <p>&copy; 2024 Study Map. Made with ❤️ for future finance professionals.</p>
      </footer>
    </div>
  )
}