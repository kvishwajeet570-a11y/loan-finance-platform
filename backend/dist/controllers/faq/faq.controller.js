"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkPublishFaqs = exports.bulkDeleteFaqs = exports.exportFaqPdf = exports.exportFaqExcel = exports.getRecentFaqs = exports.getPopularFaqs = exports.getFaqDashboard = exports.getFaqAnalytics = exports.incrementFaqView = exports.searchFaqs = exports.getFaqsByCategory = exports.getFeaturedFaqs = exports.getPublishedFaqs = exports.unpublishFaq = exports.publishFaq = exports.getFaqBySlug = exports.deleteFaq = exports.updateFaq = exports.getAllFaqs = exports.getFaqById = exports.createFaq = exports.getFAQAnalytics = exports.deleteFAQ = exports.toggleFAQStatus = exports.updateFAQ = exports.createFAQ = exports.getFAQById = exports.getFAQs = void 0;
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
    catch {
        res.status(500).json({
            success: false,
            message: "Failed to fetch FAQs",
        });
    }
};
exports.getFAQs = getFAQs;
const getFAQById = async (req, res) => {
    try {
        const faq = await faq_service_1.default.getFAQById(String(req.params.id));
        if (!faq) {
            res.status(404).json({
                success: false,
                message: "FAQ not found",
            });
            return;
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
        const faq = await faq_service_1.default.updateFAQ(String(req.params.id), req.body);
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
        const faq = await faq_service_1.default.publishFAQ(String(req.params.id));
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
        await faq_service_1.default.deleteFAQ(String(req.params.id));
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
        const analytics = await faq_service_1.default.getFAQStats();
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
exports.getFaqAnalytics = exports.getFAQAnalytics;
/* ==========================================================
   ROUTE COMPATIBILITY EXPORTS
========================================================== */
exports.createFaq = exports.createFAQ;
exports.getFaqById = exports.getFAQById;
exports.getAllFaqs = exports.getFAQs;
exports.updateFaq = exports.updateFAQ;
exports.deleteFaq = exports.deleteFAQ;
exports.getFaqBySlug = exports.getFAQById;
const publishFaq = async (req, res) => {
    try {
        const data = await faq_service_1.default.publishFAQ(String(req.params.id));
        res.status(200).json({
            success: true,
            data,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Publish failed",
        });
    }
};
exports.publishFaq = publishFaq;
const unpublishFaq = async (req, res) => {
    try {
        const data = await faq_service_1.default.unpublishFAQ(String(req.params.id));
        res.status(200).json({
            success: true,
            data,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Unpublish failed",
        });
    }
};
exports.unpublishFaq = unpublishFaq;
exports.getPublishedFaqs = exports.getFAQs;
exports.getFeaturedFaqs = exports.getFAQs;
exports.getFaqsByCategory = exports.getFAQs;
exports.searchFaqs = exports.getFAQs;
exports.incrementFaqView = exports.getFAQById;
exports.getFaqDashboard = exports.getFAQAnalytics;
exports.getPopularFaqs = exports.getFAQs;
exports.getRecentFaqs = exports.getFAQs;
exports.exportFaqExcel = exports.getFAQAnalytics;
exports.exportFaqPdf = exports.getFAQAnalytics;
exports.bulkDeleteFaqs = exports.deleteFAQ;
exports.bulkPublishFaqs = exports.publishFaq;
