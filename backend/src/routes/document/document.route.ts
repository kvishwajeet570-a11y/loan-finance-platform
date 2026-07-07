import { Router } from "express";

import {
  uploadDocument,
  getDocumentById,
  getUserDocuments,
  getAllDocuments,

  updateDocument,
  deleteDocument,

  verifyDocument,
  rejectDocument,

  searchDocuments,

  getPendingDocuments,
  getVerifiedDocuments,
  getRejectedDocuments,

  getDocumentsByType,

  downloadDocument,

  getDocumentAnalytics,
  getDocumentDashboard,

  getRecentDocuments,
  getExpiredDocuments,

  bulkVerifyDocuments,
  bulkRejectDocuments,

  exportDocumentsExcel,
  exportDocumentsPdf,
} from "../../controllers/document/document.controller";

const router = Router();

/* ========================================
   ANALYTICS
======================================== */

router.get(
  "/analytics",
  getDocumentAnalytics
);

router.get(
  "/dashboard",
  getDocumentDashboard
);

/* ========================================
   EXPORT
======================================== */

router.get(
  "/export/excel",
  exportDocumentsExcel
);

router.get(
  "/export/pdf",
  exportDocumentsPdf
);

/* ========================================
   DOCUMENT STATUS
======================================== */

router.get(
  "/pending",
  getPendingDocuments
);

router.get(
  "/verified",
  getVerifiedDocuments
);

router.get(
  "/rejected",
  getRejectedDocuments
);

router.get(
  "/recent",
  getRecentDocuments
);

router.get(
  "/expired",
  getExpiredDocuments
);

/* ========================================
   DOCUMENT TYPES
======================================== */

router.get(
  "/type/:type",
  getDocumentsByType
);

/* ========================================
   DOCUMENT MANAGEMENT
======================================== */

router.post(
  "/upload",
  uploadDocument
);

router.get(
  "/",
  getAllDocuments
);

router.get(
  "/search",
  searchDocuments
);

router.get(
  "/user/:userId",
  getUserDocuments
);

router.get(
  "/:id",
  getDocumentById
);

router.put(
  "/:id",
  updateDocument
);

router.delete(
  "/:id",
  deleteDocument
);

/* ========================================
   DOCUMENT ACTIONS
======================================== */

router.patch(
  "/:id/verify",
  verifyDocument
);

router.patch(
  "/:id/reject",
  rejectDocument
);

router.get(
  "/:id/download",
  downloadDocument
);

/* ========================================
   BULK ACTIONS
======================================== */

router.post(
  "/bulk-verify",
  bulkVerifyDocuments
);

router.post(
  "/bulk-reject",
  bulkRejectDocuments
);

export default router;