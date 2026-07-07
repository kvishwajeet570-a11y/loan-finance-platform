"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFAQAnalytics = exports.deleteFAQ = exports.toggleFAQStatus = exports.updateFAQ = exports.createFAQ = exports.getFAQById = exports.getFAQs = void 0;
const faq_service_1 = __importDefault(require("../../services/faq/faq.service"));
const getFAQs = async (req, res) => {
    try {
        const page = Number(req.query.page || 1);
        const limit = Number(req.query.limit || 10);
        const search = String(req.query.search || "");
        const category = String(req.query.category || "");
        const result = await faq_service_1.default.getFAQs({
            page,
            limit,
            search,
            category,
        });
        res.status(200).json({
            success: true,
            ...result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch FAQs",
        });
    }
};
exports.getFAQs = getFAQs;
const getFAQById = async (req, res) => {
    try {
        const faq = await faq_service_1.default.getFAQById(req.params.id);
        if (!faq) {
            return void res.status(404).json({
                success: false,
                message: "FAQ not found",
            });
        }
        res.status(200).json({
            success: true,
            data: faq,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Failed to fetch FAQ",
        });
    }
};
exports.getFAQById = getFAQById;
const createFAQ = async (req, res) => {
    try {
        const faq = await faq_service_1.default.createFAQ(req.body);
        res.status(201).json({
            success: true,
            message: "FAQ created successfully",
            data: faq,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
exports.createFAQ = createFAQ;
const updateFAQ = async (req, res) => {
    try {
        const faq = await faq_service_1.default.updateFAQ(req.params.id, req.body);
        res.status(200).json({
            success: true,
            message: "FAQ updated successfully",
            data: faq,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
exports.updateFAQ = updateFAQ;
const toggleFAQStatus = async (req, res) => {
    try {
        const faq = await faq_service_1.default.toggleStatus(req.params.id);
        res.status(200).json({
            success: true,
            message: "FAQ status updated",
            data: faq,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Failed to update status",
        });
    }
};
exports.toggleFAQStatus = toggleFAQStatus;
const deleteFAQ = async (req, res) => {
    try {
        await faq_service_1.default.softDelete(req.params.id);
        res.status(200).json({
            success: true,
            message: "FAQ deleted successfully",
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Failed to delete FAQ",
        });
    }
};
exports.deleteFAQ = deleteFAQ;
const getFAQAnalytics = async (req, res) => {
    try {
        const analytics = await faq_service_1.default.getAnalytics();
        res.status(200).json({
            success: true,
            data: analytics,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Failed to fetch analytics",
        });
    }
};
exports.getFAQAnalytics = getFAQAnalytics;
