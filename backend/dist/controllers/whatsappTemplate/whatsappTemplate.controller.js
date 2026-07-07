"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.templateAnalytics = exports.toggleTemplateStatus = exports.rejectTemplate = exports.approveTemplate = exports.updateTemplate = exports.getTemplateById = exports.getTemplates = exports.createTemplate = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
/**
 * CREATE TEMPLATE
 */
const createTemplate = async (req, res) => {
    try {
        const { name, category, language, body, headerType, headerText, footerText, buttons, variables } = req.body;
        const exists = await prisma_1.default.whatsAppTemplate.findUnique({
            where: { name }
        });
        if (exists) {
            res.status(400).json({
                success: false,
                message: "Template already exists"
            });
            return;
        }
        const template = await prisma_1.default.whatsAppTemplate.create({
            data: {
                name,
                category,
                language,
                body,
                headerType,
                headerText,
                footerText,
                buttons,
                variables
            }
        });
        res.status(201).json({
            success: true,
            data: template
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error
        });
    }
};
exports.createTemplate = createTemplate;
/**
 * GET ALL TEMPLATES
 */
const getTemplates = async (req, res) => {
    try {
        const page = Number(req.query.page || 1);
        const limit = Number(req.query.limit || 20);
        const skip = (page - 1) * limit;
        const templates = await prisma_1.default.whatsAppTemplate.findMany({
            skip,
            take: limit,
            orderBy: {
                createdAt: "desc"
            }
        });
        const total = await prisma_1.default.whatsAppTemplate.count();
        res.status(200).json({
            success: true,
            total,
            page,
            data: templates
        });
    }
    catch {
        res.status(500).json({
            success: false
        });
    }
};
exports.getTemplates = getTemplates;
/**
 * GET TEMPLATE BY ID
 */
const getTemplateById = async (req, res) => {
    try {
        const template = await prisma_1.default.whatsAppTemplate.findUnique({
            where: {
                id: req.params.id
            }
        });
        if (!template) {
            res.status(404).json({
                success: false,
                message: "Template not found"
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: template
        });
    }
    catch {
        res.status(500).json({
            success: false
        });
    }
};
exports.getTemplateById = getTemplateById;
/**
 * UPDATE TEMPLATE
 */
const updateTemplate = async (req, res) => {
    try {
        const template = await prisma_1.default.whatsAppTemplate.update({
            where: {
                id: req.params.id
            },
            data: req.body
        });
        res.status(200).json({
            success: true,
            data: template
        });
    }
    catch {
        res.status(500).json({
            success: false
        });
    }
};
exports.updateTemplate = updateTemplate;
/**
 * APPROVE TEMPLATE
 */
const approveTemplate = async (req, res) => {
    try {
        const template = await prisma_1.default.whatsAppTemplate.update({
            where: {
                id: req.params.id
            },
            data: {
                status: "APPROVED",
                approvedAt: new Date()
            }
        });
        res.status(200).json({
            success: true,
            data: template
        });
    }
    catch {
        res.status(500).json({
            success: false
        });
    }
};
exports.approveTemplate = approveTemplate;
/**
 * REJECT TEMPLATE
 */
const rejectTemplate = async (req, res) => {
    try {
        const template = await prisma_1.default.whatsAppTemplate.update({
            where: {
                id: req.params.id
            },
            data: {
                status: "REJECTED",
                rejectionReason: req.body.reason
            }
        });
        res.status(200).json({
            success: true,
            data: template
        });
    }
    catch {
        res.status(500).json({
            success: false
        });
    }
};
exports.rejectTemplate = rejectTemplate;
/**
 * TOGGLE TEMPLATE STATUS
 */
const toggleTemplateStatus = async (req, res) => {
    try {
        const template = await prisma_1.default.whatsAppTemplate.findUnique({
            where: {
                id: req.params.id
            }
        });
        if (!template) {
            res.status(404).json({
                success: false
            });
            return;
        }
        const updated = await prisma_1.default.whatsAppTemplate.update({
            where: {
                id: req.params.id
            },
            data: {
                isActive: !template.isActive
            }
        });
        res.status(200).json({
            success: true,
            data: updated
        });
    }
    catch {
        res.status(500).json({
            success: false
        });
    }
};
exports.toggleTemplateStatus = toggleTemplateStatus;
/**
 * TEMPLATE ANALYTICS
 */
const templateAnalytics = async (req, res) => {
    try {
        const [total, approved, pending, rejected] = await Promise.all([
            prisma_1.default.whatsAppTemplate.count(),
            prisma_1.default.whatsAppTemplate.count({
                where: {
                    status: "APPROVED"
                }
            }),
            prisma_1.default.whatsAppTemplate.count({
                where: {
                    status: "PENDING"
                }
            }),
            prisma_1.default.whatsAppTemplate.count({
                where: {
                    status: "REJECTED"
                }
            })
        ]);
        res.status(200).json({
            success: true,
            data: {
                total,
                approved,
                pending,
                rejected
            }
        });
    }
    catch {
        res.status(500).json({
            success: false
        });
    }
};
exports.templateAnalytics = templateAnalytics;
