// Mock Stripe first
vi.mock('stripe', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      customers: {
        create: vi.fn(),
        retrieve: vi.fn(),
      },
      paymentIntents: {
        list: vi.fn(),
      },
    })),
  };
});

// Mock Supabase
vi.mock('@supabase/supabase-js', () => ({
  createClient: () => global.mockSupabase,
}));

// Import after mocking
import {
  createOrRetrieveCustomer,
  updateUserPlanStatus,
  logPaymentTransaction,
  getUserPaymentHistory,
  syncSubscriptionStatus,
  getStripeCustomer,
  stripe,
} from '@/lib/stripe';

describe('Stripe utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createOrRetrieveCustomer', () => {
    it('should return existing customer ID if user has one', async () => {
      const mockUser = {
        stripe_customer_id: 'cus_existing_123',
      };

      global.mockSupabase.from().select().eq().single.mockResolvedValue({
        data: mockUser,
        error: null,
      });
      vi.mocked(stripe.customers.retrieve).mockResolvedValue({
        id: 'cus_existing_123',
      } as any);

      const customerId = await createOrRetrieveCustomer(
        'user-123',
        'test@example.com',
        'firebase-uid-123'
      );

      expect(customerId).toBe('cus_existing_123');
      expect(stripe.customers.retrieve).toHaveBeenCalledWith('cus_existing_123');
      expect(stripe.customers.create).not.toHaveBeenCalled();
    });

    it('should create new customer if user has no customer ID', async () => {
      const mockUser = {
        stripe_customer_id: null,
      };

      global.mockSupabase.from().select().eq().single.mockResolvedValue({
        data: mockUser,
        error: null,
      });
      vi.mocked(stripe.customers.create).mockResolvedValue({
        id: 'cus_new_123',
      } as any);
      global.mockSupabase.from().update().eq.mockResolvedValue({
        error: null,
      });

      const customerId = await createOrRetrieveCustomer(
        'user-123',
        'test@example.com',
        'firebase-uid-123'
      );

      expect(customerId).toBe('cus_new_123');
      expect(stripe.customers.create).toHaveBeenCalledWith({
        email: 'test@example.com',
        metadata: {
          userId: 'user-123',
          firebaseUid: 'firebase-uid-123',
        },
      });
    });

    it('should handle database errors', async () => {
      global.mockSupabase.from().select().eq().single.mockResolvedValue({
        data: null,
        error: { message: 'User not found' },
      });

      await expect(
        createOrRetrieveCustomer('user-123', 'test@example.com', 'firebase-uid-123')
      ).rejects.toThrow('Failed to fetch user: User not found');
    });
  });

  describe('updateUserPlanStatus', () => {
    it('should update user plan and payment status', async () => {
      global.mockSupabase.from().update().eq.mockResolvedValue({
        error: null,
      });

      await updateUserPlanStatus('user-123', 'premium', 'paid');

      expect(global.mockSupabase.from().update).toHaveBeenCalledWith({
        plan: 'premium',
        payment_status: 'paid',
        updated_at: expect.any(String),
      });
    });

    it('should handle database update errors', async () => {
      global.mockSupabase.from().update().eq.mockResolvedValue({
        error: { message: 'Update failed' },
      });

      await expect(
        updateUserPlanStatus('user-123', 'premium', 'paid')
      ).rejects.toThrow('Failed to update user plan: Update failed');
    });
  });

  describe('logPaymentTransaction', () => {
    it('should log payment transaction', async () => {
      global.mockSupabase.from().insert.mockResolvedValue({
        error: null,
      });

      await logPaymentTransaction(
        'user-123',
        'cs_test_123',
        2000,
        'eur',
        'completed'
      );

      expect(global.mockSupabase.from().insert).toHaveBeenCalledWith({
        user_id: 'user-123',
        stripe_session_id: 'cs_test_123',
        amount: 2000,
        currency: 'eur',
        status: 'completed',
      });
    });

    it('should handle database insert errors', async () => {
      global.mockSupabase.from().insert.mockResolvedValue({
        error: { message: 'Insert failed' },
      });

      await expect(
        logPaymentTransaction('user-123', 'cs_test_123', 2000, 'eur', 'completed')
      ).rejects.toThrow('Failed to log payment transaction: Insert failed');
    });
  });

  describe('getUserPaymentHistory', () => {
    it('should return user payment history', async () => {
      const mockTransactions = [
        {
          id: 'txn-1',
          user_id: 'user-123',
          stripe_session_id: 'cs_test_123',
          amount: 2000,
          currency: 'eur',
          status: 'completed',
          created_at: '2023-01-01T00:00:00Z',
        },
      ];

      global.mockSupabase.from().select().eq().order.mockResolvedValue({
        data: mockTransactions,
        error: null,
      });

      const history = await getUserPaymentHistory('user-123');

      expect(history).toEqual(mockTransactions);
      expect(global.mockSupabase.from().select).toHaveBeenCalledWith('*');
    });

    it('should handle database query errors', async () => {
      global.mockSupabase.from().select().eq().order.mockResolvedValue({
        data: null,
        error: { message: 'Query failed' },
      });

      await expect(getUserPaymentHistory('user-123')).rejects.toThrow(
        'Failed to fetch payment history: Query failed'
      );
    });
  });

  describe('syncSubscriptionStatus', () => {
    it('should sync subscription status for user with successful payments', async () => {
      const mockUser = {
        stripe_customer_id: 'cus_test_123',
        email: 'test@example.com',
      };

      const mockPaymentIntents = {
        data: [
          { status: 'succeeded' },
          { status: 'failed' },
        ],
      };

      global.mockSupabase.from().select().eq().single.mockResolvedValue({
        data: mockUser,
        error: null,
      });
      vi.mocked(stripe.paymentIntents.list).mockResolvedValue(mockPaymentIntents as any);
      global.mockSupabase.from().update().eq.mockResolvedValue({
        error: null,
      });

      await syncSubscriptionStatus('user-123');

      expect(global.mockSupabase.from().update).toHaveBeenCalledWith({
        plan: 'premium',
        payment_status: 'paid',
        updated_at: expect.any(String),
      });
    });

    it('should set free plan for user with no successful payments', async () => {
      const mockUser = {
        stripe_customer_id: 'cus_test_123',
        email: 'test@example.com',
      };

      const mockPaymentIntents = {
        data: [
          { status: 'failed' },
          { status: 'canceled' },
        ],
      };

      global.mockSupabase.from().select().eq().single.mockResolvedValue({
        data: mockUser,
        error: null,
      });
      vi.mocked(stripe.paymentIntents.list).mockResolvedValue(mockPaymentIntents as any);
      global.mockSupabase.from().update().eq.mockResolvedValue({
        error: null,
      });

      await syncSubscriptionStatus('user-123');

      expect(global.mockSupabase.from().update).toHaveBeenCalledWith({
        plan: 'free',
        payment_status: 'pending',
        updated_at: expect.any(String),
      });
    });
  });

  describe('getStripeCustomer', () => {
    it('should return customer details', async () => {
      const mockCustomer = {
        id: 'cus_test_123',
        email: 'test@example.com',
        created: 1640995200,
        metadata: {
          userId: 'user-123',
        },
      };

      vi.mocked(stripe.customers.retrieve).mockResolvedValue(mockCustomer as any);

      const customer = await getStripeCustomer('cus_test_123');

      expect(customer).toEqual({
        id: 'cus_test_123',
        email: 'test@example.com',
        created: 1640995200,
        metadata: {
          userId: 'user-123',
        },
      });
    });

    it('should return null for deleted customer', async () => {
      vi.mocked(stripe.customers.retrieve).mockResolvedValue({
        deleted: true,
      } as any);

      const customer = await getStripeCustomer('cus_deleted_123');

      expect(customer).toBeNull();
    });

    it('should return null on Stripe errors', async () => {
      vi.mocked(stripe.customers.retrieve).mockRejectedValue(new Error('Customer not found'));

      const customer = await getStripeCustomer('cus_nonexistent_123');

      expect(customer).toBeNull();
    });
  });
});