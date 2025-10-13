import { db } from "@/lib/db";
import { CreateUserInput, UpdateUserInput } from "@/lib/validations/user";

export class UserService {
  async createUser(data: CreateUserInput) {
    try {
      // Check if Google ID already exists
      const existingUser = await db.user.findUnique({
        where: { googleId: data.googleId },
      });

      if (existingUser) {
        throw new Error("User with this Google ID already exists");
      }

      const user = await db.user.create({
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
      const user = await db.user.findUnique({
        where: { googleId },
        include: {
          profile: {
            include: {
              repos: {
                orderBy: { createdAt: "desc" },
              },
              _count: {
                select: {
                  vouches: true,
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
      const user = await db.user.findUnique({
        where: { id },
        include: {
          profile: {
            include: {
              repos: {
                orderBy: { createdAt: "desc" },
              },
              _count: {
                select: {
                  vouches: true,
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
      const user = await db.user.update({
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
        db.user.findMany({
          where,
          skip,
          take: limit,
          include: {
            profile: {
              include: {
                _count: {
                  select: {
                    vouches: true,
                    repos: true,
                  },
                },
              },
            },
          },
          orderBy: { createdAt: "desc" },
        }),
        db.user.count({ where }),
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
      await db.user.delete({
        where: { googleId },
      });

      return { message: "User deleted successfully" };
    } catch (error) {
      throw error;
    }
  }

  async syncUserFromGoogle(googleId: string, googleData: any) {
    try {
      // Ensure email is always provided (required by schema)
      if (!googleData.email) {
        throw new Error("Email is required for user creation");
      }

      const user = await db.user.upsert({
        where: { googleId },
        update: {
          name: googleData.name || undefined,
          email: googleData.email,
          image: googleData.picture || undefined,
        },
        create: {
          googleId,
          name: googleData.name || undefined,
          email: googleData.email,
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

  async checkOnboardingStatus(googleId: string) {
    try {
      const user = await db.user.findUnique({
        where: { googleId },
        select: {
          id: true,
          onboardingComplete: true,
          profile: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      });

      if (!user) {
        return {
          onboardingComplete: false,
          isNewUser: true,
        };
      }

      const hasProfile = !!user.profile;

      return {
        onboardingComplete: user.onboardingComplete && hasProfile,
        isNewUser: false,
        userId: user.id,
        hasProfile: hasProfile,
      };
    } catch (error) {
      throw error;
    }
  }

  async updateUserImage(userId: string, imageUrl: string) {
    try {
      const updatedUser = await db.user.update({
        where: { id: userId },
        data: { image: imageUrl },
      });

      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  async completeOnboarding(
    googleId: string,
    onboardingData: {
      profileImage: string;
      username: string;
      resumeContent: string;
      githubId: string;
      skills?: string[];
      name?: string;
    }
  ) {
    try {
      // Check if user exists
      const existingUser = await db.user.findUnique({
        where: { googleId },
      });

      if (!existingUser) {
        throw new Error("User not found. Please sign in again.");
      }

      // Check if username is taken
      const existingProfile = await db.profile.findUnique({
        where: { username: onboardingData.username },
      });

      if (existingProfile) {
        throw new Error("Username already taken");
      }

      // Update user and create profile in a transaction
      const result = await db.$transaction(async (tx) => {
        // Update user
        const user = await tx.user.update({
          where: { googleId },
          data: {
            name: onboardingData.name || onboardingData.username,
            image: onboardingData.profileImage,
            onboardingComplete: true,
          },
        });

        // Create profile
        const profile = await tx.profile.create({
          data: {
            userId: user.id,
            username: onboardingData.username,
            bio: `Welcome to ${onboardingData.username}'s portfolio!`,
            resumeContent: onboardingData.resumeContent,
            githubId: onboardingData.githubId,
            skills: onboardingData.skills || [],
          },
        });

        return { user, profile };
      });

      return result;
    } catch (error) {
      throw error;
    }
  }
}
