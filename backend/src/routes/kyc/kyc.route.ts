import { Router } from "express";

import {
  createKyc,
  getKycById,
  getAllKycs,

  updateKyc,
  deleteKyc,

  submitKyc,

  approveKyc,
  rejectKyc,

  verifyAadhaar,
  verifyPan,
  verifyBank,

  getUserKyc,

  searchKyc,

  getPendingKycs,
  getApprovedKycs,
  getRejectedKycs,
  getUnderReviewKycs,

  getKycAnalytics,
  getKycDashboard,

  getRecentKycs,
  getExpiringKycs,

  exportKycExcel,
  exportKycPdf,

  bulkApproveKycs,
  bulkRejectKycs,
} from "../../controllers/kyc/kyc.controller";

const router = Router();

/* ========================================
   ANALYTICS
======================================== */

router.get(
  "/analytics",
  getKycAnalytics
);

router.get(
  "/dashboard",
  getKycDashboard
);

/* ========================================
   EXPORT
======================================== */

router.get(
  "/export/excel",
  exportKycExcel
);

router.get(
  "/export/pdf",
  exportKycPdf
);

/* ========================================
   STATUS
======================================== */

router.get(
  "/pending",
  getPendingKycs
);

router.get(
  "/approved",
  getApprovedKycs
);

router.get(
  "/rejected",
  getRejectedKycs
);

router.get(
  "/under-review",
  getUnderReviewKycs
);

router.get(
  "/recent",
  getRecentKycs
);

router.get(
  "/expiring",
  getExpiringKycs
);

/* ========================================
   KYC MANAGEMENT
======================================== */

router.post(
  "/",
  createKyc
);

router.post(
  "/submit",
  submitKyc
);

router.get(
  "/",
  getAllKycs
);

router.get(
  "/search",
  searchKyc
);

router.get(
  "/user/:userId",
  getUserKyc
);

router.get(
  "/:id",
  getKycById
);

router.put(
  "/:id",
  updateKyc
);

router.delete(
  "/:id",
  deleteKyc
);

/* ========================================
   VERIFICATION
======================================== */

router.patch(
  "/:id/approve",
  approveKyc
);

router.patch(
  "/:id/reject",
  rejectKyc
);

router.patch(
  "/:id/verify-aadhaar",
  verifyAadhaar
);

router.patch(
  "/:id/verify-pan",
  verifyPan
);

router.patch(
  "/:id/verify-bank",
  verifyBank
);

/* ========================================
   BULK ACTIONS
======================================== */

router.post(
  "/bulk-approve",
  bulkApproveKycs
);

router.post(
  "/bulk-reject",
  bulkRejectKycs
);

export default router;