'use client';

import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserPlan } from '@/hooks/useUserPlan';

interface UseAccessControlReturn {
  canAccessProgram: boolean;
  showUpgradePrompt: boolean;
  handleProgramAccess: (programId: string, schoolName: string) => Promise<boolean>;
  closeUpgradePrompt: () => void;
}

export function useAccessControl(): UseAccessControlReturn {
  const { user } = useAuth();
  const { plan, canViewProgram, incrementProgramView } = useUserPlan();
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);

  const handleProgramAccess = useCallback(async (programId: string, schoolName: string): Promise<boolean> => {
    if (!user) {
      // User not authenticated - this should be handled by middleware
      return false;
    }

    if (plan === 'premium') {
      // Premium users have unlimited access
      try {
        await incrementProgramView(programId, schoolName);
        return true;
      } catch (error) {
        console.error('Error tracking program view:', error);
        return true; // Still allow access for premium users even if tracking fails
      }
    }

    if (!canViewProgram) {
      // Free user has reached limit
      setShowUpgradePrompt(true);
      return false;
    }

    // Free user within limit
    try {
      await incrementProgramView(programId, schoolName);
      return true;
    } catch (error) {
      console.error('Error incrementing program view:', error);
      // Show upgrade prompt if there's an error (likely means they hit the limit)
      setShowUpgradePrompt(true);
      return false;
    }
  }, [user, plan, canViewProgram, incrementProgramView]);

  const closeUpgradePrompt = useCallback(() => {
    setShowUpgradePrompt(false);
  }, []);

  return {
    canAccessProgram: canViewProgram,
    showUpgradePrompt,
    handleProgramAccess,
    closeUpgradePrompt
  };
}