import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';
import { cookies } from 'next/headers';

// Create session cookie
export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json(
        { error: 'ID token is required' },
        { status: 400 }
      );
    }

    // Verify the ID token
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    
    // Create session cookie (expires in 5 days)
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days in milliseconds
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

    // Set the session cookie
    const cookieStore = cookies();
    cookieStore.set('session', sessionCookie, {
      maxAge: expiresIn / 1000, // Convert to seconds
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    });

    return NextResponse.json({ 
      success: true,
      user: {
        uid: decodedToken.uid,
        email: decodedToken.email
      }
    });
  } catch (error: any) {
    console.error('Session creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 401 }
    );
  }
}

// Verify session
export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('session')?.value;

    if (!sessionCookie) {
      return NextResponse.json(
        { error: 'No session found' },
        { status: 401 }
      );
    }

    // Verify the session cookie
    const decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);

    return NextResponse.json({
      success: true,
      user: {
        uid: decodedToken.uid,
        email: decodedToken.email
      }
    });
  } catch (error: any) {
    console.error('Session verification error:', error);
    return NextResponse.json(
      { error: 'Invalid session' },
      { status: 401 }
    );
  }
}

// Delete session (logout)
export async function DELETE(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('session')?.value;

    if (sessionCookie) {
      try {
        // Revoke the session cookie
        const decodedToken = await adminAuth.verifySessionCookie(sessionCookie);
        await adminAuth.revokeRefreshTokens(decodedToken.uid);
      } catch (error) {
        // Session might already be invalid, continue with logout
        console.log('Session already invalid during logout:', error);
      }
    }

    // Clear the session cookie
    cookieStore.delete('session');

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Failed to logout' },
      { status: 500 }
    );
  }
}