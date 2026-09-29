import prisma from "../../prisma/prisma";

export class BlogRepository {
  // ========================================
  // CREATE BLOG
  // ========================================

  static async createBlog(data: {
    title: string;
    slug: string;
    excerpt?: string;
    content: string;
    featuredImage?: string;
    category?: string;
    tags?: string[];
    metaTitle?: string;
    metaDescription?: string;
    isPublished?: boolean;
    publishedAt?: Date;
  }) {
    return prisma.blogPost.create({
      data,
    });
  }

  // ========================================
  // GET BLOG BY ID
  // ========================================

  static async getBlogById(blogId: string) {
    return prisma.blogPost.findUnique({
      where: {
        id: blogId,
      },
    });
  }

  // ========================================
  // GET BLOG BY SLUG
  // ========================================

  static async getBlogBySlug(slug: string) {
    return prisma.blogPost.findUnique({
      where: {
        slug,
      },
    });
  }

  // ========================================
  // GET ALL BLOGS
  // ========================================

  static async getAllBlogs(
    page: number = 1,
    limit: number = 10
  ) {
    const skip = (page - 1) * limit;

    const [blogs, total] = await Promise.all([
      prisma.blogPost.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),

      prisma.blogPost.count(),
    ]);

    return {
      success: true,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      blogs,
    };
  }

  // ========================================
  // GET PUBLISHED BLOGS
  // ========================================

  static async getPublishedBlogs(
    page: number = 1,
    limit: number = 10
  ) {
    const skip = (page - 1) * limit;

    const [blogs, total] = await Promise.all([
      prisma.blogPost.findMany({
        where: {
          isPublished: true,
        },
        skip,
        take: limit,
        orderBy: {
          publishedAt: "desc",
        },
      }),

      prisma.blogPost.count({
        where: {
          isPublished: true,
        },
      }),
    ]);

    return {
      success: true,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      blogs,
    };
  }
    // ========================================
  // GET BLOGS BY CATEGORY
  // ========================================

  static async getBlogsByCategory(
    category: string,
    page: number = 1,
    limit: number = 10
  ) {
    const skip = (page - 1) * limit;

    const [blogs, total] = await Promise.all([
      prisma.blogPost.findMany({
        where: {
          category,
          isPublished: true,
        },
        skip,
        take: limit,
        orderBy: {
          publishedAt: "desc",
        },
      }),

      prisma.blogPost.count({
        where: {
          category,
          isPublished: true,
        },
      }),
    ]);

    return {
      success: true,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      blogs,
    };
  }

  // ========================================
  // SEARCH BLOGS
  // ========================================

  static async searchBlogs(
    search: string,
    page: number = 1,
    limit: number = 10
  ) {
    const skip = (page - 1) * limit;

    const where = {
      isPublished: true,
      OR: [
        {
          title: {
            contains: search,
            mode: "insensitive" as const,
          },
        },
        {
          excerpt: {
            contains: search,
            mode: "insensitive" as const,
          },
        },
        {
          content: {
            contains: search,
            mode: "insensitive" as const,
          },
        },
        {
          category: {
            contains: search,
            mode: "insensitive" as const,
          },
        },
      ],
    };

    const [blogs, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          publishedAt: "desc",
        },
      }),

      prisma.blogPost.count({
        where,
      }),
    ]);

    return {
      success: true,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      blogs,
    };
  }

  // ========================================
  // UPDATE BLOG
  // ========================================

  static async updateBlog(
    blogId: string,
    data: {
      title?: string;
      slug?: string;
      excerpt?: string;
      content?: string;
      featuredImage?: string;
      category?: string;
      tags?: string[];
      metaTitle?: string;
      metaDescription?: string;
      isPublished?: boolean;
      publishedAt?: Date | null;
    }
  ) {
    return prisma.blogPost.update({
      where: {
        id: blogId,
      },
      data,
    });
  }
    // ========================================
  // PUBLISH BLOG
  // ========================================

  static async publishBlog(blogId: string) {
    return prisma.blogPost.update({
      where: {
        id: blogId,
      },
      data: {
        isPublished: true,
        publishedAt: new Date(),
      },
    });
  }

  // ========================================
  // UNPUBLISH BLOG
  // ========================================

  static async unpublishBlog(blogId: string) {
    return prisma.blogPost.update({
      where: {
        id: blogId,
      },
      data: {
        isPublished: false,
        publishedAt: null,
      },
    });
  }

  // ========================================
  // INCREMENT BLOG VIEW
  // ========================================

  static async incrementView(blogId: string) {
    return prisma.blogPost.update({
      where: {
        id: blogId,
      },
      data: {
        views: {
          increment: 1,
        },
      },
    });
  }

  // ========================================
  // DELETE BLOG
  // ========================================

  static async deleteBlog(blogId: string) {
    return prisma.blogPost.delete({
      where: {
        id: blogId,
      },
    });
  }
    // ========================================
  // BLOG ANALYTICS
  // ========================================

  static async getBlogAnalytics() {
    const [
      totalBlogs,
      publishedBlogs,
      draftBlogs,
      totalViews,
      totalLikes,
    ] = await Promise.all([
      prisma.blogPost.count(),

      prisma.blogPost.count({
        where: {
          isPublished: true,
        },
      }),

      prisma.blogPost.count({
        where: {
          isPublished: false,
        },
      }),

      prisma.blogPost.aggregate({
        _sum: {
          views: true,
        },
      }),

      prisma.blogPost.aggregate({
        _sum: {
          likes: true,
        },
      }),
    ]);

    return {
      success: true,
      analytics: {
        totalBlogs,
        publishedBlogs,
        draftBlogs,
        totalViews: totalViews._sum.views ?? 0,
        totalLikes: totalLikes._sum.likes ?? 0,
      },
    };
  }
}