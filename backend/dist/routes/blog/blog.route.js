"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const blog_controller_1 = require("../../controllers/blog/blog.controller");
const router = (0, express_1.Router)();
/* ========================================
   ANALYTICS
======================================== */
router.get("/analytics", blog_controller_1.getBlogAnalytics);
/* ========================================
   PUBLIC BLOGS
======================================== */
router.get("/published", blog_controller_1.getPublishedBlogs);
router.get("/featured", blog_controller_1.getFeaturedBlogs);
router.get("/category/:category", blog_controller_1.getBlogsByCategory);
router.get("/slug/:slug", blog_controller_1.getBlogBySlug);
router.get("/search", blog_controller_1.searchBlogs);
/* ========================================
   BLOG CRUD
======================================== */
router.post("/", blog_controller_1.createBlog);
router.get("/", blog_controller_1.getAllBlogs);
router.get("/:id", blog_controller_1.getBlogById);
router.put("/:id", blog_controller_1.updateBlog);
router.delete("/:id", blog_controller_1.deleteBlog);
/* ========================================
   BLOG STATUS
======================================== */
router.patch("/:id/publish", blog_controller_1.publishBlog);
router.patch("/:id/unpublish", blog_controller_1.unpublishBlog);
router.patch("/:id/featured", blog_controller_1.markFeatured);
router.patch("/:id/remove-featured", blog_controller_1.removeFeatured);
/* ========================================
   TRACKING
======================================== */
router.patch("/:id/view", blog_controller_1.incrementView);
exports.default = router;
