import prisma from "../../prisma/prisma";
import { Prisma } from "@prisma/client";

interface CreateBlogDto {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featuredImage?: string;
  category?: string;
  tags?: string[];
  authorId: string;
  isPublished?: boolean;
  metaTitle?: string;
  metaDescription?: string;
}

interface BlogFilterDto {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: string;
}

class BlogService {
  /**
   * Create Blog
   */
  async createBlog(data: CreateBlogDto) {
    const existing = await prisma.blog.findUnique({
      where: {
        slug: data.slug,
      },
    });

    if (existing) {
      throw new Error("Blog slug already exists");
    }

    return prisma.blog.create({
      data: {
        ...data,
        views: 0,
        likes: 0,
      },
    });
  }

  /**
   * Update Blog
   */
  async updateBlog(
    blogId: string,
    data: Partial<CreateBlogDto>
  ) {
    return prisma.blog.update({
      where: { id: blogId },
      data,
    });
  }

  /**
   * Delete Blog
   */
  async deleteBlog(blogId: string) {
    return prisma.blog.delete({
      where: {
        id: blogId,
      },
    });
  }

  /**
   * Publish Blog
   */
  async publishBlog(blogId: string) {
    return prisma.blog.update({
      where: { id: blogId },
      data: {
        isPublished: true,
        publishedAt: new Date(),
      },
    });
  }

  /**
   * Unpublish Blog
   */
  async unpublishBlog(blogId: string) {
    return prisma.blog.update({
      where: { id: blogId },
      data: {
        isPublished: false,
      },
    });
  }

  /**
   * Blog Details
   */
  async getBlogBySlug(slug: string) {
    const blog = await prisma.blog.findUnique({
      where: { slug },
      include: {
        author: true,
      },
    });

    if (!blog) {
      throw new Error("Blog not found");
    }

    await prisma.blog.update({
      where: { id: blog.id },
      data: {
        views: {
          increment: 1,
        },
      },
    });

    return blog;
  }

  /**
   * Get Blogs
   */
  async getBlogs(filters: BlogFilterDto) {
    const {
      page = 1,
      limit = 10,
      search,
      category,
      status,
    } = filters;

    const skip = (page - 1) * limit;

    const where: Prisma.BlogWhereInput = {};

    if (search) {
      where.OR = [
        {
          title: {
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

    if (category) {
      where.category = category;
    }

    if (status === "published") {
      where.isPublished = true;
    }

    if (status === "draft") {
      where.isPublished = false;
    }

    const [blogs, total] = await Promise.all([
      prisma.blog.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.blog.count({ where }),
    ]);

    return {
      blogs,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  /**
   * Featured Blogs
   */
  async getFeaturedBlogs(limit = 5) {
    return prisma.blog.findMany({
      where: {
        isPublished: true,
      },
      orderBy: {
        views: "desc",
      },
      take: limit,
    });
  }

  /**
   * Related Blogs
   */
  async getRelatedBlogs(
    category: string,
    currentBlogId: string
  ) {
    return prisma.blog.findMany({
      where: {
        category,
        id: {
          not: currentBlogId,
        },
        isPublished: true,
      },
      take: 4,
    });
  }

  /**
   * Like Blog
   */
  async likeBlog(blogId: string) {
    return prisma.blog.update({
      where: {
        id: blogId,
      },
      data: {
        likes: {
          increment: 1,
        },
      },
    });
  }

  /**
   * Blog Dashboard Stats
   */
  async getBlogStats() {
    const [
      totalBlogs,
      publishedBlogs,
      draftBlogs,
      totalViews,
    ] = await Promise.all([
      prisma.blog.count(),
      prisma.blog.count({
        where: {
          isPublished: true,
        },
      }),
      prisma.blog.count({
        where: {
          isPublished: false,
        },
      }),
      prisma.blog.aggregate({
        _sum: {
          views: true,
        },
      }),
    ]);

    return {
      totalBlogs,
      publishedBlogs,
      draftBlogs,
      totalViews:
        totalViews._sum.views || 0,
    };
  }
}

export default new BlogService();