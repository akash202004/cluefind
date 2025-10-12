import { NextRequest, NextResponse } from "next/server";
import {
  getProfilesQuerySchema,
  createProfileSchema,
} from "@/lib/validations/profile";
import { ProfileService } from "@/lib/services/profile.service";
import { handleApiError } from "@/lib/errors";
import {
  createPaginatedResponse,
  createErrorResponse,
  createSuccessResponse,
} from "@/lib/utils/api-response";
import {
  validateQuery,
  parseBody,
  validateRequest,
} from "@/lib/utils/request-helpers";

const profileService = new ProfileService();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const { page, limit, search, skills } = validateQuery(
      searchParams,
      getProfilesQuerySchema
    );

    const result = await profileService.getAllProfiles(
      page,
      limit,
      search,
      skills
    );

    return NextResponse.json(
      createPaginatedResponse(
        result.profiles,
        result.pagination,
        "Profiles retrieved successfully"
      ),
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

export async function POST(request: NextRequest) {
  try {
    const body = await parseBody(request);
    const validatedData = validateRequest(body, createProfileSchema);

    const profile = await profileService.createProfile(validatedData);

    return NextResponse.json(
      createSuccessResponse(profile, "Profile created successfully"),
      { status: 201 }
    );
  } catch (error) {
    const apiError = handleApiError(error);
    return NextResponse.json(
      createErrorResponse(apiError.message, apiError.statusCode),
      { status: apiError.statusCode }
    );
  }
}
