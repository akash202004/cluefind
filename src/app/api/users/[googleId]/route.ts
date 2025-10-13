import { NextRequest, NextResponse } from "next/server";
import {
  getUserByGoogleIdSchema,
  updateUserSchema,
} from "@/lib/validations/user";
import { UserService } from "@/lib/services/user.service";
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

const userService = new UserService();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ googleId: string }> }
) {
  try {
    const resolvedParams = await params;
    const validatedParams = validateParams(resolvedParams, getUserByGoogleIdSchema);
    const user = await userService.getUserByGoogleId(
      validatedParams.googleId
    );

    return NextResponse.json(
      createSuccessResponse(user, "User retrieved successfully"),
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
  { params }: { params: Promise<{ googleId: string }> }
) {
  try {
    const resolvedParams = await params;
    const validatedParams = validateParams(resolvedParams, getUserByGoogleIdSchema);
    const body = await parseBody(request);
    const validatedData = validateRequest(body, updateUserSchema);

    const user = await userService.updateUser(
      validatedParams.googleId,
      validatedData
    );

    return NextResponse.json(
      createSuccessResponse(user, "User updated successfully"),
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
  { params }: { params: Promise<{ googleId: string }> }
) {
  try {
    const resolvedParams = await params;
    const validatedParams = validateParams(resolvedParams, getUserByGoogleIdSchema);
    const result = await userService.deleteUser(validatedParams.googleId);

    return NextResponse.json(
      createSuccessResponse(result, "User deleted successfully"),
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


