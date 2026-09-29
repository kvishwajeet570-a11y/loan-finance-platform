"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDeliveryStats = exports.templateAnalytics = exports.approveTemplate = exports.toggleTemplateStatus = exports.deleteTemplate = exports.updateTemplate = exports.getTemplateById = exports.getAllTemplates = exports.createTemplate = void 0;
const prisma_1 = __importDefault(require("../../prisma/prisma"));
/* =====================================================
   CREATE TEMPLATE
===================================================== */
const createTemplate = async (req, res) => {
    try {
        const { name, code, category, type, subject, content, variables, } = req.body;
        const existing = await prisma_1.default.notificationTemplate.findUnique({
            where: {
                code: String(code).toUpperCase(),
            },
        });
        if (existing) {
            res.status(409).json({
                success: false,
                message: "Template code already exists",
            });
            return;
        }
        const template = await prisma_1.default.notificationTemplate.create({
            data: {
                name,
                code: String(code).toUpperCase(),
                category,
                type,
                subject,
                content,
                variables,
                createdBy: req.user?.id || null,
            },
        });
        res.status(201).json({
            success: true,
            data: template,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error,
        });
    }
};
exports.createTemplate = createTemplate;
/* =====================================================
   GET ALL TEMPLATES
===================================================== */
const getAllTemplates = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const search = typeof req.query.search === "string"
            ? req.query.search
            : undefined;
        const category = typeof req.query.category === "string"
            ? req.query.category
            : undefined;
        const type = typeof req.query.type === "string"
            ? req.query.type
            : undefined;
        const isActive = req.query.isActive === "true"
            ? true
            : req.query.isActive === "false"
                ? false
                : undefined;
        const where = {
            ...(search && {
                OR: [
                    {
                        name: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    {
                        code: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                ],
            }),
            ...(category && {
                category,
            }),
            ...(type && {
                type,
            }),
            ...(typeof isActive ===
                "boolean" && {
                isActive,
            }),
        };
        const [templates, total] = await Promise.all([
            prisma_1.default.notificationTemplate.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
            }),
            prisma_1.default.notificationTemplate.count({
                where,
            }),
        ]);
        res.status(200).json({
            success: true,
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            data: templates,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error,
        });
    }
};
exports.getAllTemplates = getAllTemplates;
/* =====================================================
   GET TEMPLATE BY ID
===================================================== */
const getTemplateById = async (req, res) => {
    try {
        const id = String(req.params.id);
        const template = await prisma_1.default.notificationTemplate.findUnique({
            where: { id },
        });
        if (!template) {
            res.status(404).json({
                success: false,
                message: "Template not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: template,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error,
        });
    }
};
exports.getTemplateById = getTemplateById;
/* =====================================================
   UPDATE TEMPLATE
===================================================== */
const updateTemplate = async (req, res) => {
    try {
        const id = String(req.params.id);
        const existing = await prisma_1.default.notificationTemplate.findUnique({
            where: { id },
        });
        if (!existing) {
            res.status(404).json({
                success: false,
                message: "Template not found",
            });
            return;
        }
        const updated = await prisma_1.default.notificationTemplate.update({
            where: { id },
            data: {
                ...req.body,
                version: {
                    increment: 1,
                },
            },
        });
        res.status(200).json({
            success: true,
            data: updated,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error,
        });
    }
};
exports.updateTemplate = updateTemplate;
/* =====================================================
   DELETE TEMPLATE
===================================================== */
const deleteTemplate = async (req, res) => {
    try {
        const id = String(req.params.id);
        await prisma_1.default.notificationTemplate.delete({
            where: { id },
        });
        res.status(200).json({
            success: true,
            message: "Template deleted successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error,
        });
    }
};
exports.deleteTemplate = deleteTemplate;
/* =====================================================
   TOGGLE TEMPLATE STATUS
===================================================== */
const toggleTemplateStatus = async (req, res) => {
    try {
        const id = String(req.params.id);
        const template = await prisma_1.default.notificationTemplate.findUnique({
            where: { id },
        });
        if (!template) {
            res.status(404).json({
                success: false,
                message: "Template not found",
            });
            return;
        }
        const updated = await prisma_1.default.notificationTemplate.update({
            where: { id },
            data: {
                isActive: !template.isActive,
            },
        });
        res.status(200).json({
            success: true,
            data: updated,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error,
        });
    }
};
exports.toggleTemplateStatus = toggleTemplateStatus;
/* =====================================================
   APPROVE TEMPLATE
===================================================== */
const approveTemplate = async (req, res) => {
    try {
        const id = String(req.params.id);
        const template = await prisma_1.default.notificationTemplate.update({
            where: { id },
            data: {
                approvedBy: req.user?.id ||
                    "SYSTEM",
            },
        });
        res.status(200).json({
            success: true,
            data: template,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error,
        });
    }
};
exports.approveTemplate = approveTemplate;
/* =====================================================
   TEMPLATE ANALYTICS
===================================================== */
const templateAnalytics = async (req, res) => {
    try {
        const analytics = await prisma_1.default.notificationTemplate.aggregate({
            _count: {
                id: true,
            },
            _sum: {
                totalSent: true,
                totalDelivered: true,
                totalFailed: true,
            },
        });
        res.status(200).json({
            success: true,
            data: analytics,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error,
        });
    }
};
exports.templateAnalytics = templateAnalytics;
/* =====================================================
   UPDATE DELIVERY STATS
===================================================== */
const updateDeliveryStats = async (templateId, delivered) => {
    await prisma_1.default.notificationTemplate.update({
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
};
exports.updateDeliveryStats = updateDeliveryStats;
