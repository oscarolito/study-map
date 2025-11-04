'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  plan: 'free' | 'premium';
  programs_viewed: number;
}

interface AuthContextType {
  user: User | null;
  firebaseUser: any;
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
  const [loading, setLoading] = useState(false);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setUser({
      id: '1',
      email,
      plan: 'free',
      programs_viewed: 0
    });
    setLoading(false);
  };

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setUser({
      id: '1',
      email,
      plan: 'free',
      programs_viewed: 0
    });
    setLoading(false);
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setUser({
      id: '1',
      email: 'user@example.com',
      plan: 'free',
      programs_viewed: 0
    });
    setLoading(false);
  };

  const signOut = async () => {
    setUser(null);
  };

  const refreshUserData = async () => {
    // No-op for now
  };

  const value: AuthContextType = {
    user,
    firebaseUser: null,
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