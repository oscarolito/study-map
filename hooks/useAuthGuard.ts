'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface UseAuthGuardOptions {
  redirectTo?: string;
  requireAuth?: boolean;
}

/**
 * Hook to guard routes based on authentication status
 * @param options Configuration options
 * @returns Authentication status and loading state
 */
export function useAuthGuard(options: UseAuthGuardOptions = {}) {
  const { 
    redirectTo = '/login', 
    requireAuth = true 
  } = options;
  
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Don't redirect while loading
    if (loading) return;

    // If authentication is required but user is not authenticated
    if (requireAuth && !user) {
      const currentPath = window.location.pathname;
      const redirectUrl = `${redirectTo}?redirect=${encodeURIComponent(currentPath)}`;
      router.push(redirectUrl);
      return;
    }

    // If authentication is not required but user is authenticated (e.g., login page)
    if (!requireAuth && user) {
      // Check if there's a redirect parameter
      const urlParams = new URLSearchParams(window.location.search);
      const redirect = urlParams.get('redirect');
      router.push(redirect || '/map');
      return;
    }
  }, [user, loading, requireAuth, redirectTo, router]);

  return {
    user,
    loading,
    isAuthenticated: !!user,
    isReady: !loading
  };
}