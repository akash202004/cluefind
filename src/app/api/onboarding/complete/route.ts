import { NextRequest, NextResponse } from "next/server";
import { UserService } from "@/lib/services/user.service";

export async function POST(request: NextRequest) {
  try {
    const { 
      role,
      profileImage, 
      username, 
      bio, 
      googleId, 
      email, 
      name 
    } = await request.json();

    // Validate required fields
    if (!role || !googleId) {
      return NextResponse.json(
        { error: "Role and Google ID are required" },
        { status: 400 }
      );
    }

    // For developers, validate profile fields
    if (role === 'STUDENT' && (!profileImage || !username || !bio)) {
      return NextResponse.json(
        { error: "All profile fields are required for developers" },
        { status: 400 }
      );
    }

    // Complete onboarding using service
    const userService = new UserService();
    console.log("Onboarding data received:", {
      role,
      profileImage,
      username,
      bio,
      googleId,
      name: name || username,
    });
    
    const result = await userService.completeOnboarding(googleId, {
      role,
      profileImage,
      username,
      bio,
      name: name || username,
    });
    
    console.log("Onboarding completed successfully:", {
      userId: result.user.id,
      role: result.user.role,
      imageUrl: result.user.image,
    });

    return NextResponse.json({
      success: true,
      userId: result.user.id,
      profileId: result.profile?.id,
      username: result.user.username,
      role: result.user.role,
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
