import { NextRequest, NextResponse } from "next/server";
import { UserService } from "@/lib/services/user.service";

export async function POST(request: NextRequest) {
  try {
    const { 
      profileImage, 
      username, 
      bio, 
      googleId, 
      email, 
      name 
    } = await request.json();

    // Validate required fields
    if (!profileImage || !username || !bio || !googleId) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Complete onboarding using service
    const userService = new UserService();
    console.log("Onboarding data received:", {
      profileImage,
      username,
      bio,
      googleId,
      name: name || username,
    });
    
    const result = await userService.completeOnboarding(googleId, {
      profileImage,
      username,
      bio,
      name: name || username,
    });
    
    console.log("Onboarding completed successfully:", {
      userId: result.user.id,
      imageUrl: result.user.image,
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

    // Prisma unique constraint errors
    if (error.code === "P2002") {
      const field = error.meta?.target?.[0];
      if (field === "username") {
        return NextResponse.json(
          { error: "Username already taken" },
          { status: 400 }
        );
      }
    }

    // Common known errors from service
    const message: string =
      typeof error?.message === "string"
        ? error.message
        : "Failed to complete onboarding";
    const status = message.includes("User not found") ? 400 : 500;

    return NextResponse.json(
      { error: message || "Failed to complete onboarding" },
      { status }
    );
  }
}
