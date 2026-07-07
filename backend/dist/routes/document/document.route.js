"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const document_controller_1 = require("../../controllers/document/document.controller");
const router = (0, express_1.Router)();
/* ========================================
   ANALYTICS
======================================== */
router.get("/analytics", document_controller_1.getDocumentAnalytics);
router.get("/dashboard", document_controller_1.getDocumentDashboard);
/* ========================================
   EXPORT
======================================== */
router.get("/export/excel", document_controller_1.exportDocumentsExcel);
router.get("/export/pdf", document_controller_1.exportDocumentsPdf);
/* ========================================
   DOCUMENT STATUS
======================================== */
router.get("/pending", document_controller_1.getPendingDocuments);
router.get("/verified", document_controller_1.getVerifiedDocuments);
router.get("/rejected", document_controller_1.getRejectedDocuments);
router.get("/recent", document_controller_1.getRecentDocuments);
router.get("/expired", document_controller_1.getExpiredDocuments);
/* ========================================
   DOCUMENT TYPES
======================================== */
router.get("/type/:type", document_controller_1.getDocumentsByType);
/* ========================================
   DOCUMENT MANAGEMENT
======================================== */
router.post("/upload", document_controller_1.uploadDocument);
router.get("/", document_controller_1.getAllDocuments);
router.get("/search", document_controller_1.searchDocuments);
router.get("/user/:userId", document_controller_1.getUserDocuments);
router.get("/:id", document_controller_1.getDocumentById);
router.put("/:id", document_controller_1.updateDocument);
router.delete("/:id", document_controller_1.deleteDocument);
/* ========================================
   DOCUMENT ACTIONS
======================================== */
router.patch("/:id/verify", document_controller_1.verifyDocument);
router.patch("/:id/reject", document_controller_1.rejectDocument);
router.get("/:id/download", document_controller_1.downloadDocument);
/* ========================================
   BULK ACTIONS
======================================== */
router.post("/bulk-verify", document_controller_1.bulkVerifyDocuments);
router.post("/bulk-reject", document_controller_1.bulkRejectDocuments);
exports.default = router;
