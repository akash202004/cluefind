import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

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
    if (
      !profileImage ||
      !username ||
      !resumeContent ||
      !githubId ||
      !googleId ||
      !email
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await db.user.findUnique({
      where: { googleId },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: "User not found. Please sign in again." },
        { status: 400 }
      );
    }

    // Check if username is taken
    const existingProfile = await db.profile.findUnique({
      where: { username },
    });

    if (existingProfile) {
      return NextResponse.json(
        { error: "Username already taken" },
        { status: 400 }
      );
    }

    // Update user and create profile in a transaction
    const result = await db.$transaction(async (tx) => {
      // Update user
      const user = await tx.user.update({
        where: { googleId },
        data: {
          name: name || username,
          image: profileImage,
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
    if (error.code === "P2002") {
      const field = error.meta?.target?.[0];
      if (field === "email") {
        return NextResponse.json(
          { error: "Email already registered" },
          { status: 400 }
        );
      }
      if (field === "username") {
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
