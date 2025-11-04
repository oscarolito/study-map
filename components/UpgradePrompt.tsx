'use client'

import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { X, Crown, Check, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface UpgradePromptProps {
  isOpen: boolean
  onClose: () => void
  programsViewed: number
  maxViews: number
}

export default function UpgradePrompt({ isOpen, onClose, programsViewed, maxViews }: UpgradePromptProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                      <Crown className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-3">
                      <Dialog.Title as="h3" className="text-lg font-semibold text-gray-900 dark:text-white">
                        Upgrade to Premium
                      </Dialog.Title>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        You've reached your free limit
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={onClose}
                    className="rounded-md bg-gray-100 dark:bg-gray-700 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Progress */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span>Programs viewed</span>
                    <span>{programsViewed}/{maxViews}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((programsViewed / maxViews) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="mb-6">
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    You've explored {programsViewed} out of {maxViews} free programs. Upgrade to Premium to unlock unlimited access to all Masters in Finance programs.
                  </p>
                  
                  <div className="bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Premium Benefits:</h4>
                    <ul className="space-y-2">
                      <li className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                        <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        Unlimited program access
                      </li>
                      <li className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                        <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        Advanced comparison tools
                      </li>
                      <li className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                        <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        Detailed program insights
                      </li>
                      <li className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                        <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        Priority support
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Pricing */}
                <div className="mb-6 text-center">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    €20
                    <span className="text-lg font-normal text-gray-500 dark:text-gray-400 ml-1">
                      one-time
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Lifetime access • No recurring fees
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col space-y-3">
                  <Link
                    href="/pricing"
                    className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center group"
                    onClick={onClose}
                  >
                    Upgrade to Premium
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  
                  <button
                    onClick={onClose}
                    className="w-full text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium py-2 transition-colors"
                  >
                    Maybe later
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}