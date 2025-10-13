import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { googleId } = await request.json();

    if (!googleId) {
      return NextResponse.json(
        { error: "Google ID is required" },
        { status: 400 }
      );
    }

    // Check if user exists in our Prisma database
    const user = await prisma.user.findUnique({
      where: { googleId },
      select: {
        id: true,
        onboardingComplete: true,
        profile: {
          select: {
            id: true,
            username: true,
          }
        }
      }
    });

    if (!user) {
      // New user, needs onboarding
      return NextResponse.json({
        onboardingComplete: false,
        isNewUser: true
      });
    }

    // Check if user has a profile (additional check)
    const hasProfile = !!user.profile;

    return NextResponse.json({
      onboardingComplete: user.onboardingComplete && hasProfile,
      isNewUser: false,
      userId: user.id,
      hasProfile: hasProfile
    });

  } catch (error) {
    console.error("Error checking onboarding status:", error);
    return NextResponse.json(
      { error: "Failed to check onboarding status" },
      { status: 500 }
    );
  }
}



