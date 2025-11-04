'use client'

import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { X, MapPin, Globe, Users, ExternalLink, Clock, BookOpen, DollarSign, Calendar, Mail, FileText, Plus, Check } from 'lucide-react'
import { SchoolWithPrograms } from '../types/sheets'
import { useAccessControl } from '../hooks/useAccessControl'
import { useUserPlan } from '../hooks/useUserPlan'
import UpgradePrompt from './UpgradePrompt'

interface SchoolModalProps {
  school: SchoolWithPrograms
  onClose: () => void
  comparison?: {
    addToComparison: (program: any, schoolName?: string) => Promise<boolean>
    isInComparison: (programId: string) => boolean
  }
}

export default function SchoolModal({ school, onClose, comparison }: SchoolModalProps) {
  const { showUpgradePrompt, handleProgramAccess, closeUpgradePrompt } = useAccessControl()
  const { programsViewed, maxViews } = useUserPlan()

  const handleProgramClick = async (program: any, link: string) => {
    const canAccess = await handleProgramAccess(program.id, school.name)
    if (canAccess) {
      window.open(link, '_blank', 'noopener,noreferrer')
    }
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
              <Dialog.Panel className="w-full max-w-6xl max-h-[90vh] transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-start justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-start space-x-4">
                    {school.logo && (
                      <img 
                        src={school.logo} 
                        alt={school.name}
                        className="w-16 h-16 object-contain rounded-lg border border-gray-200 dark:border-gray-700"
                      />
                    )}
                    <div>
                      <Dialog.Title as="h3" className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {school.name}
                      </Dialog.Title>
                      <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
                        <MapPin className="h-5 w-5 mr-2" />
                        <span className="text-lg">{school.country}</span>
                        {school.campus && (
                          <>
                            <span className="mx-2">•</span>
                            <span>{school.campus}</span>
                          </>
                        )}
                      </div>
                      {school.accreditation && (
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-medium">Accreditation:</span> {school.accreditation}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <button
                    onClick={onClose}
                    className="rounded-md bg-gray-100 dark:bg-gray-700 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
                  {/* School Info */}
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {school.year && (
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                          <div className="flex items-center mb-2">
                            <Calendar className="h-5 w-5 text-primary-600 mr-2" />
                            <span className="font-medium text-gray-900 dark:text-white">Established</span>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300">{school.year}</p>
                        </div>
                      )}

                      {school.alumni && (
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                          <div className="flex items-center mb-2">
                            <Users className="h-5 w-5 text-primary-600 mr-2" />
                            <span className="font-medium text-gray-900 dark:text-white">Alumni Network</span>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300">{school.alumni}</p>
                        </div>
                      )}

                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <BookOpen className="h-5 w-5 text-primary-600 mr-2" />
                          <span className="font-medium text-gray-900 dark:text-white">Programs</span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300">{school.programs.length} Masters programs</p>
                      </div>
                    </div>
                  </div>

                  {/* Programs */}
                  <div className="p-6">
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                      Masters Programs ({school.programs.length})
                    </h4>
                    
                    <div className="grid gap-6">
                      {school.programs.map(program => (
                        <div key={program.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h5 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                {program.name}
                              </h5>
                              {program.domain && (
                                <span className="inline-block bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 px-3 py-1 rounded-full text-sm font-medium">
                                  {program.domain}
                                </span>
                              )}
                            </div>
                            {program.price && (
                              <div className="text-right">
                                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                                  {program.price}
                                </div>
                              </div>
                            )}
                          </div>

                          {program.description && (
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                              {program.description}
                            </p>
                          )}

                          {/* Program Details Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                              <Clock className="h-4 w-4 mr-2" />
                              <span>{program.duration}</span>
                            </div>
                            
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                              <Globe className="h-4 w-4 mr-2" />
                              <span>{program.language.join(', ')}</span>
                            </div>
                            
                            {program.type && (
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                <span className="font-medium">{program.type}</span>
                              </div>
                            )}

                            {program.intake && (
                              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                <Calendar className="h-4 w-4 mr-2" />
                                <span>{program.intake}</span>
                              </div>
                            )}
                          </div>

                          {/* Additional Info */}
                          {(program.prerequisites || program.deadline || program.director) && (
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                              {program.prerequisites && (
                                <div className="mb-3">
                                  <span className="font-medium text-gray-900 dark:text-white">Prerequisites:</span>
                                  <p className="text-gray-700 dark:text-gray-300 mt-1">{program.prerequisites}</p>
                                </div>
                              )}
                              
                              {program.deadline && (
                                <div className="mb-3">
                                  <span className="font-medium text-gray-900 dark:text-white">Application Deadline:</span>
                                  <p className="text-gray-700 dark:text-gray-300 mt-1">{program.deadline}</p>
                                </div>
                              )}

                              {program.director && (
                                <div className="mb-3">
                                  <span className="font-medium text-gray-900 dark:text-white">Program Director:</span>
                                  <p className="text-gray-700 dark:text-gray-300 mt-1">{program.director}</p>
                                </div>
                              )}

                              {program.requiredDocuments.length > 0 && (
                                <div>
                                  <span className="font-medium text-gray-900 dark:text-white">Required Documents:</span>
                                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mt-1">
                                    {program.requiredDocuments.map((doc, index) => (
                                      <li key={index}>{doc}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                              {program.contact && (
                                <div className="flex items-center">
                                  <Mail className="h-4 w-4 mr-1" />
                                  <span>{program.contact}</span>
                                </div>
                              )}
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              {comparison && (
                                <button
                                  onClick={async () => {
                                    await comparison.addToComparison(program, school.name)
                                  }}
                                  className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                                    comparison.isInComparison(program.id)
                                      ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                      : 'bg-gray-100 text-gray-700 hover:bg-primary-100 hover:text-primary-700 dark:bg-gray-700 dark:text-gray-300'
                                  }`}
                                >
                                  {comparison.isInComparison(program.id) ? (
                                    <>
                                      <Check className="h-4 w-4 mr-1" />
                                      In Comparison
                                    </>
                                  ) : (
                                    <>
                                      <Plus className="h-4 w-4 mr-1" />
                                      Compare
                                    </>
                                  )}
                                </button>
                              )}
                              {program.link && (
                                <button
                                  onClick={() => handleProgramClick(program, program.link)}
                                  className="flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 text-sm font-medium"
                                >
                                  <ExternalLink className="h-4 w-4 mr-1" />
                                  Program Info
                                </button>
                              )}
                              {program.applicationLink && (
                                <button
                                  onClick={() => handleProgramClick(program, program.applicationLink)}
                                  className="btn-primary text-sm"
                                >
                                  Apply Now
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-200 dark:border-gray-600">
                  <button
                    onClick={onClose}
                    className="btn-secondary"
                  >
                    Close
                  </button>
                  {school.website && (
                    <a
                      href={school.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary inline-flex items-center"
                    >
                      <Globe className="h-4 w-4 mr-2" />
                      Visit School Website
                    </a>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>

        {/* Upgrade Prompt */}
        <UpgradePrompt
          isOpen={showUpgradePrompt}
          onClose={closeUpgradePrompt}
          programsViewed={programsViewed}
          maxViews={maxViews}
        />
      </Dialog>
    </Transition>
  )
}