import { NextRequest, NextResponse } from "next/server";
import { getRepoByIdSchema } from "@/lib/validations/repo";
import { updateRepoSchema } from "@/lib/validations/repo";
import { RepoService } from "@/lib/services/repo.service";
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

const repoService = new RepoService();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const validatedParams = validateParams(params, getRepoByIdSchema);
    const repo = await repoService.getRepoById(validatedParams.id);

    return NextResponse.json(
      createSuccessResponse(repo, "Repository retrieved successfully"),
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
    const validatedParams = validateParams(params, getRepoByIdSchema);
    const body = await parseBody(request);
    const validatedData = validateRequest(body, updateRepoSchema);

    const repo = await repoService.updateRepo(
      validatedParams.id,
      validatedData
    );

    return NextResponse.json(
      createSuccessResponse(repo, "Repository updated successfully"),
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
    const validatedParams = validateParams(params, getRepoByIdSchema);
    const result = await repoService.deleteRepo(validatedParams.id);

    return NextResponse.json(
      createSuccessResponse(result, "Repository deleted successfully"),
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
