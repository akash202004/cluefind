import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyGoogleToken, getGoogleTokens } from '@/lib/google-auth';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/auth/auth-code-error?error=${error}`);
    }

    if (!code) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/auth/auth-code-error?error=no_code`);
    }

    // Exchange code for tokens
    const tokens = await getGoogleTokens(code);
    
    if (!tokens.id_token) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/auth/auth-code-error?error=no_token`);
    }

    // Verify the ID token
    const userInfo = await verifyGoogleToken(tokens.id_token);

    // Check if user exists in database
    let user = await db.user.findUnique({
      where: { googleId: userInfo.id }
    });

    if (!user) {
      // Create new user
      user = await db.user.create({
        data: {
          googleId: userInfo.id,
          email: userInfo.email,
          name: userInfo.name,
          image: userInfo.picture,
          emailVerified: userInfo.verified_email,
        }
      });
    } else {
      // Update existing user info
      user = await db.user.update({
        where: { googleId: userInfo.id },
        data: {
          email: userInfo.email,
          name: userInfo.name,
          image: userInfo.picture,
          emailVerified: userInfo.verified_email,
        }
      });
    }

    // Set session cookie
    const cookieStore = cookies();
    cookieStore.set('session', JSON.stringify({
      userId: user.id,
      googleId: user.googleId,
      email: user.email,
      name: user.name,
      image: user.image,
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    // Redirect based on onboarding status
    if (user.onboardingComplete) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard`);
    } else {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/onboarding`);
    }

  } catch (error) {
    console.error('Auth callback error:', error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/auth/auth-code-error?error=callback_error`);
  }
}
