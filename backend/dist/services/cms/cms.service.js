"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../../prisma/prisma"));
class CMSService {
    /**
     * Create CMS Page
     */
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
            data,
        });
    }
    /**
     * Update CMS Page
     */
    async updatePage(pageId, data) {
        return prisma_1.default.cMSPage.update({
            where: {
                id: pageId,
            },
            data,
        });
    }
    /**
     * Delete CMS Page
     */
    async deletePage(pageId) {
        return prisma_1.default.cMSPage.delete({
            where: {
                id: pageId,
            },
        });
    }
    /**
     * Get Page By Slug
     */
    async getPageBySlug(slug) {
        return prisma_1.default.cMSPage.findUnique({
            where: {
                slug,
            },
        });
    }
    /**
     * Get Page By ID
     */
    async getPageById(id) {
        return prisma_1.default.cMSPage.findUnique({
            where: {
                id,
            },
        });
    }
    /**
     * Publish Page
     */
    async publishPage(id) {
        return prisma_1.default.cMSPage.update({
            where: { id },
            data: {
                isPublished: true,
            },
        });
    }
    /**
     * Unpublish Page
     */
    async unpublishPage(id) {
        return prisma_1.default.cMSPage.update({
            where: { id },
            data: {
                isPublished: false,
            },
        });
    }
    /**
     * CMS Listing
     */
    async getPages(filters) {
        const { page = 1, limit = 10, search, } = filters;
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
            ];
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
            pagesCount: Math.ceil(total / limit),
        };
    }
    /**
     * Homepage CMS Blocks
     */
    async getHomePageCMS() {
        return prisma_1.default.cMSPage.findMany({
            where: {
                isPublished: true,
            },
            orderBy: {
                createdAt: "asc",
            },
        });
    }
    /**
     * CMS Statistics
     */
    async getCMSStats() {
        const [totalPages, publishedPages, draftPages,] = await Promise.all([
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
        ]);
        return {
            totalPages,
            publishedPages,
            draftPages,
        };
    }
}
exports.default = new CMSService();
