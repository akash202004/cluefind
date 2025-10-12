import { NextRequest, NextResponse } from "next/server";
import { getUsersQuerySchema } from "@/lib/validations/user";
import { UserService } from "@/lib/services/user.service";
import { handleApiError } from "@/lib/errors";
import {
  createPaginatedResponse,
  createErrorResponse,
} from "@/lib/utils/api-response";
import { validateQuery } from "@/lib/utils/request-helpers";

const userService = new UserService();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const { page, limit, search } = validateQuery(
      searchParams,
      getUsersQuerySchema
    );

    const result = await userService.getAllUsers(page, limit, search);

    return NextResponse.json(
      createPaginatedResponse(
        result.users,
        result.pagination,
        "Users retrieved successfully"
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { createUserSchema } = await import("@/lib/validations/user");
    const validatedData = createUserSchema.parse(body);

    const user = await userService.createUser(validatedData);

    return NextResponse.json(
      {
        success: true,
        data: user,
        message: "User created successfully",
        timestamp: new Date().toISOString(),
      },
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
