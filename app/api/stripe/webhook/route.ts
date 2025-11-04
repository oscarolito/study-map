import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { updateUserPlanStatus, logPaymentTransaction, stripe } from '@/lib/stripe'
import { logPaymentError, trackPaymentMetrics, trackConversionEvent } from '@/lib/monitoring'

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    logPaymentError('Missing Stripe signature in webhook');
    return NextResponse.json(
      { error: 'Missing signature' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret)
    trackPaymentMetrics('webhook_received', undefined, undefined, { eventType: event.type });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    logPaymentError('Webhook signature verification failed', { error: errorMessage });
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }

  try {
    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session)
        break
      
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent)
        break
      
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent)
        break
      
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    trackPaymentMetrics('webhook_processed', undefined, undefined, { eventType: event.type });
    return NextResponse.json({ received: true })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logPaymentError('Error processing webhook', { 
      error: errorMessage, 
      eventType: event?.type 
    });
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log('Processing checkout session completed:', session.id)

  const { userId, firebaseUid } = session.metadata || {}

  if (!userId || !firebaseUid) {
    logPaymentError('Missing user metadata in session', { sessionId: session.id });
    return
  }

  try {
    // Update user plan to premium
    await updateUserPlanStatus(userId, 'premium', 'paid')

    // Log the payment transaction
    await logPaymentTransaction(
      userId,
      session.id,
      session.amount_total || 0,
      session.currency || 'eur',
      'completed'
    )

    // Track successful conversion
    trackConversionEvent(userId, 'upgrade_success', {
      amount: session.amount_total,
      currency: session.currency,
      sessionId: session.id
    });

    console.log(`Successfully upgraded user ${userId} to premium`)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logPaymentError('Error processing checkout session', { 
      error: errorMessage, 
      sessionId: session.id, 
      userId 
    });
    
    trackConversionEvent(userId, 'upgrade_failed', {
      error: errorMessage,
      sessionId: session.id
    });
    
    throw error
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log('Payment intent succeeded:', paymentIntent.id)
  
  // Additional processing if needed
  // The main upgrade logic is handled in checkout.session.completed
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log('Payment intent failed:', paymentIntent.id)

  // Get the checkout session to find user info
  try {
    const sessions = await stripe.checkout.sessions.list({
      payment_intent: paymentIntent.id,
      limit: 1,
    })

    if (sessions.data.length > 0) {
      const session = sessions.data[0]
      const { userId } = session.metadata || {}

      if (userId) {
        // Update payment status to failed (keep current plan)
        await updateUserPlanStatus(userId, 'free', 'failed')

        // Log the failed transaction
        await logPaymentTransaction(
          userId,
          session.id,
          paymentIntent.amount || 0,
          paymentIntent.currency || 'eur',
          'failed'
        )

        console.log(`Updated payment status to failed for user ${userId}`)
      }
    }
  } catch (error) {
    console.error('Error processing failed payment:', error)
  }
}