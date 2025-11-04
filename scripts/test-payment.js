// Script pour tester les paiements en développement
// Usage: node scripts/test-payment.js

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function createTestCheckoutSession() {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Study Map Premium',
              description: 'Unlimited access to all programs',
            },
            unit_amount: 2000, // 20.00 EUR
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'http://localhost:3000/payment/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://localhost:3000/pricing',
      metadata: {
        userId: 'test-user-id',
        firebaseUid: 'test-firebase-uid',
      },
    });

    console.log('Test checkout session created:');
    console.log('Session ID:', session.id);
    console.log('Payment URL:', session.url);
    
    return session;
  } catch (error) {
    console.error('Error creating test session:', error);
  }
}

// Exécuter le test si ce fichier est appelé directement
if (require.main === module) {
  createTestCheckoutSession();
}

module.exports = { createTestCheckoutSession };