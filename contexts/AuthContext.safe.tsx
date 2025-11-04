'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

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
  error: string | null;
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
  const [error, setError] = useState<string | null>(null);

  // Check if environment variables are available
  const hasEnvVars = typeof window !== 'undefined' && 
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY && 
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  useEffect(() => {
    if (!hasEnvVars) {
      setError('Configuration manquante. Vérifiez les variables d\'environnement.');
      setLoading(false);
    }
  }, [hasEnvVars]);

  const signIn = async (email: string, password: string) => {
    if (!hasEnvVars) {
      throw new Error('Configuration manquante');
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Simulate authentication for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUser({
        id: '1',
        email,
        plan: 'free',
        programs_viewed: 0
      });
    } catch (err) {
      setError('Erreur de connexion');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    if (!hasEnvVars) {
      throw new Error('Configuration manquante');
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Simulate authentication for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUser({
        id: '1',
        email,
        plan: 'free',
        programs_viewed: 0
      });
    } catch (err) {
      setError('Erreur d\'inscription');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    if (!hasEnvVars) {
      throw new Error('Configuration manquante');
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Simulate authentication for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUser({
        id: '1',
        email: 'user@example.com',
        plan: 'free',
        programs_viewed: 0
      });
    } catch (err) {
      setError('Erreur de connexion Google');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setUser(null);
    setError(null);
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
    refreshUserData,
    error
  };

  // Show error message if configuration is missing
  if (!hasEnvVars) {
    return (
      <AuthContext.Provider value={value}>
        <div className="min-h-screen flex items-center justify-center bg-red-50">
          <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
            <h2 className="text-xl font-bold text-red-600 mb-4">Configuration manquante</h2>
            <p className="text-gray-600 mb-4">
              Les variables d'environnement ne sont pas configurées correctement.
            </p>
            <p className="text-sm text-gray-500">
              Vérifiez votre fichier .env.local et redémarrez le serveur.
            </p>
          </div>
        </div>
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}