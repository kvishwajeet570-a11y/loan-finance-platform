import prisma from "../../prisma/prisma";
import { Prisma } from "@prisma/client";

interface CreateCMSDto {
  title: string;
  slug: string;
  content: string;
  metaTitle?: string;
  metaDescription?: string;
  isPublished?: boolean;
}

interface CMSFilterDto {
  page?: number;
  limit?: number;
  search?: string;
}

class CMSService {
  /**
   * Create CMS Page
   */
  async createPage(data: CreateCMSDto) {
    const existing = await prisma.cMSPage.findUnique({
      where: {
        slug: data.slug,
      },
    });

    if (existing) {
      throw new Error("Page slug already exists");
    }

    return prisma.cMSPage.create({
      data,
    });
  }

  /**
   * Update CMS Page
   */
  async updatePage(
    pageId: string,
    data: Partial<CreateCMSDto>
  ) {
    return prisma.cMSPage.update({
      where: {
        id: pageId,
      },
      data,
    });
  }

  /**
   * Delete CMS Page
   */
  async deletePage(pageId: string) {
    return prisma.cMSPage.delete({
      where: {
        id: pageId,
      },
    });
  }

  /**
   * Get Page By Slug
   */
  async getPageBySlug(slug: string) {
    return prisma.cMSPage.findUnique({
      where: {
        slug,
      },
    });
  }

  /**
   * Get Page By ID
   */
  async getPageById(id: string) {
    return prisma.cMSPage.findUnique({
      where: {
        id,
      },
    });
  }

  /**
   * Publish Page
   */
  async publishPage(id: string) {
    return prisma.cMSPage.update({
      where: { id },
      data: {
        isPublished: true,
      },
    });
  }

  /**
   * Unpublish Page
   */
  async unpublishPage(id: string) {
    return prisma.cMSPage.update({
      where: { id },
      data: {
        isPublished: false,
      },
    });
  }

  /**
   * CMS Listing
   */
  async getPages(filters: CMSFilterDto) {
    const {
      page = 1,
      limit = 10,
      search,
    } = filters;

    const skip = (page - 1) * limit;

    const where: Prisma.CMSPageWhereInput = {};

    if (search) {
      where.OR = [
        {
          title: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          slug: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    const [pages, total] = await Promise.all([
      prisma.cMSPage.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          updatedAt: "desc",
        },
      }),
      prisma.cMSPage.count({
        where,
      }),
    ]);

    return {
      pages,
      total,
      page,
      pagesCount: Math.ceil(total / limit),
    };
  }

  /**
   * Homepage CMS Blocks
   */
  async getHomePageCMS() {
    return prisma.cMSPage.findMany({
      where: {
        isPublished: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  }

  /**
   * CMS Statistics
   */
  async getCMSStats() {
    const [
      totalPages,
      publishedPages,
      draftPages,
    ] = await Promise.all([
      prisma.cMSPage.count(),
      prisma.cMSPage.count({
        where: {
          isPublished: true,
        },
      }),
      prisma.cMSPage.count({
        where: {
          isPublished: false,
        },
      }),
    ]);

    return {
      totalPages,
      publishedPages,
      draftPages,
    };
  }
}

export default new CMSService();