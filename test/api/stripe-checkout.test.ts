import { NextRequest } from 'next/server';

// Mock dependencies first
vi.mock('@/lib/firebase-admin', () => ({
  adminAuth: {
    verifyIdToken: vi.fn(),
  },
}));

vi.mock('@/lib/stripe', () => ({
  stripe: {
    checkout: {
      sessions: {
        create: vi.fn(),
      },
    },
  },
  createOrRetrieveCustomer: vi.fn(),
}));

vi.mock('@supabase/supabase-js', () => ({
  createClient: () => global.mockSupabase,
}));

// Import after mocking
import { POST } from '@/app/api/stripe/checkout/route';
import { adminAuth } from '@/lib/firebase-admin';
import { stripe, createOrRetrieveCustomer } from '@/lib/stripe';

describe('/api/stripe/checkout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createRequest = (body: any) => {
    return {
      json: () => Promise.resolve(body),
    } as NextRequest;
  };

  it('should create checkout session for valid user', async () => {
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      plan: 'free',
    };

    const mockSession = {
      id: 'cs_test_123',
      url: 'https://checkout.stripe.com/pay/cs_test_123',
    };

    vi.mocked(adminAuth.verifyIdToken).mockResolvedValue({ uid: 'firebase-uid-123' } as any);
    global.mockSupabase.from().select().eq().single.mockResolvedValue({
      data: mockUser,
      error: null,
    });
    vi.mocked(createOrRetrieveCustomer).mockResolvedValue('cus_test_123');
    vi.mocked(stripe.checkout.sessions.create).mockResolvedValue(mockSession as any);

    const request = createRequest({ idToken: 'valid-token' });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.sessionId).toBe('cs_test_123');
    expect(data.url).toBe('https://checkout.stripe.com/pay/cs_test_123');
    expect(stripe.checkout.sessions.create).toHaveBeenCalledWith(
      expect.objectContaining({
        customer: 'cus_test_123',
        line_items: expect.arrayContaining([
          expect.objectContaining({
            price_data: expect.objectContaining({
              unit_amount: 2000, // €20.00
              currency: 'eur',
            }),
          }),
        ]),
        metadata: {
          userId: 'user-123',
          firebaseUid: 'firebase-uid-123',
        },
      })
    );
  });

  it('should return 401 for missing token', async () => {
    const request = createRequest({});
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Authentication required');
  });

  it('should return 404 for non-existent user', async () => {
    vi.mocked(adminAuth.verifyIdToken).mockResolvedValue({ uid: 'firebase-uid-123' } as any);
    global.mockSupabase.from().select().eq().single.mockResolvedValue({
      data: null,
      error: { message: 'User not found' },
    });

    const request = createRequest({ idToken: 'valid-token' });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe('User not found');
  });

  it('should return 400 for user with premium plan', async () => {
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      plan: 'premium',
    };

    vi.mocked(adminAuth.verifyIdToken).mockResolvedValue({ uid: 'firebase-uid-123' } as any);
    global.mockSupabase.from().select().eq().single.mockResolvedValue({
      data: mockUser,
      error: null,
    });

    const request = createRequest({ idToken: 'valid-token' });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('User already has premium plan');
  });

  it('should handle Firebase token verification failure', async () => {
    vi.mocked(adminAuth.verifyIdToken).mockRejectedValue(new Error('Invalid token'));

    const request = createRequest({ idToken: 'invalid-token' });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Failed to create checkout session');
  });

  it('should handle Stripe checkout session creation failure', async () => {
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      plan: 'free',
    };

    vi.mocked(adminAuth.verifyIdToken).mockResolvedValue({ uid: 'firebase-uid-123' } as any);
    global.mockSupabase.from().select().eq().single.mockResolvedValue({
      data: mockUser,
      error: null,
    });
    vi.mocked(createOrRetrieveCustomer).mockResolvedValue('cus_test_123');
    vi.mocked(stripe.checkout.sessions.create).mockRejectedValue(new Error('Stripe error'));

    const request = createRequest({ idToken: 'valid-token' });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Failed to create checkout session');
  });
});