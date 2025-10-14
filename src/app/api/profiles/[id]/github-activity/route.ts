import { NextRequest, NextResponse } from "next/server";
import { getProfileByIdSchema } from "@/lib/validations/profile";
import { ProfileService } from "@/lib/services/profile.service";
import { handleApiError } from "@/lib/errors";
import { createErrorResponse, createSuccessResponse } from "@/lib/utils/api-response";
import { validateParams } from "@/lib/utils/request-helpers";

const profileService = new ProfileService();

type PublicEvent = {
  id: string;
  type: string;
  created_at: string;
  repo?: { name: string };
  payload?: any;
};

async function fetchGithubEvents(username: string, sinceISO: string): Promise<PublicEvent[]> {
  const events: PublicEvent[] = [];
  let page = 1;
  const headers: Record<string, string> = {
    "Accept": "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (process.env.GITHUB_TOKEN) headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;

  while (page <= 5) {
    const res = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}/events/public?per_page=100&page=${page}`,
      { headers, next: { revalidate: 60 } }
    );
    if (!res.ok) break;
    const batch = (await res.json()) as PublicEvent[];
    if (!Array.isArray(batch) || batch.length === 0) break;
    for (const ev of batch) {
      if (ev.created_at >= sinceISO) events.push(ev);
    }
    const last = batch[batch.length - 1];
    if (!last || last.created_at < sinceISO) break;
    page += 1;
  }
  return events;
}

function summarize(events: PublicEvent[]) {
  const summary = {
    totalEvents: events.length,
    pushes: 0,
    commits: 0,
    pullRequestsOpened: 0,
    issuesOpened: 0,
    reposTouched: new Set<string>(),
  } as {
    totalEvents: number;
    pushes: number;
    commits: number;
    pullRequestsOpened: number;
    issuesOpened: number;
    reposTouched: Set<string>;
  };

  for (const ev of events) {
    if (ev.repo?.name) summary.reposTouched.add(ev.repo.name);
    switch (ev.type) {
      case "PushEvent": {
        summary.pushes += 1;
        const commits = Array.isArray(ev.payload?.commits) ? ev.payload.commits.length : 0;
        summary.commits += commits;
        break;
      }
      case "PullRequestEvent": {
        if (ev.payload?.action === "opened") summary.pullRequestsOpened += 1;
        break;
      }
      case "IssuesEvent": {
        if (ev.payload?.action === "opened") summary.issuesOpened += 1;
        break;
      }
      default:
        break;
    }
  }

  return {
    totalEvents: summary.totalEvents,
    pushes: summary.pushes,
    commits: summary.commits,
    pullRequestsOpened: summary.pullRequestsOpened,
    issuesOpened: summary.issuesOpened,
    reposTouched: summary.reposTouched.size,
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { id } = validateParams(resolvedParams, getProfileByIdSchema);

    const profile = await profileService.getProfileById(id);
    const githubId = profile.githubId;
    if (!githubId) {
      return NextResponse.json(createErrorResponse("GitHub ID not connected", 400), { status: 400 });
    }

    const since = new Date();
    since.setDate(since.getDate() - 30);
    const sinceISO = since.toISOString();

    const events = await fetchGithubEvents(githubId, sinceISO);
    const summary = summarize(events);

    return NextResponse.json(
      createSuccessResponse(
        {
          username: githubId,
          since: sinceISO,
          summary,
          events: events.slice(0, 100).map((e) => ({
            id: e.id,
            type: e.type,
            created_at: e.created_at,
            repo: e.repo?.name,
          })),
        },
        "GitHub activity fetched"
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


