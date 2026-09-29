import prisma from "../../prisma/prisma";
import { Prisma } from "@prisma/client";

interface CreateCMSDto {
  title: string;
  slug: string;
  content: string;

  excerpt?: string;
  description?: string;

  pageType?: string;
  category?: string;

  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;

  featuredImage?: string;
  bannerImage?: string;

  isPublished?: boolean;
  isActive?: boolean;

  publishedAt?: Date;
  sortOrder?: number;

  createdBy?: string;
  updatedBy?: string;
}

interface CMSFilterDto {
  page?: number;
  limit?: number;
  search?: string;
  pageType?: string;
  category?: string;
  isPublished?: boolean;
  isActive?: boolean;
}

class CMSService {

  // ========================================
  // CREATE PAGE
  // ========================================

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
      data: {
        ...data,
        publishedAt: data.isPublished ? new Date() : null,
      },
    });
  }

  // ========================================
  // UPDATE PAGE
  // ========================================

  async updatePage(
    pageId: string,
    data: Partial<CreateCMSDto>
  ) {
    return prisma.cMSPage.update({
      where: {
        id: pageId,
      },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  }

  // ========================================
  // DELETE PAGE
  // ========================================

  async deletePage(pageId: string) {
    return prisma.cMSPage.delete({
      where: {
        id: pageId,
      },
    });
  }

  // ========================================
  // GET PAGE BY ID
  // ========================================

  async getPageById(id: string) {
    return prisma.cMSPage.findUnique({
      where: {
        id,
      },
    });
  }

  // ========================================
  // GET PAGE BY SLUG
  // ========================================

  async getPageBySlug(slug: string) {
    return prisma.cMSPage.findUnique({
      where: {
        slug,
      },
    });
  }

  // ========================================
  // GET ALL PAGES
  // ========================================

  async getAllPages(filters: CMSFilterDto) {
    const {
      page = 1,
      limit = 10,
      search,
      pageType,
      category,
      isPublished,
      isActive,
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
        {
          content: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    if (pageType) where.pageType = pageType;

    if (category) where.category = category;

    if (isPublished !== undefined)
      where.isPublished = isPublished;

    if (isActive !== undefined)
      where.isActive = isActive;

    const [pages, total] = await Promise.all([
      prisma.cMSPage.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          {
            sortOrder: "asc",
          },
          {
            updatedAt: "desc",
          },
        ],
      }),

      prisma.cMSPage.count({
        where,
      }),
    ]);

    return {
      pages,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
    // ========================================
  // GET PUBLISHED PAGES
  // ========================================

  async getPublishedPages() {
    return prisma.cMSPage.findMany({
      where: {
        isPublished: true,
        isActive: true,
      },
      orderBy: [
        {
          sortOrder: "asc",
        },
        {
          publishedAt: "desc",
        },
      ],
    });
  }

  // ========================================
  // SEARCH PAGES
  // ========================================

  async searchPages(filters: {
    keyword?: string;
    page?: number;
    limit?: number;
    pageType?: string;
    category?: string;
    isPublished?: boolean;
  }) {
    const {
      keyword = "",
      page = 1,
      limit = 10,
      pageType,
      category,
      isPublished,
    } = filters;

    const skip = (page - 1) * limit;

    const where: Prisma.CMSPageWhereInput = {};

    if (keyword) {
      where.OR = [
        {
          title: {
            contains: keyword,
            mode: "insensitive",
          },
        },
        {
          slug: {
            contains: keyword,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: keyword,
            mode: "insensitive",
          },
        },
        {
          metaTitle: {
            contains: keyword,
            mode: "insensitive",
          },
        },
        {
          metaDescription: {
            contains: keyword,
            mode: "insensitive",
          },
        },
      ];
    }

    if (pageType) where.pageType = pageType;

    if (category) where.category = category;

    if (isPublished !== undefined) {
      where.isPublished = isPublished;
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
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // ========================================
  // PUBLISH PAGE
  // ========================================

  async publishPage(id: string) {
    return prisma.cMSPage.update({
      where: {
        id,
      },
      data: {
        isPublished: true,
        publishedAt: new Date(),
      },
    });
  }

  // ========================================
  // UNPUBLISH PAGE
  // ========================================

  async unpublishPage(id: string) {
    return prisma.cMSPage.update({
      where: {
        id,
      },
      data: {
        isPublished: false,
        publishedAt: null,
      },
    });
  }
    // ========================================
  // GET PAGE TYPES
  // ========================================

  async getPageTypes() {
    const pageTypes = await prisma.cMSPage.findMany({
      distinct: ["pageType"],
      select: {
        pageType: true,
      },
      where: {
        pageType: {
          not: null,
        },
      },
      orderBy: {
        pageType: "asc",
      },
    });

    return pageTypes
      .map((item) => item.pageType)
      .filter(Boolean);
  }

  // ========================================
  // CMS ANALYTICS
  // ========================================

  async getCmsAnalytics() {
    const [
      totalPages,
      publishedPages,
      draftPages,
      activePages,
      inactivePages,
      totalViews,
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

      prisma.cMSPage.count({
        where: {
          isActive: true,
        },
      }),

      prisma.cMSPage.count({
        where: {
          isActive: false,
        },
      }),

      prisma.cMSPage.aggregate({
        _sum: {
          views: true,
        },
      }),
    ]);

    return {
      totalPages,
      publishedPages,
      draftPages,
      activePages,
      inactivePages,
      totalViews: totalViews._sum.views ?? 0,
    };
  }

  // ========================================
  // BULK DELETE
  // ========================================

  async bulkDelete(ids: string[]) {
    return prisma.cMSPage.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }
}

export default new CMSService();