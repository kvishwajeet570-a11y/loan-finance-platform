"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogRepository = void 0;
const prisma_1 = require("../../prisma/prisma");
class BlogRepository {
    /* =========================
        CREATE BLOG
    ========================= */
    static async createBlog(data) {
        return prisma_1.prisma.blog.create({
            data
        });
    }
    /* =========================
        GET BLOG BY ID
    ========================= */
    static async getBlogById(blogId) {
        return prisma_1.prisma.blog.findUnique({
            where: {
                id: blogId
            }
        });
    }
    /* =========================
        GET BLOG BY SLUG
    ========================= */
    static async getBlogBySlug(slug) {
        return prisma_1.prisma.blog.findUnique({
            where: {
                slug
            }
        });
    }
    /* =========================
        GET ALL BLOGS
    ========================= */
    static async getAllBlogs(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [blogs, total] = await Promise.all([
            prisma_1.prisma.blog.findMany({
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc"
                }
            }),
            prisma_1.prisma.blog.count()
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
        return prisma_1.prisma.blog.findMany({
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
        return prisma_1.prisma.blog.findMany({
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
    static async getBlogsByCategory(category) {
        return prisma_1.prisma.blog.findMany({
            where: {
                category,
                status: "PUBLISHED"
            }
        });
    }
    /* =========================
        SEARCH BLOGS
    ========================= */
    static async searchBlogs(search) {
        return prisma_1.prisma.blog.findMany({
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
    static async updateBlog(blogId, data) {
        return prisma_1.prisma.blog.update({
            where: {
                id: blogId
            },
            data
        });
    }
    /* =========================
        PUBLISH BLOG
    ========================= */
    static async publishBlog(blogId) {
        return prisma_1.prisma.blog.update({
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
    static async unpublishBlog(blogId) {
        return prisma_1.prisma.blog.update({
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
    static async markFeatured(blogId) {
        return prisma_1.prisma.blog.update({
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
    static async removeFeatured(blogId) {
        return prisma_1.prisma.blog.update({
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
    static async incrementView(blogId) {
        return prisma_1.prisma.blog.update({
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
    static async deleteBlog(blogId) {
        return prisma_1.prisma.blog.delete({
            where: {
                id: blogId
            }
        });
    }
    /* =========================
        BLOG ANALYTICS
    ========================= */
    static async getBlogAnalytics() {
        const [totalBlogs, publishedBlogs, draftBlogs, featuredBlogs, totalViews] = await Promise.all([
            prisma_1.prisma.blog.count(),
            prisma_1.prisma.blog.count({
                where: {
                    status: "PUBLISHED"
                }
            }),
            prisma_1.prisma.blog.count({
                where: {
                    status: "DRAFT"
                }
            }),
            prisma_1.prisma.blog.count({
                where: {
                    isFeatured: true
                }
            }),
            prisma_1.prisma.blog.aggregate({
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
            totalViews: totalViews._sum.viewCount || 0
        };
    }
}
exports.BlogRepository = BlogRepository;
