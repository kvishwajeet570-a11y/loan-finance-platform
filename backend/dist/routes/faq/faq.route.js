"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const faq_controller_1 = require("../../controllers/faq/faq.controller");
const router = (0, express_1.Router)();
/* ========================================
   ANALYTICS
======================================== */
router.get("/analytics", faq_controller_1.getFaqAnalytics);
router.get("/dashboard", faq_controller_1.getFaqDashboard);
router.get("/popular", faq_controller_1.getPopularFaqs);
router.get("/recent", faq_controller_1.getRecentFaqs);
/* ========================================
   EXPORT
======================================== */
router.get("/export/excel", faq_controller_1.exportFaqExcel);
router.get("/export/pdf", faq_controller_1.exportFaqPdf);
/* ========================================
   FAQ FILTERS
======================================== */
router.get("/published", faq_controller_1.getPublishedFaqs);
router.get("/featured", faq_controller_1.getFeaturedFaqs);
router.get("/category/:category", faq_controller_1.getFaqsByCategory);
router.get("/slug/:slug", faq_controller_1.getFaqBySlug);
router.get("/search", faq_controller_1.searchFaqs);
/* ========================================
   FAQ MANAGEMENT
======================================== */
router.post("/", faq_controller_1.createFaq);
router.get("/", faq_controller_1.getAllFaqs);
router.get("/:id", faq_controller_1.getFaqById);
router.put("/:id", faq_controller_1.updateFaq);
router.delete("/:id", faq_controller_1.deleteFaq);
/* ========================================
   FAQ ACTIONS
======================================== */
router.patch("/:id/publish", faq_controller_1.publishFaq);
router.patch("/:id/unpublish", faq_controller_1.unpublishFaq);
router.patch("/:id/view", faq_controller_1.incrementFaqView);
/* ========================================
   BULK ACTIONS
======================================== */
router.post("/bulk-delete", faq_controller_1.bulkDeleteFaqs);
router.post("/bulk-publish", faq_controller_1.bulkPublishFaqs);
exports.default = router;
