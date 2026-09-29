"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const blog_controller_1 = require("../../controllers/blog/blog.controller");
const router = (0, express_1.Router)();
/* ========================================
   BLOG ANALYTICS
======================================== */
router.get("/analytics", blog_controller_1.BlogController.getBlogAnalytics);
/* ========================================
   PUBLIC BLOG ROUTES
======================================== */
router.get("/published", blog_controller_1.BlogController.getPublishedBlogs);
router.get("/category/:category", blog_controller_1.BlogController.getBlogsByCategory);
router.get("/slug/:slug", blog_controller_1.BlogController.getBlogBySlug);
router.get("/search", blog_controller_1.BlogController.searchBlogs);
/* ========================================
   BLOG CRUD
======================================== */
router.post("/", blog_controller_1.BlogController.createBlog);
router.get("/", blog_controller_1.BlogController.getAllBlogs);
router.get("/:id", blog_controller_1.BlogController.getBlogById);
router.put("/:id", blog_controller_1.BlogController.updateBlog);
router.delete("/:id", blog_controller_1.BlogController.deleteBlog);
/* ========================================
   BLOG STATUS
======================================== */
router.patch("/:id/publish", blog_controller_1.BlogController.publishBlog);
router.patch("/:id/unpublish", blog_controller_1.BlogController.unpublishBlog);
/* ========================================
   BLOG TRACKING
======================================== */
router.patch("/:id/view", blog_controller_1.BlogController.incrementView);
exports.default = router;
