import { NextRequest, NextResponse } from "next/server";
import { UserService } from "@/lib/services/user.service";

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

    // Complete onboarding using service
    const userService = new UserService();
    const result = await userService.completeOnboarding(googleId, {
      profileImage,
      username,
      resumeContent,
      githubId,
      skills: skills || [],
      name: name || username,
    });

    return NextResponse.json({
      success: true,
      userId: result.user.id,
      profileId: result.profile.id,
      username: result.user.username,
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
