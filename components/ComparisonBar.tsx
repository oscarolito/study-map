'use client'

import { Scale, X, Eye } from 'lucide-react'
import { ProgramInfo } from '../types/sheets'

interface ComparisonBarProps {
  programs: ProgramInfo[]
  onRemoveProgram: (programId: string) => void
  onOpenComparison: () => void
  onClearAll: () => void
}

export default function ComparisonBar({ programs, onRemoveProgram, onOpenComparison, onClearAll }: ComparisonBarProps) {
  if (programs.length === 0) return null

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 min-w-96">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <Scale className="h-5 w-5 text-primary-600 mr-2" />
            <span className="font-medium text-gray-900 dark:text-white">
              Compare Programs ({programs.length}/3)
            </span>
          </div>
          <button
            onClick={onClearAll}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-2 mb-4">
          {programs.map(program => (
            <div key={program.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-lg p-2">
              <div className="flex-1">
                <div className="font-medium text-sm text-gray-900 dark:text-white">
                  {program.name}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {program.domain} • {program.duration}
                </div>
              </div>
              <button
                onClick={() => onRemoveProgram(program.id)}
                className="text-gray-400 hover:text-red-500 transition-colors ml-2"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex space-x-2">
          <button
            onClick={onOpenComparison}
            disabled={programs.length < 2}
            className={`flex-1 inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors ${
              programs.length >= 2
                ? 'bg-primary-600 hover:bg-primary-700 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Eye className="h-4 w-4 mr-2" />
            Compare
          </button>
        </div>

        {programs.length < 2 && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
            Add at least 2 programs to compare
          </p>
        )}
      </div>
    </div>
  )
}