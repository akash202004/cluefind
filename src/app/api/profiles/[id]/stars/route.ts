import { NextRequest, NextResponse } from "next/server";
import {
  getStarsByProfileSchema,
  createStarSchema,
} from "@/lib/validations/star";
import { ProfileService } from "@/lib/services/profile.service";
import { StarService } from "@/lib/services/star.service";
import { handleApiError } from "@/lib/errors";
import {
  createPaginatedResponse,
  createErrorResponse,
  createSuccessResponse,
} from "@/lib/utils/api-response";
import {
  validateParams,
  validateQuery,
  parseBody,
  validateRequest,
  getClientIP,
  getUserAgent,
} from "@/lib/utils/request-helpers";

const profileService = new ProfileService();
const starService = new StarService();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    // First verify the profile exists
    await profileService.getProfileById(resolvedParams.id);

    const { searchParams } = new URL(request.url);
    const { page, limit } = validateQuery(
      searchParams,
      getStarsByProfileSchema.omit({ profileId: true })
    );

    const result = await starService.getStarsByProfile(resolvedParams.id, page, limit);

    return NextResponse.json(
      createPaginatedResponse(
        result.stars,
        result.pagination,
        "Stars retrieved successfully"
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

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    // First verify the profile exists
    await profileService.getProfileById(resolvedParams.id);

    const body = await parseBody(request);
    const validatedData = validateRequest(
      body,
      createStarSchema.omit({ profileId: true })
    );

    // Set the profileId from the URL params and get client info
    const starData = {
      ...validatedData,
      profileId: resolvedParams.id,
      ipHash: getClientIP(request),
      userAgent: getUserAgent(request),
    };

    const star = await starService.createStar(starData);

    return NextResponse.json(
      createSuccessResponse(star, "Profile starred successfully"),
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
