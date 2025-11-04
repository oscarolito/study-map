'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  UserCredential
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { supabase } from '@/lib/supabase';
import { User, UserInsert } from '@/types/database';
import { logAuthError, trackAuthMetrics, trackConversionEvent, authRateLimiter } from '@/lib/monitoring';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Create or update user in Supabase when Firebase user changes
  const syncUserWithSupabase = async (firebaseUser: FirebaseUser): Promise<User> => {
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('firebase_uid', firebaseUser.uid)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw new Error(`Failed to fetch user: ${fetchError.message}`);
    }

    if (existingUser) {
      // User exists, return the existing user
      return existingUser;
    } else {
      // Create new user
      const newUser: UserInsert = {
        email: firebaseUser.email!,
        firebase_uid: firebaseUser.uid,
        plan: 'free',
        programs_viewed: 0,
        payment_status: 'pending'
      };

      const { data: createdUser, error: createError } = await supabase
        .from('users')
        .insert(newUser)
        .select()
        .single();

      if (createError) {
        throw new Error(`Failed to create user: ${createError.message}`);
      }

      return createdUser;
    }
  };

  // Refresh user data from Supabase
  const refreshUserData = async () => {
    if (!firebaseUser) {
      setUser(null);
      return;
    }

    try {
      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('firebase_uid', firebaseUser.uid)
        .single();

      if (error) {
        console.error('Failed to refresh user data:', error);
        return;
      }

      setUser(userData);
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  };

  // Create session cookie after authentication
  const createSession = async (user: FirebaseUser) => {
    try {
      const idToken = await user.getIdToken();
      const response = await fetch('/api/auth/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) {
        throw new Error('Failed to create session');
      }
    } catch (error) {
      console.error('Session creation error:', error);
      // Don't throw here as authentication was successful
    }
  };

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    // Check rate limiting
    if (!authRateLimiter.isAllowed(email)) {
      const resetTime = authRateLimiter.getResetTime(email);
      const remainingTime = resetTime ? Math.ceil((resetTime - Date.now()) / 60000) : 15;
      throw new Error(`Too many login attempts. Please try again in ${remainingTime} minutes.`);
    }

    trackAuthMetrics('login_attempt', { email });

    try {
      setLoading(true);
      const result = await signInWithEmailAndPassword(auth, email, password);
      await createSession(result.user);
      const supabaseUser = await syncUserWithSupabase(result.user);
      setUser(supabaseUser);
      
      trackAuthMetrics('login_success', { email, userId: supabaseUser.id });
      trackConversionEvent(supabaseUser.id, 'login');
    } catch (error: any) {
      trackAuthMetrics('login_failure', { email, error: error.message });
      logAuthError('Sign in failed', { email, error: error.message });
      throw new Error(error.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string) => {
    // Check rate limiting
    if (!authRateLimiter.isAllowed(email)) {
      const resetTime = authRateLimiter.getResetTime(email);
      const remainingTime = resetTime ? Math.ceil((resetTime - Date.now()) / 60000) : 15;
      throw new Error(`Too many registration attempts. Please try again in ${remainingTime} minutes.`);
    }

    trackAuthMetrics('registration_attempt', { email });

    try {
      setLoading(true);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await createSession(result.user);
      const supabaseUser = await syncUserWithSupabase(result.user);
      setUser(supabaseUser);
      
      trackAuthMetrics('registration_success', { email, userId: supabaseUser.id });
      trackConversionEvent(supabaseUser.id, 'registration');
    } catch (error: any) {
      trackAuthMetrics('registration_failure', { email, error: error.message });
      logAuthError('Sign up failed', { email, error: error.message });
      throw new Error(error.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    trackAuthMetrics('login_attempt', { provider: 'google' });

    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      await createSession(result.user);
      const supabaseUser = await syncUserWithSupabase(result.user);
      setUser(supabaseUser);
      
      trackAuthMetrics('login_success', { provider: 'google', userId: supabaseUser.id });
      trackConversionEvent(supabaseUser.id, 'login');
    } catch (error: any) {
      trackAuthMetrics('login_failure', { provider: 'google', error: error.message });
      logAuthError('Google sign in failed', { error: error.message });
      throw new Error(error.message || 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      // Clear session cookie
      await fetch('/api/auth/session', {
        method: 'DELETE',
      });
      
      // Sign out from Firebase
      await firebaseSignOut(auth);
      setUser(null);
      setFirebaseUser(null);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to sign out');
    }
  };

  // Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          const supabaseUser = await syncUserWithSupabase(firebaseUser);
          setUser(supabaseUser);
        } catch (error) {
          console.error('Error syncing user with Supabase:', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    user,
    firebaseUser,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    refreshUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}