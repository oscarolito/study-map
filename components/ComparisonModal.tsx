'use client'

import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { X, Clock, Globe, DollarSign, Calendar, Mail, FileText, ExternalLink, CheckCircle, XCircle, Crown } from 'lucide-react'
import { ProgramInfo } from '../types/sheets'
import { useUserPlan } from '../hooks/useUserPlan'

interface ComparisonModalProps {
  programs: ProgramInfo[]
  onClose: () => void
  onRemoveProgram: (programId: string) => void
}

export default function ComparisonModal({ programs, onClose, onRemoveProgram }: ComparisonModalProps) {
  const { plan } = useUserPlan()
  const isPremium = plan === 'premium'

  const extractPrice = (priceStr: string): number => {
    const match = priceStr.match(/[\d,]+/)
    return match ? parseInt(match[0].replace(/,/g, '')) : 0
  }

  const extractDuration = (duration: string): number => {
    const match = duration.match(/(\d+)/)
    return match ? parseInt(match[1]) : 0
  }

  const getComparisonValue = (programs: ProgramInfo[], field: keyof ProgramInfo, index: number) => {
    const program = programs[index]
    if (!program) return null
    
    const value = program[field]
    if (field === 'price') {
      return extractPrice(value as string)
    }
    if (field === 'duration') {
      return extractDuration(value as string)
    }
    return value
  }

  const getBestValue = (programs: ProgramInfo[], field: keyof ProgramInfo, isLowerBetter = false) => {
    const values = programs.map(p => {
      if (field === 'price') return extractPrice(p[field] as string)
      if (field === 'duration') return extractDuration(p[field] as string)
      return p[field]
    }).filter(v => v !== null && v !== undefined && v !== '')

    if (values.length === 0) return null
    
    if (field === 'price' || field === 'duration') {
      return isLowerBetter ? Math.min(...(values as number[])) : Math.max(...(values as number[]))
    }
    
    return null
  }

  const isBestValue = (program: ProgramInfo, field: keyof ProgramInfo, isLowerBetter = false) => {
    const bestValue = getBestValue(programs, field, isLowerBetter)
    if (bestValue === null) return false
    
    const currentValue = getComparisonValue(programs, field, programs.indexOf(program))
    return currentValue === bestValue
  }

  return (
    <Transition appear show={true} as={Fragment}>
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
              <Dialog.Panel className="w-full max-w-7xl max-h-[90vh] transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 text-left align-middle shadow-xl transition-all flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                  <div>
                    <Dialog.Title as="h3" className="text-2xl font-bold text-gray-900 dark:text-white">
                      Compare Programs
                    </Dialog.Title>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      Side-by-side comparison of {programs.length} Masters programs
                    </p>
                  </div>
                  
                  <button
                    onClick={onClose}
                    className="rounded-md bg-gray-100 dark:bg-gray-700 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Comparison Table */}
                <div className="flex-1 overflow-auto">
                  <div className="p-6">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr>
                            <th className="text-left py-4 px-4 font-medium text-gray-900 dark:text-white w-48">
                              Criteria
                            </th>
                            {programs.map((program, index) => (
                              <th key={program.id} className="text-left py-4 px-4 min-w-80">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                                      {program.name}
                                    </h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                      {program.domain}
                                    </p>
                                  </div>
                                  <button
                                    onClick={() => onRemoveProgram(program.id)}
                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          {/* Duration */}
                          <tr>
                            <td className="py-4 px-4 font-medium text-gray-900 dark:text-white">
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-2" />
                                Duration
                              </div>
                            </td>
                            {programs.map(program => (
                              <td key={program.id} className="py-4 px-4">
                                <div className={`flex items-center ${isBestValue(program, 'duration', true) ? 'text-green-600 dark:text-green-400 font-semibold' : 'text-gray-700 dark:text-gray-300'}`}>
                                  {isBestValue(program, 'duration', true) && <CheckCircle className="h-4 w-4 mr-1" />}
                                  {program.duration}
                                </div>
                              </td>
                            ))}
                          </tr>

                          {/* Language */}
                          <tr>
                            <td className="py-4 px-4 font-medium text-gray-900 dark:text-white">
                              <div className="flex items-center">
                                <Globe className="h-4 w-4 mr-2" />
                                Language
                              </div>
                            </td>
                            {programs.map(program => (
                              <td key={program.id} className="py-4 px-4 text-gray-700 dark:text-gray-300">
                                {program.language.join(', ')}
                              </td>
                            ))}
                          </tr>

                          {/* Price */}
                          <tr>
                            <td className="py-4 px-4 font-medium text-gray-900 dark:text-white">
                              <div className="flex items-center">
                                <DollarSign className="h-4 w-4 mr-2" />
                                Tuition
                              </div>
                            </td>
                            {programs.map(program => (
                              <td key={program.id} className="py-4 px-4">
                                <div className={`flex items-center ${isBestValue(program, 'price', true) ? 'text-green-600 dark:text-green-400 font-semibold' : 'text-gray-700 dark:text-gray-300'}`}>
                                  {isBestValue(program, 'price', true) && <CheckCircle className="h-4 w-4 mr-1" />}
                                  {program.price}
                                </div>
                              </td>
                            ))}
                          </tr>

                          {/* Program Type */}
                          <tr>
                            <td className="py-4 px-4 font-medium text-gray-900 dark:text-white">
                              Program Type
                            </td>
                            {programs.map(program => (
                              <td key={program.id} className="py-4 px-4 text-gray-700 dark:text-gray-300">
                                {program.type}
                              </td>
                            ))}
                          </tr>

                          {/* Intake */}
                          <tr>
                            <td className="py-4 px-4 font-medium text-gray-900 dark:text-white">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2" />
                                Intake
                              </div>
                            </td>
                            {programs.map(program => (
                              <td key={program.id} className="py-4 px-4 text-gray-700 dark:text-gray-300">
                                {program.intake || 'N/A'}
                              </td>
                            ))}
                          </tr>

                          {/* Application Deadline */}
                          <tr>
                            <td className="py-4 px-4 font-medium text-gray-900 dark:text-white">
                              Application Deadline
                            </td>
                            {programs.map(program => (
                              <td key={program.id} className="py-4 px-4 text-gray-700 dark:text-gray-300">
                                {program.deadline || 'N/A'}
                              </td>
                            ))}
                          </tr>

                          {/* Prerequisites */}
                          <tr>
                            <td className="py-4 px-4 font-medium text-gray-900 dark:text-white">
                              <div className="flex items-center">
                                Prerequisites
                                {!isPremium && (
                                  <div className="ml-2 flex items-center bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded-full text-xs">
                                    <Crown className="h-3 w-3 mr-1" />
                                    Premium
                                  </div>
                                )}
                              </div>
                            </td>
                            {programs.map(program => (
                              <td key={program.id} className="py-4 px-4">
                                {isPremium ? (
                                  <div className="text-sm text-gray-700 dark:text-gray-300">
                                    {program.prerequisites || 'N/A'}
                                  </div>
                                ) : (
                                  <div className="text-sm text-gray-400 dark:text-gray-500 italic">
                                    Upgrade to Premium to view detailed prerequisites
                                  </div>
                                )}
                              </td>
                            ))}
                          </tr>

                          {/* Director */}
                          <tr>
                            <td className="py-4 px-4 font-medium text-gray-900 dark:text-white">
                              <div className="flex items-center">
                                Program Director
                                {!isPremium && (
                                  <div className="ml-2 flex items-center bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded-full text-xs">
                                    <Crown className="h-3 w-3 mr-1" />
                                    Premium
                                  </div>
                                )}
                              </div>
                            </td>
                            {programs.map(program => (
                              <td key={program.id} className="py-4 px-4">
                                {isPremium ? (
                                  <div className="text-gray-700 dark:text-gray-300">
                                    {program.director || 'N/A'}
                                  </div>
                                ) : (
                                  <div className="text-sm text-gray-400 dark:text-gray-500 italic">
                                    Upgrade to Premium to view program director details
                                  </div>
                                )}
                              </td>
                            ))}
                          </tr>

                          {/* Contact */}
                          <tr>
                            <td className="py-4 px-4 font-medium text-gray-900 dark:text-white">
                              <div className="flex items-center">
                                <Mail className="h-4 w-4 mr-2" />
                                Contact
                              </div>
                            </td>
                            {programs.map(program => (
                              <td key={program.id} className="py-4 px-4 text-gray-700 dark:text-gray-300">
                                {program.contact || 'N/A'}
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Premium Upgrade Banner */}
                {!isPremium && (
                  <div className="flex-shrink-0 bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 border-t border-gray-200 dark:border-gray-600 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Crown className="h-5 w-5 text-yellow-500 mr-2" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            Unlock Advanced Comparison Features
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Get detailed prerequisites, program director info, and more with Premium
                          </p>
                        </div>
                      </div>
                      <a
                        href="/pricing"
                        className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                      >
                        Upgrade Now
                      </a>
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="flex-shrink-0 flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-600">
                  <div className="flex items-center space-x-4">
                    {programs.map(program => (
                      <div key={program.id}>
                        {program.applicationLink && (
                          <a
                            href={program.applicationLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary text-sm inline-flex items-center"
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Apply to {program.name.split(' ').slice(0, 2).join(' ')}
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={onClose}
                    className="btn-secondary"
                  >
                    Close Comparison
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