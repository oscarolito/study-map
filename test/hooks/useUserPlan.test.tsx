import { renderHook, act, waitFor } from '@testing-library/react';
import { useUserPlan } from '@/hooks/useUserPlan';
import { User } from '@/types/database';

// Mock the auth context
const mockUser: User = {
  id: '123',
  email: 'test@example.com',
  firebase_uid: '123',
  plan: 'free',
  programs_viewed: 2,
  payment_status: 'pending',
  stripe_customer_id: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

const mockRefreshUserData = vi.fn();
const mockUseAuth = {
  user: mockUser,
  firebaseUser: null,
  loading: false,
  signIn: vi.fn(),
  signUp: vi.fn(),
  signInWithGoogle: vi.fn(),
  signOut: vi.fn(),
  refreshUserData: mockRefreshUserData,
};

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => mockUseAuth,
}));

describe('useUserPlan', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return correct plan information for free user', () => {
    const { result } = renderHook(() => useUserPlan());

    expect(result.current.plan).toBe('free');
    expect(result.current.programsViewed).toBe(2);
    expect(result.current.maxViews).toBe(5);
    expect(result.current.remainingViews).toBe(3);
    expect(result.current.canViewProgram).toBe(true);
    expect(result.current.upgradeUrl).toBe('/pricing');
  });

  it('should return correct plan information for premium user', () => {
    const premiumUser = { ...mockUser, plan: 'premium' as const };
    mockUseAuth.user = premiumUser;

    const { result } = renderHook(() => useUserPlan());

    expect(result.current.plan).toBe('premium');
    expect(result.current.maxViews).toBe(Infinity);
    expect(result.current.remainingViews).toBe(Infinity);
    expect(result.current.canViewProgram).toBe(true);
  });

  it('should prevent viewing when free user reaches limit', () => {
    const limitReachedUser = { ...mockUser, programs_viewed: 5 };
    mockUseAuth.user = limitReachedUser;

    const { result } = renderHook(() => useUserPlan());

    expect(result.current.canViewProgram).toBe(false);
    expect(result.current.remainingViews).toBe(0);
  });

  it('should increment program view for new program', async () => {
    // Set up a user with fewer than 5 views
    const userWithLowViews = { ...mockUser, programs_viewed: 1 };
    mockUseAuth.user = userWithLowViews;

    global.mockSupabase.from().select().eq().single.mockResolvedValue({ 
      data: null, 
      error: { code: 'PGRST116' } 
    });
    global.mockSupabase.from().insert.mockResolvedValue({ error: null });
    global.mockSupabase.from().update().eq.mockResolvedValue({ error: null });

    const { result } = renderHook(() => useUserPlan());

    await act(async () => {
      await result.current.incrementProgramView('program-123', 'Test School');
    });

    expect(global.mockSupabase.from().insert).toHaveBeenCalledWith({
      user_id: '123',
      program_id: 'program-123',
      school_name: 'Test School'
    });
    expect(mockRefreshUserData).toHaveBeenCalled();
  });

  it('should not increment view for already viewed program', async () => {
    // Set up a user with fewer than 5 views
    const userWithLowViews = { ...mockUser, programs_viewed: 1 };
    mockUseAuth.user = userWithLowViews;

    global.mockSupabase.from().select().eq().single.mockResolvedValue({ 
      data: { id: 'existing-view' }, 
      error: null 
    });

    const { result } = renderHook(() => useUserPlan());

    await act(async () => {
      await result.current.incrementProgramView('program-123', 'Test School');
    });

    expect(global.mockSupabase.from().insert).not.toHaveBeenCalled();
    expect(global.mockSupabase.from().update).not.toHaveBeenCalled();
  });

  it('should throw error when unauthenticated user tries to view program', async () => {
    mockUseAuth.user = null;

    const { result } = renderHook(() => useUserPlan());

    await expect(
      result.current.incrementProgramView('program-123', 'Test School')
    ).rejects.toThrow('User must be authenticated to view programs');
  });

  it('should throw error when free user exceeds view limit', async () => {
    const limitReachedUser = { ...mockUser, programs_viewed: 5 };
    mockUseAuth.user = limitReachedUser;

    const { result } = renderHook(() => useUserPlan());

    await expect(
      result.current.incrementProgramView('program-123', 'Test School')
    ).rejects.toThrow('Free plan view limit reached. Please upgrade to premium.');
  });

  it('should handle database errors gracefully', async () => {
    // Set up a user with fewer than 5 views
    const userWithLowViews = { ...mockUser, programs_viewed: 1 };
    mockUseAuth.user = userWithLowViews;

    global.mockSupabase.from().select().eq().single.mockResolvedValue({ 
      data: null, 
      error: { code: 'PGRST116' } 
    });
    global.mockSupabase.from().insert.mockResolvedValue({ 
      error: { message: 'Database error' } 
    });

    const { result } = renderHook(() => useUserPlan());

    await expect(
      result.current.incrementProgramView('program-123', 'Test School')
    ).rejects.toThrow('Failed to record program view: Database error');
  });
});