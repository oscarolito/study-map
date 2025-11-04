'use client'

import { Program } from '../types/program'
import { MapPin, Clock, Globe, DollarSign, Star, ExternalLink } from 'lucide-react'

interface ProgramListProps {
  programs: Program[]
  onProgramSelect: (program: Program) => void
}

export default function ProgramList({ programs, onProgramSelect }: ProgramListProps) {
  const formatTuition = (tuition: Program['tuition']) => {
    const symbol = tuition.currency === 'USD' ? '$' : tuition.currency === 'EUR' ? '€' : '£'
    return `${symbol}${tuition.amount.toLocaleString()}`
  }

  const getBestRanking = (rankings?: Program['ranking']) => {
    if (!rankings || rankings.length === 0) return null
    return rankings.reduce((best, current) => 
      current.position < best.position ? current : best
    )
  }

  return (
    <div className="h-full overflow-y-auto bg-gray-50 dark:bg-gray-900">
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Masters in Finance Programs
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {programs.length} programs found
          </p>
        </div>

        <div className="grid gap-6">
          {programs.map(program => {
            const bestRanking = getBestRanking(program.ranking)
            
            return (
              <div
                key={program.id}
                className="card p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => onProgramSelect(program)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                      {program.name}
                    </h3>
                    <p className="text-lg text-primary-600 dark:text-primary-400 font-medium mb-2">
                      {program.school}
                    </p>
                    <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{program.city}, {program.country}</span>
                    </div>
                  </div>
                  
                  {bestRanking && (
                    <div className="flex items-center bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-3 py-1 rounded-full text-sm font-medium">
                      <Star className="h-4 w-4 mr-1" />
                      #{bestRanking.position} {bestRanking.source}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{program.duration}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Globe className="h-4 w-4 mr-2" />
                    <span>{program.language.join(', ')}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <DollarSign className="h-4 w-4 mr-2" />
                    <span>{formatTuition(program.tuition)}</span>
                  </div>
                  
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">{program.type}</span>
                  </div>
                </div>

                {program.description && (
                  <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">
                    {program.description}
                  </p>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    {program.averageAge && (
                      <span>Avg. age: {program.averageAge}</span>
                    )}
                    {program.admissionRequirements.gmat && (
                      <span>GMAT: {program.admissionRequirements.gmat}+</span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <a
                      href={program.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 text-sm font-medium"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Visit Website
                    </a>
                    <button className="btn-primary text-sm">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {programs.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <MapPin className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No programs found
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