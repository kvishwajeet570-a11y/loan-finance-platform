"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../../prisma/prisma"));
class FAQService {
    /**
     * Create FAQ
     */
    async createFAQ(data) {
        return prisma_1.default.fAQ.create({
            data: {
                ...data,
                views: 0,
            },
        });
    }
    /**
     * Update FAQ
     */
    async updateFAQ(faqId, data) {
        return prisma_1.default.fAQ.update({
            where: {
                id: faqId,
            },
            data,
        });
    }
    /**
     * Delete FAQ
     */
    async deleteFAQ(faqId) {
        return prisma_1.default.fAQ.delete({
            where: {
                id: faqId,
            },
        });
    }
    /**
     * Get FAQ By ID
     */
    async getFAQById(id) {
        const faq = await prisma_1.default.fAQ.findUnique({
            where: { id },
        });
        if (!faq) {
            throw new Error("FAQ not found");
        }
        await prisma_1.default.fAQ.update({
            where: { id },
            data: {
                views: {
                    increment: 1,
                },
            },
        });
        return faq;
    }
    /**
     * Publish FAQ
     */
    async publishFAQ(id) {
        return prisma_1.default.fAQ.update({
            where: { id },
            data: {
                isPublished: true,
            },
        });
    }
    /**
     * Unpublish FAQ
     */
    async unpublishFAQ(id) {
        return prisma_1.default.fAQ.update({
            where: { id },
            data: {
                isPublished: false,
            },
        });
    }
    /**
     * FAQ Listing
     */
    async getFAQs(filters) {
        const { page = 1, limit = 20, search, category, isPublished, } = filters;
        const skip = (page - 1) * limit;
        const where = {};
        if (search) {
            where.OR = [
                {
                    question: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
                {
                    answer: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
            ];
        }
        if (category) {
            where.category = category;
        }
        if (typeof isPublished === "boolean") {
            where.isPublished = isPublished;
        }
        const [faqs, total] = await Promise.all([
            prisma_1.default.fAQ.findMany({
                where,
                skip,
                take: limit,
                orderBy: [
                    {
                        displayOrder: "asc",
                    },
                    {
                        createdAt: "desc",
                    },
                ],
            }),
            prisma_1.default.fAQ.count({
                where,
            }),
        ]);
        return {
            faqs,
            total,
            page,
            pages: Math.ceil(total / limit),
        };
    }
    /**
     * Public FAQs
     */
    async getPublicFAQs() {
        return prisma_1.default.fAQ.findMany({
            where: {
                isPublished: true,
            },
            orderBy: {
                displayOrder: "asc",
            },
        });
    }
    /**
     * Category FAQs
     */
    async getCategoryFAQs(category) {
        return prisma_1.default.fAQ.findMany({
            where: {
                category,
                isPublished: true,
            },
            orderBy: {
                displayOrder: "asc",
            },
        });
    }
    /**
     * FAQ Categories
     */
    async getFAQCategories() {
        return prisma_1.default.fAQ.groupBy({
            by: ["category"],
            _count: true,
        });
    }
    /**
     * FAQ Analytics
     */
    async getFAQStats() {
        const [totalFAQs, publishedFAQs, draftFAQs, totalViews,] = await Promise.all([
            prisma_1.default.fAQ.count(),
            prisma_1.default.fAQ.count({
                where: {
                    isPublished: true,
                },
            }),
            prisma_1.default.fAQ.count({
                where: {
                    isPublished: false,
                },
            }),
            prisma_1.default.fAQ.aggregate({
                _sum: {
                    views: true,
                },
            }),
        ]);
        return {
            totalFAQs,
            publishedFAQs,
            draftFAQs,
            totalViews: totalViews._sum.views || 0,
        };
    }
}
exports.default = new FAQService();
