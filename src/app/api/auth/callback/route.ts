import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  verifyGoogleToken,
  getGoogleTokens,
  isGoogleOAuthConfigured,
} from "@/lib/google-auth";
import { UserService } from "@/lib/services/user.service";

export async function GET(request: NextRequest) {
  try {
    if (!isGoogleOAuthConfigured()) {
      console.error("Google OAuth not configured");
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/auth/auth-code-error?error=oauth_not_configured`
      );
    }

    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const error = searchParams.get("error");
    const state = searchParams.get("state");

    // Handle OAuth errors
    if (error) {
      console.error("OAuth error from Google:", error);
      let errorMessage = "oauth_error";

      switch (error) {
        case "access_denied":
          errorMessage = "access_denied";
          break;
        case "invalid_request":
          errorMessage = "invalid_request";
          break;
        case "unauthorized_client":
          errorMessage = "unauthorized_client";
          break;
        case "unsupported_response_type":
          errorMessage = "unsupported_response_type";
          break;
        case "invalid_scope":
          errorMessage = "invalid_scope";
          break;
        default:
          errorMessage = "oauth_error";
      }

      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/auth/auth-code-error?error=${errorMessage}`
      );
    }

    if (!code) {
      console.error("No authorization code received");
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/auth/auth-code-error?error=no_code`
      );
    }

    // Exchange code for tokens
    let tokens;
    try {
      tokens = await getGoogleTokens(code);
    } catch (tokenError) {
      console.error("Token exchange error:", tokenError);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/auth/auth-code-error?error=token_exchange_failed`
      );
    }

    if (!tokens.id_token) {
      console.error("No ID token received");
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/auth/auth-code-error?error=no_token`
      );
    }

    // Verify the ID token
    let userInfo;
    try {
      userInfo = await verifyGoogleToken(tokens.id_token);
    } catch (verifyError) {
      console.error("Token verification error:", verifyError);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/auth/auth-code-error?error=token_verification_failed`
      );
    }

    // Sync user with Google data using service
    let user;
    try {
      const userService = new UserService();
      user = await userService.syncUserFromGoogle(userInfo.id, {
        name: userInfo.name,
        email: userInfo.email,
        picture: userInfo.picture,
        verified_email: userInfo.verified_email,
      });
    } catch (syncError) {
      console.error("User sync error:", syncError);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/auth/auth-code-error?error=user_sync_failed`
      );
    }

    // Set session cookie
    try {
      const cookieStore = await cookies();
      cookieStore.set(
        "session",
        JSON.stringify({
          userId: user.id,
          googleId: user.googleId,
          email: user.email,
          name: user.name,
          image: user.image,
        }),
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7, // 7 days
        }
      );
    } catch (cookieError) {
      console.error("Cookie setting error:", cookieError);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/auth/auth-code-error?error=session_failed`
      );
    }

    // Redirect based on onboarding status
    if (user.onboardingComplete) {
      console.log("User onboarding complete, redirecting to dashboard");
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
      );
    } else {
      console.log("User needs onboarding, redirecting to onboarding");
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/onboarding`
      );
    }
  } catch (error) {
    console.error("Unexpected auth callback error:", error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/auth/auth-code-error?error=callback_error`
    );
  }
}
