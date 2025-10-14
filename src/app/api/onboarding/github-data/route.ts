import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json();

    if (!username) {
      return NextResponse.json(
        { error: "GitHub username is required" },
        { status: 400 }
      );
    }

    // Fetch GitHub profile data
    const githubResponse = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Cluefind-App'
      }
    });

    if (!githubResponse.ok) {
      if (githubResponse.status === 404) {
        return NextResponse.json(
          { error: "GitHub user not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: "Failed to fetch GitHub data" },
        { status: githubResponse.status }
      );
    }

    const profileData = await githubResponse.json();

    // Fetch repositories
    const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=10`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Cluefind-App'
      }
    });

    let repositories = [];
    if (reposResponse.ok) {
      repositories = await reposResponse.json();
    }

    // Process repository data
    const processedRepos = repositories.map((repo: any) => ({
      id: repo.id,
      name: repo.name,
      description: repo.description,
      language: repo.language,
      forks: repo.forks_count,
      updated: repo.updated_at,
      url: repo.html_url,
      homepage: repo.homepage
    }));

    // Calculate language distribution
    const languages: { [key: string]: number } = {};
    repositories.forEach((repo: any) => {
      if (repo.language) {
        languages[repo.language] = (languages[repo.language] || 0) + 1;
      }
    });

    const topLanguages = Object.entries(languages)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([language]) => language);

    return NextResponse.json({
      profile: {
        id: profileData.id,
        login: profileData.login,
        name: profileData.name,
        bio: profileData.bio,
        avatar_url: profileData.avatar_url,
        html_url: profileData.html_url,
        public_repos: profileData.public_repos,
        public_gists: profileData.public_gists,
        followers: profileData.followers,
        following: profileData.following,
        created_at: profileData.created_at,
        updated_at: profileData.updated_at
      },
      repositories: processedRepos,
      topLanguages,
      stats: {
        totalRepos: profileData.public_repos,
        totalForks: repositories.reduce((sum: number, repo: any) => sum + repo.forks_count, 0),
        accountAge: Math.floor((Date.now() - new Date(profileData.created_at).getTime()) / (1000 * 60 * 60 * 24 * 365))
      }
    });

  } catch (error) {
    console.error("Error fetching GitHub data:", error);
    return NextResponse.json(
      { error: "Failed to fetch GitHub data" },
      { status: 500 }
    );
  }
}
