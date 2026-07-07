"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTemplateAnalytics = exports.deleteTemplate = exports.sendTestEmail = exports.previewTemplate = exports.toggleTemplateStatus = exports.updateTemplate = exports.createTemplate = exports.getTemplateById = exports.getTemplates = void 0;
const emailTemplate_service_1 = __importDefault(require("../../services/email-template/emailTemplate.service"));
const getTemplates = async (req, res) => {
    try {
        const page = Number(req.query.page || 1);
        const limit = Number(req.query.limit || 10);
        const search = String(req.query.search || "");
        const result = await emailTemplate_service_1.default.getTemplates({
            page,
            limit,
            search,
        });
        res.status(200).json({
            success: true,
            ...result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch templates",
        });
    }
};
exports.getTemplates = getTemplates;
const getTemplateById = async (req, res) => {
    try {
        const template = await emailTemplate_service_1.default.getTemplateById(req.params.id);
        if (!template) {
            return void res.status(404).json({
                success: false,
                message: "Template not found",
            });
        }
        res.status(200).json({
            success: true,
            data: template,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Failed to fetch template",
        });
    }
};
exports.getTemplateById = getTemplateById;
const createTemplate = async (req, res) => {
    try {
        const template = await emailTemplate_service_1.default.createTemplate(req.body);
        res.status(201).json({
            success: true,
            message: "Template created successfully",
            data: template,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
exports.createTemplate = createTemplate;
const updateTemplate = async (req, res) => {
    try {
        const template = await emailTemplate_service_1.default.updateTemplate(req.params.id, req.body);
        res.status(200).json({
            success: true,
            message: "Template updated successfully",
            data: template,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
exports.updateTemplate = updateTemplate;
const toggleTemplateStatus = async (req, res) => {
    try {
        const template = await emailTemplate_service_1.default.toggleStatus(req.params.id);
        res.status(200).json({
            success: true,
            message: "Status updated successfully",
            data: template,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Failed to update status",
        });
    }
};
exports.toggleTemplateStatus = toggleTemplateStatus;
const previewTemplate = async (req, res) => {
    try {
        const preview = await emailTemplate_service_1.default.previewTemplate(req.params.id, req.body.variables || {});
        res.status(200).json({
            success: true,
            data: preview,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Preview failed",
        });
    }
};
exports.previewTemplate = previewTemplate;
const sendTestEmail = async (req, res) => {
    try {
        await emailTemplate_service_1.default.sendTestEmail({
            templateId: req.params.id,
            email: req.body.email,
        });
        res.status(200).json({
            success: true,
            message: "Test email sent successfully",
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Failed to send test email",
        });
    }
};
exports.sendTestEmail = sendTestEmail;
const deleteTemplate = async (req, res) => {
    try {
        await emailTemplate_service_1.default.softDelete(req.params.id);
        res.status(200).json({
            success: true,
            message: "Template deleted successfully",
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
const getTemplateAnalytics = async (req, res) => {
    try {
        const analytics = await emailTemplate_service_1.default.getAnalytics();
        res.status(200).json({
            success: true,
            data: analytics,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Analytics failed",
        });
    }
};
exports.getTemplateAnalytics = getTemplateAnalytics;
