import { NextRequest, NextResponse } from "next/server";
import { getProfileByIdSchema } from "@/lib/validations/profile";
import { ProfileService } from "@/lib/services/profile.service";
import { handleApiError } from "@/lib/errors";
import {
  createSuccessResponse,
  createErrorResponse,
} from "@/lib/utils/api-response";
import {
  validateParams,
  parseBody,
} from "@/lib/utils/request-helpers";
import { z } from "zod";

const updateSkillsSchema = z.object({
  skills: z.array(z.string()).min(1, "At least one skill is required"),
});

const profileService = new ProfileService();

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const validatedParams = validateParams(resolvedParams, getProfileByIdSchema);
    const body = await parseBody(request);
    const validatedData = updateSkillsSchema.parse(body);

    const profile = await profileService.updateProfile(
      validatedParams.id,
      { skills: validatedData.skills }
    );

    return NextResponse.json(
      createSuccessResponse(profile, "Skills updated successfully"),
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
