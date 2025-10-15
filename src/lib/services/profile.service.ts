import { db } from "@/lib/db";
import {
  CreateProfileInput,
  UpdateProfileInput,
} from "@/lib/validations/profile";

export class ProfileService {
  async createProfile(data: CreateProfileInput) {
    try {
      // Check if profile already exists for user
      const existingProfile = await db.profile.findUnique({
        where: { userId: data.userId },
      });

      if (existingProfile) {
        throw new Error("Profile already exists for this user");
      }

      const profile = await db.profile.create({
        data,
        include: {
          user: true,
          repos: true,
          _count: {
            select: {
              vouches: true,
            },
          },
        },
      });

      return profile;
    } catch (error) {
      throw error;
    }
  }

  async checkUsernameAvailability(username: string) {
    try {
      const usernameRegex = /^[a-z0-9_-]{3,20}$/;
      if (!usernameRegex.test(username)) {
        throw new Error(
          "Username must be 3-20 characters, lowercase letters, numbers, hyphens, and underscores only"
        );
      }

      const existing = await db.user.findUnique({ where: { username } });
      return { available: !existing };
    } catch (error) {
      throw error;
    }
  }

  async getProfileById(id: string) {
    try {
      const profile = await db.profile.findUnique({
        where: { id },
        include: {
          user: true,
          repos: {
            orderBy: { createdAt: "desc" },
          },
          vouches: {
            orderBy: { createdAt: "desc" },
            take: 10,
          },
          _count: {
            select: {
              vouches: true,
              repos: true,
            },
          },
        },
      });

      if (!profile) {
        throw new Error("Profile not found");
      }

      return profile;
    } catch (error) {
      throw error;
    }
  }

  async getProfileByUserId(userId: string) {
    try {
      const profile = await db.profile.findUnique({
        where: { userId },
        include: {
          user: true,
          repos: {
            orderBy: { createdAt: "desc" },
          },
          vouches: {
            orderBy: { createdAt: "desc" },
            take: 10,
          },
          _count: {
            select: {
              vouches: true,
              repos: true,
            },
          },
        },
      });

      if (!profile) {
        throw new Error("Profile not found");
      }

      return profile;
    } catch (error) {
      throw error;
    }
  }

  async updateProfile(id: string, data: UpdateProfileInput) {
    try {
      const profile = await db.profile.update({
        where: { id },
        data,
        include: {
          user: true,
          repos: true,
          _count: {
            select: {
              vouches: true,
            },
          },
        },
      });

      return profile;
    } catch (error) {
      throw error;
    }
  }

  async getAllProfiles(page = 1, limit = 10, search = "", skills?: string) {
    try {
      const skip = (page - 1) * limit;

      let where: any = {};

      if (search) {
        const searchTerm = search.trim();
        where.OR = [
          // User name search
          {
            user: {
              name: { contains: searchTerm, mode: "insensitive" as const },
            },
          },
          // User email search
          {
            user: {
              email: { contains: searchTerm, mode: "insensitive" as const },
            },
          },
          // Username search
          {
            user: {
              username: { contains: searchTerm, mode: "insensitive" as const },
            },
          },
          // Bio search
          {
            user: {
              bio: { contains: searchTerm, mode: "insensitive" as const },
            },
          },
          // Skills search - exact and partial matches
          {
            skills: {
              hasSome: [searchTerm], // Try exact match first
            },
          },
          // Skills search - case insensitive match
          {
            skills: {
              hasSome: [searchTerm.toLowerCase()],
            },
          },
          // Skills search - case insensitive match with capitalized first letter
          {
            skills: {
              hasSome: [
                searchTerm.charAt(0).toUpperCase() +
                  searchTerm.slice(1).toLowerCase(),
              ],
            },
          },
          // Skills search - uppercase version
          {
            skills: {
              hasSome: [searchTerm.toUpperCase()],
            },
          },
          // Resume content search
          {
            resumeContent: {
              contains: searchTerm,
              mode: "insensitive" as const,
            },
          },
          // Repository name search
          {
            repos: {
              some: {
                name: { contains: searchTerm, mode: "insensitive" as const },
              },
            },
          },
          // Repository description search
          {
            repos: {
              some: {
                description: {
                  contains: searchTerm,
                  mode: "insensitive" as const,
                },
              },
            },
          },
          // Repository languages search
          {
            repos: {
              some: {
                languages: {
                  hasSome: [searchTerm],
                },
              },
            },
          },
        ];
      }

      if (skills) {
        const skillArray = skills.split(",").map((s) => s.trim());
        // If search is already applied, we need to combine with AND
        if (where.OR) {
          where = {
            AND: [
              { OR: where.OR },
              {
                skills: {
                  hasSome: skillArray,
                },
              },
            ],
          };
        } else {
          where.skills = {
            hasSome: skillArray,
          };
        }
      }

      const [profiles, total] = await Promise.all([
        db.profile.findMany({
          where,
          skip,
          take: limit,
          include: {
            user: true,
            repos: {
              select: {
                id: true,
                name: true,
                description: true,
                languages: true,
              },
            },
            _count: {
              select: {
                vouches: true,
                repos: true,
              },
            },
          },
          orderBy: [
            // Order by creation date for now - can be enhanced with relevance scoring
            { updatedAt: "desc" },
            { createdAt: "desc" },
          ],
        }),
        db.profile.count({ where }),
      ]);

      return {
        profiles,
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

  async incrementVouchCount(profileId: string) {
    try {
      // This would be handled by the VouchService when creating vouches
      // No direct field update needed as vouches are counted via relations
      return { message: "Vouch count incremented" };
    } catch (error) {
      throw error;
    }
  }

  async decrementVouchCount(profileId: string) {
    try {
      // This would be handled by the VouchService when deleting vouches
      // No direct field update needed as vouches are counted via relations
      return { message: "Vouch count decremented" };
    } catch (error) {
      throw error;
    }
  }

  async syncProfile(profileId: string, lastSyncedAt: Date) {
    try {
      await db.profile.update({
        where: { id: profileId },
        data: { lastSyncedAt },
      });
    } catch (error) {
      throw error;
    }
  }

  async deleteProfile(id: string) {
    try {
      await db.profile.delete({
        where: { id },
      });

      return { message: "Profile deleted successfully" };
    } catch (error) {
      throw error;
    }
  }
}
