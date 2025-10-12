import { prisma } from "@/lib/db";
import { CreateUserInput, UpdateUserInput } from "@/lib/validations/user";

export class UserService {
  async createUser(data: CreateUserInput) {
    try {
      // Check if GitHub login already exists
      const existingUser = await prisma.user.findUnique({
        where: { githubLogin: data.githubLogin },
      });

      if (existingUser) {
        throw new Error("User with this GitHub login already exists");
      }

      const user = await prisma.user.create({
        data,
        include: {
          profile: true,
        },
      });

      return user;
    } catch (error) {
      throw error;
    }
  }

  async getUserByGithubLogin(githubLogin: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { githubLogin },
        include: {
          profile: {
            include: {
              repos: {
                orderBy: { stars: "desc" },
              },
              _count: {
                select: {
                  stars: true,
                  repos: true,
                },
              },
            },
          },
        },
      });

      if (!user) {
        throw new Error("User not found");
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  async getUserById(id: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        include: {
          profile: {
            include: {
              repos: {
                orderBy: { stars: "desc" },
              },
              _count: {
                select: {
                  stars: true,
                  repos: true,
                },
              },
            },
          },
        },
      });

      if (!user) {
        throw new Error("User not found");
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  async updateUser(githubLogin: string, data: UpdateUserInput) {
    try {
      const user = await prisma.user.update({
        where: { githubLogin },
        data,
        include: {
          profile: true,
        },
      });

      return user;
    } catch (error) {
      throw error;
    }
  }

  async getAllUsers(page = 1, limit = 10, search = "") {
    try {
      const skip = (page - 1) * limit;

      const where = search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" as const } },
              {
                githubLogin: { contains: search, mode: "insensitive" as const },
              },
            ],
          }
        : {};

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where,
          skip,
          take: limit,
          include: {
            profile: {
              include: {
                _count: {
                  select: {
                    stars: true,
                    repos: true,
                  },
                },
              },
            },
          },
          orderBy: { createdAt: "desc" },
        }),
        prisma.user.count({ where }),
      ]);

      return {
        users,
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

  async deleteUser(githubLogin: string) {
    try {
      await prisma.user.delete({
        where: { githubLogin },
      });

      return { message: "User deleted successfully" };
    } catch (error) {
      throw error;
    }
  }

  async syncUserFromGitHub(githubLogin: string, githubData: any) {
    try {
      const user = await prisma.user.upsert({
        where: { githubLogin },
        update: {
          name: githubData.name || undefined,
          email: githubData.email || undefined,
          avatarUrl: githubData.avatar_url || undefined,
        },
        create: {
          githubLogin,
          name: githubData.name || undefined,
          email: githubData.email || undefined,
          avatarUrl: githubData.avatar_url || undefined,
        },
        include: {
          profile: true,
        },
      });

      return user;
    } catch (error) {
      throw error;
    }
  }
}
