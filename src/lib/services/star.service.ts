import { prisma } from "@/lib/db";
import { CreateStarInput } from "@/lib/validations/star";

export class StarService {
  async createStar(data: CreateStarInput) {
    try {
      // Check if user already starred this profile
      const existingStar = await prisma.star.findFirst({
        where: {
          profileId: data.profileId,
          ipHash: data.ipHash,
        },
      });

      if (existingStar) {
        throw new Error("You have already starred this profile");
      }

      const star = await prisma.star.create({
        data,
        include: {
          profile: {
            include: {
              user: true,
            },
          },
        },
      });

      // Increment star count on profile
      await prisma.profile.update({
        where: { id: data.profileId },
        data: {
          startCount: {
            increment: 1,
          },
        },
      });

      return star;
    } catch (error) {
      throw error;
    }
  }

  async getStarById(id: string) {
    try {
      const star = await prisma.star.findUnique({
        where: { id },
        include: {
          profile: {
            include: {
              user: true,
            },
          },
        },
      });

      if (!star) {
        throw new Error("Star not found");
      }

      return star;
    } catch (error) {
      throw error;
    }
  }

  async getStarsByProfile(profileId: string, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;

      const [stars, total] = await Promise.all([
        prisma.star.findMany({
          where: { profileId },
          skip,
          take: limit,
          orderBy: { createdAt: "desc" },
        }),
        prisma.star.count({ where: { profileId } }),
      ]);

      return {
        stars,
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

  async getAllStars(page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;

      const [stars, total] = await Promise.all([
        prisma.star.findMany({
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
        prisma.star.count(),
      ]);

      return {
        stars,
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

  async deleteStar(id: string) {
    try {
      const star = await prisma.star.findUnique({
        where: { id },
        include: {
          profile: true,
        },
      });

      if (!star) {
        throw new Error("Star not found");
      }

      await prisma.star.delete({
        where: { id },
      });

      // Decrement star count on profile
      await prisma.profile.update({
        where: { id: star.profileId },
        data: {
          startCount: {
            decrement: 1,
          },
        },
      });

      return { message: "Star removed successfully" };
    } catch (error) {
      throw error;
    }
  }

  async checkUserHasStarred(profileId: string, ipHash: string) {
    try {
      const star = await prisma.star.findFirst({
        where: {
          profileId,
          ipHash,
        },
      });

      return !!star;
    } catch (error) {
      throw error;
    }
  }

  async getStarStats() {
    try {
      const [totalStars, uniqueProfiles] = await Promise.all([
        prisma.star.count(),
        prisma.star.groupBy({
          by: ["profileId"],
          _count: {
            profileId: true,
          },
        }),
      ]);

      const totalProfiles = uniqueProfiles.length;
      const averageStarsPerProfile =
        totalProfiles > 0 ? totalStars / totalProfiles : 0;

      return {
        totalStars,
        totalProfiles,
        averageStarsPerProfile: Math.round(averageStarsPerProfile * 100) / 100,
      };
    } catch (error) {
      throw error;
    }
  }
}
