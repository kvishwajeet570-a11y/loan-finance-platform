"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const upload_controller_1 = require("../../controllers/upload/upload.controller");
const router = (0, express_1.Router)();
/* =====================================
   DASHBOARD
===================================== */
router.get("/dashboard", upload_controller_1.getUploadDashboard);
router.get("/analytics", upload_controller_1.getUploadAnalytics);
router.get("/storage-analytics", upload_controller_1.getStorageAnalytics);
router.get("/file-type-analytics", upload_controller_1.getFileTypeAnalytics);
/* =====================================
   GENERATE URLS
===================================== */
router.post("/generate-upload-url", upload_controller_1.generateUploadUrl);
router.post("/generate-download-url", upload_controller_1.generateDownloadUrl);
/* =====================================
   UPLOAD FILES
===================================== */
router.post("/single", upload_controller_1.uploadSingleFile);
router.post("/multiple", upload_controller_1.uploadMultipleFiles);
router.post("/profile-image", upload_controller_1.uploadProfileImage);
router.post("/kyc", upload_controller_1.uploadKycDocument);
router.post("/loan", upload_controller_1.uploadLoanDocument);
router.post("/bank", upload_controller_1.uploadBankDocument);
/* =====================================
   ID DOCUMENTS
===================================== */
router.post("/pan", upload_controller_1.uploadPanCard);
router.post("/aadhaar", upload_controller_1.uploadAadhaarCard);
router.post("/passport", upload_controller_1.uploadPassport);
router.post("/driving-license", upload_controller_1.uploadDrivingLicense);
/* =====================================
   BUSINESS DOCUMENTS
===================================== */
router.post("/agreement", upload_controller_1.uploadAgreement);
router.post("/insurance", upload_controller_1.uploadInsuranceDocument);
/* =====================================
   STATUS
===================================== */
router.get("/pending", upload_controller_1.getPendingUploads);
router.get("/approved", upload_controller_1.getApprovedUploads);
router.get("/rejected", upload_controller_1.getRejectedUploads);
router.get("/expired", upload_controller_1.getExpiredUploads);
/* =====================================
   USER FILES
===================================== */
router.get("/user/:userId", upload_controller_1.getUserUploads);
router.get("/customer/:customerId", upload_controller_1.getCustomerUploads);
router.get("/dsa/:dsaId", upload_controller_1.getDsaUploads);
router.get("/partner/:partnerId", upload_controller_1.getPartnerUploads);
/* =====================================
   FILE ACTIONS
===================================== */
router.patch("/:id/verify", upload_controller_1.verifyUploadedDocument);
router.patch("/:id/reject-document", upload_controller_1.rejectUploadedDocument);
router.patch("/:id/approve", upload_controller_1.approveUpload);
router.patch("/:id/reject", upload_controller_1.rejectUpload);
router.patch("/:id/restore", upload_controller_1.restoreFile);
/* =====================================
   FILE ACCESS
===================================== */
router.get("/:id/download", upload_controller_1.downloadFile);
router.get("/:id/preview", upload_controller_1.previewFile);
/* =====================================
   FILE LISTING
===================================== */
router.get("/recent", upload_controller_1.getRecentUploads);
router.get("/large-files", upload_controller_1.getLargeFiles);
router.get("/search", upload_controller_1.searchUploads);
/* =====================================
   EXPORTS
===================================== */
router.get("/export/excel", upload_controller_1.exportUploadsExcel);
router.get("/export/pdf", upload_controller_1.exportUploadsPdf);
/* =====================================
   AUDIT LOGS
===================================== */
router.get("/audit-logs", upload_controller_1.getUploadAuditLogs);
/* =====================================
   CRUD
===================================== */
router.get("/", upload_controller_1.getAllUploads);
router.get("/:id", upload_controller_1.getUploadById);
router.delete("/:id", upload_controller_1.deleteFile);
/* =====================================
   BULK ACTIONS
===================================== */
router.post("/bulk/approve", upload_controller_1.bulkApproveUploads);
router.post("/bulk/reject", upload_controller_1.bulkRejectUploads);
router.post("/bulk/delete", upload_controller_1.bulkDeleteUploads);
exports.default = router;
