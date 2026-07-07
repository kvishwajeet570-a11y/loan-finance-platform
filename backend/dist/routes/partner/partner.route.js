"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const partner_controller_1 = require("../../controllers/partner/partner.controller");
const router = (0, express_1.Router)();
/* ========================================
   DASHBOARD & ANALYTICS
======================================== */
router.get("/dashboard", partner_controller_1.getPartnerDashboard);
router.get("/analytics", partner_controller_1.getPartnerAnalytics);
router.get("/top-performers", partner_controller_1.getTopPartners);
router.get("/monthly", partner_controller_1.getMonthlyPartners);
/* ========================================
   EXPORTS
======================================== */
router.get("/export/excel", partner_controller_1.exportPartnersExcel);
router.get("/export/pdf", partner_controller_1.exportPartnersPdf);
/* ========================================
   STATUS
======================================== */
router.get("/pending", partner_controller_1.getPendingPartners);
router.get("/verified", partner_controller_1.getVerifiedPartners);
router.get("/blocked", partner_controller_1.getBlockedPartners);
router.get("/active", partner_controller_1.getActivePartners);
/* ========================================
   PARTNER MANAGEMENT
======================================== */
router.post("/", partner_controller_1.createPartner);
router.get("/", partner_controller_1.getAllPartners);
router.get("/search", partner_controller_1.searchPartners);
router.get("/profile/:partnerId", partner_controller_1.getPartnerProfile);
router.get("/:id", partner_controller_1.getPartnerById);
router.put("/:id", partner_controller_1.updatePartner);
router.delete("/:id", partner_controller_1.deletePartner);
/* ========================================
   VERIFICATION
======================================== */
router.patch("/:id/verify", partner_controller_1.verifyPartner);
router.patch("/:id/reject", partner_controller_1.rejectPartner);
router.patch("/:id/block", partner_controller_1.blockPartner);
router.patch("/:id/unblock", partner_controller_1.unblockPartner);
/* ========================================
   RELATIONS
======================================== */
router.get("/:partnerId/customers", partner_controller_1.getPartnerCustomers);
router.get("/:partnerId/loans", partner_controller_1.getPartnerLoans);
router.get("/:partnerId/commissions", partner_controller_1.getPartnerCommissions);
router.get("/:partnerId/referrals", partner_controller_1.getPartnerReferrals);
router.get("/:partnerId/transactions", partner_controller_1.getPartnerTransactions);
router.get("/:partnerId/wallet", partner_controller_1.getPartnerWallet);
/* ========================================
   BULK ACTIONS
======================================== */
router.post("/bulk-verify", partner_controller_1.bulkVerifyPartners);
router.post("/bulk-block", partner_controller_1.bulkBlockPartners);
exports.default = router;
