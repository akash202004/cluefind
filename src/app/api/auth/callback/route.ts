import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    // Get session from BetterAuth
    const sessionResponse = await fetch(
      `${process.env.BETTER_AUTH_URL}/api/auth/get-session`,
      {
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
      }
    );

    if (!sessionResponse.ok) {
      return NextResponse.redirect(new URL("/get-started", request.url));
    }

    const sessionData = await sessionResponse.json();
    
    if (!sessionData.session || !sessionData.session.userId) {
      return NextResponse.redirect(new URL("/get-started", request.url));
    }

    // Check if user has completed onboarding
    const user = await prisma.user.findUnique({
      where: { id: sessionData.session.userId },
      select: {
        onboardingComplete: true,
        profile: {
          select: { id: true },
        },
      },
    });

    // If user has completed onboarding or has a profile, go to dashboard
    if (user?.onboardingComplete || user?.profile) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Otherwise, go to onboarding
    return NextResponse.redirect(new URL("/onboarding", request.url));
  } catch (error) {
    console.error("OAuth callback error:", error);
    return NextResponse.redirect(new URL("/get-started", request.url));
  }
}
