import { NextRequest, NextResponse } from "next/server";
import { getStarByIdSchema } from "@/lib/validations/star";
import { StarService } from "@/lib/services/star.service";
import { handleApiError } from "@/lib/errors";
import {
  createSuccessResponse,
  createErrorResponse,
} from "@/lib/utils/api-response";
import { validateParams } from "@/lib/utils/request-helpers";

const starService = new StarService();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const validatedParams = validateParams(resolvedParams, getStarByIdSchema);
    const star = await starService.getStarById(validatedParams.id);

    return NextResponse.json(
      createSuccessResponse(star, "Star retrieved successfully"),
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const validatedParams = validateParams(resolvedParams, getStarByIdSchema);
    const result = await starService.deleteStar(validatedParams.id);

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
