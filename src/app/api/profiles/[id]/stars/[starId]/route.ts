import { NextRequest, NextResponse } from "next/server";
import { getStarByIdSchema } from "@/lib/validations/star";
import { ProfileService } from "@/lib/services/profile.service";
import { StarService } from "@/lib/services/star.service";
import { handleApiError } from "@/lib/errors";
import {
  createSuccessResponse,
  createErrorResponse,
} from "@/lib/utils/api-response";
import { validateParams } from "@/lib/utils/request-helpers";

const profileService = new ProfileService();
const starService = new StarService();

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; starId: string } }
) {
  try {
    // First verify the profile exists
    await profileService.getProfileById(params.id);

    // Verify the star exists and belongs to this profile
    const star = await starService.getStarById(params.starId);

    if (star.profileId !== params.id) {
      return NextResponse.json(
        createErrorResponse("Star does not belong to this profile", 403),
        { status: 403 }
      );
    }

    const result = await starService.deleteStar(params.starId);

    return NextResponse.json(
      createSuccessResponse(result, "Star removed successfully"),
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
