import { NextRequest, NextResponse } from "next/server";
import { getUserByGithubLoginSchema } from "@/lib/validations/user";
import { updateProfileSchema } from "@/lib/validations/profile";
import { UserService } from "@/lib/services/user.service";
import { ProfileService } from "@/lib/services/profile.service";
import { handleApiError } from "@/lib/errors";
import {
  createSuccessResponse,
  createErrorResponse,
} from "@/lib/utils/api-response";
import {
  validateParams,
  parseBody,
  validateRequest,
} from "@/lib/utils/request-helpers";

const userService = new UserService();
const profileService = new ProfileService();

export async function GET(
  request: NextRequest,
  { params }: { params: { githubLogin: string } }
) {
  try {
    const validatedParams = validateParams(params, getUserByGithubLoginSchema);
    const user = await userService.getUserByGithubLogin(
      validatedParams.githubLogin
    );

    if (!user.profile) {
      return NextResponse.json(
        createErrorResponse("Profile not found for this user", 404),
        { status: 404 }
      );
    }

    const profile = await profileService.getProfileById(user.profile.id);

    return NextResponse.json(
      createSuccessResponse(profile, "Profile retrieved successfully"),
      { status: 200 }
    );
  } catch (error) {
    const apiError = handleApiError(error);
    return NextResponse.json(
      createErrorResponse(apiError.message, apiError.statusCode),
      { status: apiError.statusCode }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { githubLogin: string } }
) {
  try {
    const validatedParams = validateParams(params, getUserByGithubLoginSchema);
    const user = await userService.getUserByGithubLogin(
      validatedParams.githubLogin
    );

    if (!user.profile) {
      return NextResponse.json(
        createErrorResponse("Profile not found for this user", 404),
        { status: 404 }
      );
    }

    const body = await parseBody(request);
    const validatedData = validateRequest(body, updateProfileSchema);

    const profile = await profileService.updateProfile(
      user.profile.id,
      validatedData
    );

    return NextResponse.json(
      createSuccessResponse(profile, "Profile updated successfully"),
      { status: 200 }
    );
  } catch (error) {
    const apiError = handleApiError(error);
    return NextResponse.json(
      createErrorResponse(apiError.message, apiError.statusCode),
      { status: apiError.statusCode }
    );
  }
}
