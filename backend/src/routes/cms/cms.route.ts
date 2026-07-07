import { Router } from "express";

import {
  createPage,
  getPageById,
  getPageBySlug,
  getAllPages,
  getPublishedPages,
  searchPages,
  updatePage,
  publishPage,
  unpublishPage,
  deletePage,
  getPageTypes,
  getCmsAnalytics,
  bulkDelete,
} from "../../controllers/cms/cms.controller";

const router = Router();

/* ========================================
   CMS ANALYTICS
======================================== */

router.get(
  "/analytics",
  getCmsAnalytics
);

/* ========================================
   CMS TYPES
======================================== */

router.get(
  "/types",
  getPageTypes
);

/* ========================================
   PUBLIC CMS
======================================== */

router.get(
  "/published",
  getPublishedPages
);

router.get(
  "/slug/:slug",
  getPageBySlug
);

router.get(
  "/search",
  searchPages
);

/* ========================================
   CMS CRUD
======================================== */

router.post(
  "/",
  createPage
);

router.get(
  "/",
  getAllPages
);

router.get(
  "/:id",
  getPageById
);

router.put(
  "/:id",
  updatePage
);

router.delete(
  "/:id",
  deletePage
);

/* ========================================
   PAGE STATUS
======================================== */

router.patch(
  "/:id/publish",
  publishPage
);

router.patch(
  "/:id/unpublish",
  unpublishPage
);

/* ========================================
   BULK ACTIONS
======================================== */

router.delete(
  "/bulk/delete",
  bulkDelete
);

export default router;