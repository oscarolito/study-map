import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { adminAuth } from '@/lib/firebase-admin'
import { getUserPaymentHistory, syncSubscriptionStatus } from '@/lib/stripe'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const idToken = authHeader.split('Bearer ')[1]

    // Verify the Firebase ID token
    const decodedToken = await adminAuth.verifyIdToken(idToken)
    const firebaseUid = decodedToken.uid

    // Get user from Supabase
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('firebase_uid', firebaseUid)
      .single()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get payment history
    const paymentHistory = await getUserPaymentHistory(user.id)

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        plan: user.plan,
        payment_status: user.payment_status,
        programs_viewed: user.programs_viewed,
        created_at: user.created_at,
      },
      paymentHistory,
    })
  } catch (error) {
    console.error('Error fetching subscription info:', error)
    return NextResponse.json(
      { error: 'Failed to fetch subscription information' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, idToken } = await request.json()

    if (!idToken) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Verify the Firebase ID token
    const decodedToken = await adminAuth.verifyIdToken(idToken)
    const firebaseUid = decodedToken.uid

    // Get user from Supabase
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('firebase_uid', firebaseUid)
      .single()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    switch (action) {
      case 'sync':
        // Synchronize subscription status with Stripe
        await syncSubscriptionStatus(user.id)
        
        // Fetch updated user data
        const { data: updatedUser } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()

        return NextResponse.json({
          message: 'Subscription status synchronized',
          user: updatedUser,
        })

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Error processing subscription action:', error)
    return NextResponse.json(
      { error: 'Failed to process subscription action' },
      { status: 500 }
    )
  }
}