"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.templateAnalytics = exports.deleteTemplate = exports.toggleTemplateStatus = exports.updateTemplate = exports.getTemplateById = exports.getAllTemplates = exports.createTemplate = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const createTemplate = async (req, res) => {
    try {
        const { name, code, type, subject, content, variables, } = req.body;
        const exists = await prisma_1.default.notificationTemplate.findUnique({
            where: { code },
        });
        if (exists) {
            res.status(400).json({
                success: false,
                message: "Template code already exists",
            });
            return;
        }
        const template = await prisma_1.default.notificationTemplate.create({
            data: {
                name,
                code,
                type,
                subject,
                content,
                variables,
                createdBy: req.user?.id,
            },
        });
        res.status(201).json({
            success: true,
            data: template,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to create template",
        });
    }
};
exports.createTemplate = createTemplate;
const getAllTemplates = async (req, res) => {
    try {
        const page = Number(req.query.page || 1);
        const limit = Number(req.query.limit || 20);
        const search = String(req.query.search || "");
        const skip = (page - 1) * limit;
        const where = {
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
            total,
            page,
            data: templates,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Failed to fetch templates",
        });
    }
};
exports.getAllTemplates = getAllTemplates;
const getTemplateById = async (req, res) => {
    try {
        const template = await prisma_1.default.notificationTemplate.findUnique({
            where: {
                id: req.params.id,
            },
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
    catch {
        res.status(500).json({
            success: false,
            message: "Failed",
        });
    }
};
exports.getTemplateById = getTemplateById;
const updateTemplate = async (req, res) => {
    try {
        const template = await prisma_1.default.notificationTemplate.update({
            where: {
                id: req.params.id,
            },
            data: {
                ...req.body,
                updatedBy: req.user?.id,
            },
        });
        res.status(200).json({
            success: true,
            message: "Template updated",
            data: template,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Update failed",
        });
    }
};
exports.updateTemplate = updateTemplate;
const toggleTemplateStatus = async (req, res) => {
    try {
        const template = await prisma_1.default.notificationTemplate.findUnique({
            where: {
                id: req.params.id,
            },
        });
        if (!template) {
            res.status(404).json({
                success: false,
                message: "Template not found",
            });
            return;
        }
        const updated = await prisma_1.default.notificationTemplate.update({
            where: {
                id: req.params.id,
            },
            data: {
                isActive: !template.isActive,
            },
        });
        res.status(200).json({
            success: true,
            data: updated,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Status update failed",
        });
    }
};
exports.toggleTemplateStatus = toggleTemplateStatus;
const deleteTemplate = async (req, res) => {
    try {
        await prisma_1.default.notificationTemplate.delete({
            where: {
                id: req.params.id,
            },
        });
        res.status(200).json({
            success: true,
            message: "Template deleted",
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Delete failed",
        });
    }
};
exports.deleteTemplate = deleteTemplate;
const templateAnalytics = async (req, res) => {
    try {
        const [totalTemplates, activeTemplates, emailTemplates, smsTemplates, pushTemplates, whatsappTemplates,] = await Promise.all([
            prisma_1.default.notificationTemplate.count(),
            prisma_1.default.notificationTemplate.count({
                where: { isActive: true },
            }),
            prisma_1.default.notificationTemplate.count({
                where: { type: "EMAIL" },
            }),
            prisma_1.default.notificationTemplate.count({
                where: { type: "SMS" },
            }),
            prisma_1.default.notificationTemplate.count({
                where: { type: "PUSH" },
            }),
            prisma_1.default.notificationTemplate.count({
                where: { type: "WHATSAPP" },
            }),
        ]);
        res.status(200).json({
            success: true,
            data: {
                totalTemplates,
                activeTemplates,
                emailTemplates,
                smsTemplates,
                pushTemplates,
                whatsappTemplates,
            },
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Analytics failed",
        });
    }
};
exports.templateAnalytics = templateAnalytics;
