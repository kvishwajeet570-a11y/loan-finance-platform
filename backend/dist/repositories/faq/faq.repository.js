"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FaqRepository = void 0;
const prisma_1 = require("../../prisma/prisma");
class FaqRepository {
    /* ==========================
        CREATE FAQ
    ========================== */
    static async createFaq(data) {
        return prisma_1.prisma.faq.create({
            data
        });
    }
    /* ==========================
        GET FAQ BY ID
    ========================== */
    static async getFaqById(faqId) {
        return prisma_1.prisma.faq.findUnique({
            where: {
                id: faqId
            }
        });
    }
    /* ==========================
        GET ALL FAQS
    ========================== */
    static async getAllFaqs(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [faqs, total] = await Promise.all([
            prisma_1.prisma.faq.findMany({
                skip,
                take: limit,
                orderBy: [
                    {
                        displayOrder: "asc"
                    },
                    {
                        createdAt: "desc"
                    }
                ]
            }),
            prisma_1.prisma.faq.count()
        ]);
        return {
            total,
            page,
            limit,
            faqs
        };
    }
    /* ==========================
        PUBLISHED FAQS
    ========================== */
    static async getPublishedFaqs() {
        return prisma_1.prisma.faq.findMany({
            where: {
                isPublished: true
            },
            orderBy: {
                displayOrder: "asc"
            }
        });
    }
    /* ==========================
        FAQ BY CATEGORY
    ========================== */
    static async getFaqsByCategory(category) {
        return prisma_1.prisma.faq.findMany({
            where: {
                category,
                isPublished: true
            },
            orderBy: {
                displayOrder: "asc"
            }
        });
    }
    /* ==========================
        FEATURED FAQS
    ========================== */
    static async getFeaturedFaqs() {
        return prisma_1.prisma.faq.findMany({
            where: {
                isFeatured: true,
                isPublished: true
            }
        });
    }
    /* ==========================
        SEARCH FAQS
    ========================== */
    static async searchFaqs(keyword) {
        return prisma_1.prisma.faq.findMany({
            where: {
                OR: [
                    {
                        question: {
                            contains: keyword,
                            mode: "insensitive"
                        }
                    },
                    {
                        answer: {
                            contains: keyword,
                            mode: "insensitive"
                        }
                    },
                    {
                        category: {
                            contains: keyword,
                            mode: "insensitive"
                        }
                    }
                ]
            }
        });
    }
    /* ==========================
        UPDATE FAQ
    ========================== */
    static async updateFaq(faqId, data) {
        return prisma_1.prisma.faq.update({
            where: {
                id: faqId
            },
            data
        });
    }
    /* ==========================
        PUBLISH FAQ
    ========================== */
    static async publishFaq(faqId) {
        return prisma_1.prisma.faq.update({
            where: {
                id: faqId
            },
            data: {
                isPublished: true
            }
        });
    }
    /* ==========================
        UNPUBLISH FAQ
    ========================== */
    static async unpublishFaq(faqId) {
        return prisma_1.prisma.faq.update({
            where: {
                id: faqId
            },
            data: {
                isPublished: false
            }
        });
    }
    /* ==========================
        FEATURE FAQ
    ========================== */
    static async markFeatured(faqId) {
        return prisma_1.prisma.faq.update({
            where: {
                id: faqId
            },
            data: {
                isFeatured: true
            }
        });
    }
    /* ==========================
        REMOVE FEATURED
    ========================== */
    static async removeFeatured(faqId) {
        return prisma_1.prisma.faq.update({
            where: {
                id: faqId
            },
            data: {
                isFeatured: false
            }
        });
    }
    /* ==========================
        INCREMENT VIEW
    ========================== */
    static async incrementView(faqId) {
        return prisma_1.prisma.faq.update({
            where: {
                id: faqId
            },
            data: {
                viewCount: {
                    increment: 1
                }
            }
        });
    }
    /* ==========================
        DELETE FAQ
    ========================== */
    static async deleteFaq(faqId) {
        return prisma_1.prisma.faq.delete({
            where: {
                id: faqId
            }
        });
    }
    /* ==========================
        BULK DELETE FAQS
    ========================== */
    static async bulkDelete(faqIds) {
        return prisma_1.prisma.faq.deleteMany({
            where: {
                id: {
                    in: faqIds
                }
            }
        });
    }
    /* ==========================
        FAQ ANALYTICS
    ========================== */
    static async getFaqAnalytics() {
        const [totalFaqs, publishedFaqs, featuredFaqs, totalViews] = await Promise.all([
            prisma_1.prisma.faq.count(),
            prisma_1.prisma.faq.count({
                where: {
                    isPublished: true
                }
            }),
            prisma_1.prisma.faq.count({
                where: {
                    isFeatured: true
                }
            }),
            prisma_1.prisma.faq.aggregate({
                _sum: {
                    viewCount: true
                }
            })
        ]);
        return {
            totalFaqs,
            publishedFaqs,
            featuredFaqs,
            totalViews: totalViews._sum.viewCount || 0
        };
    }
    /* ==========================
        FAQ CATEGORIES
    ========================== */
    static async getCategories() {
        return prisma_1.prisma.faq.groupBy({
            by: ["category"]
        });
    }
}
exports.FaqRepository = FaqRepository;
