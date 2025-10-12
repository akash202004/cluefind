import { prisma } from "@/lib/db";
import { CreateUserInput, UpdateUserInput } from "@/lib/validations/user";

export class UserService {
  async createUser(data: CreateUserInput) {
    try {
      // Check if Google ID already exists
      const existingUser = await prisma.user.findUnique({
        where: { googleId: data.googleId },
      });

      if (existingUser) {
        throw new Error("User with this Google ID already exists");
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

  async getUserByGoogleId(googleId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { googleId },
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

  async updateUser(googleId: string, data: UpdateUserInput) {
    try {
      const user = await prisma.user.update({
        where: { googleId },
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
                email: { contains: search, mode: "insensitive" as const },
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

  async deleteUser(googleId: string) {
    try {
      await prisma.user.delete({
        where: { googleId },
      });

      return { message: "User deleted successfully" };
    } catch (error) {
      throw error;
    }
  }

  async syncUserFromGoogle(googleId: string, googleData: any) {
    try {
      const user = await prisma.user.upsert({
        where: { googleId },
        update: {
          name: googleData.name || undefined,
          email: googleData.email || undefined,
          image: googleData.picture || undefined,
        },
        create: {
          googleId,
          name: googleData.name || undefined,
          email: googleData.email || undefined,
          image: googleData.picture || undefined,
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
