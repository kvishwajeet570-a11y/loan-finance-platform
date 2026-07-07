"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const kyc_controller_1 = require("../../controllers/kyc/kyc.controller");
const router = (0, express_1.Router)();
/* ========================================
   ANALYTICS
======================================== */
router.get("/analytics", kyc_controller_1.getKycAnalytics);
router.get("/dashboard", kyc_controller_1.getKycDashboard);
/* ========================================
   EXPORT
======================================== */
router.get("/export/excel", kyc_controller_1.exportKycExcel);
router.get("/export/pdf", kyc_controller_1.exportKycPdf);
/* ========================================
   STATUS
======================================== */
router.get("/pending", kyc_controller_1.getPendingKycs);
router.get("/approved", kyc_controller_1.getApprovedKycs);
router.get("/rejected", kyc_controller_1.getRejectedKycs);
router.get("/under-review", kyc_controller_1.getUnderReviewKycs);
router.get("/recent", kyc_controller_1.getRecentKycs);
router.get("/expiring", kyc_controller_1.getExpiringKycs);
/* ========================================
   KYC MANAGEMENT
======================================== */
router.post("/", kyc_controller_1.createKyc);
router.post("/submit", kyc_controller_1.submitKyc);
router.get("/", kyc_controller_1.getAllKycs);
router.get("/search", kyc_controller_1.searchKyc);
router.get("/user/:userId", kyc_controller_1.getUserKyc);
router.get("/:id", kyc_controller_1.getKycById);
router.put("/:id", kyc_controller_1.updateKyc);
router.delete("/:id", kyc_controller_1.deleteKyc);
/* ========================================
   VERIFICATION
======================================== */
router.patch("/:id/approve", kyc_controller_1.approveKyc);
router.patch("/:id/reject", kyc_controller_1.rejectKyc);
router.patch("/:id/verify-aadhaar", kyc_controller_1.verifyAadhaar);
router.patch("/:id/verify-pan", kyc_controller_1.verifyPan);
router.patch("/:id/verify-bank", kyc_controller_1.verifyBank);
/* ========================================
   BULK ACTIONS
======================================== */
router.post("/bulk-approve", kyc_controller_1.bulkApproveKycs);
router.post("/bulk-reject", kyc_controller_1.bulkRejectKycs);
exports.default = router;
