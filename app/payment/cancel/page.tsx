'use client'

import { XCircleIcon, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
        <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <XCircleIcon className="w-8 h-8 text-orange-600 dark:text-orange-400" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Payment Cancelled</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Your payment was cancelled. No charges have been made to your account.
        </p>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">Still interested in Premium?</h3>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• Unlimited program access</li>
            <li>• Advanced comparison tools</li>
            <li>• Priority support</li>
            <li>• One-time payment of €20</li>
          </ul>
        </div>
        
        <div className="space-y-3">
          <Link
            href="/pricing"
            className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
          >
            Try Again
          </Link>
          
          <Link
            href="/map"
            className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continue with Free Plan
          </Link>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Need help? Contact our support team for assistance with your upgrade.
          </p>
        </div>
      </div>
    </div>
  )
}