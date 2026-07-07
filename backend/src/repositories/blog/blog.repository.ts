import { prisma } from "../../prisma/prisma";

export class BlogRepository {

  /* =========================
      CREATE BLOG
  ========================= */

  static async createBlog(data: {
    title: string;
    slug: string;
    excerpt?: string;
    content: string;
    featuredImage?: string;
    category?: string;
    tags?: string;
    authorId?: string;
    authorName?: string;
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string;
  }) {

    return prisma.blog.create({
      data
    });
  }

  /* =========================
      GET BLOG BY ID
  ========================= */

  static async getBlogById(
    blogId: string
  ) {

    return prisma.blog.findUnique({
      where: {
        id: blogId
      }
    });
  }

  /* =========================
      GET BLOG BY SLUG
  ========================= */

  static async getBlogBySlug(
    slug: string
  ) {

    return prisma.blog.findUnique({
      where: {
        slug
      }
    });
  }

  /* =========================
      GET ALL BLOGS
  ========================= */

  static async getAllBlogs(
    page = 1,
    limit = 10
  ) {

    const skip = (page - 1) * limit;

    const [blogs, total] =
      await Promise.all([

        prisma.blog.findMany({
          skip,
          take: limit,
          orderBy: {
            createdAt: "desc"
          }
        }),

        prisma.blog.count()
      ]);

    return {
      total,
      page,
      limit,
      blogs
    };
  }

  /* =========================
      GET PUBLISHED BLOGS
  ========================= */

  static async getPublishedBlogs() {

    return prisma.blog.findMany({
      where: {
        status: "PUBLISHED"
      },
      orderBy: {
        publishedAt: "desc"
      }
    });
  }

  /* =========================
      FEATURED BLOGS
  ========================= */

  static async getFeaturedBlogs() {

    return prisma.blog.findMany({
      where: {
        isFeatured: true,
        status: "PUBLISHED"
      },
      orderBy: {
        publishedAt: "desc"
      }
    });
  }

  /* =========================
      BLOG BY CATEGORY
  ========================= */

  static async getBlogsByCategory(
    category: string
  ) {

    return prisma.blog.findMany({
      where: {
        category,
        status: "PUBLISHED"
      }
    });
  }

  /* =========================
      SEARCH BLOGS
  ========================= */

  static async searchBlogs(
    search: string
  ) {

    return prisma.blog.findMany({
      where: {
        OR: [
          {
            title: {
              contains: search,
              mode: "insensitive"
            }
          },
          {
            content: {
              contains: search,
              mode: "insensitive"
            }
          },
          {
            category: {
              contains: search,
              mode: "insensitive"
            }
          }
        ]
      }
    });
  }

  /* =========================
      UPDATE BLOG
  ========================= */

  static async updateBlog(
    blogId: string,
    data: any
  ) {

    return prisma.blog.update({
      where: {
        id: blogId
      },
      data
    });
  }

  /* =========================
      PUBLISH BLOG
  ========================= */

  static async publishBlog(
    blogId: string
  ) {

    return prisma.blog.update({
      where: {
        id: blogId
      },
      data: {
        status: "PUBLISHED",
        publishedAt: new Date()
      }
    });
  }

  /* =========================
      UNPUBLISH BLOG
  ========================= */

  static async unpublishBlog(
    blogId: string
  ) {

    return prisma.blog.update({
      where: {
        id: blogId
      },
      data: {
        status: "DRAFT"
      }
    });
  }

  /* =========================
      FEATURE BLOG
  ========================= */

  static async markFeatured(
    blogId: string
  ) {

    return prisma.blog.update({
      where: {
        id: blogId
      },
      data: {
        isFeatured: true
      }
    });
  }

  /* =========================
      REMOVE FEATURED
  ========================= */

  static async removeFeatured(
    blogId: string
  ) {

    return prisma.blog.update({
      where: {
        id: blogId
      },
      data: {
        isFeatured: false
      }
    });
  }

  /* =========================
      INCREMENT VIEW
  ========================= */

  static async incrementView(
    blogId: string
  ) {

    return prisma.blog.update({
      where: {
        id: blogId
      },
      data: {
        viewCount: {
          increment: 1
        }
      }
    });
  }

  /* =========================
      DELETE BLOG
  ========================= */

  static async deleteBlog(
    blogId: string
  ) {

    return prisma.blog.delete({
      where: {
        id: blogId
      }
    });
  }

  /* =========================
      BLOG ANALYTICS
  ========================= */

  static async getBlogAnalytics() {

    const [
      totalBlogs,
      publishedBlogs,
      draftBlogs,
      featuredBlogs,
      totalViews
    ] = await Promise.all([

      prisma.blog.count(),

      prisma.blog.count({
        where: {
          status: "PUBLISHED"
        }
      }),

      prisma.blog.count({
        where: {
          status: "DRAFT"
        }
      }),

      prisma.blog.count({
        where: {
          isFeatured: true
        }
      }),

      prisma.blog.aggregate({
        _sum: {
          viewCount: true
        }
      })
    ]);

    return {
      totalBlogs,
      publishedBlogs,
      draftBlogs,
      featuredBlogs,
      totalViews:
        totalViews._sum.viewCount || 0
    };
  }
}