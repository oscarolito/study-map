'use client'

import { useState } from 'react'
import { ProgramInfo } from '../types/sheets'
import { useAccessControl } from './useAccessControl'

export function useComparison() {
  const [comparisonPrograms, setComparisonPrograms] = useState<ProgramInfo[]>([])
  const [showComparison, setShowComparison] = useState(false)
  const { handleProgramAccess } = useAccessControl()

  const addToComparison = async (program: ProgramInfo, schoolName?: string) => {
    // Check if program is already in comparison
    if (comparisonPrograms.find(p => p.id === program.id)) {
      return true // Already in comparison, no need to track again
    }

    // Check access control before adding to comparison
    const canAccess = await handleProgramAccess(program.id, schoolName || 'Unknown School')
    
    if (!canAccess) {
      return false // Access denied, upgrade prompt will be shown
    }

    // Add to comparison if access is granted
    if (comparisonPrograms.length >= 3) {
      // Replace the oldest program if we have 3 already
      setComparisonPrograms([...comparisonPrograms.slice(1), program])
    } else {
      setComparisonPrograms([...comparisonPrograms, program])
    }
    
    return true
  }

  const removeFromComparison = (programId: string) => {
    setComparisonPrograms(comparisonPrograms.filter(p => p.id !== programId))
  }

  const clearComparison = () => {
    setComparisonPrograms([])
    setShowComparison(false)
  }

  const isInComparison = (programId: string) => {
    return comparisonPrograms.some(p => p.id === programId)
  }

  const openComparison = () => {
    if (comparisonPrograms.length >= 2) {
      setShowComparison(true)
    }
  }

  const closeComparison = () => {
    setShowComparison(false)
  }

  return {
    comparisonPrograms,
    showComparison,
    addToComparison,
    removeFromComparison,
    clearComparison,
    isInComparison,
    openComparison,
    closeComparison
  }
}