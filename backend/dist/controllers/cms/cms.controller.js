"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkDelete = exports.getCmsAnalytics = exports.getPageTypes = exports.deletePage = exports.unpublishPage = exports.publishPage = exports.updatePage = exports.searchPages = exports.getPublishedPages = exports.getAllPages = exports.getPageBySlug = exports.getPageById = exports.createPage = void 0;
const cms_service_1 = __importDefault(require("../../services/cms/cms.service"));
/* ========================================
   CREATE PAGE
======================================== */
const createPage = async (req, res) => {
    try {
        const page = await cms_service_1.default.createPage(req.body);
        res.status(201).json({
            success: true,
            message: "CMS page created successfully.",
            data: page,
        });
    }
    catch (error) {
        console.error(error);
        res.status(400).json({
            success: false,
            message: error?.message || "Failed to create page.",
        });
    }
};
exports.createPage = createPage;
/* ========================================
   GET PAGE BY ID
======================================== */
const getPageById = async (req, res) => {
    try {
        const page = await cms_service_1.default.getPageById(req.params.id);
        if (!page) {
            res.status(404).json({
                success: false,
                message: "Page not found.",
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: page,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch page.",
        });
    }
};
exports.getPageById = getPageById;
/* ========================================
   GET PAGE BY SLUG
======================================== */
const getPageBySlug = async (req, res) => {
    try {
        const page = await cms_service_1.default.getPageBySlug(req.params.slug);
        if (!page) {
            res.status(404).json({
                success: false,
                message: "Page not found.",
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: page,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch page.",
        });
    }
};
exports.getPageBySlug = getPageBySlug;
/* ========================================
   GET ALL PAGES
======================================== */
const getAllPages = async (req, res) => {
    try {
        const page = Number(req.query.page ?? 1);
        const limit = Number(req.query.limit ?? 10);
        const result = await cms_service_1.default.getAllPages({
            page,
            limit,
            search: String(req.query.search ?? ""),
            pageType: String(req.query.pageType ?? ""),
            category: String(req.query.category ?? ""),
            isPublished: req.query.isPublished !== undefined
                ? req.query.isPublished === "true"
                : undefined,
        });
        res.status(200).json({
            success: true,
            ...result,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch pages.",
        });
    }
};
exports.getAllPages = getAllPages;
/* ========================================
   GET PUBLISHED PAGES
======================================== */
const getPublishedPages = async (req, res) => {
    try {
        const pages = await cms_service_1.default.getPublishedPages();
        res.status(200).json({
            success: true,
            count: pages.length,
            data: pages,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch published pages.",
        });
    }
};
exports.getPublishedPages = getPublishedPages;
/* ========================================
   SEARCH PAGES
======================================== */
const searchPages = async (req, res) => {
    try {
        const { keyword = "", pageType, category, isPublished, page = 1, limit = 10, } = req.query;
        const result = await cms_service_1.default.searchPages({
            keyword: String(keyword),
            pageType: pageType ? String(pageType) : undefined,
            category: category ? String(category) : undefined,
            isPublished: isPublished !== undefined
                ? isPublished === "true"
                : undefined,
            page: Number(page),
            limit: Number(limit),
        });
        res.status(200).json({
            success: true,
            ...result,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Search failed.",
        });
    }
};
exports.searchPages = searchPages;
/* ========================================
   UPDATE PAGE
======================================== */
const updatePage = async (req, res) => {
    try {
        const page = await cms_service_1.default.updatePage(req.params.id, req.body);
        res.status(200).json({
            success: true,
            message: "Page updated successfully.",
            data: page,
        });
    }
    catch (error) {
        console.error(error);
        res.status(400).json({
            success: false,
            message: error?.message || "Failed to update page.",
        });
    }
};
exports.updatePage = updatePage;
/* ========================================
   PUBLISH PAGE
======================================== */
const publishPage = async (req, res) => {
    try {
        const page = await cms_service_1.default.publishPage(req.params.id);
        res.status(200).json({
            success: true,
            message: "Page published successfully.",
            data: page,
        });
    }
    catch (error) {
        console.error(error);
        res.status(400).json({
            success: false,
            message: error?.message || "Failed to publish page.",
        });
    }
};
exports.publishPage = publishPage;
/* ========================================
   UNPUBLISH PAGE
======================================== */
const unpublishPage = async (req, res) => {
    try {
        const page = await cms_service_1.default.unpublishPage(req.params.id);
        res.status(200).json({
            success: true,
            message: "Page unpublished successfully.",
            data: page,
        });
    }
    catch (error) {
        console.error(error);
        res.status(400).json({
            success: false,
            message: error?.message || "Failed to unpublish page.",
        });
    }
};
exports.unpublishPage = unpublishPage;
/* ========================================
   DELETE PAGE
======================================== */
const deletePage = async (req, res) => {
    try {
        await cms_service_1.default.deletePage(req.params.id);
        res.status(200).json({
            success: true,
            message: "Page deleted successfully.",
        });
    }
    catch (error) {
        console.error(error);
        res.status(400).json({
            success: false,
            message: error?.message || "Failed to delete page.",
        });
    }
};
exports.deletePage = deletePage;
/* ========================================
   GET PAGE TYPES
======================================== */
const getPageTypes = async (req, res) => {
    try {
        const pageTypes = await cms_service_1.default.getPageTypes();
        res.status(200).json({
            success: true,
            count: pageTypes.length,
            data: pageTypes,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch page types.",
        });
    }
};
exports.getPageTypes = getPageTypes;
/* ========================================
   CMS ANALYTICS
======================================== */
const getCmsAnalytics = async (req, res) => {
    try {
        const analytics = await cms_service_1.default.getCmsAnalytics();
        res.status(200).json({
            success: true,
            data: analytics,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch CMS analytics.",
        });
    }
};
exports.getCmsAnalytics = getCmsAnalytics;
/* ========================================
   BULK DELETE
======================================== */
const bulkDelete = async (req, res) => {
    try {
        const { ids } = req.body;
        if (!Array.isArray(ids) || ids.length === 0) {
            res.status(400).json({
                success: false,
                message: "Please provide page ids.",
            });
            return;
        }
        const result = await cms_service_1.default.bulkDelete(ids);
        res.status(200).json({
            success: true,
            message: "Pages deleted successfully.",
            data: result,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error?.message || "Bulk delete failed.",
        });
    }
};
exports.bulkDelete = bulkDelete;
