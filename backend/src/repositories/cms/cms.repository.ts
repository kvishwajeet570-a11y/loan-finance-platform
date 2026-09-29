import prisma from "../../prisma/prisma";
export class CmsRepository {

  /* =========================
      CREATE PAGE
  ========================= */

  static async createPage(data: {
    title: string;
    slug: string;
    content: string;
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
    pageType?: string;
    createdBy?: string;
  }) {

    return prisma.cMSPage.create({
      data
    });
  }

  /* =========================
      GET PAGE BY ID
  ========================= */

  static async getPageById(
    pageId: string
  ) {

    return prisma.cMSPage.findUnique({
      where: {
        id: pageId
      }
    });
  }

  /* =========================
      GET PAGE BY SLUG
  ========================= */

  static async getPageBySlug(
    slug: string
  ) {

    return prisma.cMSPage.findUnique({
      where: {
        slug
      }
    });
  }

  /* =========================
      GET ALL PAGES
  ========================= */

  static async getAllPages(
    page = 1,
    limit = 20
  ) {

    const skip = (page - 1) * limit;

    const [pages, total] =
      await Promise.all([

        prisma.cMSPage.findMany({
          skip,
          take: limit,
          orderBy: {
            updatedAt: "desc"
          }
        }),

        prisma.cMSPage.count()
      ]);

    return {
      total,
      page,
      limit,
      pages
    };
  }

  /* =========================
      GET PUBLISHED PAGES
  ========================= */

  static async getPublishedPages() {

    return prisma.cMSPage.findMany({
      where: {
        isPublished: true
      },
      orderBy: {
        updatedAt: "desc"
      }
    });
  }

  /* =========================
      SEARCH PAGES
  ========================= */

  static async searchPages(
    keyword: string
  ) {

    return prisma.cMSPage.findMany({
      where: {
        OR: [
          {
            title: {
              contains: keyword,
              mode: "insensitive"
            }
          },
          {
            slug: {
              contains: keyword,
              mode: "insensitive"
            }
          },
          {
            content: {
              contains: keyword,
              mode: "insensitive"
            }
          }
        ]
      }
    });
  }

  /* =========================
      UPDATE PAGE
  ========================= */

  static async updatePage(
    pageId: string,
    data: {
      title?: string;
      content?: string;
      metaTitle?: string;
      metaDescription?: string;
      metaKeywords?: string;
      pageType?: string;
      updatedBy?: string;
    }
  ) {

    return prisma.cMSPage.update({
      where: {
        id: pageId
      },
      data
    });
  }

  /* =========================
      PUBLISH PAGE
  ========================= */

  static async publishPage(
    pageId: string
  ) {

    return prisma.cMSPage.update({
      where: {
        id: pageId
      },
      data: {
        isPublished: true
      }
    });
  }

  /* =========================
      UNPUBLISH PAGE
  ========================= */

  static async unpublishPage(
    pageId: string
  ) {

    return prisma.cMSPage.update({
      where: {
        id: pageId
      },
      data: {
        isPublished: false
      }
    });
  }

  /* =========================
      DELETE PAGE
  ========================= */

  static async deletePage(
    pageId: string
  ) {

    return prisma.cMSPage.delete({
      where: {
        id: pageId
      }
    });
  }

  /* =========================
      GET PAGE TYPES
  ========================= */

  static async getPageTypes() {

    return prisma.cMSPage.groupBy({
      by: ["pageType"]
    });
  }

  /* =========================
      CMS ANALYTICS
  ========================= */

  static async getCmsAnalytics() {

    const [
      totalPages,
      publishedPages,
      draftPages
    ] = await Promise.all([

      prisma.cMSPage.count(),

      prisma.cMSPage.count({
        where: {
          isPublished: true
        }
      }),

      prisma.cMSPage.count({
        where: {
          isPublished: false
        }
      })
    ]);

    return {
      totalPages,
      publishedPages,
      draftPages
    };
  }

  /* =========================
      BULK DELETE
  ========================= */

  static async bulkDelete(
    pageIds: string[]
  ) {

    return prisma.cMSPage.deleteMany({
      where: {
        id: {
          in: pageIds
        }
      }
    });
  }
}