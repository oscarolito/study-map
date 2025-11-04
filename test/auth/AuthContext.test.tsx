import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { User } from '@/types/database';

// Test component to access auth context
function TestComponent() {
  const { user, loading, signIn, signUp, signInWithGoogle, signOut } = useAuth();
  
  return (
    <div>
      <div data-testid="loading">{loading ? 'loading' : 'loaded'}</div>
      <div data-testid="user">{user ? user.email : 'no user'}</div>
      <button onClick={() => signIn('test@example.com', 'password')}>Sign In</button>
      <button onClick={() => signUp('test@example.com', 'password')}>Sign Up</button>
      <button onClick={signInWithGoogle}>Sign In with Google</button>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should provide auth context to children', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('loading')).toHaveTextContent('loaded');
    expect(screen.getByTestId('user')).toHaveTextContent('no user');
  });

  it('should handle sign in', async () => {
    const mockUser = { uid: '123', email: 'test@example.com', getIdToken: vi.fn().mockResolvedValue('token') };
    const mockSupabaseUser: User = {
      id: '123',
      email: 'test@example.com',
      firebase_uid: '123',
      plan: 'free',
      programs_viewed: 0,
      payment_status: 'pending',
      stripe_customer_id: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    global.mockAuth.signInWithEmailAndPassword.mockResolvedValue({ user: mockUser });
    global.mockSupabase.from().select().eq().single.mockResolvedValue({ data: mockSupabaseUser, error: null });
    
    // Mock fetch for session creation
    global.fetch = vi.fn().mockResolvedValue({ ok: true });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const signInButton = screen.getByText('Sign In');
    signInButton.click();

    await waitFor(() => {
      expect(global.mockAuth.signInWithEmailAndPassword).toHaveBeenCalledWith(
        global.mockAuth,
        'test@example.com',
        'password'
      );
    });
  });

  it('should handle sign up', async () => {
    const mockUser = { uid: '123', email: 'test@example.com', getIdToken: vi.fn().mockResolvedValue('token') };
    const mockSupabaseUser: User = {
      id: '123',
      email: 'test@example.com',
      firebase_uid: '123',
      plan: 'free',
      programs_viewed: 0,
      payment_status: 'pending',
      stripe_customer_id: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    global.mockAuth.createUserWithEmailAndPassword.mockResolvedValue({ user: mockUser });
    global.mockSupabase.from().select().eq().single.mockResolvedValue({ data: null, error: { code: 'PGRST116' } });
    global.mockSupabase.from().insert().select().single.mockResolvedValue({ data: mockSupabaseUser, error: null });
    
    // Mock fetch for session creation
    global.fetch = vi.fn().mockResolvedValue({ ok: true });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const signUpButton = screen.getByText('Sign Up');
    signUpButton.click();

    await waitFor(() => {
      expect(global.mockAuth.createUserWithEmailAndPassword).toHaveBeenCalledWith(
        global.mockAuth,
        'test@example.com',
        'password'
      );
    });
  });

  it('should handle Google sign in', async () => {
    const mockUser = { uid: '123', email: 'test@example.com', getIdToken: vi.fn().mockResolvedValue('token') };
    const mockSupabaseUser: User = {
      id: '123',
      email: 'test@example.com',
      firebase_uid: '123',
      plan: 'free',
      programs_viewed: 0,
      payment_status: 'pending',
      stripe_customer_id: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    global.mockAuth.signInWithPopup.mockResolvedValue({ user: mockUser });
    global.mockSupabase.from().select().eq().single.mockResolvedValue({ data: mockSupabaseUser, error: null });
    
    // Mock fetch for session creation
    global.fetch = vi.fn().mockResolvedValue({ ok: true });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const googleSignInButton = screen.getByText('Sign In with Google');
    googleSignInButton.click();

    await waitFor(() => {
      expect(global.mockAuth.signInWithPopup).toHaveBeenCalledWith(
        global.mockAuth,
        global.mockGoogleProvider
      );
    });
  });

  it('should handle sign out', async () => {
    global.mockAuth.signOut.mockResolvedValue(undefined);
    global.fetch = vi.fn().mockResolvedValue({ ok: true });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const signOutButton = screen.getByText('Sign Out');
    signOutButton.click();

    await waitFor(() => {
      expect(global.mockAuth.signOut).toHaveBeenCalled();
      expect(global.fetch).toHaveBeenCalledWith('/api/auth/session', {
        method: 'DELETE',
      });
    });
  });

  it('should throw error when useAuth is used outside AuthProvider', () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useAuth must be used within an AuthProvider');
    
    consoleSpy.mockRestore();
  });
});