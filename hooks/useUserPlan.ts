'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { ProgramViewInsert } from '@/types/database';

interface UseUserPlanReturn {
  plan: 'free' | 'premium';
  programsViewed: number;
  canViewProgram: boolean;
  isLoading: boolean;
  incrementProgramView: (programId: string, schoolName: string) => Promise<void>;
  upgradeUrl: string;
  remainingViews: number;
  maxViews: number;
}

export function useUserPlan(): UseUserPlanReturn {
  const { user, refreshUserData } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const plan = user?.plan || 'free';
  const programsViewed = user?.programs_viewed || 0;
  const maxViews = plan === 'free' ? 5 : Infinity;
  const remainingViews = plan === 'free' ? Math.max(0, maxViews - programsViewed) : Infinity;
  const canViewProgram = plan === 'premium' || programsViewed < maxViews;

  // Increment program view count
  const incrementProgramView = useCallback(async (programId: string, schoolName: string) => {
    if (!user) {
      throw new Error('User must be authenticated to view programs');
    }

    if (plan === 'free' && programsViewed >= maxViews) {
      throw new Error('Free plan view limit reached. Please upgrade to premium.');
    }

    setIsLoading(true);

    try {
      // Check if user has already viewed this specific program
      const { data: existingView, error: checkError } = await supabase
        .from('program_views')
        .select('id')
        .eq('user_id', user.id)
        .eq('program_id', programId)
        .single();

      // If user hasn't viewed this program before, record the view
      if (checkError && checkError.code === 'PGRST116') {
        // Record the program view
        const programView: ProgramViewInsert = {
          user_id: user.id,
          program_id: programId,
          school_name: schoolName
        };

        const { error: insertError } = await supabase
          .from('program_views')
          .insert(programView);

        if (insertError) {
          throw new Error(`Failed to record program view: ${insertError.message}`);
        }

        // Update user's programs_viewed count
        const { error: updateError } = await supabase
          .from('users')
          .update({ 
            programs_viewed: programsViewed + 1,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);

        if (updateError) {
          throw new Error(`Failed to update user view count: ${updateError.message}`);
        }

        // Refresh user data to get updated count
        await refreshUserData();
      } else if (checkError) {
        throw new Error(`Failed to check existing views: ${checkError.message}`);
      }
      // If user has already viewed this program, don't increment count
    } catch (error: any) {
      console.error('Error incrementing program view:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [user, plan, programsViewed, maxViews, refreshUserData]);

  // Generate upgrade URL (will be used for Stripe Checkout)
  const upgradeUrl = '/pricing'; // This will redirect to pricing page which handles Stripe

  return {
    plan,
    programsViewed,
    canViewProgram,
    isLoading,
    incrementProgramView,
    upgradeUrl,
    remainingViews,
    maxViews
  };
}