'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CheckCircle, Crown, ArrowRight, MapPin } from 'lucide-react'

export default function PaymentSuccessPage() {
  const [sessionId, setSessionId] = useState<string | null>(null)

  useEffect(() => {
    // Récupérer l'ID de session depuis l'URL
    const urlParams = new URLSearchParams(window.location.search)
    const id = urlParams.get('session_id')
    setSessionId(id)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex items-center justify-center space-x-2 mb-8">
          <MapPin className="h-8 w-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Study Map</h1>
        </Link>
        
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            {/* Success Icon */}
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            
            {/* Success Message */}
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Successful!
            </h2>
            
            <div className="flex items-center justify-center space-x-2 mb-6">
              <Crown className="h-6 w-6 text-yellow-500" />
              <span className="text-lg font-semibold text-yellow-600">
                Welcome to Premium!
              </span>
            </div>
            
            <p className="text-gray-600 mb-8">
              Your account has been upgraded to Premium. You now have unlimited access to all Masters in Finance programs.
            </p>
            
            {/* Session Info */}
            {sessionId && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-500">
                  Transaction ID: <span className="font-mono">{sessionId}</span>
                </p>
              </div>
            )}
            
            {/* Premium Features */}
            <div className="text-left bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-gray-900 mb-4 text-center">
                Your Premium Benefits
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>Unlimited program access</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>Advanced comparison tools</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>Detailed program insights</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>Priority support</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>Export program data</span>
                </li>
              </ul>
            </div>
            
            {/* Action Buttons */}
            <div className="space-y-3">
              <Link
                href="/map"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center group"
              >
                Start Exploring Programs
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                href="/account"
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors text-center block"
              >
                View Account Settings
              </Link>
            </div>
            
            {/* Receipt Info */}
            <div className="mt-8 pt-6 border-t text-center">
              <p className="text-sm text-gray-500">
                A receipt has been sent to your email address.
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Need help? Contact us at support@studymap.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}