import { Router } from "express";

import {
  createBlog,
  getBlogById,
  getBlogBySlug,
  getAllBlogs,
  getPublishedBlogs,
  getFeaturedBlogs,
  getBlogsByCategory,
  searchBlogs,
  updateBlog,
  publishBlog,
  unpublishBlog,
  markFeatured,
  removeFeatured,
  incrementView,
  deleteBlog,
  getBlogAnalytics,
} from "../../controllers/blog/blog.controller";

const router = Router();

/* ========================================
   ANALYTICS
======================================== */

router.get("/analytics", getBlogAnalytics);

/* ========================================
   PUBLIC BLOGS
======================================== */

router.get("/published", getPublishedBlogs);

router.get("/featured", getFeaturedBlogs);

router.get("/category/:category", getBlogsByCategory);

router.get("/slug/:slug", getBlogBySlug);

router.get("/search", searchBlogs);

/* ========================================
   BLOG CRUD
======================================== */

router.post("/", createBlog);

router.get("/", getAllBlogs);

router.get("/:id", getBlogById);

router.put("/:id", updateBlog);

router.delete("/:id", deleteBlog);

/* ========================================
   BLOG STATUS
======================================== */

router.patch("/:id/publish", publishBlog);

router.patch("/:id/unpublish", unpublishBlog);

router.patch("/:id/featured", markFeatured);

router.patch("/:id/remove-featured", removeFeatured);

/* ========================================
   TRACKING
======================================== */

router.patch("/:id/view", incrementView);

export default router;