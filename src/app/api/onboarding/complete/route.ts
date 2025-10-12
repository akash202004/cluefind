import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const {
      profileImage,
      username,
      resumeContent,
      githubId,
      skills,
      googleId,
      email,
      name,
    } = await request.json();

    // Validate required fields
    if (!profileImage || !username || !resumeContent || !githubId || !googleId || !email) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { googleId },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Check if username is taken
    const existingProfile = await prisma.profile.findUnique({
      where: { username },
    });

    if (existingProfile) {
      return NextResponse.json(
        { error: "Username already taken" },
        { status: 400 }
      );
    }

    // Create user and profile in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          email,
          name: name || username,
          image: profileImage,
          googleId,
          onboardingComplete: true,
        },
      });

      // Create profile
      const profile = await tx.profile.create({
        data: {
          userId: user.id,
          username,
          bio: `Welcome to ${username}'s portfolio!`,
          resumeContent,
          githubId,
          skills: skills || [],
        },
      });

      return { user, profile };
    });

    return NextResponse.json({
      success: true,
      userId: result.user.id,
      profileId: result.profile.id,
      username: result.profile.username,
      message: "Onboarding completed successfully",
    });

  } catch (error: any) {
    console.error("Error completing onboarding:", error);
    
    // Handle Prisma unique constraint errors
    if (error.code === 'P2002') {
      const field = error.meta?.target?.[0];
      if (field === 'email') {
        return NextResponse.json(
          { error: "Email already registered" },
          { status: 400 }
        );
      }
      if (field === 'username') {
        return NextResponse.json(
          { error: "Username already taken" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to complete onboarding" },
      { status: 500 }
    );
  }
}
