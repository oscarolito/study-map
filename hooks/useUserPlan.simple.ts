import { useAuth } from '@/contexts/AuthContext.minimal';

export function useUserPlan() {
  const { user } = useAuth();
  
  return {
    plan: user?.plan || 'free',
    programsViewed: user?.programs_viewed || 0,
    canViewProgram: () => true, // Allow all for now
    incrementProgramView: () => Promise.resolve(),
    isLoading: false
  };
}