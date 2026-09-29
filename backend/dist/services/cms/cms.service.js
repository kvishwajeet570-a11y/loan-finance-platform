"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../../prisma/prisma"));
class CMSService {
    // ========================================
    // CREATE PAGE
    // ========================================
    async createPage(data) {
        const existing = await prisma_1.default.cMSPage.findUnique({
            where: {
                slug: data.slug,
            },
        });
        if (existing) {
            throw new Error("Page slug already exists");
        }
        return prisma_1.default.cMSPage.create({
            data: {
                ...data,
                publishedAt: data.isPublished ? new Date() : null,
            },
        });
    }
    // ========================================
    // UPDATE PAGE
    // ========================================
    async updatePage(pageId, data) {
        return prisma_1.default.cMSPage.update({
            where: {
                id: pageId,
            },
            data: {
                ...data,
                updatedAt: new Date(),
            },
        });
    }
    // ========================================
    // DELETE PAGE
    // ========================================
    async deletePage(pageId) {
        return prisma_1.default.cMSPage.delete({
            where: {
                id: pageId,
            },
        });
    }
    // ========================================
    // GET PAGE BY ID
    // ========================================
    async getPageById(id) {
        return prisma_1.default.cMSPage.findUnique({
            where: {
                id,
            },
        });
    }
    // ========================================
    // GET PAGE BY SLUG
    // ========================================
    async getPageBySlug(slug) {
        return prisma_1.default.cMSPage.findUnique({
            where: {
                slug,
            },
        });
    }
    // ========================================
    // GET ALL PAGES
    // ========================================
    async getAllPages(filters) {
        const { page = 1, limit = 10, search, pageType, category, isPublished, isActive, } = filters;
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
                    slug: {
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
        if (pageType)
            where.pageType = pageType;
        if (category)
            where.category = category;
        if (isPublished !== undefined)
            where.isPublished = isPublished;
        if (isActive !== undefined)
            where.isActive = isActive;
        const [pages, total] = await Promise.all([
            prisma_1.default.cMSPage.findMany({
                where,
                skip,
                take: limit,
                orderBy: [
                    {
                        sortOrder: "asc",
                    },
                    {
                        updatedAt: "desc",
                    },
                ],
            }),
            prisma_1.default.cMSPage.count({
                where,
            }),
        ]);
        return {
            pages,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    // ========================================
    // GET PUBLISHED PAGES
    // ========================================
    async getPublishedPages() {
        return prisma_1.default.cMSPage.findMany({
            where: {
                isPublished: true,
                isActive: true,
            },
            orderBy: [
                {
                    sortOrder: "asc",
                },
                {
                    publishedAt: "desc",
                },
            ],
        });
    }
    // ========================================
    // SEARCH PAGES
    // ========================================
    async searchPages(filters) {
        const { keyword = "", page = 1, limit = 10, pageType, category, isPublished, } = filters;
        const skip = (page - 1) * limit;
        const where = {};
        if (keyword) {
            where.OR = [
                {
                    title: {
                        contains: keyword,
                        mode: "insensitive",
                    },
                },
                {
                    slug: {
                        contains: keyword,
                        mode: "insensitive",
                    },
                },
                {
                    content: {
                        contains: keyword,
                        mode: "insensitive",
                    },
                },
                {
                    metaTitle: {
                        contains: keyword,
                        mode: "insensitive",
                    },
                },
                {
                    metaDescription: {
                        contains: keyword,
                        mode: "insensitive",
                    },
                },
            ];
        }
        if (pageType)
            where.pageType = pageType;
        if (category)
            where.category = category;
        if (isPublished !== undefined) {
            where.isPublished = isPublished;
        }
        const [pages, total] = await Promise.all([
            prisma_1.default.cMSPage.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    updatedAt: "desc",
                },
            }),
            prisma_1.default.cMSPage.count({
                where,
            }),
        ]);
        return {
            pages,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    // ========================================
    // PUBLISH PAGE
    // ========================================
    async publishPage(id) {
        return prisma_1.default.cMSPage.update({
            where: {
                id,
            },
            data: {
                isPublished: true,
                publishedAt: new Date(),
            },
        });
    }
    // ========================================
    // UNPUBLISH PAGE
    // ========================================
    async unpublishPage(id) {
        return prisma_1.default.cMSPage.update({
            where: {
                id,
            },
            data: {
                isPublished: false,
                publishedAt: null,
            },
        });
    }
    // ========================================
    // GET PAGE TYPES
    // ========================================
    async getPageTypes() {
        const pageTypes = await prisma_1.default.cMSPage.findMany({
            distinct: ["pageType"],
            select: {
                pageType: true,
            },
            where: {
                pageType: {
                    not: null,
                },
            },
            orderBy: {
                pageType: "asc",
            },
        });
        return pageTypes
            .map((item) => item.pageType)
            .filter(Boolean);
    }
    // ========================================
    // CMS ANALYTICS
    // ========================================
    async getCmsAnalytics() {
        const [totalPages, publishedPages, draftPages, activePages, inactivePages, totalViews,] = await Promise.all([
            prisma_1.default.cMSPage.count(),
            prisma_1.default.cMSPage.count({
                where: {
                    isPublished: true,
                },
            }),
            prisma_1.default.cMSPage.count({
                where: {
                    isPublished: false,
                },
            }),
            prisma_1.default.cMSPage.count({
                where: {
                    isActive: true,
                },
            }),
            prisma_1.default.cMSPage.count({
                where: {
                    isActive: false,
                },
            }),
            prisma_1.default.cMSPage.aggregate({
                _sum: {
                    views: true,
                },
            }),
        ]);
        return {
            totalPages,
            publishedPages,
            draftPages,
            activePages,
            inactivePages,
            totalViews: totalViews._sum.views ?? 0,
        };
    }
    // ========================================
    // BULK DELETE
    // ========================================
    async bulkDelete(ids) {
        return prisma_1.default.cMSPage.deleteMany({
            where: {
                id: {
                    in: ids,
                },
            },
        });
    }
}
exports.default = new CMSService();
