"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const referral_controller_1 = require("../../controllers/referral/referral.controller");
const router = (0, express_1.Router)();
/* ========================================
   DASHBOARD
======================================== */
router.get("/dashboard", referral_controller_1.getReferralDashboard);
router.get("/analytics", referral_controller_1.getReferralAnalytics);
router.get("/statistics", referral_controller_1.getReferralStatistics);
router.get("/live", referral_controller_1.getLiveReferrals);
/* ========================================
   REPORTS
======================================== */
router.get("/reports/conversion", referral_controller_1.getConversionReport);
router.get("/reports/revenue", referral_controller_1.getRevenueReport);
router.get("/reports/performance", referral_controller_1.getPerformanceReport);
/* ========================================
   LEADERBOARD
======================================== */
router.get("/leaderboard", referral_controller_1.getReferralLeaderboard);
router.get("/top-referrers", referral_controller_1.getTopReferrers);
router.get("/top-earners", referral_controller_1.getTopEarners);
router.get("/top-converters", referral_controller_1.getTopConverters);
/* ========================================
   TIME BASED
======================================== */
router.get("/today", referral_controller_1.getTodayReferrals);
router.get("/weekly", referral_controller_1.getWeeklyReferrals);
router.get("/monthly", referral_controller_1.getMonthlyReferrals);
router.get("/yearly", referral_controller_1.getYearlyReferrals);
/* ========================================
   REFERRAL TYPES
======================================== */
router.get("/loan", referral_controller_1.getLoanReferrals);
router.get("/insurance", referral_controller_1.getInsuranceReferrals);
router.get("/investment", referral_controller_1.getInvestmentReferrals);
router.get("/fastag", referral_controller_1.getFastagReferrals);
router.get("/credit-card", referral_controller_1.getCreditCardReferrals);
/* ========================================
   STATUS
======================================== */
router.get("/pending", referral_controller_1.getPendingReferrals);
router.get("/approved", referral_controller_1.getApprovedReferrals);
router.get("/rejected", referral_controller_1.getRejectedReferrals);
router.get("/rewarded", referral_controller_1.getRewardedReferrals);
router.get("/paid", referral_controller_1.getPaidReferrals);
router.get("/expired", referral_controller_1.getExpiredReferrals);
/* ========================================
   REFERRAL CODE
======================================== */
router.post("/generate-code", referral_controller_1.generateReferralCode);
router.post("/validate-code", referral_controller_1.validateReferralCode);
router.post("/apply-code", referral_controller_1.applyReferralCode);
/* ========================================
   USER REFERRALS
======================================== */
router.get("/user/:userId", referral_controller_1.getUserReferrals);
router.get("/customer/:customerId", referral_controller_1.getCustomerReferrals);
router.get("/dsa/:dsaId", referral_controller_1.getDsaReferrals);
router.get("/partner/:partnerId", referral_controller_1.getPartnerReferrals);
/* ========================================
   EARNINGS
======================================== */
router.get("/earnings/:userId", referral_controller_1.getReferralEarnings);
router.get("/rewards/:userId", referral_controller_1.getReferralRewards);
router.get("/commissions/:userId", referral_controller_1.getReferralCommissions);
/* ========================================
   FRAUD MANAGEMENT
======================================== */
router.get("/fraud-check", referral_controller_1.detectFraudReferrals);
router.get("/duplicate-check", referral_controller_1.detectDuplicateReferrals);
router.get("/audit-logs", referral_controller_1.getReferralAuditLogs);
/* ========================================
   EXPORTS
======================================== */
router.get("/export/excel", referral_controller_1.exportReferralExcel);
router.get("/export/pdf", referral_controller_1.exportReferralPdf);
/* ========================================
   SEARCH
======================================== */
router.get("/search", referral_controller_1.searchReferrals);
/* ========================================
   CRUD
======================================== */
router.post("/", referral_controller_1.createReferral);
router.get("/", referral_controller_1.getAllReferrals);
router.get("/:id", referral_controller_1.getReferralById);
router.put("/:id", referral_controller_1.updateReferral);
router.delete("/:id", referral_controller_1.deleteReferral);
/* ========================================
   ACTIONS
======================================== */
router.patch("/:id/approve", referral_controller_1.approveReferral);
router.patch("/:id/reject", referral_controller_1.rejectReferral);
router.patch("/:id/reward", referral_controller_1.rewardReferral);
router.patch("/:id/mark-paid", referral_controller_1.markReferralPaid);
/* ========================================
   BULK ACTIONS
======================================== */
router.post("/bulk/approve", referral_controller_1.bulkApproveReferrals);
router.post("/bulk/reject", referral_controller_1.bulkRejectReferrals);
router.post("/bulk/reward", referral_controller_1.bulkRewardReferrals);
router.post("/bulk/delete", referral_controller_1.bulkDeleteReferrals);
exports.default = router;
