"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogService = void 0;
const blog_repository_1 = require("../../repositories/blog/blog.repository");
class BlogService {
    // ========================================
    // CREATE BLOG
    // ========================================
    async createBlog(data) {
        return blog_repository_1.BlogRepository.createBlog(data);
    }
    // ========================================
    // GET BLOG BY ID
    // ========================================
    async getBlogById(blogId) {
        return blog_repository_1.BlogRepository.getBlogById(blogId);
    }
    // ========================================
    // GET BLOG BY SLUG
    // ========================================
    async getBlogBySlug(slug) {
        return blog_repository_1.BlogRepository.getBlogBySlug(slug);
    }
    // ========================================
    // GET ALL BLOGS
    // ========================================
    async getAllBlogs(page = 1, limit = 10) {
        return blog_repository_1.BlogRepository.getAllBlogs(page, limit);
    }
    // ========================================
    // GET PUBLISHED BLOGS
    // ========================================
    async getPublishedBlogs(page = 1, limit = 10) {
        return blog_repository_1.BlogRepository.getPublishedBlogs(page, limit);
    }
    // ========================================
    // GET BLOGS BY CATEGORY
    // ========================================
    async getBlogsByCategory(category, page = 1, limit = 10) {
        return blog_repository_1.BlogRepository.getBlogsByCategory(category, page, limit);
    }
    // ========================================
    // SEARCH BLOGS
    // ========================================
    async searchBlogs(search, page = 1, limit = 10) {
        return blog_repository_1.BlogRepository.searchBlogs(search, page, limit);
    }
    // ========================================
    // UPDATE BLOG
    // ========================================
    async updateBlog(blogId, data) {
        return blog_repository_1.BlogRepository.updateBlog(blogId, data);
    }
    // ========================================
    // PUBLISH BLOG
    // ========================================
    async publishBlog(blogId) {
        return blog_repository_1.BlogRepository.publishBlog(blogId);
    }
    // ========================================
    // UNPUBLISH BLOG
    // ========================================
    async unpublishBlog(blogId) {
        return blog_repository_1.BlogRepository.unpublishBlog(blogId);
    }
    // ========================================
    // INCREMENT BLOG VIEW
    // ========================================
    async incrementView(blogId) {
        return blog_repository_1.BlogRepository.incrementView(blogId);
    }
    // ========================================
    // DELETE BLOG
    // ========================================
    async deleteBlog(blogId) {
        return blog_repository_1.BlogRepository.deleteBlog(blogId);
    }
    // ========================================
    // BLOG ANALYTICS
    // ========================================
    async getBlogAnalytics() {
        return blog_repository_1.BlogRepository.getBlogAnalytics();
    }
}
exports.BlogService = BlogService;
exports.default = new BlogService();
