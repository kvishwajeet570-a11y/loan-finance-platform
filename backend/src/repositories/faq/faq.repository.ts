import prisma from "../../prisma/prisma";

export class FaqRepository {

  /* ==========================
      CREATE FAQ
  ========================== */

  static async createFaq(data: {
    question: string;
    answer: string;
    category?: string;
    displayOrder?: number;
  }) {
    return prisma.fAQ.create({
      data
    });
  }

  /* ==========================
      GET FAQ BY ID
  ========================== */

  static async getFaqById(
    faqId: string
  ) {
    return prisma.fAQ.findUnique({
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
    const skip = (page - 1) * limit;

    const [faqs, total] = await Promise.all([
      prisma.fAQ.findMany({
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

      prisma.fAQ.count()
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
    return prisma.fAQ.findMany({
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
    return prisma.fAQ.findMany({
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
    return prisma.fAQ.findMany({
      where: {
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
    return prisma.fAQ.findMany({
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
    }>
  ) {
    return prisma.fAQ.update({
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
    return prisma.fAQ.update({
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
    return prisma.fAQ.update({
      where: {
        id: faqId
      },
      data: {
        isPublished: false
      }
    });
  }

  /* ==========================
      FEATURE PLACEHOLDER
  ========================== */

  static async markFeatured(
    faqId: string
  ) {
    return prisma.fAQ.findUnique({
      where: {
        id: faqId
      }
    });
  }

  static async removeFeatured(
    faqId: string
  ) {
    return prisma.fAQ.findUnique({
      where: {
        id: faqId
      }
    });
  }

  /* ==========================
      INCREMENT VIEW
  ========================== */

  static async incrementView(
    faqId: string
  ) {
    return prisma.fAQ.update({
      where: {
        id: faqId
      },
      data: {
        views: {
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
    return prisma.fAQ.delete({
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
    return prisma.fAQ.deleteMany({
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
      totalViews
    ] = await Promise.all([
      prisma.fAQ.count(),

      prisma.fAQ.count({
        where: {
          isPublished: true
        }
      }),

      prisma.fAQ.aggregate({
        _sum: {
          views: true
        }
      })
    ]);

    return {
      totalFaqs,
      publishedFaqs,
      featuredFaqs: 0,
      totalViews: totalViews._sum?.views || 0
    };
  }

  /* ==========================
      FAQ CATEGORIES
  ========================== */

  static async getCategories() {
    return prisma.fAQ.groupBy({
      by: ["category"]
    });
  }
}