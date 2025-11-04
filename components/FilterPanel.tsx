'use client'

import { useState } from 'react'
import { Search, Filter, X, ChevronDown, ChevronUp } from 'lucide-react'
import { programs } from '../data/programs'
import { Filters } from '../types/filters'

interface FilterPanelProps {
  filters: Filters
  onFiltersChange: (filters: Filters) => void
  programCount: number
}

export default function FilterPanel({ filters, onFiltersChange, programCount }: FilterPanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [expandedSections, setExpandedSections] = useState({
    country: true,
    type: true,
    duration: true,
    language: true,
    tuition: true
  })

  // Get unique values for filters
  const countries = [...new Set(programs.map(p => p.country))].sort()
  const types = [...new Set(programs.map(p => p.type))].sort()
  const durations = [...new Set(programs.map(p => p.duration))].sort()
  const languages = [...new Set(programs.flatMap(p => p.language))].sort()

  const updateFilters = (key: keyof Filters, value: any) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const toggleArrayFilter = (key: 'countries' | 'types' | 'durations' | 'languages', value: string) => {
    const currentArray = filters[key]
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value]
    updateFilters(key, newArray)
  }

  const clearAllFilters = () => {
    onFiltersChange({
      countries: [],
      types: [],
      durations: [],
      languages: [],
      tuitionRange: [0, 100000],
      searchQuery: ''
    })
  }

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  if (isCollapsed) {
    return (
      <div className="w-12 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col items-center py-4">
        <button
          onClick={() => setIsCollapsed(false)}
          className="p-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors"
        >
          <Filter className="h-5 w-5" />
        </button>
        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 writing-mode-vertical transform rotate-180">
          {programCount} programs
        </div>
      </div>
    )
  }

  return (
    <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filters
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={clearAllFilters}
              className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
            >
              Clear all
            </button>
            <button
              onClick={() => setIsCollapsed(true)}
              className="p-1 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search programs or schools..."
            value={filters.searchQuery}
            onChange={(e) => updateFilters('searchQuery', e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Results count */}
        <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
          {programCount} programs found
        </div>
      </div>

      {/* Filters */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Country Filter */}
        <div>
          <button
            onClick={() => toggleSection('country')}
            className="flex items-center justify-between w-full text-left font-medium text-gray-900 dark:text-white mb-3"
          >
            Country
            {expandedSections.country ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          {expandedSections.country && (
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {countries.map(country => (
                <label key={country} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.countries.includes(country)}
                    onChange={() => toggleArrayFilter('countries', country)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{country}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Type Filter */}
        <div>
          <button
            onClick={() => toggleSection('type')}
            className="flex items-center justify-between w-full text-left font-medium text-gray-900 dark:text-white mb-3"
          >
            Institution Type
            {expandedSections.type ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          {expandedSections.type && (
            <div className="space-y-2">
              {types.map(type => (
                <label key={type} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.types.includes(type)}
                    onChange={() => toggleArrayFilter('types', type)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{type}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Duration Filter */}
        <div>
          <button
            onClick={() => toggleSection('duration')}
            className="flex items-center justify-between w-full text-left font-medium text-gray-900 dark:text-white mb-3"
          >
            Duration
            {expandedSections.duration ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          {expandedSections.duration && (
            <div className="space-y-2">
              {durations.map(duration => (
                <label key={duration} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.durations.includes(duration)}
                    onChange={() => toggleArrayFilter('durations', duration)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{duration}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Language Filter */}
        <div>
          <button
            onClick={() => toggleSection('language')}
            className="flex items-center justify-between w-full text-left font-medium text-gray-900 dark:text-white mb-3"
          >
            Language
            {expandedSections.language ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          {expandedSections.language && (
            <div className="space-y-2">
              {languages.map(language => (
                <label key={language} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.languages.includes(language)}
                    onChange={() => toggleArrayFilter('languages', language)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{language}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Tuition Range */}
        <div>
          <button
            onClick={() => toggleSection('tuition')}
            className="flex items-center justify-between w-full text-left font-medium text-gray-900 dark:text-white mb-3"
          >
            Tuition (USD)
            {expandedSections.tuition ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          {expandedSections.tuition && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.tuitionRange[0]}
                  onChange={(e) => updateFilters('tuitionRange', [parseInt(e.target.value) || 0, filters.tuitionRange[1]])}
                  className="w-20 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <span className="text-gray-500">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.tuitionRange[1]}
                  onChange={(e) => updateFilters('tuitionRange', [filters.tuitionRange[0], parseInt(e.target.value) || 100000])}
                  className="w-20 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <input
                type="range"
                min="0"
                max="100000"
                step="5000"
                value={filters.tuitionRange[1]}
                onChange={(e) => updateFilters('tuitionRange', [filters.tuitionRange[0], parseInt(e.target.value)])}
                className="w-full"
              />
              <div className="text-xs text-gray-500 dark:text-gray-400">
                ${filters.tuitionRange[0].toLocaleString()} - ${filters.tuitionRange[1].toLocaleString()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}