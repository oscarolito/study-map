'use client'

import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { X, MapPin, GraduationCap, Globe } from 'lucide-react'
import { ClusterPoint } from '../lib/clustering'
import { SchoolWithPrograms } from '../types/sheets'

interface ClusterModalProps {
  cluster: ClusterPoint
  onClose: () => void
  onSchoolSelect: (school: SchoolWithPrograms) => void
}

export default function ClusterModal({ cluster, onClose, onSchoolSelect }: ClusterModalProps) {
  const totalPrograms = cluster.schools.reduce((sum, school) => sum + school.programs.length, 0)

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
              <Dialog.Panel className="w-full max-w-4xl max-h-[80vh] transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                  <div>
                    <Dialog.Title as="h3" className="text-xl font-bold text-gray-900 dark:text-white">
                      Schools in this area
                    </Dialog.Title>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      {cluster.schools.length} schools • {totalPrograms} total programs
                    </p>
                  </div>
                  
                  <button
                    onClick={onClose}
                    className="rounded-md bg-gray-100 dark:bg-gray-700 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Schools List */}
                <div className="overflow-y-auto max-h-[calc(80vh-120px)] p-6">
                  <div className="grid gap-4">
                    {cluster.schools.map(school => (
                      <div
                        key={school.id}
                        className="card p-4 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => {
                          onSchoolSelect(school)
                          onClose()
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            {school.logo && (
                              <img 
                                src={school.logo} 
                                alt={school.name}
                                className="w-12 h-12 object-contain rounded-lg border border-gray-200 dark:border-gray-700"
                              />
                            )}
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                                {school.name}
                              </h4>
                              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
                                <MapPin className="h-4 w-4 mr-1" />
                                <span>{school.country}</span>
                                {school.campus && (
                                  <>
                                    <span className="mx-2">•</span>
                                    <span>{school.campus}</span>
                                  </>
                                )}
                              </div>
                              
                              {/* Programs preview */}
                              <div className="flex flex-wrap gap-1 mb-2">
                                {school.programs.slice(0, 3).map((program, index) => (
                                  <span 
                                    key={index}
                                    className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs"
                                  >
                                    {program.name}
                                  </span>
                                ))}
                                {school.programs.length > 3 && (
                                  <span className="inline-block bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 px-2 py-1 rounded text-xs">
                                    +{school.programs.length - 3} more
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="flex items-center bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 px-2 py-1 rounded-full text-sm font-medium mb-2">
                              <GraduationCap className="h-4 w-4 mr-1" />
                              {school.programs.length}
                            </div>
                            {school.website && (
                              <a
                                href={school.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 text-sm"
                              >
                                <Globe className="h-4 w-4" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end p-6 border-t border-gray-200 dark:border-gray-600">
                  <button
                    onClick={onClose}
                    className="btn-secondary"
                  >
                    Close
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