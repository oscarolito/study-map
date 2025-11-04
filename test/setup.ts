import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Declare global types
declare global {
  var mockAuth: any;
  var mockSupabase: any;
}

// Mock Firebase
const mockAuth = {
  currentUser: null,
  onAuthStateChanged: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  signInWithPopup: vi.fn(),
  signOut: vi.fn(),
};

const mockGoogleProvider = {};

vi.mock('@/lib/firebase', () => ({
  auth: mockAuth,
  googleProvider: mockGoogleProvider,
}));

// Mock Supabase
const mockSupabase = {
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        single: vi.fn(),
      })),
    })),
    insert: vi.fn(() => ({
      select: vi.fn(() => ({
        single: vi.fn(),
      })),
    })),
    update: vi.fn(() => ({
      eq: vi.fn(),
    })),
  })),
};

vi.mock('@/lib/supabase', () => ({
  supabase: mockSupabase,
}));

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn(),
  }),
}));

// Global test utilities
global.mockAuth = mockAuth;
global.mockSupabase = mockSupabase;