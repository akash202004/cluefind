// Note: Install @octokit/rest with: npm install @octokit/rest
// For now, using a simplified interface
interface Octokit {
  users: {
    getAuthenticated(): Promise<{ data: any }>;
    getByUsername(params: { username: string }): Promise<{ data: any }>;
  };
  repos: {
    listForUser(params: any): Promise<{ data: any[] }>;
    listLanguages(params: any): Promise<{ data: any }>;
    get(params: any): Promise<{ data: any }>;
  };
  rateLimit: {
    get(): Promise<{ data: any }>;
  };
  search: {
    users(params: any): Promise<{ data: any }>;
    repos(params: any): Promise<{ data: any }>;
  };
}

export interface GitHubUser {
  id: number;
  login: string;
  name: string | null;
  email: string | null;
  avatar_url: string;
  bio: string | null;
  location: string | null;
  blog: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  clone_url: string;
  ssh_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  languages_url: string;
  fork: boolean;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  owner: {
    login: string;
  };
  languages?: string[];
}

export class GitHubService {
  private octokit: Octokit;

  constructor(accessToken?: string) {
    // Mock implementation - replace with actual Octokit when installed
    this.octokit = {} as Octokit;
    // this.octokit = new Octokit({
    //   auth: accessToken || process.env.GITHUB_TOKEN,
    //   userAgent: 'Cluefind Portfolio Platform'
    // })
  }

  async getUserData(): Promise<GitHubUser> {
    try {
      const { data } = await this.octokit.users.getAuthenticated();
      return data as GitHubUser;
    } catch (error) {
      throw new Error("Failed to fetch user data from GitHub");
    }
  }

  async getUserByUsername(username: string): Promise<GitHubUser> {
    try {
      const { data } = await this.octokit.users.getByUsername({ username });
      return data as GitHubUser;
    } catch (error) {
      throw new Error(`Failed to fetch user data for ${username} from GitHub`);
    }
  }

  async getUserRepos(
    username: string,
    perPage = 100,
    page = 1
  ): Promise<GitHubRepo[]> {
    try {
      const { data } = await this.octokit.repos.listForUser({
        username,
        per_page: perPage,
        page,
        sort: "updated",
        type: "owner",
      });
      return data as GitHubRepo[];
    } catch (error) {
      throw new Error(
        `Failed to fetch repositories for ${username} from GitHub`
      );
    }
  }

  async getRepoLanguages(owner: string, repo: string): Promise<string[]> {
    try {
      const { data } = await this.octokit.repos.listLanguages({
        owner,
        repo,
      });
      return Object.keys(data);
    } catch (error) {
      console.warn(`Failed to fetch languages for ${owner}/${repo}`);
      return [];
    }
  }

  async getRepoDetails(owner: string, repo: string): Promise<GitHubRepo> {
    try {
      const { data } = await this.octokit.repos.get({
        owner,
        repo,
      });
      return data as GitHubRepo;
    } catch (error) {
      throw new Error(
        `Failed to fetch repository details for ${owner}/${repo}`
      );
    }
  }

  async getAllUserRepos(username: string): Promise<GitHubRepo[]> {
    try {
      const allRepos: GitHubRepo[] = [];
      let page = 1;
      const perPage = 100;

      while (true) {
        const repos = await this.getUserRepos(username, perPage, page);
        if (repos.length === 0) break;

        allRepos.push(...repos);

        if (repos.length < perPage) break;
        page++;
      }

      return allRepos;
    } catch (error) {
      throw new Error(`Failed to fetch all repositories for ${username}`);
    }
  }

  async enrichReposWithLanguages(repos: GitHubRepo[]): Promise<GitHubRepo[]> {
    try {
      const enrichedRepos = await Promise.all(
        repos.map(async (repo) => {
          const languages = await this.getRepoLanguages(
            repo.owner.login,
            repo.name
          );
          return {
            ...repo,
            languages,
          };
        })
      );

      return enrichedRepos;
    } catch (error) {
      console.warn("Failed to enrich some repos with language data");
      return repos;
    }
  }

  async validateAccessToken(token: string): Promise<boolean> {
    try {
      // Mock implementation - replace with actual Octokit when installed
      // const octokit = new Octokit({ auth: token })
      // await octokit.users.getAuthenticated()
      return true;
    } catch (error) {
      return false;
    }
  }

  async getRateLimit(): Promise<any> {
    try {
      const { data } = await this.octokit.rateLimit.get();
      return data;
    } catch (error) {
      throw new Error("Failed to fetch GitHub rate limit information");
    }
  }

  async searchUsers(query: string, perPage = 30, page = 1): Promise<any> {
    try {
      const { data } = await this.octokit.search.users({
        q: query,
        per_page: perPage,
        page,
      });
      return data;
    } catch (error) {
      throw new Error("Failed to search GitHub users");
    }
  }

  async searchRepos(query: string, perPage = 30, page = 1): Promise<any> {
    try {
      const { data } = await this.octokit.search.repos({
        q: query,
        per_page: perPage,
        page,
      });
      return data;
    } catch (error) {
      throw new Error("Failed to search GitHub repositories");
    }
  }
}
