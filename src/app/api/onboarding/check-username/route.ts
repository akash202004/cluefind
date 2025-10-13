import { NextRequest, NextResponse } from "next/server";
import { ProfileService } from "@/lib/services/profile.service";

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json();

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    // Check username availability using service
    const profileService = new ProfileService();
    const result = await profileService.checkUsernameAvailability(username);

    return NextResponse.json(result);

  } catch (error) {
    console.error("Error checking username:", error);
    return NextResponse.json(
      { error: "Failed to check username" },
      { status: 500 }
    );
  }
}
