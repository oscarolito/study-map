'use client'

import { SchoolWithPrograms } from '../types/sheets'
import { MapPin, Globe, Users, ExternalLink, GraduationCap, Plus, Check } from 'lucide-react'

interface SchoolListProps {
  schools: SchoolWithPrograms[]
  onSchoolSelect: (school: SchoolWithPrograms) => void
  comparison?: {
    addToComparison: (program: any, schoolName?: string) => Promise<boolean>
    isInComparison: (programId: string) => boolean
  }
}

export default function SchoolList({ schools, onSchoolSelect, comparison }: SchoolListProps) {
  return (
    <div className="h-full overflow-y-auto bg-gray-50 dark:bg-gray-900">
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Business Schools & Universities
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {schools.length} schools • {schools.reduce((sum, school) => sum + school.programs.length, 0)} total programs
          </p>
        </div>

        <div className="grid gap-6">
          {schools.map(school => (
            <div
              key={school.id}
              className="card p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onSchoolSelect(school)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4 flex-1">
                  {school.logo && (
                    <img 
                      src={school.logo} 
                      alt={school.name}
                      className="w-16 h-16 object-contain rounded-lg border border-gray-200 dark:border-gray-700"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                      {school.name}
                    </h3>
                    <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{school.country}</span>
                      {school.campus && (
                        <>
                          <span className="mx-2">•</span>
                          <span>{school.campus}</span>
                        </>
                      )}
                    </div>
                    {school.accreditation && (
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                        <span className="font-medium">Accreditation:</span>
                        <span className="ml-1">{school.accreditation}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 px-3 py-1 rounded-full text-sm font-medium mb-2">
                    <GraduationCap className="h-4 w-4 mr-1" />
                    {school.programs.length} programs
                  </div>
                  {school.year && (
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Est. {school.year}
                    </div>
                  )}
                </div>
              </div>

              {/* Programs Preview */}
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Programs:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {school.programs.slice(0, 4).map(program => (
                    <div key={program.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 relative">
                      <h5 className="font-medium text-sm text-gray-900 dark:text-white mb-1">
                        {program.name}
                      </h5>
                      <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                        <span>{program.duration}</span>
                        <span>{program.language.join(', ')}</span>
                      </div>
                      {program.price && (
                        <div className="text-xs text-primary-600 dark:text-primary-400 font-medium mt-1">
                          {program.price}
                        </div>
                      )}
                      
                      {/* Comparison Button */}
                      {comparison && (
                        <button
                          onClick={async (e) => {
                            e.stopPropagation()
                            await comparison.addToComparison(program, school.name)
                          }}
                          className={`absolute top-2 right-2 p-1 rounded-full transition-colors ${
                            comparison.isInComparison(program.id)
                              ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400'
                              : 'bg-white dark:bg-gray-600 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400'
                          }`}
                          title={comparison.isInComparison(program.id) ? 'In comparison' : 'Add to comparison'}
                        >
                          {comparison.isInComparison(program.id) ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <Plus className="h-3 w-3" />
                          )}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {school.programs.length > 4 && (
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    +{school.programs.length - 4} more programs
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  {school.alumni && (
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{school.alumni} alumni</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  {school.website && (
                    <a
                      href={school.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 text-sm font-medium"
                    >
                      <Globe className="h-4 w-4 mr-1" />
                      Visit Website
                    </a>
                  )}
                  <button className="btn-primary text-sm">
                    View Programs
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {schools.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <GraduationCap className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No schools found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your filters to see more results.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}