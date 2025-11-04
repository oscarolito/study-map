'use client'

import Link from 'next/link'
import { User, Crown, MapPin, Settings, LogOut, CreditCard, Eye } from 'lucide-react'

export default function AccountPage() {
  // Données de démonstration
  const user = {
    email: 'demo@example.com',
    plan: 'premium',
    programsViewed: 15,
    joinedDate: '2024-01-15',
    paymentStatus: 'completed'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <MapPin className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">Study Map</h1>
            </Link>
            
            <nav className="flex items-center space-x-6">
              <Link href="/map" className="text-gray-600 hover:text-gray-900">
                Explore Programs
              </Link>
              <Link href="/pricing" className="text-gray-600 hover:text-gray-900">
                Pricing
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account and subscription</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Account Info */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="bg-blue-100 rounded-full p-3">
                  <User className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                  <p className="text-gray-600">Update your account details</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Member Since
                  </label>
                  <input
                    type="text"
                    value={new Date(user.joinedDate).toLocaleDateString()}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>
              </div>
            </div>

            {/* Usage Statistics */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="bg-green-100 rounded-full p-3">
                  <Eye className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Usage Statistics</h2>
                  <p className="text-gray-600">Your activity overview</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{user.programsViewed}</div>
                  <div className="text-sm text-gray-600">Programs Viewed</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">∞</div>
                  <div className="text-sm text-gray-600">Remaining Views</div>
                </div>
              </div>
            </div>

            {/* Account Actions */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="bg-red-100 rounded-full p-3">
                  <Settings className="h-8 w-8 text-red-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Account Actions</h2>
                  <p className="text-gray-600">Manage your account</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">Change Password</span>
                    <span className="text-gray-400">→</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Update your account password</p>
                </button>
                
                <button className="w-full text-left px-4 py-3 border border-red-300 rounded-lg hover:bg-red-50 transition-colors text-red-600">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Delete Account</span>
                    <span className="text-red-400">→</span>
                  </div>
                  <p className="text-sm text-red-500 mt-1">Permanently delete your account</p>
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Current Plan */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <Crown className="h-6 w-6 text-yellow-500" />
                  <span className="text-lg font-semibold text-yellow-600">Premium Plan</span>
                </div>
                
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 mb-4">
                  <div className="text-2xl font-bold text-gray-900 mb-1">€20</div>
                  <div className="text-sm text-gray-600">One-time payment</div>
                  <div className="text-xs text-green-600 mt-2">✓ Lifetime access</div>
                </div>
                
                <div className="text-sm text-gray-600 space-y-1">
                  <div>✓ Unlimited program access</div>
                  <div>✓ Advanced comparison tools</div>
                  <div>✓ Priority support</div>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center space-x-3 mb-4">
                <CreditCard className="h-5 w-5 text-gray-400" />
                <h3 className="font-semibold text-gray-900">Payment Status</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className="text-sm font-medium text-green-600">Paid</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Amount</span>
                  <span className="text-sm font-medium text-gray-900">€20.00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Date</span>
                  <span className="text-sm font-medium text-gray-900">Jan 15, 2024</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                <Link
                  href="/map"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-center block"
                >
                  Explore Programs
                </Link>
                
                <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2">
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}