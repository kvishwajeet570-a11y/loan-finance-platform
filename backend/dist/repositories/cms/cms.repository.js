"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CmsRepository = void 0;
const prisma_1 = require("../../prisma/prisma");
class CmsRepository {
    /* =========================
        CREATE PAGE
    ========================= */
    static async createPage(data) {
        return prisma_1.prisma.cmsPage.create({
            data
        });
    }
    /* =========================
        GET PAGE BY ID
    ========================= */
    static async getPageById(pageId) {
        return prisma_1.prisma.cmsPage.findUnique({
            where: {
                id: pageId
            }
        });
    }
    /* =========================
        GET PAGE BY SLUG
    ========================= */
    static async getPageBySlug(slug) {
        return prisma_1.prisma.cmsPage.findUnique({
            where: {
                slug
            }
        });
    }
    /* =========================
        GET ALL PAGES
    ========================= */
    static async getAllPages(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [pages, total] = await Promise.all([
            prisma_1.prisma.cmsPage.findMany({
                skip,
                take: limit,
                orderBy: {
                    updatedAt: "desc"
                }
            }),
            prisma_1.prisma.cmsPage.count()
        ]);
        return {
            total,
            page,
            limit,
            pages
        };
    }
    /* =========================
        GET PUBLISHED PAGES
    ========================= */
    static async getPublishedPages() {
        return prisma_1.prisma.cmsPage.findMany({
            where: {
                isPublished: true
            },
            orderBy: {
                updatedAt: "desc"
            }
        });
    }
    /* =========================
        SEARCH PAGES
    ========================= */
    static async searchPages(keyword) {
        return prisma_1.prisma.cmsPage.findMany({
            where: {
                OR: [
                    {
                        title: {
                            contains: keyword,
                            mode: "insensitive"
                        }
                    },
                    {
                        slug: {
                            contains: keyword,
                            mode: "insensitive"
                        }
                    },
                    {
                        content: {
                            contains: keyword,
                            mode: "insensitive"
                        }
                    }
                ]
            }
        });
    }
    /* =========================
        UPDATE PAGE
    ========================= */
    static async updatePage(pageId, data) {
        return prisma_1.prisma.cmsPage.update({
            where: {
                id: pageId
            },
            data
        });
    }
    /* =========================
        PUBLISH PAGE
    ========================= */
    static async publishPage(pageId) {
        return prisma_1.prisma.cmsPage.update({
            where: {
                id: pageId
            },
            data: {
                isPublished: true
            }
        });
    }
    /* =========================
        UNPUBLISH PAGE
    ========================= */
    static async unpublishPage(pageId) {
        return prisma_1.prisma.cmsPage.update({
            where: {
                id: pageId
            },
            data: {
                isPublished: false
            }
        });
    }
    /* =========================
        DELETE PAGE
    ========================= */
    static async deletePage(pageId) {
        return prisma_1.prisma.cmsPage.delete({
            where: {
                id: pageId
            }
        });
    }
    /* =========================
        GET PAGE TYPES
    ========================= */
    static async getPageTypes() {
        return prisma_1.prisma.cmsPage.groupBy({
            by: ["pageType"]
        });
    }
    /* =========================
        CMS ANALYTICS
    ========================= */
    static async getCmsAnalytics() {
        const [totalPages, publishedPages, draftPages] = await Promise.all([
            prisma_1.prisma.cmsPage.count(),
            prisma_1.prisma.cmsPage.count({
                where: {
                    isPublished: true
                }
            }),
            prisma_1.prisma.cmsPage.count({
                where: {
                    isPublished: false
                }
            })
        ]);
        return {
            totalPages,
            publishedPages,
            draftPages
        };
    }
    /* =========================
        BULK DELETE
    ========================= */
    static async bulkDelete(pageIds) {
        return prisma_1.prisma.cmsPage.deleteMany({
            where: {
                id: {
                    in: pageIds
                }
            }
        });
    }
}
exports.CmsRepository = CmsRepository;
