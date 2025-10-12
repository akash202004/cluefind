import { NextRequest, NextResponse } from "next/server";
import { getProfileByIdSchema } from "@/lib/validations/profile";
import { updateProfileSchema } from "@/lib/validations/profile";
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

const profileService = new ProfileService();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const validatedParams = validateParams(params, getProfileByIdSchema);
    const profile = await profileService.getProfileById(validatedParams.id);

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
  { params }: { params: { id: string } }
) {
  try {
    const validatedParams = validateParams(params, getProfileByIdSchema);
    const body = await parseBody(request);
    const validatedData = validateRequest(body, updateProfileSchema);

    const profile = await profileService.updateProfile(
      validatedParams.id,
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const validatedParams = validateParams(params, getProfileByIdSchema);
    const result = await profileService.deleteProfile(validatedParams.id);

    return NextResponse.json(
      createSuccessResponse(result, "Profile deleted successfully"),
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
