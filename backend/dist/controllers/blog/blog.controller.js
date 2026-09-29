"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogController = void 0;
const blog_service_1 = __importDefault(require("../../services/blog/blog.service"));
class BlogController {
    // ========================================
    // CREATE BLOG
    // ========================================
    static async createBlog(req, res) {
        try {
            const blog = await blog_service_1.default.createBlog(req.body);
            return res.status(201).json({
                success: true,
                message: "Blog created successfully.",
                data: blog,
            });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || "Failed to create blog.",
            });
        }
    }
    // ========================================
    // GET BLOG BY ID
    // ========================================
    static async getBlogById(req, res) {
        try {
            const id = req.params.id;
            const blog = await blog_service_1.default.getBlogById(id);
            if (!blog) {
                return res.status(404).json({
                    success: false,
                    message: "Blog not found.",
                });
            }
            return res.status(200).json({
                success: true,
                data: blog,
            });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || "Failed to fetch blog.",
            });
        }
    }
    // ========================================
    // GET BLOG BY SLUG
    // ========================================
    static async getBlogBySlug(req, res) {
        try {
            const slug = req.params.slug;
            const blog = await blog_service_1.default.getBlogBySlug(slug);
            if (!blog) {
                return res.status(404).json({
                    success: false,
                    message: "Blog not found.",
                });
            }
            return res.status(200).json({
                success: true,
                data: blog,
            });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || "Failed to fetch blog.",
            });
        }
    }
    // ========================================
    // GET ALL BLOGS
    // ========================================
    static async getAllBlogs(req, res) {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const result = await blog_service_1.default.getAllBlogs(page, limit);
            return res.status(200).json(result);
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || "Failed to fetch blogs.",
            });
        }
    }
    // ========================================
    // GET PUBLISHED BLOGS
    // ========================================
    static async getPublishedBlogs(req, res) {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const result = await blog_service_1.default.getPublishedBlogs(page, limit);
            return res.status(200).json(result);
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || "Failed to fetch published blogs.",
            });
        }
    }
    // ========================================
    // GET BLOGS BY CATEGORY
    // ========================================
    static async getBlogsByCategory(req, res) {
        try {
            const category = req.params.category;
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const blogs = await blog_service_1.default.getBlogsByCategory(category, page, limit);
            return res.status(200).json(blogs);
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || "Failed to fetch category blogs.",
            });
        }
    }
    // ========================================
    // SEARCH BLOGS
    // ========================================
    static async searchBlogs(req, res) {
        try {
            const search = String(req.query.search || "");
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const result = await blog_service_1.default.searchBlogs(search, page, limit);
            return res.status(200).json(result);
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || "Failed to search blogs.",
            });
        }
    }
    // ========================================
    // UPDATE BLOG
    // ========================================
    static async updateBlog(req, res) {
        try {
            const id = req.params.id;
            const blog = await blog_service_1.default.updateBlog(id, req.body);
            return res.status(200).json({
                success: true,
                message: "Blog updated successfully.",
                data: blog,
            });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || "Failed to update blog.",
            });
        }
    }
    // ========================================
    // PUBLISH BLOG
    // ========================================
    static async publishBlog(req, res) {
        try {
            const id = req.params.id;
            const blog = await blog_service_1.default.publishBlog(id);
            return res.status(200).json({
                success: true,
                message: "Blog published successfully.",
                data: blog,
            });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || "Failed to publish blog.",
            });
        }
    }
    // ========================================
    // UNPUBLISH BLOG
    // ========================================
    static async unpublishBlog(req, res) {
        try {
            const id = req.params.id;
            const blog = await blog_service_1.default.unpublishBlog(id);
            return res.status(200).json({
                success: true,
                message: "Blog unpublished successfully.",
                data: blog,
            });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || "Failed to unpublish blog.",
            });
        }
    }
    // ========================================
    // INCREMENT BLOG VIEW
    // ========================================
    static async incrementView(req, res) {
        try {
            const id = req.params.id;
            const blog = await blog_service_1.default.incrementView(id);
            return res.status(200).json({
                success: true,
                message: "Blog view updated successfully.",
                data: blog,
            });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || "Failed to update blog views.",
            });
        }
    }
    // ========================================
    // DELETE BLOG
    // ========================================
    static async deleteBlog(req, res) {
        try {
            const id = req.params.id;
            await blog_service_1.default.deleteBlog(id);
            return res.status(200).json({
                success: true,
                message: "Blog deleted successfully.",
            });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || "Failed to delete blog.",
            });
        }
    }
    // ========================================
    // BLOG ANALYTICS
    // ========================================
    static async getBlogAnalytics(req, res) {
        try {
            const analytics = await blog_service_1.default.getBlogAnalytics();
            return res.status(200).json({
                success: true,
                data: analytics,
            });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || "Failed to fetch blog analytics.",
            });
        }
    }
}
exports.BlogController = BlogController;
exports.default = BlogController;
