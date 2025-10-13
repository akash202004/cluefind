import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyGoogleToken, getGoogleTokens } from '@/lib/google-auth';
import { UserService } from '@/lib/services/user.service';

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

    // Sync user with Google data using service
    const userService = new UserService();
    const user = await userService.syncUserFromGoogle(userInfo.id, {
      name: userInfo.name,
      email: userInfo.email,
      picture: userInfo.picture,
      verified_email: userInfo.verified_email,
    });

    // Set session cookie
    const cookieStore = await cookies();
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
