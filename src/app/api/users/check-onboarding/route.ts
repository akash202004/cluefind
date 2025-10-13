import { NextRequest, NextResponse } from "next/server";
import { UserService } from "@/lib/services/user.service";

export async function POST(request: NextRequest) {
  try {
    const { googleId } = await request.json();

    if (!googleId) {
      return NextResponse.json(
        { error: "Google ID is required" },
        { status: 400 }
      );
    }

    // Check onboarding status using service
    const userService = new UserService();
    const result = await userService.checkOnboardingStatus(googleId);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    return NextResponse.json(
      { error: "Failed to check onboarding status" },
      { status: 500 }
    );
  }
}
