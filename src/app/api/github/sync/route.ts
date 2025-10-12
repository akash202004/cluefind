import { NextRequest, NextResponse } from "next/server";
import { GitHubService } from "@/lib/services/github.service";
import { UserService } from "@/lib/services/user.service";
import { RepoService } from "@/lib/services/repo.service";
import { handleApiError } from "@/lib/errors";
import {
  createSuccessResponse,
  createErrorResponse,
} from "@/lib/utils/api-response";
import { parseBody } from "@/lib/utils/request-helpers";

const githubService = new GitHubService();
const userService = new UserService();
const repoService = new RepoService();

export async function POST(request: NextRequest) {
  try {
    const body = await parseBody(request);
    const { githubLogin, accessToken } = body;

    if (!githubLogin) {
      return NextResponse.json(
        createErrorResponse("GitHub login is required", 400),
        { status: 400 }
      );
    }

    // Initialize GitHub service with access token if provided
    const github = accessToken ? new GitHubService(accessToken) : githubService;

    // Get user data from GitHub
    const githubUser = await github.getUserByUsername(githubLogin);

    // Sync user data
    const user = await userService.syncUserFromGitHub(githubLogin, githubUser);

    // Get user's repositories
    const githubRepos = await github.getAllUserRepos(githubLogin);

    // Enrich repos with language data
    const enrichedRepos = await github.enrichReposWithLanguages(githubRepos);

    // Sync repositories if user has a profile
    let syncedRepos = null;
    if (user.profile) {
      syncedRepos = await repoService.syncRepos(user.profile.id, enrichedRepos);
    }

    // Update profile sync timestamp
    if (user.profile) {
      const { ProfileService } = await import("@/lib/services/profile.service");
      const profileService = new ProfileService();
      await profileService.syncProfile(user.profile.id, new Date());
    }

    return NextResponse.json(
      createSuccessResponse(
        {
          user,
          syncedRepos: syncedRepos?.count || 0,
          totalRepos: enrichedRepos.length,
        },
        "GitHub data synced successfully"
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
