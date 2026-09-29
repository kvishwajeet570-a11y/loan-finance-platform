"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FaqRepository = void 0;
const prisma_1 = __importDefault(require("../../prisma/prisma"));
class FaqRepository {
    /* ==========================
        CREATE FAQ
    ========================== */
    static async createFaq(data) {
        return prisma_1.default.fAQ.create({
            data
        });
    }
    /* ==========================
        GET FAQ BY ID
    ========================== */
    static async getFaqById(faqId) {
        return prisma_1.default.fAQ.findUnique({
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
            prisma_1.default.fAQ.findMany({
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
            prisma_1.default.fAQ.count()
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
        return prisma_1.default.fAQ.findMany({
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
        return prisma_1.default.fAQ.findMany({
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
        return prisma_1.default.fAQ.findMany({
            where: {
                isPublished: true
            }
        });
    }
    /* ==========================
        SEARCH FAQS
    ========================== */
    static async searchFaqs(keyword) {
        return prisma_1.default.fAQ.findMany({
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
        return prisma_1.default.fAQ.update({
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
        return prisma_1.default.fAQ.update({
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
        return prisma_1.default.fAQ.update({
            where: {
                id: faqId
            },
            data: {
                isPublished: false
            }
        });
    }
    /* ==========================
        FEATURE PLACEHOLDER
    ========================== */
    static async markFeatured(faqId) {
        return prisma_1.default.fAQ.findUnique({
            where: {
                id: faqId
            }
        });
    }
    static async removeFeatured(faqId) {
        return prisma_1.default.fAQ.findUnique({
            where: {
                id: faqId
            }
        });
    }
    /* ==========================
        INCREMENT VIEW
    ========================== */
    static async incrementView(faqId) {
        return prisma_1.default.fAQ.update({
            where: {
                id: faqId
            },
            data: {
                views: {
                    increment: 1
                }
            }
        });
    }
    /* ==========================
        DELETE FAQ
    ========================== */
    static async deleteFaq(faqId) {
        return prisma_1.default.fAQ.delete({
            where: {
                id: faqId
            }
        });
    }
    /* ==========================
        BULK DELETE FAQS
    ========================== */
    static async bulkDelete(faqIds) {
        return prisma_1.default.fAQ.deleteMany({
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
        const [totalFaqs, publishedFaqs, totalViews] = await Promise.all([
            prisma_1.default.fAQ.count(),
            prisma_1.default.fAQ.count({
                where: {
                    isPublished: true
                }
            }),
            prisma_1.default.fAQ.aggregate({
                _sum: {
                    views: true
                }
            })
        ]);
        return {
            totalFaqs,
            publishedFaqs,
            featuredFaqs: 0,
            totalViews: totalViews._sum?.views || 0
        };
    }
    /* ==========================
        FAQ CATEGORIES
    ========================== */
    static async getCategories() {
        return prisma_1.default.fAQ.groupBy({
            by: ["category"]
        });
    }
}
exports.FaqRepository = FaqRepository;
