import { NextRequest, NextResponse } from "next/server";
import { getReposQuerySchema } from "@/lib/validations/repo";
import { RepoService } from "@/lib/services/repo.service";
import { handleApiError } from "@/lib/errors";
import {
  createPaginatedResponse,
  createErrorResponse,
} from "@/lib/utils/api-response";
import { validateQuery } from "@/lib/utils/request-helpers";

const repoService = new RepoService();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const { page, limit, search, language } = validateQuery(
      searchParams,
      getReposQuerySchema
    );

    const result = await repoService.getAllRepos(
      page,
      limit,
      search,
      language
    );

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
