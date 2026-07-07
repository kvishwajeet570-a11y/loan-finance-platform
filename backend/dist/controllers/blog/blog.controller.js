"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBlogAnalytics = exports.deleteBlog = exports.updateBlog = exports.createBlog = exports.getBlogBySlug = exports.getBlogs = void 0;
const blog_service_1 = __importDefault(require("../../services/blog/blog.service"));
const getBlogs = async (req, res) => {
    try {
        const page = Number(req.query.page || 1);
        const limit = Number(req.query.limit || 10);
        const blogs = await blog_service_1.default.getBlogs(page, limit);
        res.status(200).json({
            success: true,
            ...blogs,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch blogs",
        });
    }
};
exports.getBlogs = getBlogs;
const getBlogBySlug = async (req, res) => {
    try {
        const blog = await blog_service_1.default.getBlogBySlug(req.params.slug);
        if (!blog) {
            res.status(404).json({
                success: false,
                message: "Blog not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: blog,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch blog",
        });
    }
};
exports.getBlogBySlug = getBlogBySlug;
const createBlog = async (req, res) => {
    try {
        const blog = await blog_service_1.default.createBlog(req.body);
        res.status(201).json({
            success: true,
            message: "Blog created successfully",
            data: blog,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create blog",
        });
    }
};
exports.createBlog = createBlog;
const updateBlog = async (req, res) => {
    try {
        const blog = await blog_service_1.default.updateBlog(req.params.id, req.body);
        res.status(200).json({
            success: true,
            message: "Blog updated successfully",
            data: blog,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update blog",
        });
    }
};
exports.updateBlog = updateBlog;
const deleteBlog = async (req, res) => {
    try {
        await blog_service_1.default.deleteBlog(req.params.id);
        res.status(200).json({
            success: true,
            message: "Blog deleted successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete blog",
        });
    }
};
exports.deleteBlog = deleteBlog;
const getBlogAnalytics = async (req, res) => {
    try {
        const analytics = await blog_service_1.default.getBlogAnalytics();
        res.status(200).json({
            success: true,
            data: analytics,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch analytics",
        });
    }
};
exports.getBlogAnalytics = getBlogAnalytics;
