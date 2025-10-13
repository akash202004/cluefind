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

const projectSchema = z.object({
  title: z.string().min(1, "Project title is required").transform((s) => s.trim()),
  description: z.string().min(1, "Project description is required").transform((s) => s.trim()),
  // Allow empty string as "no URL" and normalize to undefined
  url: z
    .union([z.string().url("Invalid project URL"), z.literal("")])
    .optional()
    .transform((v) => (v === "" ? undefined : v)),
});

const updateProjectsSchema = z.object({
  projects: z.array(projectSchema),
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
    // Normalize incoming projects: trim strings and drop empty URLs
    const normalized = {
      projects: (Array.isArray(body?.projects) ? body.projects : []).map((p: any) => {
        const title = typeof p?.title === "string" ? p.title.trim() : "";
        const description = typeof p?.description === "string" ? p.description.trim() : "";
        let url: string | undefined = undefined;
        if (typeof p?.url === "string") {
          const raw = p.url.trim();
          if (raw.length > 0) {
            // If missing protocol, assume https
            const withProtocol = /^(https?:)?\/\//i.test(raw) ? raw : `https://${raw}`;
            url = withProtocol;
          }
        }
        return { title, description, url };
      }),
    };
    const validatedData = updateProjectsSchema.parse(normalized);

    const profile = await profileService.updateProfile(
      validatedParams.id,
      { projects: validatedData.projects }
    );

    return NextResponse.json(
      createSuccessResponse(profile, "Projects updated successfully"),
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
