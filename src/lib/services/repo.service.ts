import { db } from "@/lib/db";
import { CreateRepoInput, UpdateRepoInput } from "@/lib/validations/repo";

export class RepoService {
  async createRepo(data: CreateRepoInput) {
    try {
      const repo = await db.repo.create({
        data,
        include: {
          profile: {
            include: {
              user: true,
            },
          },
        },
      });

      return repo;
    } catch (error) {
      throw error;
    }
  }

  async getRepoById(id: string) {
    try {
      const repo = await db.repo.findUnique({
        where: { id },
        include: {
          profile: {
            include: {
              user: true,
            },
          },
        },
      });

      if (!repo) {
        throw new Error("Repository not found");
      }

      return repo;
    } catch (error) {
      throw error;
    }
  }

  async getReposByProfile(profileId: string, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;

      const [repos, total] = await Promise.all([
        db.repo.findMany({
          where: { profileId },
          skip,
          take: limit,
          orderBy: { createdAt: "desc" },
        }),
        db.repo.count({ where: { profileId } }),
      ]);

      return {
        repos,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async getAllRepos(
    page = 1,
    limit = 10,
    search = "",
    language?: string
  ) {
    try {
      const skip = (page - 1) * limit;

      let where: any = {};

      if (search) {
        where.OR = [
          { name: { contains: search, mode: "insensitive" as const } },
          { description: { contains: search, mode: "insensitive" as const } },
        ];
      }

      if (language) {
        where.languages = {
          has: language,
        };
      }


      const [repos, total] = await Promise.all([
        db.repo.findMany({
          where,
          skip,
          take: limit,
          include: {
            profile: {
              include: {
                user: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        }),
        db.repo.count({ where }),
      ]);

      return {
        repos,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async updateRepo(id: string, data: UpdateRepoInput) {
    try {
      const repo = await db.repo.update({
        where: { id },
        data,
        include: {
          profile: {
            include: {
              user: true,
            },
          },
        },
      });

      return repo;
    } catch (error) {
      throw error;
    }
  }

  async deleteRepo(id: string) {
    try {
      await db.repo.delete({
        where: { id },
      });

      return { message: "Repository deleted successfully" };
    } catch (error) {
      throw error;
    }
  }

  async syncRepos(profileId: string, repos: any[]) {
    try {
      // Delete existing repos for this profile
      await db.repo.deleteMany({
        where: { profileId },
      });

      // Create new repos
      const reposData = repos.map((repo) => ({
        profileId,
        name: repo.name,
        description: repo.description || null,
        url: repo.html_url,
        languages: repo.languages || [],
        fork: repo.fork || false,
      }));

      const createdRepos = await db.repo.createMany({
        data: reposData,
      });

      return createdRepos;
    } catch (error) {
      throw error;
    }
  }

  async getTopLanguages() {
    try {
      const repos = await db.repo.findMany({
        select: {
          languages: true,
        },
      });

      const languageCount: Record<string, number> = {};

      repos.forEach((repo) => {
        repo.languages.forEach((lang) => {
          languageCount[lang] = (languageCount[lang] || 0) + 1;
        });
      });

      return Object.entries(languageCount)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 20)
        .map(([language, count]) => ({ language, count }));
    } catch (error) {
      throw error;
    }
  }
}
