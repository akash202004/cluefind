import { NextRequest, NextResponse } from "next/server";
import { GitHubService } from "@/lib/services/github.service";
import { UserService } from "@/lib/services/user.service";
import { RepoService } from "@/lib/services/repo.service";
import { handleApiError } from "@/lib/errors";
import {
  createSuccessResponse,
  createErrorResponse,
} from "@/lib/utils/api-response";

const githubService = new GitHubService();
const userService = new UserService();
const repoService = new RepoService();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, repository, sender } = body;

    // Handle repository events
    if (repository && sender) {
      const githubLogin = sender.login;

      switch (action) {
        case "created":
        case "edited":
        case "deleted":
          // Sync user repositories when repository events occur
          try {
            const github = new GitHubService();
            const githubRepos = await github.getAllUserRepos(githubLogin);
            const enrichedRepos = await github.enrichReposWithLanguages(
              githubRepos
            );

            // Get user from database
            const user = await userService.getUserByGithubLogin(githubLogin);

            if (user.profile) {
              await repoService.syncRepos(user.profile.id, enrichedRepos);
            }
          } catch (syncError) {
            console.error("Failed to sync repositories:", syncError);
          }
          break;

        case "publicized":
        case "privatized":
          // Handle repository visibility changes
          console.log(`Repository ${repository.full_name} was ${action}`);
          break;

        default:
          console.log(`Unhandled repository action: ${action}`);
      }
    }

    return NextResponse.json(
      createSuccessResponse(
        { received: true },
        "Webhook processed successfully"
      ),
      { status: 200 }
    );
  } catch (error) {
    const apiError = handleApiError(error);
    console.error("Webhook processing error:", error);

    return NextResponse.json(
      createErrorResponse(apiError.message, apiError.statusCode),
      { status: apiError.statusCode }
    );
  }
}

// Handle GET requests for webhook verification
export async function GET(request: NextRequest) {
  return NextResponse.json(
    createSuccessResponse(
      { status: "Webhook endpoint active" },
      "Webhook endpoint is ready"
    ),
    { status: 200 }
  );
}
