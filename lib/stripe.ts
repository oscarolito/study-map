import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { logPaymentError, logDatabaseError } from './monitoring'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export interface StripeCustomer {
  id: string
  email: string
  created: number
  metadata: {
    userId?: string
    firebaseUid?: string
  }
}

export interface PaymentTransaction {
  id: string
  user_id: string
  stripe_session_id: string
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed'
  created_at: string
}

/**
 * Create or retrieve a Stripe customer for a user
 */
export async function createOrRetrieveCustomer(
  userId: string,
  email: string,
  firebaseUid: string
): Promise<string> {
  try {
    // Check if user already has a Stripe customer ID
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('stripe_customer_id')
      .eq('id', userId)
      .single()

    if (userError) {
      logDatabaseError('Failed to fetch user for Stripe customer', { error: userError.message, userId });
      throw new Error(`Failed to fetch user: ${userError.message}`)
    }

    if (user.stripe_customer_id) {
      // Verify the customer still exists in Stripe
      try {
        await stripe.customers.retrieve(user.stripe_customer_id)
        return user.stripe_customer_id
      } catch (stripeError) {
        console.warn(`Stripe customer ${user.stripe_customer_id} not found, creating new one`)
      }
    }

    // Create new Stripe customer
    const customer = await stripe.customers.create({
      email,
      metadata: {
        userId,
        firebaseUid,
      },
    })

    // Update user with Stripe customer ID
    const { error: updateError } = await supabase
      .from('users')
      .update({ stripe_customer_id: customer.id })
      .eq('id', userId)

    if (updateError) {
      logDatabaseError('Failed to update user with Stripe customer ID', { 
        error: updateError.message, 
        userId, 
        customerId: customer.id 
      });
      throw new Error(`Failed to update user with customer ID: ${updateError.message}`)
    }

    return customer.id
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logPaymentError('Error creating/retrieving Stripe customer', { 
      error: errorMessage, 
      userId, 
      email 
    });
    throw error
  }
}

/**
 * Update user plan status after successful payment
 */
export async function updateUserPlanStatus(
  userId: string,
  plan: 'free' | 'premium',
  paymentStatus: 'pending' | 'paid' | 'failed'
): Promise<void> {
  try {
    const { error } = await supabase
      .from('users')
      .update({
        plan,
        payment_status: paymentStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)

    if (error) {
      throw new Error(`Failed to update user plan: ${error.message}`)
    }

    console.log(`Updated user ${userId} plan to ${plan} with payment status ${paymentStatus}`)
  } catch (error) {
    console.error('Error updating user plan status:', error)
    throw error
  }
}

/**
 * Log payment transaction for audit purposes
 */
export async function logPaymentTransaction(
  userId: string,
  stripeSessionId: string,
  amount: number,
  currency: string,
  status: 'pending' | 'completed' | 'failed'
): Promise<void> {
  try {
    const { error } = await supabase
      .from('payment_transactions')
      .insert({
        user_id: userId,
        stripe_session_id: stripeSessionId,
        amount,
        currency,
        status,
      })

    if (error) {
      throw new Error(`Failed to log payment transaction: ${error.message}`)
    }

    console.log(`Logged payment transaction for user ${userId}: ${status}`)
  } catch (error) {
    console.error('Error logging payment transaction:', error)
    throw error
  }
}

/**
 * Get user's payment history
 */
export async function getUserPaymentHistory(userId: string): Promise<PaymentTransaction[]> {
  try {
    const { data, error } = await supabase
      .from('payment_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch payment history: ${error.message}`)
    }

    return data || []
  } catch (error) {
    console.error('Error fetching payment history:', error)
    throw error
  }
}

/**
 * Synchronize subscription status with Stripe
 */
export async function syncSubscriptionStatus(userId: string): Promise<void> {
  try {
    // Get user's Stripe customer ID
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('stripe_customer_id, email')
      .eq('id', userId)
      .single()

    if (userError || !user.stripe_customer_id) {
      throw new Error('User or Stripe customer not found')
    }

    // Get customer's payment history from Stripe
    const paymentIntents = await stripe.paymentIntents.list({
      customer: user.stripe_customer_id,
      limit: 10,
    })

    // Check if there are any successful payments
    const hasSuccessfulPayment = paymentIntents.data.some(
      (payment) => payment.status === 'succeeded'
    )

    // Update user plan based on payment history
    const currentPlan = hasSuccessfulPayment ? 'premium' : 'free'
    const paymentStatus = hasSuccessfulPayment ? 'paid' : 'pending'

    await updateUserPlanStatus(userId, currentPlan, paymentStatus)

    console.log(`Synchronized subscription status for user ${userId}: ${currentPlan}`)
  } catch (error) {
    console.error('Error synchronizing subscription status:', error)
    throw error
  }
}

/**
 * Get Stripe customer details
 */
export async function getStripeCustomer(customerId: string): Promise<StripeCustomer | null> {
  try {
    const customer = await stripe.customers.retrieve(customerId)
    
    if ('deleted' in customer && customer.deleted) {
      return null
    }

    const fullCustomer = customer as Stripe.Customer

    return {
      id: fullCustomer.id,
      email: fullCustomer.email || '',
      created: fullCustomer.created,
      metadata: fullCustomer.metadata,
    }
  } catch (error) {
    console.error('Error fetching Stripe customer:', error)
    return null
  }
}

export { stripe }