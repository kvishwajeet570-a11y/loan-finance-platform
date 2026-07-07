"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCMSAnalytics = exports.deletePage = exports.togglePublishStatus = exports.updatePage = exports.createPage = exports.getPageBySlug = exports.getPages = void 0;
const cms_service_1 = __importDefault(require("../../services/cms/cms.service"));
const getPages = async (req, res) => {
    try {
        const page = Number(req.query.page || 1);
        const limit = Number(req.query.limit || 10);
        const search = String(req.query.search || "");
        const data = await cms_service_1.default.getPages({
            page,
            limit,
            search,
        });
        res.status(200).json({
            success: true,
            ...data,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch pages",
        });
    }
};
exports.getPages = getPages;
const getPageBySlug = async (req, res) => {
    try {
        const page = await cms_service_1.default.getPageBySlug(req.params.slug);
        if (!page) {
            res.status(404).json({
                success: false,
                message: "Page not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: page,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Failed to fetch page",
        });
    }
};
exports.getPageBySlug = getPageBySlug;
const createPage = async (req, res) => {
    try {
        const page = await cms_service_1.default.createPage(req.body);
        res.status(201).json({
            success: true,
            message: "Page created successfully",
            data: page,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
exports.createPage = createPage;
const updatePage = async (req, res) => {
    try {
        const page = await cms_service_1.default.updatePage(req.params.id, req.body);
        res.status(200).json({
            success: true,
            message: "Page updated successfully",
            data: page,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
exports.updatePage = updatePage;
const togglePublishStatus = async (req, res) => {
    try {
        const page = await cms_service_1.default.togglePublishStatus(req.params.id);
        res.status(200).json({
            success: true,
            message: "Status updated",
            data: page,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Failed to update status",
        });
    }
};
exports.togglePublishStatus = togglePublishStatus;
const deletePage = async (req, res) => {
    try {
        await cms_service_1.default.softDelete(req.params.id);
        res.status(200).json({
            success: true,
            message: "Page deleted successfully",
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Failed to delete page",
        });
    }
};
exports.deletePage = deletePage;
const getCMSAnalytics = async (req, res) => {
    try {
        const analytics = await cms_service_1.default.getAnalytics();
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
exports.getCMSAnalytics = getCMSAnalytics;
