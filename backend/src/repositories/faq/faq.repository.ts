import { prisma } from "../../prisma/prisma";

export class FaqRepository {

  /* ==========================
      CREATE FAQ
  ========================== */

  static async createFaq(data: {
    question: string;
    answer: string;
    category?: string;
    displayOrder?: number;
    isFeatured?: boolean;
  }) {

    return prisma.faq.create({
      data
    });
  }

  /* ==========================
      GET FAQ BY ID
  ========================== */

  static async getFaqById(
    faqId: string
  ) {

    return prisma.faq.findUnique({
      where: {
        id: faqId
      }
    });
  }

  /* ==========================
      GET ALL FAQS
  ========================== */

  static async getAllFaqs(
    page = 1,
    limit = 20
  ) {

    const skip =
      (page - 1) * limit;

    const [faqs, total] =
      await Promise.all([

        prisma.faq.findMany({
          skip,
          take: limit,
          orderBy: [
            {
              displayOrder: "asc"
            },
            {
              createdAt: "desc"
            }
          ]
        }),

        prisma.faq.count()
      ]);

    return {
      total,
      page,
      limit,
      faqs
    };
  }

  /* ==========================
      PUBLISHED FAQS
  ========================== */

  static async getPublishedFaqs() {

    return prisma.faq.findMany({
      where: {
        isPublished: true
      },
      orderBy: {
        displayOrder: "asc"
      }
    });
  }

  /* ==========================
      FAQ BY CATEGORY
  ========================== */

  static async getFaqsByCategory(
    category: string
  ) {

    return prisma.faq.findMany({
      where: {
        category,
        isPublished: true
      },
      orderBy: {
        displayOrder: "asc"
      }
    });
  }

  /* ==========================
      FEATURED FAQS
  ========================== */

  static async getFeaturedFaqs() {

    return prisma.faq.findMany({
      where: {
        isFeatured: true,
        isPublished: true
      }
    });
  }

  /* ==========================
      SEARCH FAQS
  ========================== */

  static async searchFaqs(
    keyword: string
  ) {

    return prisma.faq.findMany({
      where: {
        OR: [
          {
            question: {
              contains: keyword,
              mode: "insensitive"
            }
          },
          {
            answer: {
              contains: keyword,
              mode: "insensitive"
            }
          },
          {
            category: {
              contains: keyword,
              mode: "insensitive"
            }
          }
        ]
      }
    });
  }

  /* ==========================
      UPDATE FAQ
  ========================== */

  static async updateFaq(
    faqId: string,
    data: Partial<{
      question: string;
      answer: string;
      category: string;
      displayOrder: number;
      isFeatured: boolean;
    }>
  ) {

    return prisma.faq.update({
      where: {
        id: faqId
      },
      data
    });
  }

  /* ==========================
      PUBLISH FAQ
  ========================== */

  static async publishFaq(
    faqId: string
  ) {

    return prisma.faq.update({
      where: {
        id: faqId
      },
      data: {
        isPublished: true
      }
    });
  }

  /* ==========================
      UNPUBLISH FAQ
  ========================== */

  static async unpublishFaq(
    faqId: string
  ) {

    return prisma.faq.update({
      where: {
        id: faqId
      },
      data: {
        isPublished: false
      }
    });
  }

  /* ==========================
      FEATURE FAQ
  ========================== */

  static async markFeatured(
    faqId: string
  ) {

    return prisma.faq.update({
      where: {
        id: faqId
      },
      data: {
        isFeatured: true
      }
    });
  }

  /* ==========================
      REMOVE FEATURED
  ========================== */

  static async removeFeatured(
    faqId: string
  ) {

    return prisma.faq.update({
      where: {
        id: faqId
      },
      data: {
        isFeatured: false
      }
    });
  }

  /* ==========================
      INCREMENT VIEW
  ========================== */

  static async incrementView(
    faqId: string
  ) {

    return prisma.faq.update({
      where: {
        id: faqId
      },
      data: {
        viewCount: {
          increment: 1
        }
      }
    });
  }

  /* ==========================
      DELETE FAQ
  ========================== */

  static async deleteFaq(
    faqId: string
  ) {

    return prisma.faq.delete({
      where: {
        id: faqId
      }
    });
  }

  /* ==========================
      BULK DELETE FAQS
  ========================== */

  static async bulkDelete(
    faqIds: string[]
  ) {

    return prisma.faq.deleteMany({
      where: {
        id: {
          in: faqIds
        }
      }
    });
  }

  /* ==========================
      FAQ ANALYTICS
  ========================== */

  static async getFaqAnalytics() {

    const [
      totalFaqs,
      publishedFaqs,
      featuredFaqs,
      totalViews
    ] = await Promise.all([

      prisma.faq.count(),

      prisma.faq.count({
        where: {
          isPublished: true
        }
      }),

      prisma.faq.count({
        where: {
          isFeatured: true
        }
      }),

      prisma.faq.aggregate({
        _sum: {
          viewCount: true
        }
      })
    ]);

    return {
      totalFaqs,
      publishedFaqs,
      featuredFaqs,
      totalViews:
        totalViews._sum.viewCount || 0
    };
  }

  /* ==========================
      FAQ CATEGORIES
  ========================== */

  static async getCategories() {

    return prisma.faq.groupBy({
      by: ["category"]
    });
  }
}