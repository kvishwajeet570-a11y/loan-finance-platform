"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cms_controller_1 = require("../../controllers/cms/cms.controller");
const router = (0, express_1.Router)();
/* ========================================
   CMS ANALYTICS
======================================== */
router.get("/analytics", cms_controller_1.getCmsAnalytics);
/* ========================================
   CMS TYPES
======================================== */
router.get("/types", cms_controller_1.getPageTypes);
/* ========================================
   PUBLIC CMS
======================================== */
router.get("/published", cms_controller_1.getPublishedPages);
router.get("/slug/:slug", cms_controller_1.getPageBySlug);
router.get("/search", cms_controller_1.searchPages);
/* ========================================
   CMS CRUD
======================================== */
router.post("/", cms_controller_1.createPage);
router.get("/", cms_controller_1.getAllPages);
router.get("/:id", cms_controller_1.getPageById);
router.put("/:id", cms_controller_1.updatePage);
router.delete("/:id", cms_controller_1.deletePage);
/* ========================================
   PAGE STATUS
======================================== */
router.patch("/:id/publish", cms_controller_1.publishPage);
router.patch("/:id/unpublish", cms_controller_1.unpublishPage);
/* ========================================
   BULK ACTIONS
======================================== */
router.delete("/bulk/delete", cms_controller_1.bulkDelete);
exports.default = router;
