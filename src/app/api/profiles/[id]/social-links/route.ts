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

const socialLinkSchema = z.object({
  platform: z.string().min(1, "Platform is required"),
  url: z.string().url("Invalid social link URL"),
});

const updateSocialLinksSchema = z.object({
  socialLinks: z.array(socialLinkSchema),
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
    const validatedData = updateSocialLinksSchema.parse(body);

    const profile = await profileService.updateProfile(
      validatedParams.id,
      { socialLinks: validatedData.socialLinks }
    );

    return NextResponse.json(
      createSuccessResponse(profile, "Social links updated successfully"),
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
