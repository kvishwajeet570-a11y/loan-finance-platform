import { Router } from "express";

import {
  createFaq,
  getFaqById,
  getFaqBySlug,
  getAllFaqs,

  updateFaq,
  deleteFaq,

  publishFaq,
  unpublishFaq,

  getPublishedFaqs,
  getFeaturedFaqs,

  getFaqsByCategory,
  searchFaqs,

  incrementFaqView,

  getFaqAnalytics,
  getFaqDashboard,

  getPopularFaqs,
  getRecentFaqs,

  exportFaqExcel,
  exportFaqPdf,

  bulkDeleteFaqs,
  bulkPublishFaqs,
} from "../../controllers/faq/faq.controller";

const router = Router();

/* ========================================
   ANALYTICS
======================================== */

router.get(
  "/analytics",
  getFaqAnalytics
);

router.get(
  "/dashboard",
  getFaqDashboard
);

router.get(
  "/popular",
  getPopularFaqs
);

router.get(
  "/recent",
  getRecentFaqs
);

/* ========================================
   EXPORT
======================================== */

router.get(
  "/export/excel",
  exportFaqExcel
);

router.get(
  "/export/pdf",
  exportFaqPdf
);

/* ========================================
   FAQ FILTERS
======================================== */

router.get(
  "/published",
  getPublishedFaqs
);

router.get(
  "/featured",
  getFeaturedFaqs
);

router.get(
  "/category/:category",
  getFaqsByCategory
);

router.get(
  "/slug/:slug",
  getFaqBySlug
);

router.get(
  "/search",
  searchFaqs
);

/* ========================================
   FAQ MANAGEMENT
======================================== */

router.post(
  "/",
  createFaq
);

router.get(
  "/",
  getAllFaqs
);

router.get(
  "/:id",
  getFaqById
);

router.put(
  "/:id",
  updateFaq
);

router.delete(
  "/:id",
  deleteFaq
);

/* ========================================
   FAQ ACTIONS
======================================== */

router.patch(
  "/:id/publish",
  publishFaq
);

router.patch(
  "/:id/unpublish",
  unpublishFaq
);

router.patch(
  "/:id/view",
  incrementFaqView
);

/* ========================================
   BULK ACTIONS
======================================== */

router.post(
  "/bulk-delete",
  bulkDeleteFaqs
);

router.post(
  "/bulk-publish",
  bulkPublishFaqs
);

export default router;