import prisma from "../../prisma/prisma";
import { Prisma } from "@prisma/client";

interface CreateFastTagDto {
  name: string;
  slug: string;
  description?: string;
  color?: string;
  icon?: string;
  isActive?: boolean;
}

interface FastTagFilters {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}

class FastTagService {
  /**
   * Create Fast Tag
   */
  async createFastTag(
    data: CreateFastTagDto
  ) {
    const existing =
      await prisma.fastTag.findUnique({
        where: {
          slug: data.slug,
        },
      });

    if (existing) {
      throw new Error(
        "Fast tag already exists"
      );
    }

    return prisma.fastTag.create({
      data,
    });
  }

  /**
   * Update Fast Tag
   */
  async updateFastTag(
    id: string,
    data: Partial<CreateFastTagDto>
  ) {
    return prisma.fastTag.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete Fast Tag
   */
  async deleteFastTag(id: string) {
    return prisma.fastTag.delete({
      where: { id },
    });
  }

  /**
   * Get Tag By ID
   */
  async getFastTagById(id: string) {
    return prisma.fastTag.findUnique({
      where: { id },
    });
  }

  /**
   * Get Tag By Slug
   */
  async getFastTagBySlug(
    slug: string
  ) {
    return prisma.fastTag.findUnique({
      where: { slug },
    });
  }

  /**
   * Get All Tags
   */
  async getFastTags(
    filters: FastTagFilters
  ) {
    const {
      page = 1,
      limit = 20,
      search,
      isActive,
    } = filters;

    const skip = (page - 1) * limit;

    const where: Prisma.FastTagWhereInput =
      {};

    if (search) {
      where.OR = [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    if (
      typeof isActive === "boolean"
    ) {
      where.isActive = isActive;
    }

    const [tags, total] =
      await Promise.all([
        prisma.fastTag.findMany({
          where,
          skip,
          take: limit,
          orderBy: {
            createdAt: "desc",
          },
        }),
        prisma.fastTag.count({
          where,
        }),
      ]);

    return {
      tags,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  /**
   * Active Tags
   */
  async getActiveTags() {
    return prisma.fastTag.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        name: "asc",
      },
    });
  }

  /**
   * Enable Tag
   */
  async activateTag(id: string) {
    return prisma.fastTag.update({
      where: { id },
      data: {
        isActive: true,
      },
    });
  }

  /**
   * Disable Tag
   */
  async deactivateTag(id: string) {
    return prisma.fastTag.update({
      where: { id },
      data: {
        isActive: false,
      },
    });
  }

  /**
   * Dashboard Stats
   */
  async getFastTagStats() {
    const [
      totalTags,
      activeTags,
      inactiveTags,
    ] = await Promise.all([
      prisma.fastTag.count(),

      prisma.fastTag.count({
        where: {
          isActive: true,
        },
      }),

      prisma.fastTag.count({
        where: {
          isActive: false,
        },
      }),
    ]);

    return {
      totalTags,
      activeTags,
      inactiveTags,
    };
  }
}

export default new FastTagService();