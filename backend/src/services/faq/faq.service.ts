import prisma from "../../prisma/prisma";
import { Prisma } from "@prisma/client";

interface CreateFAQDto {
  question: string;
  answer: string;
  category?: string;
  displayOrder?: number;
  isPublished?: boolean;
}

interface FAQFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  isPublished?: boolean;
}

class FAQService {
  /**
   * Create FAQ
   */
  async createFAQ(data: CreateFAQDto) {
    return prisma.fAQ.create({
      data: {
        ...data,
        views: 0,
      },
    });
  }

  /**
   * Update FAQ
   */
  async updateFAQ(
    faqId: string,
    data: Partial<CreateFAQDto>
  ) {
    return prisma.fAQ.update({
      where: {
        id: faqId,
      },
      data,
    });
  }

  /**
   * Delete FAQ
   */
  async deleteFAQ(faqId: string) {
    return prisma.fAQ.delete({
      where: {
        id: faqId,
      },
    });
  }

  /**
   * Get FAQ By ID
   */
  async getFAQById(id: string) {
    const faq = await prisma.fAQ.findUnique({
      where: { id },
    });

    if (!faq) {
      throw new Error("FAQ not found");
    }

    await prisma.fAQ.update({
      where: { id },
      data: {
        views: {
          increment: 1,
        },
      },
    });

    return faq;
  }

  /**
   * Publish FAQ
   */
  async publishFAQ(id: string) {
    return prisma.fAQ.update({
      where: { id },
      data: {
        isPublished: true,
      },
    });
  }

  /**
   * Unpublish FAQ
   */
  async unpublishFAQ(id: string) {
    return prisma.fAQ.update({
      where: { id },
      data: {
        isPublished: false,
      },
    });
  }

  /**
   * FAQ Listing
   */
  async getFAQs(filters: FAQFilters) {
    const {
      page = 1,
      limit = 20,
      search,
      category,
      isPublished,
    } = filters;

    const skip = (page - 1) * limit;

const where: Prisma.fAQWhereInput = {};
    if (search) {
      where.OR = [
        {
          question: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          answer: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    if (category) {
      where.category = category;
    }

    if (typeof isPublished === "boolean") {
      where.isPublished = isPublished;
    }

    const [faqs, total] = await Promise.all([
      prisma.fAQ.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          {
            displayOrder: "asc",
          },
          {
            createdAt: "desc",
          },
        ],
      }),

      prisma.fAQ.count({
        where,
      }),
    ]);

    return {
      faqs,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  /**
   * Public FAQs
   */
  async getPublicFAQs() {
    return prisma.fAQ.findMany({
      where: {
        isPublished: true,
      },
      orderBy: {
        displayOrder: "asc",
      },
    });
  }

  /**
   * Category FAQs
   */
  async getCategoryFAQs(
    category: string
  ) {
    return prisma.fAQ.findMany({
      where: {
        category,
        isPublished: true,
      },
      orderBy: {
        displayOrder: "asc",
      },
    });
  }

  /**
   * FAQ Categories
   */
  async getFAQCategories() {
    return prisma.fAQ.groupBy({
      by: ["category"],
      _count: true,
    });
  }

  /**
   * FAQ Analytics
   */
  async getFAQStats() {
    const [
      totalFAQs,
      publishedFAQs,
      draftFAQs,
      totalViews,
    ] = await Promise.all([
      prisma.fAQ.count(),

      prisma.fAQ.count({
        where: {
          isPublished: true,
        },
      }),

      prisma.fAQ.count({
        where: {
          isPublished: false,
        },
      }),

      prisma.fAQ.aggregate({
        _sum: {
          views: true,
        },
      }),
    ]);

    return {
      totalFAQs,
      publishedFAQs,
      draftFAQs,
      totalViews:
        totalViews._sum.views || 0,
    };
  }
}

export default new FAQService();