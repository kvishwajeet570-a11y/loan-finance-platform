"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogRepository = void 0;
const prisma_1 = __importDefault(require("../../prisma/prisma"));
class BlogRepository {
    // ========================================
    // CREATE BLOG
    // ========================================
    static async createBlog(data) {
        return prisma_1.default.blogPost.create({
            data,
        });
    }
    // ========================================
    // GET BLOG BY ID
    // ========================================
    static async getBlogById(blogId) {
        return prisma_1.default.blogPost.findUnique({
            where: {
                id: blogId,
            },
        });
    }
    // ========================================
    // GET BLOG BY SLUG
    // ========================================
    static async getBlogBySlug(slug) {
        return prisma_1.default.blogPost.findUnique({
            where: {
                slug,
            },
        });
    }
    // ========================================
    // GET ALL BLOGS
    // ========================================
    static async getAllBlogs(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [blogs, total] = await Promise.all([
            prisma_1.default.blogPost.findMany({
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
            }),
            prisma_1.default.blogPost.count(),
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
    static async getPublishedBlogs(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [blogs, total] = await Promise.all([
            prisma_1.default.blogPost.findMany({
                where: {
                    isPublished: true,
                },
                skip,
                take: limit,
                orderBy: {
                    publishedAt: "desc",
                },
            }),
            prisma_1.default.blogPost.count({
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
    static async getBlogsByCategory(category, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [blogs, total] = await Promise.all([
            prisma_1.default.blogPost.findMany({
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
            prisma_1.default.blogPost.count({
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
    static async searchBlogs(search, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const where = {
            isPublished: true,
            OR: [
                {
                    title: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
                {
                    excerpt: {
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
                {
                    category: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
            ],
        };
        const [blogs, total] = await Promise.all([
            prisma_1.default.blogPost.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    publishedAt: "desc",
                },
            }),
            prisma_1.default.blogPost.count({
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
    static async updateBlog(blogId, data) {
        return prisma_1.default.blogPost.update({
            where: {
                id: blogId,
            },
            data,
        });
    }
    // ========================================
    // PUBLISH BLOG
    // ========================================
    static async publishBlog(blogId) {
        return prisma_1.default.blogPost.update({
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
    static async unpublishBlog(blogId) {
        return prisma_1.default.blogPost.update({
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
    static async incrementView(blogId) {
        return prisma_1.default.blogPost.update({
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
    static async deleteBlog(blogId) {
        return prisma_1.default.blogPost.delete({
            where: {
                id: blogId,
            },
        });
    }
    // ========================================
    // BLOG ANALYTICS
    // ========================================
    static async getBlogAnalytics() {
        const [totalBlogs, publishedBlogs, draftBlogs, totalViews, totalLikes,] = await Promise.all([
            prisma_1.default.blogPost.count(),
            prisma_1.default.blogPost.count({
                where: {
                    isPublished: true,
                },
            }),
            prisma_1.default.blogPost.count({
                where: {
                    isPublished: false,
                },
            }),
            prisma_1.default.blogPost.aggregate({
                _sum: {
                    views: true,
                },
            }),
            prisma_1.default.blogPost.aggregate({
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
exports.BlogRepository = BlogRepository;
