import { Router } from "express";
import { BlogController } from "../../controllers/blog/blog.controller";

const router = Router();

/* ========================================
   BLOG ANALYTICS
======================================== */

router.get("/analytics", BlogController.getBlogAnalytics);

/* ========================================
   PUBLIC BLOG ROUTES
======================================== */

router.get("/published", BlogController.getPublishedBlogs);

router.get("/category/:category", BlogController.getBlogsByCategory);

router.get("/slug/:slug", BlogController.getBlogBySlug);

router.get("/search", BlogController.searchBlogs);

/* ========================================
   BLOG CRUD
======================================== */

router.post("/", BlogController.createBlog);

router.get("/", BlogController.getAllBlogs);

router.get("/:id", BlogController.getBlogById);

router.put("/:id", BlogController.updateBlog);

router.delete("/:id", BlogController.deleteBlog);

/* ========================================
   BLOG STATUS
======================================== */

router.patch("/:id/publish", BlogController.publishBlog);

router.patch("/:id/unpublish", BlogController.unpublishBlog);

/* ========================================
   BLOG TRACKING
======================================== */

router.patch("/:id/view", BlogController.incrementView);

export default router;