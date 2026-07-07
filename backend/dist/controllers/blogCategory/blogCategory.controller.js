"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategoryAnalytics = exports.deleteCategory = exports.toggleCategoryStatus = exports.updateCategory = exports.createCategory = exports.getCategoryById = exports.getCategories = void 0;
const blogCategory_service_1 = __importDefault(require("../../services/blog-category/blogCategory.service"));
const getCategories = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const search = String(req.query.search || "");
        const result = await blogCategory_service_1.default.getCategories({
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
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch categories",
        });
    }
};
exports.getCategories = getCategories;
const getCategoryById = async (req, res) => {
    try {
        const category = await blogCategory_service_1.default.getCategoryById(req.params.id);
        if (!category) {
            res.status(404).json({
                success: false,
                message: "Category not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: category,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Failed to fetch category",
        });
    }
};
exports.getCategoryById = getCategoryById;
const createCategory = async (req, res) => {
    try {
        const category = await blogCategory_service_1.default.createCategory(req.body);
        res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: category,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
exports.createCategory = createCategory;
const updateCategory = async (req, res) => {
    try {
        const category = await blogCategory_service_1.default.updateCategory(req.params.id, req.body);
        res.status(200).json({
            success: true,
            message: "Category updated successfully",
            data: category,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
exports.updateCategory = updateCategory;
const toggleCategoryStatus = async (req, res) => {
    try {
        const category = await blogCategory_service_1.default.toggleStatus(req.params.id);
        res.status(200).json({
            success: true,
            message: "Status updated",
            data: category,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Failed to update status",
        });
    }
};
exports.toggleCategoryStatus = toggleCategoryStatus;
const deleteCategory = async (req, res) => {
    try {
        await blogCategory_service_1.default.softDelete(req.params.id);
        res.status(200).json({
            success: true,
            message: "Category deleted successfully",
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Failed to delete category",
        });
    }
};
exports.deleteCategory = deleteCategory;
const getCategoryAnalytics = async (req, res) => {
    try {
        const analytics = await blogCategory_service_1.default.getAnalytics();
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
exports.getCategoryAnalytics = getCategoryAnalytics;
