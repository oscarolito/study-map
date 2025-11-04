'use client'

import { Crown, Check, ArrowRight, X } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import { MapPin } from 'lucide-react'

export default function PricingPage() {
  const [isUpgrading, setIsUpgrading] = useState(false)

  const handleUpgrade = async () => {
    setIsUpgrading(true)
    
    try {
      // Créer une session Stripe Checkout
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          userId: 'demo-user',
          email: 'demo@example.com'
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      // Redirection vers Stripe Checkout
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Error creating checkout session:', error)
      alert('Failed to start checkout process. Please try again.')
      setIsUpgrading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="flex items-center space-x-2">
            <MapPin className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Study Map</h1>
          </Link>
        </div>
      </header>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore Masters in Finance programs with our free plan, or upgrade to Premium for unlimited access and advanced features.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
              <div className="text-4xl font-bold text-gray-900 mb-2">
                €0
                <span className="text-lg font-normal text-gray-500 ml-1">
                  forever
                </span>
              </div>
              <p className="text-gray-600">Perfect for exploring</p>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-gray-700">5 program views</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-gray-700">Interactive map exploration</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-gray-700">Basic program information</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-gray-700">Search and filtering</span>
              </li>
              <li className="flex items-center opacity-50">
                <X className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                <span className="text-gray-500">Unlimited program access</span>
              </li>
              <li className="flex items-center opacity-50">
                <X className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                <span className="text-gray-500">Advanced comparison tools</span>
              </li>
            </ul>

            <Link
              href="/register"
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-lg text-center block transition-colors"
            >
              Get Started Free
            </Link>
          </div>

          {/* Premium Plan */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg border-2 border-blue-200 p-8 relative">
            {/* Best Value Badge */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-1 rounded-full text-sm font-medium">
                Best Value
              </div>
            </div>

            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-2">
                <Crown className="h-6 w-6 text-yellow-500 mr-2" />
                <h3 className="text-2xl font-bold text-gray-900">Premium</h3>
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">
                €20
                <span className="text-lg font-normal text-gray-500 ml-1">
                  one-time
                </span>
              </div>
              <p className="text-gray-600">Lifetime access • No recurring fees</p>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-gray-700 font-medium">Unlimited program access</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-gray-700">Advanced comparison tools</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-gray-700">Detailed program insights</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-gray-700">Priority support</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-gray-700">Export program data</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-gray-700">Early access to new features</span>
              </li>
            </ul>

            <button
              onClick={handleUpgrade}
              disabled={isUpgrading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center group"
            >
              {isUpgrading ? (
                'Processing...'
              ) : (
                <>
                  Upgrade to Premium
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mt-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">
                Is this really a one-time payment?
              </h3>
              <p className="text-gray-600">
                Yes! Premium is a one-time payment of €20 with no recurring fees. You get lifetime access to all premium features.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">
                What happens after I use my 5 free views?
              </h3>
              <p className="text-gray-600">
                After viewing 5 programs, you'll need to upgrade to Premium to continue exploring. Your progress is saved, so you can pick up where you left off after upgrading.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">
                Can I get a refund?
              </h3>
              <p className="text-gray-600">
                We offer a 30-day money-back guarantee. If you're not satisfied with Premium, contact us for a full refund.
              </p>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-12">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}