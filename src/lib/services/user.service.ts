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

  async getAllStudentProfiles(page = 1, limit = 20) {
    try {
      const skip = (page - 1) * limit;

      // Only get users with STUDENT role and profiles
      const [students, total] = await Promise.all([
        db.user.findMany({
          where: {
            role: 'STUDENT',
            profile: {
              isNot: null,
            },
          },
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
          orderBy: {
            profile: {
              vouches: {
                _count: 'desc',
              },
            },
          },
        }),
        db.user.count({
          where: {
            role: 'STUDENT',
            profile: {
              isNot: null,
            },
          },
        }),
      ]);

      return {
        students,
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

      // Generate username from email if not provided
      const username =
        googleData.username ||
        googleData.email
          .split("@")[0]
          .toLowerCase()
          .replace(/[^a-z0-9_-]/g, "");

      const user = await db.user.upsert({
        where: { googleId },
        update: {
          name: googleData.name || undefined,
          email: googleData.email,
          username: username,
          image: googleData.picture || undefined,
          emailVerified: googleData.verified_email || false,
        },
        create: {
          googleId,
          name: googleData.name || undefined,
          email: googleData.email,
          username: username,
          image: googleData.picture || undefined,
          emailVerified: googleData.verified_email || false,
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
      role: 'STUDENT' | 'RECRUITER';
      profileImage?: string;
      username?: string;
      bio?: string;
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

      // For students, validate username uniqueness
      if (onboardingData.role === 'STUDENT' && onboardingData.username) {
        const existingUserWithUsername = await db.user.findUnique({
          where: { username: onboardingData.username },
        });

        if (existingUserWithUsername && existingUserWithUsername.id !== existingUser.id) {
          throw new Error("Username already taken");
        }
      }

      // Update user and create profile in a transaction
      const result = await db.$transaction(async (tx) => {
        // For students: update with full profile data
        if (onboardingData.role === 'STUDENT') {
          const user = await tx.user.update({
            where: { googleId },
            data: {
              role: 'STUDENT',
              name: onboardingData.name || onboardingData.username,
              username: onboardingData.username!,
              bio: onboardingData.bio!,
              image: onboardingData.profileImage!,
              onboardingComplete: true,
            },
          });

          // Create profile for students
          const profile = await tx.profile.upsert({
            where: { userId: user.id },
            update: {},
            create: {
              userId: user.id,
              skills: [],
            },
          });

          return { user, profile };
        } 
        // For recruiters: minimal update, no profile
        else {
          const user = await tx.user.update({
            where: { googleId },
            data: {
              role: 'RECRUITER',
              username: onboardingData.username || existingUser.username,
              onboardingComplete: true,
            },
          });

          return { user, profile: null };
        }
      });

      return result;
    } catch (error) {
      throw error;
    }
  }

  async checkUsernameAvailability(username: string) {
    try {
      // Validate username format
      const usernameRegex = /^[a-z0-9_-]{3,20}$/;
      if (!usernameRegex.test(username)) {
        throw new Error(
          "Username must be 3-20 characters, lowercase letters, numbers, hyphens, and underscores only"
        );
      }

      // Check if username exists
      const existingUser = await db.user.findUnique({
        where: { username },
      });

      return {
        available: !existingUser,
        username: username,
      };
    } catch (error) {
      throw error;
    }
  }
}
