"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationTemplateService = exports.NotificationTemplateService = void 0;
const prisma_1 = __importDefault(require("../../prisma/prisma"));
class NotificationTemplateService {
    /* =========================================
       CREATE TEMPLATE
    ========================================= */
    async createTemplate(data, userId) {
        return prisma_1.default.notificationTemplate.create({
            data: {
                ...data,
                code: data.code.toUpperCase(),
                createdBy: userId,
            },
        });
    }
    /* =========================================
       GET ALL TEMPLATES
    ========================================= */
    async getAllTemplates(page, limit, filters) {
        const skip = (page - 1) * limit;
        const [templates, total] = await Promise.all([
            prisma_1.default.notificationTemplate.findMany({
                where: filters,
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
            }),
            prisma_1.default.notificationTemplate.count({
                where: filters,
            }),
        ]);
        return {
            templates,
            total,
            page,
            limit,
        };
    }
    /* =========================================
       GET TEMPLATE BY ID
    ========================================= */
    async getTemplateById(id) {
        return prisma_1.default.notificationTemplate.findUnique({
            where: { id },
        });
    }
    /* =========================================
       GET TEMPLATE BY CODE
    ========================================= */
    async getTemplateByCode(code) {
        return prisma_1.default.notificationTemplate.findUnique({
            where: {
                code: code.toUpperCase(),
            },
        });
    }
    /* =========================================
       UPDATE TEMPLATE
    ========================================= */
    async updateTemplate(id, data) {
        return prisma_1.default.notificationTemplate.update({
            where: { id },
            data: {
                ...data,
                version: {
                    increment: 1,
                },
            },
        });
    }
    /* =========================================
       DELETE TEMPLATE
    ========================================= */
    async deleteTemplate(id) {
        return prisma_1.default.notificationTemplate.delete({
            where: { id },
        });
    }
    /* =========================================
       TOGGLE STATUS
    ========================================= */
    async toggleStatus(id) {
        const template = await prisma_1.default.notificationTemplate.findUnique({
            where: { id },
        });
        if (!template) {
            throw new Error("Template not found");
        }
        return prisma_1.default.notificationTemplate.update({
            where: { id },
            data: {
                isActive: !template.isActive,
            },
        });
    }
    /* =========================================
       APPROVE TEMPLATE
    ========================================= */
    async approveTemplate(id, approvedBy) {
        return prisma_1.default.notificationTemplate.update({
            where: { id },
            data: {
                approvedBy: approvedBy || "SYSTEM",
            },
        });
    }
    /* =========================================
       DELIVERY STATS
    ========================================= */
    async updateDeliveryStats(templateId, delivered) {
        return prisma_1.default.notificationTemplate.update({
            where: {
                id: templateId,
            },
            data: {
                totalSent: {
                    increment: 1,
                },
                ...(delivered
                    ? {
                        totalDelivered: {
                            increment: 1,
                        },
                    }
                    : {
                        totalFailed: {
                            increment: 1,
                        },
                    }),
            },
        });
    }
    /* =========================================
       TEMPLATE ANALYTICS
    ========================================= */
    async getAnalytics() {
        return prisma_1.default.notificationTemplate.aggregate({
            _count: {
                id: true,
            },
            _sum: {
                totalSent: true,
                totalDelivered: true,
                totalFailed: true,
            },
        });
    }
    /* =========================================
       TEMPLATE RENDER ENGINE
    ========================================= */
    renderTemplate(template, data) {
        return template.replace(/{{(.*?)}}/g, (_, key) => data[key.trim()] || "");
    }
}
exports.NotificationTemplateService = NotificationTemplateService;
exports.notificationTemplateService = new NotificationTemplateService();
