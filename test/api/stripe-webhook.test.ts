import { NextRequest } from 'next/server';
import Stripe from 'stripe';

// Mock dependencies first
vi.mock('@/lib/stripe', () => ({
  stripe: {
    webhooks: {
      constructEvent: vi.fn(),
    },
    checkout: {
      sessions: {
        list: vi.fn(),
      },
    },
  },
  updateUserPlanStatus: vi.fn(),
  logPaymentTransaction: vi.fn(),
}));

// Import after mocking
import { POST } from '@/app/api/stripe/webhook/route';
import { stripe, updateUserPlanStatus, logPaymentTransaction } from '@/lib/stripe';

describe('/api/stripe/webhook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createRequest = (body: string, signature?: string) => {
    return {
      text: () => Promise.resolve(body),
      headers: {
        get: (name: string) => name === 'stripe-signature' ? signature : null,
      },
    } as NextRequest;
  };

  it('should handle checkout.session.completed event', async () => {
    const mockEvent: Stripe.Event = {
      id: 'evt_test_123',
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'cs_test_123',
          amount_total: 2000,
          currency: 'eur',
          metadata: {
            userId: 'user-123',
            firebaseUid: 'firebase-uid-123',
          },
        } as Stripe.Checkout.Session,
      },
      created: Date.now(),
      livemode: false,
      pending_webhooks: 1,
      request: { id: null, idempotency_key: null },
      api_version: '2020-08-27',
      object: 'event',
    };

    vi.mocked(stripe.webhooks.constructEvent).mockReturnValue(mockEvent);
    vi.mocked(updateUserPlanStatus).mockResolvedValue(undefined);
    vi.mocked(logPaymentTransaction).mockResolvedValue(undefined);

    const request = createRequest('webhook-body', 'valid-signature');
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.received).toBe(true);
    expect(updateUserPlanStatus).toHaveBeenCalledWith('user-123', 'premium', 'paid');
    expect(logPaymentTransaction).toHaveBeenCalledWith(
      'user-123',
      'cs_test_123',
      2000,
      'eur',
      'completed'
    );
  });

  it('should handle payment_intent.succeeded event', async () => {
    const mockEvent: Stripe.Event = {
      id: 'evt_test_123',
      type: 'payment_intent.succeeded',
      data: {
        object: {
          id: 'pi_test_123',
          amount: 2000,
          currency: 'eur',
        } as Stripe.PaymentIntent,
      },
      created: Date.now(),
      livemode: false,
      pending_webhooks: 1,
      request: { id: null, idempotency_key: null },
      api_version: '2020-08-27',
      object: 'event',
    };

    vi.mocked(stripe.webhooks.constructEvent).mockReturnValue(mockEvent);

    const request = createRequest('webhook-body', 'valid-signature');
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.received).toBe(true);
  });

  it('should handle payment_intent.payment_failed event', async () => {
    const mockEvent: Stripe.Event = {
      id: 'evt_test_123',
      type: 'payment_intent.payment_failed',
      data: {
        object: {
          id: 'pi_test_123',
          amount: 2000,
          currency: 'eur',
        } as Stripe.PaymentIntent,
      },
      created: Date.now(),
      livemode: false,
      pending_webhooks: 1,
      request: { id: null, idempotency_key: null },
      api_version: '2020-08-27',
      object: 'event',
    };

    const mockSession = {
      id: 'cs_test_123',
      metadata: {
        userId: 'user-123',
      },
    };

    vi.mocked(stripe.webhooks.constructEvent).mockReturnValue(mockEvent);
    vi.mocked(stripe.checkout.sessions.list).mockResolvedValue({
      data: [mockSession],
    } as any);
    vi.mocked(updateUserPlanStatus).mockResolvedValue(undefined);
    vi.mocked(logPaymentTransaction).mockResolvedValue(undefined);

    const request = createRequest('webhook-body', 'valid-signature');
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.received).toBe(true);
    expect(updateUserPlanStatus).toHaveBeenCalledWith('user-123', 'free', 'failed');
    expect(logPaymentTransaction).toHaveBeenCalledWith(
      'user-123',
      'cs_test_123',
      2000,
      'eur',
      'failed'
    );
  });

  it('should return 400 for missing signature', async () => {
    const request = createRequest('webhook-body');
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Missing signature');
  });

  it('should return 400 for invalid signature', async () => {
    vi.mocked(stripe.webhooks.constructEvent).mockImplementation(() => {
      throw new Error('Invalid signature');
    });

    const request = createRequest('webhook-body', 'invalid-signature');
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Invalid signature');
  });

  it('should handle unrecognized event types', async () => {
    const mockEvent: Stripe.Event = {
      id: 'evt_test_123',
      type: 'customer.created' as any,
      data: {
        object: {} as any,
      },
      created: Date.now(),
      livemode: false,
      pending_webhooks: 1,
      request: { id: null, idempotency_key: null },
      api_version: '2020-08-27',
      object: 'event',
    };

    vi.mocked(stripe.webhooks.constructEvent).mockReturnValue(mockEvent);

    const request = createRequest('webhook-body', 'valid-signature');
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.received).toBe(true);
  });

  it('should handle checkout session without metadata', async () => {
    const mockEvent: Stripe.Event = {
      id: 'evt_test_123',
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'cs_test_123',
          amount_total: 2000,
          currency: 'eur',
          metadata: {}, // Empty metadata
        } as Stripe.Checkout.Session,
      },
      created: Date.now(),
      livemode: false,
      pending_webhooks: 1,
      request: { id: null, idempotency_key: null },
      api_version: '2020-08-27',
      object: 'event',
    };

    vi.mocked(stripe.webhooks.constructEvent).mockReturnValue(mockEvent);

    const request = createRequest('webhook-body', 'valid-signature');
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.received).toBe(true);
    expect(updateUserPlanStatus).not.toHaveBeenCalled();
    expect(logPaymentTransaction).not.toHaveBeenCalled();
  });

  it('should handle database errors during webhook processing', async () => {
    const mockEvent: Stripe.Event = {
      id: 'evt_test_123',
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'cs_test_123',
          amount_total: 2000,
          currency: 'eur',
          metadata: {
            userId: 'user-123',
            firebaseUid: 'firebase-uid-123',
          },
        } as Stripe.Checkout.Session,
      },
      created: Date.now(),
      livemode: false,
      pending_webhooks: 1,
      request: { id: null, idempotency_key: null },
      api_version: '2020-08-27',
      object: 'event',
    };

    vi.mocked(stripe.webhooks.constructEvent).mockReturnValue(mockEvent);
    vi.mocked(updateUserPlanStatus).mockRejectedValue(new Error('Database error'));

    const request = createRequest('webhook-body', 'valid-signature');
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Webhook processing failed');
  });
});