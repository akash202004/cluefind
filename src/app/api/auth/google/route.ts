import { NextRequest, NextResponse } from "next/server";
import { getGoogleAuthUrl, isGoogleOAuthConfigured } from "@/lib/google-auth";

export async function GET(request: NextRequest) {
  try {
    if (!isGoogleOAuthConfigured()) {
      return NextResponse.json(
        {
          error:
            "Google OAuth is not configured. Please set up Google OAuth credentials.",
        },
        { status: 400 }
      );
    }

    const authUrl = getGoogleAuthUrl();
    return NextResponse.json({ authUrl });
  } catch (error) {
    console.error("Google auth URL generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate auth URL" },
      { status: 500 }
    );
  }
}
