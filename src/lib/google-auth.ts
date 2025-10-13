import { OAuth2Client } from "google-auth-library";

// Check if Google OAuth credentials are configured
export const isGoogleOAuthConfigured = () => {
  return !!(
    process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET &&
    process.env.GOOGLE_REDIRECT_URI &&
    process.env.GOOGLE_CLIENT_ID !== "your-google-client-id" &&
    process.env.GOOGLE_CLIENT_SECRET !== "your-google-client-secret" &&
    !process.env.GOOGLE_CLIENT_ID.includes("abcdefghijklmnopqrstuvwxyz")
  );
};

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export interface GoogleUserInfo {
  id: string;
  email: string;
  name: string;
  picture: string;
  verified_email: boolean;
}

export async function verifyGoogleToken(
  token: string
): Promise<GoogleUserInfo> {
  if (!isGoogleOAuthConfigured()) {
    throw new Error("Google OAuth is not configured");
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      throw new Error("Invalid token payload");
    }

    return {
      id: payload.sub,
      email: payload.email || "",
      name: payload.name || "",
      picture: payload.picture || "",
      verified_email: payload.email_verified || false,
    };
  } catch (error) {
    console.error("Error verifying Google token:", error);
    throw new Error("Invalid Google token");
  }
}

export function getGoogleAuthUrl(): string {
  if (!isGoogleOAuthConfigured()) {
    throw new Error("Google OAuth is not configured");
  }

  return client.generateAuthUrl({
    access_type: "offline",
    scope: ["profile", "email"],
    include_granted_scopes: true,
  });
}

export async function getGoogleTokens(code: string) {
  if (!isGoogleOAuthConfigured()) {
    throw new Error("Google OAuth is not configured");
  }

  const { tokens } = await client.getToken(code);
  return tokens;
}
