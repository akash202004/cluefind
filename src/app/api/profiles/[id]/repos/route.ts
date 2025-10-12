import { NextRequest, NextResponse } from "next/server";
import {
  getReposByProfileSchema,
  createRepoSchema,
} from "@/lib/validations/repo";
import { ProfileService } from "@/lib/services/profile.service";
import { RepoService } from "@/lib/services/repo.service";
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
} from "@/lib/utils/request-helpers";

const profileService = new ProfileService();
const repoService = new RepoService();

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
      getReposByProfileSchema.omit({ profileId: true })
    );

    const result = await repoService.getReposByProfile(resolvedParams.id, page, limit);

    return NextResponse.json(
      createPaginatedResponse(
        result.repos,
        result.pagination,
        "Repositories retrieved successfully"
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
    const validatedData = validateRequest(body, createRepoSchema);

    // Set the profileId from the URL params
    validatedData.profileId = resolvedParams.id;

    // Ensure required fields have defaults
    const repoData = {
      ...validatedData,
      fork: validatedData.fork ?? false,
    };

    const repo = await repoService.createRepo(repoData);

    return NextResponse.json(
      createSuccessResponse(repo, "Repository created successfully"),
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
