import upload from "../../config/upload/multer";
import { Router } from "express";

import {
  uploadSingleFile,
  uploadMultipleFiles,

  uploadProfileImage,
  uploadKycDocument,
  uploadLoanDocument,
  uploadBankDocument,

  uploadPanCard,
  uploadAadhaarCard,
  uploadPassport,
  uploadDrivingLicense,

  uploadAgreement,
  uploadInsuranceDocument,

  getAllUploads,
  getUploadById,

  getUserUploads,
  getCustomerUploads,
  getDsaUploads,
  getPartnerUploads,

  verifyUploadedDocument,
  rejectUploadedDocument,

  approveUpload,
  rejectUpload,

  downloadFile,
  previewFile,

  deleteFile,
  restoreFile,

  getPendingUploads,
  getApprovedUploads,
  getRejectedUploads,
  getExpiredUploads,

  getUploadDashboard,
  getUploadAnalytics,

  getStorageAnalytics,
  getFileTypeAnalytics,

  searchUploads,

  exportUploadsExcel,
  exportUploadsPdf,

  getRecentUploads,
  getLargeFiles,

  bulkApproveUploads,
  bulkRejectUploads,
  bulkDeleteUploads,

  getUploadAuditLogs,

  generateUploadUrl,
  generateDownloadUrl,
} from "../../controllers/upload/upload.controller";

const router = Router();

/* =====================================
   DASHBOARD
===================================== */

router.get(
  "/dashboard",
  getUploadDashboard
);

router.get(
  "/analytics",
  getUploadAnalytics
);

router.get(
  "/storage-analytics",
  getStorageAnalytics
);

router.get(
  "/file-type-analytics",
  getFileTypeAnalytics
);

/* =====================================
   GENERATE URLS
===================================== */

router.post(
  "/generate-upload-url",
  generateUploadUrl
);

router.post(
  "/generate-download-url",
  generateDownloadUrl
);

/* =====================================
   UPLOAD FILES
===================================== */

router.post(
  "/single",
  uploadSingleFile
);

router.post(
  "/multiple",
  uploadMultipleFiles
);

router.post(
  "/profile-image",
  uploadProfileImage
);

router.post("/kyc", upload.single("file"), uploadKycDocument);

router.post(
  "/loan",
  upload.single("file"),
  uploadLoanDocument
);

router.post(
  "/bank",
  uploadBankDocument
);

/* =====================================
   ID DOCUMENTS
===================================== */

router.post("/pan", upload.single("file"), uploadPanCard);

router.post("/aadhaar", upload.single("file"), uploadAadhaarCard);

router.post(
  "/passport",
  uploadPassport
);

router.post(
  "/driving-license",
  uploadDrivingLicense
);

/* =====================================
   BUSINESS DOCUMENTS
===================================== */

router.post(
  "/agreement",
  uploadAgreement
);

router.post(
  "/insurance",
  uploadInsuranceDocument
);

/* =====================================
   STATUS
===================================== */

router.get(
  "/pending",
  getPendingUploads
);

router.get(
  "/approved",
  getApprovedUploads
);

router.get(
  "/rejected",
  getRejectedUploads
);

router.get(
  "/expired",
  getExpiredUploads
);

/* =====================================
   USER FILES
===================================== */

router.get(
  "/user/:userId",
  getUserUploads
);

router.get(
  "/customer/:customerId",
  getCustomerUploads
);

router.get(
  "/dsa/:dsaId",
  getDsaUploads
);

router.get(
  "/partner/:partnerId",
  getPartnerUploads
);

/* =====================================
   FILE ACTIONS
===================================== */

router.patch(
  "/:id/verify",
  verifyUploadedDocument
);

router.patch(
  "/:id/reject-document",
  rejectUploadedDocument
);

router.patch(
  "/:id/approve",
  approveUpload
);

router.patch(
  "/:id/reject",
  rejectUpload
);

router.patch(
  "/:id/restore",
  restoreFile
);

/* =====================================
   FILE ACCESS
===================================== */

router.get(
  "/:id/download",
  downloadFile
);

router.get(
  "/:id/preview",
  previewFile
);

/* =====================================
   FILE LISTING
===================================== */

router.get(
  "/recent",
  getRecentUploads
);

router.get(
  "/large-files",
  getLargeFiles
);

router.get(
  "/search",
  searchUploads
);

/* =====================================
   EXPORTS
===================================== */

router.get(
  "/export/excel",
  exportUploadsExcel
);

router.get(
  "/export/pdf",
  exportUploadsPdf
);

/* =====================================
   AUDIT LOGS
===================================== */

router.get(
  "/audit-logs",
  getUploadAuditLogs
);

/* =====================================
   CRUD
===================================== */

router.get(
  "/",
  getAllUploads
);

router.get(
  "/:id",
  getUploadById
);

router.delete(
  "/:id",
  deleteFile
);

/* =====================================
   BULK ACTIONS
===================================== */

router.post(
  "/bulk/approve",
  bulkApproveUploads
);

router.post(
  "/bulk/reject",
  bulkRejectUploads
);

router.post(
  "/bulk/delete",
  bulkDeleteUploads
);

export default router;



