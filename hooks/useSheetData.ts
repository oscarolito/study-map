'use client'

import { useState, useEffect } from 'react'
import { fetchSecureSheetData } from '../lib/secureGoogleSheets'
import { transformToSchoolsWithPrograms, extractFilterOptions } from '../lib/dataTransform'
import { SchoolWithPrograms } from '../types/sheets'

export function useSheetData() {
  const [schools, setSchools] = useState<SchoolWithPrograms[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [filterOptions, setFilterOptions] = useState({
    countries: [],
    languages: [],
    durations: [],
    programTypes: [],
    domains: [],
    priceRange: [0, 100000] as [number, number]
  })

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const combinedData = await fetchSecureSheetData()
      const transformedSchools = transformToSchoolsWithPrograms(combinedData)
      const options = extractFilterOptions(transformedSchools)
      
      setSchools(transformedSchools)
      setFilterOptions(options)
      setLastUpdated(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const refreshData = () => {
    fetchData()
  }

  return {
    schools,
    loading,
    error,
    lastUpdated,
    filterOptions,
    refreshData
  }
}