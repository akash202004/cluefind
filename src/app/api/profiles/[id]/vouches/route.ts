import { NextRequest, NextResponse } from "next/server";
import { ProfileService } from "@/lib/services/profile.service";
import { VouchService } from "@/lib/services/vouch.service";
import { parseBody, validateRequest } from "@/lib/utils/request-helpers";
import { createVouchSchema } from "@/lib/validations/vouch";
import { handleApiError } from "@/lib/errors";
import { createErrorResponse, createSuccessResponse } from "@/lib/utils/api-response";
import { UserService } from "@/lib/services/user.service";

const profileService = new ProfileService();
const vouchService = new VouchService();
const userService = new UserService();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const profile = await profileService.getProfileById(id);
    const { vouches, count } = await vouchService.listByProfile(id);
    // hasVouched state if requester provided
    const googleId = request.headers.get("x-user-googleid");
    let hasVouched = false;
    let isSelf = false;
    if (googleId) {
      const user = await userService.getUserByGoogleId(googleId);
      hasVouched = await vouchService.hasVouched(id, user.id);
      isSelf = profile.user.id === user.id;
    }
    return NextResponse.json(createSuccessResponse({ vouches, count, hasVouched, isSelf }));
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
    const { id } = await params;
    // ensure profile exists
    await profileService.getProfileById(id);

    // In absence of NextAuth session here, expect X-User-GoogleId header to identify user (existing pattern)
    const googleId = request.headers.get("x-user-googleid");
    if (!googleId) {
      return NextResponse.json(createErrorResponse("Unauthorized", 401), { status: 401 });
    }

    const user = await userService.getUserByGoogleId(googleId);
    const body = await parseBody(request);
    const input = validateRequest(body, createVouchSchema);

    const vouch = await vouchService.create(id, user.id, input);
    return NextResponse.json(createSuccessResponse(vouch, "Vouch created"), { status: 201 });
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
    const { id } = await params;
    await profileService.getProfileById(id);
    const googleId = request.headers.get("x-user-googleid");
    if (!googleId) {
      return NextResponse.json(createErrorResponse("Unauthorized", 401), { status: 401 });
    }
    const user = await userService.getUserByGoogleId(googleId);
    const result = await vouchService.delete(id, user.id);
    return NextResponse.json(createSuccessResponse(result, "Vouch removed"));
  } catch (error) {
    const apiError = handleApiError(error);
    return NextResponse.json(
      createErrorResponse(apiError.message, apiError.statusCode),
      { status: apiError.statusCode }
    );
  }
}


