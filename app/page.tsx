'use client'

import Link from 'next/link'
import { MapPin, Filter, Globe, GraduationCap, Crown, Check } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MapPin className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Study Map</h1>
          </div>
          <nav className="flex items-center space-x-6">
            <a href="#features" className="text-gray-600 hover:text-blue-600 hidden md:block">Features</a>
            <Link href="/pricing" className="text-gray-600 hover:text-blue-600">Pricing</Link>
            <div className="flex items-center space-x-3">
              <Link href="/login" className="text-gray-600 hover:text-blue-600">Sign In</Link>
              <Link href="/register" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">Get Started</Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Explore Masters in Finance
            <span className="text-blue-600 block">Worldwide</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover and compare top Masters in Finance programs from universities around the globe. 
            Find your perfect program with our interactive map and comprehensive filters.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/register" className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-3 rounded-lg inline-flex items-center justify-center space-x-2 transition-colors">
              <Globe className="h-5 w-5" />
              <span>Start Exploring</span>
            </Link>
            <Link href="/pricing" className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-lg px-8 py-3 rounded-lg inline-flex items-center justify-center space-x-2 transition-colors">
              <Crown className="h-5 w-5" />
              <span>View Pricing</span>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">200+</div>
              <div className="text-gray-600">Programs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
              <div className="text-gray-600">Countries</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">100+</div>
              <div className="text-gray-600">Universities</div>
            </div>
          </div>
        </div>

        {/* Features */}
        <section id="features" className="max-w-6xl mx-auto mb-16">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Everything you need to find your perfect program
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
              <MapPin className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold mb-3">Interactive Map</h4>
              <p className="text-gray-600">
                Explore programs geographically with our intuitive map interface
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
              <Filter className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold mb-3">Smart Filters</h4>
              <p className="text-gray-600">
                Filter by country, duration, language, tuition, and rankings
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
              <GraduationCap className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold mb-3">Detailed Info</h4>
              <p className="text-gray-600">
                Complete program details, admission requirements, and rankings
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="max-w-4xl mx-auto mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Choose Your Plan
            </h3>
            <p className="text-xl text-gray-600">
              Start exploring for free, upgrade for unlimited access
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Free Plan */}
            <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
              <h4 className="text-2xl font-bold text-gray-900 mb-4">Free</h4>
              <div className="text-4xl font-bold text-gray-900 mb-6">
                €0
                <span className="text-lg font-normal text-gray-500">/forever</span>
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
              <Link href="/register" className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg w-full block text-center transition-colors">
                Get Started Free
              </Link>
            </div>

            {/* Premium Plan */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-sm border-2 border-blue-200 p-8 text-center relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Best Value
                </span>
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-4 flex items-center justify-center">
                <Crown className="h-6 w-6 text-yellow-500 mr-2" />
                Premium
              </h4>
              <div className="text-4xl font-bold text-gray-900 mb-6">
                €20
                <span className="text-lg font-normal text-gray-500">/one-time</span>
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
              <Link href="/pricing" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg w-full block text-center transition-colors">
                Upgrade to Premium
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-gray-600">
        <p>&copy; 2024 Study Map. Made with ❤️ for future finance professionals.</p>
      </footer>
    </div>
  )
}