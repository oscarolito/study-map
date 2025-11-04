'use client'

import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { X, MapPin, Clock, Globe, DollarSign, Star, ExternalLink, Users, BookOpen, Award } from 'lucide-react'
import { Program } from '../types/program'

interface ProgramModalProps {
  program: Program
  onClose: () => void
}

export default function ProgramModal({ program, onClose }: ProgramModalProps) {
  const formatTuition = (tuition: Program['tuition']) => {
    const symbol = tuition.currency === 'USD' ? '$' : tuition.currency === 'EUR' ? '€' : '£'
    return `${symbol}${tuition.amount.toLocaleString()} ${tuition.currency}`
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
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <Dialog.Title as="h3" className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {program.name}
                    </Dialog.Title>
                    <p className="text-xl text-primary-600 dark:text-primary-400 font-semibold mb-3">
                      {program.school}
                    </p>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <MapPin className="h-5 w-5 mr-2" />
                      <span className="text-lg">{program.city}, {program.country}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={onClose}
                    className="rounded-md bg-gray-100 dark:bg-gray-700 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Rankings */}
                {program.ranking && program.ranking.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                      <Award className="h-5 w-5 mr-2" />
                      Rankings
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {program.ranking.map((rank, index) => (
                        <div key={index} className="flex items-center bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-4 py-2 rounded-full">
                          <Star className="h-4 w-4 mr-2" />
                          <span className="font-medium">#{rank.position} {rank.source}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Key Information Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Clock className="h-5 w-5 text-primary-600 mr-2" />
                      <span className="font-medium text-gray-900 dark:text-white">Duration</span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">{program.duration}</p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Globe className="h-5 w-5 text-primary-600 mr-2" />
                      <span className="font-medium text-gray-900 dark:text-white">Language</span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">{program.language.join(', ')}</p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <DollarSign className="h-5 w-5 text-primary-600 mr-2" />
                      <span className="font-medium text-gray-900 dark:text-white">Tuition</span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">{formatTuition(program.tuition)}</p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <BookOpen className="h-5 w-5 text-primary-600 mr-2" />
                      <span className="font-medium text-gray-900 dark:text-white">Type</span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">{program.type}</p>
                  </div>
                </div>

                {/* Description */}
                {program.description && (
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">About the Program</h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{program.description}</p>
                  </div>
                )}

                {/* Student Profile */}
                {(program.averageAge || program.studentProfile) && (
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                      <Users className="h-5 w-5 mr-2" />
                      Student Profile
                    </h4>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      {program.averageAge && (
                        <p className="text-gray-700 dark:text-gray-300 mb-2">
                          <span className="font-medium">Average Age:</span> {program.averageAge} years
                        </p>
                      )}
                      {program.studentProfile && (
                        <p className="text-gray-700 dark:text-gray-300">
                          <span className="font-medium">Profile:</span> {program.studentProfile}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Admission Requirements */}
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Admission Requirements</h4>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {program.admissionRequirements.gmat && (
                        <div>
                          <span className="font-medium text-gray-900 dark:text-white">GMAT:</span>
                          <span className="text-gray-700 dark:text-gray-300 ml-2">{program.admissionRequirements.gmat}+</span>
                        </div>
                      )}
                      {program.admissionRequirements.gre && (
                        <div>
                          <span className="font-medium text-gray-900 dark:text-white">GRE:</span>
                          <span className="text-gray-700 dark:text-gray-300 ml-2">{program.admissionRequirements.gre}+</span>
                        </div>
                      )}
                      {program.admissionRequirements.toefl && (
                        <div>
                          <span className="font-medium text-gray-900 dark:text-white">TOEFL:</span>
                          <span className="text-gray-700 dark:text-gray-300 ml-2">{program.admissionRequirements.toefl}+</span>
                        </div>
                      )}
                      {program.admissionRequirements.ielts && (
                        <div>
                          <span className="font-medium text-gray-900 dark:text-white">IELTS:</span>
                          <span className="text-gray-700 dark:text-gray-300 ml-2">{program.admissionRequirements.ielts}+</span>
                        </div>
                      )}
                      {program.admissionRequirements.workExperience && (
                        <div className="md:col-span-2">
                          <span className="font-medium text-gray-900 dark:text-white">Work Experience:</span>
                          <span className="text-gray-700 dark:text-gray-300 ml-2">{program.admissionRequirements.workExperience}</span>
                        </div>
                      )}
                    </div>
                    
                    {program.admissionRequirements.other && program.admissionRequirements.other.length > 0 && (
                      <div className="mt-4">
                        <span className="font-medium text-gray-900 dark:text-white">Additional Requirements:</span>
                        <ul className="list-disc list-inside mt-2 text-gray-700 dark:text-gray-300">
                          {program.admissionRequirements.other.map((req, index) => (
                            <li key={index}>{req}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-600">
                  <button
                    onClick={onClose}
                    className="btn-secondary"
                  >
                    Close
                  </button>
                  <a
                    href={program.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary inline-flex items-center"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Visit Program Website
                  </a>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}