import { NextRequest, NextResponse } from "next/server";
import { getStarsQuerySchema } from "@/lib/validations/star";
import { StarService } from "@/lib/services/star.service";
import { handleApiError } from "@/lib/errors";
import {
  createPaginatedResponse,
  createErrorResponse,
} from "@/lib/utils/api-response";
import { validateQuery } from "@/lib/utils/request-helpers";

const starService = new StarService();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const { page, limit } = validateQuery(searchParams, getStarsQuerySchema);

    const result = await starService.getAllStars(page, limit);

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
