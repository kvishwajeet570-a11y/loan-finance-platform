"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../../prisma/prisma"));
class BlogService {
    /**
     * Create Blog
     */
    async createBlog(data) {
        const existing = await prisma_1.default.blog.findUnique({
            where: {
                slug: data.slug,
            },
        });
        if (existing) {
            throw new Error("Blog slug already exists");
        }
        return prisma_1.default.blog.create({
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
    async updateBlog(blogId, data) {
        return prisma_1.default.blog.update({
            where: { id: blogId },
            data,
        });
    }
    /**
     * Delete Blog
     */
    async deleteBlog(blogId) {
        return prisma_1.default.blog.delete({
            where: {
                id: blogId,
            },
        });
    }
    /**
     * Publish Blog
     */
    async publishBlog(blogId) {
        return prisma_1.default.blog.update({
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
    async unpublishBlog(blogId) {
        return prisma_1.default.blog.update({
            where: { id: blogId },
            data: {
                isPublished: false,
            },
        });
    }
    /**
     * Blog Details
     */
    async getBlogBySlug(slug) {
        const blog = await prisma_1.default.blog.findUnique({
            where: { slug },
            include: {
                author: true,
            },
        });
        if (!blog) {
            throw new Error("Blog not found");
        }
        await prisma_1.default.blog.update({
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
    async getBlogs(filters) {
        const { page = 1, limit = 10, search, category, status, } = filters;
        const skip = (page - 1) * limit;
        const where = {};
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
            prisma_1.default.blog.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
            }),
            prisma_1.default.blog.count({ where }),
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
        return prisma_1.default.blog.findMany({
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
    async getRelatedBlogs(category, currentBlogId) {
        return prisma_1.default.blog.findMany({
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
    async likeBlog(blogId) {
        return prisma_1.default.blog.update({
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
        const [totalBlogs, publishedBlogs, draftBlogs, totalViews,] = await Promise.all([
            prisma_1.default.blog.count(),
            prisma_1.default.blog.count({
                where: {
                    isPublished: true,
                },
            }),
            prisma_1.default.blog.count({
                where: {
                    isPublished: false,
                },
            }),
            prisma_1.default.blog.aggregate({
                _sum: {
                    views: true,
                },
            }),
        ]);
        return {
            totalBlogs,
            publishedBlogs,
            draftBlogs,
            totalViews: totalViews._sum.views || 0,
        };
    }
}
exports.default = new BlogService();
