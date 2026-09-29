"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.templateAnalytics = exports.toggleTemplateStatus = exports.rejectTemplate = exports.approveTemplate = exports.updateTemplate = exports.getTemplateById = exports.getTemplates = exports.createTemplate = void 0;
const prisma_1 = __importDefault(require("../../prisma/prisma"));
/* ==========================================================
   HELPER
========================================================== */
const getParam = (value) => {
    if (Array.isArray(value)) {
        return value[0] ?? "";
    }
    return value ?? "";
};
/* ==========================================================
   CREATE TEMPLATE
========================================================== */
const createTemplate = async (req, res) => {
    try {
        const { name, category, language, body, headerType, headerText, footerText, buttons, variables, } = req.body;
        const exists = await prisma_1.default.whatsAppTemplate.findUnique({
            where: {
                name,
            },
        });
        if (exists) {
            res.status(400).json({
                success: false,
                message: "Template already exists",
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
                variables,
            },
        });
        res.status(201).json({
            success: true,
            message: "WhatsApp template created successfully",
            data: template,
        });
    }
    catch (error) {
        console.error("Create WhatsApp template error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create WhatsApp template",
            error: error instanceof Error
                ? error.message
                : String(error),
        });
    }
};
exports.createTemplate = createTemplate;
/* ==========================================================
   GET ALL TEMPLATES
========================================================== */
const getTemplates = async (req, res) => {
    try {
        const page = Math.max(1, Number(req.query.page || 1));
        const limit = Math.min(100, Math.max(1, Number(req.query.limit || 20)));
        const skip = (page - 1) * limit;
        const [templates, total] = await Promise.all([
            prisma_1.default.whatsAppTemplate.findMany({
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
            }),
            prisma_1.default.whatsAppTemplate.count(),
        ]);
        res.status(200).json({
            success: true,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            data: templates,
        });
    }
    catch (error) {
        console.error("Get WhatsApp templates error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch WhatsApp templates",
        });
    }
};
exports.getTemplates = getTemplates;
/* ==========================================================
   GET TEMPLATE BY ID
========================================================== */
const getTemplateById = async (req, res) => {
    try {
        const id = getParam(req.params.id);
        if (!id) {
            res.status(400).json({
                success: false,
                message: "Template ID is required",
            });
            return;
        }
        const template = await prisma_1.default.whatsAppTemplate.findUnique({
            where: {
                id,
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
    catch (error) {
        console.error("Get WhatsApp template error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch WhatsApp template",
        });
    }
};
exports.getTemplateById = getTemplateById;
/* ==========================================================
   UPDATE TEMPLATE
========================================================== */
const updateTemplate = async (req, res) => {
    try {
        const id = getParam(req.params.id);
        if (!id) {
            res.status(400).json({
                success: false,
                message: "Template ID is required",
            });
            return;
        }
        const existing = await prisma_1.default.whatsAppTemplate.findUnique({
            where: {
                id,
            },
        });
        if (!existing) {
            res.status(404).json({
                success: false,
                message: "Template not found",
            });
            return;
        }
        const template = await prisma_1.default.whatsAppTemplate.update({
            where: {
                id,
            },
            data: req.body,
        });
        res.status(200).json({
            success: true,
            message: "Template updated successfully",
            data: template,
        });
    }
    catch (error) {
        console.error("Update WhatsApp template error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update WhatsApp template",
        });
    }
};
exports.updateTemplate = updateTemplate;
/* ==========================================================
   APPROVE TEMPLATE
========================================================== */
const approveTemplate = async (req, res) => {
    try {
        const id = getParam(req.params.id);
        if (!id) {
            res.status(400).json({
                success: false,
                message: "Template ID is required",
            });
            return;
        }
        const existing = await prisma_1.default.whatsAppTemplate.findUnique({
            where: {
                id,
            },
        });
        if (!existing) {
            res.status(404).json({
                success: false,
                message: "Template not found",
            });
            return;
        }
        const template = await prisma_1.default.whatsAppTemplate.update({
            where: {
                id,
            },
            data: {
                status: "APPROVED",
                approvedAt: new Date(),
                rejectionReason: null,
            },
        });
        res.status(200).json({
            success: true,
            message: "Template approved successfully",
            data: template,
        });
    }
    catch (error) {
        console.error("Approve WhatsApp template error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to approve WhatsApp template",
        });
    }
};
exports.approveTemplate = approveTemplate;
/* ==========================================================
   REJECT TEMPLATE
========================================================== */
const rejectTemplate = async (req, res) => {
    try {
        const id = getParam(req.params.id);
        if (!id) {
            res.status(400).json({
                success: false,
                message: "Template ID is required",
            });
            return;
        }
        const existing = await prisma_1.default.whatsAppTemplate.findUnique({
            where: {
                id,
            },
        });
        if (!existing) {
            res.status(404).json({
                success: false,
                message: "Template not found",
            });
            return;
        }
        const reason = typeof req.body.reason === "string"
            ? req.body.reason.trim()
            : "";
        if (!reason) {
            res.status(400).json({
                success: false,
                message: "Rejection reason is required",
            });
            return;
        }
        const template = await prisma_1.default.whatsAppTemplate.update({
            where: {
                id,
            },
            data: {
                status: "REJECTED",
                rejectionReason: reason,
            },
        });
        res.status(200).json({
            success: true,
            message: "Template rejected successfully",
            data: template,
        });
    }
    catch (error) {
        console.error("Reject WhatsApp template error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to reject WhatsApp template",
        });
    }
};
exports.rejectTemplate = rejectTemplate;
/* ==========================================================
   TOGGLE TEMPLATE STATUS
========================================================== */
const toggleTemplateStatus = async (req, res) => {
    try {
        const id = getParam(req.params.id);
        if (!id) {
            res.status(400).json({
                success: false,
                message: "Template ID is required",
            });
            return;
        }
        const template = await prisma_1.default.whatsAppTemplate.findUnique({
            where: {
                id,
            },
        });
        if (!template) {
            res.status(404).json({
                success: false,
                message: "Template not found",
            });
            return;
        }
        const updated = await prisma_1.default.whatsAppTemplate.update({
            where: {
                id,
            },
            data: {
                isActive: !template.isActive,
            },
        });
        res.status(200).json({
            success: true,
            message: updated.isActive
                ? "Template activated successfully"
                : "Template deactivated successfully",
            data: updated,
        });
    }
    catch (error) {
        console.error("Toggle WhatsApp template status error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update template status",
        });
    }
};
exports.toggleTemplateStatus = toggleTemplateStatus;
/* ==========================================================
   TEMPLATE ANALYTICS
========================================================== */
const templateAnalytics = async (req, res) => {
    try {
        const [total, approved, pending, rejected, active, inactive,] = await Promise.all([
            prisma_1.default.whatsAppTemplate.count(),
            prisma_1.default.whatsAppTemplate.count({
                where: {
                    status: "APPROVED",
                },
            }),
            prisma_1.default.whatsAppTemplate.count({
                where: {
                    status: "PENDING",
                },
            }),
            prisma_1.default.whatsAppTemplate.count({
                where: {
                    status: "REJECTED",
                },
            }),
            prisma_1.default.whatsAppTemplate.count({
                where: {
                    isActive: true,
                },
            }),
            prisma_1.default.whatsAppTemplate.count({
                where: {
                    isActive: false,
                },
            }),
        ]);
        res.status(200).json({
            success: true,
            data: {
                total,
                approved,
                pending,
                rejected,
                active,
                inactive,
            },
        });
    }
    catch (error) {
        console.error("WhatsApp template analytics error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch template analytics",
        });
    }
};
exports.templateAnalytics = templateAnalytics;
