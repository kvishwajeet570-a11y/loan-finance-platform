import { Router } from "express";

import {
  createReferral,
  getReferralById,
  getAllReferrals,
  updateReferral,
  deleteReferral,

  generateReferralCode,
  validateReferralCode,
  applyReferralCode,

  approveReferral,
  rejectReferral,
  rewardReferral,
  markReferralPaid,

  getReferralDashboard,
  getReferralAnalytics,

  getUserReferrals,
  getCustomerReferrals,
  getDsaReferrals,
  getPartnerReferrals,

  getReferralEarnings,
  getReferralRewards,
  getReferralCommissions,

  getPendingReferrals,
  getApprovedReferrals,
  getRejectedReferrals,
  getRewardedReferrals,
  getPaidReferrals,
  getExpiredReferrals,

  getTopReferrers,
  getTopEarners,
  getTopConverters,

  getTodayReferrals,
  getWeeklyReferrals,
  getMonthlyReferrals,
  getYearlyReferrals,

  getLoanReferrals,
  getInsuranceReferrals,
  getInvestmentReferrals,
  getFastagReferrals,
  getCreditCardReferrals,

  getReferralLeaderboard,

  searchReferrals,
  getReferralAuditLogs,

  detectFraudReferrals,
  detectDuplicateReferrals,

  exportReferralExcel,
  exportReferralPdf,

  bulkApproveReferrals,
  bulkRejectReferrals,
  bulkRewardReferrals,
  bulkDeleteReferrals,

  getConversionReport,
  getRevenueReport,
  getPerformanceReport,

  getLiveReferrals,
  getReferralStatistics,

} from "../../controllers/referral/referral.controller";

const router = Router();

/* ========================================
   DASHBOARD
======================================== */

router.get("/dashboard", getReferralDashboard);
router.get("/analytics", getReferralAnalytics);
router.get("/statistics", getReferralStatistics);
router.get("/live", getLiveReferrals);

/* ========================================
   REPORTS
======================================== */

router.get("/reports/conversion", getConversionReport);
router.get("/reports/revenue", getRevenueReport);
router.get("/reports/performance", getPerformanceReport);

/* ========================================
   LEADERBOARD
======================================== */

router.get("/leaderboard", getReferralLeaderboard);
router.get("/top-referrers", getTopReferrers);
router.get("/top-earners", getTopEarners);
router.get("/top-converters", getTopConverters);

/* ========================================
   TIME BASED
======================================== */

router.get("/today", getTodayReferrals);
router.get("/weekly", getWeeklyReferrals);
router.get("/monthly", getMonthlyReferrals);
router.get("/yearly", getYearlyReferrals);

/* ========================================
   REFERRAL TYPES
======================================== */

router.get("/loan", getLoanReferrals);
router.get("/insurance", getInsuranceReferrals);
router.get("/investment", getInvestmentReferrals);
router.get("/fastag", getFastagReferrals);
router.get("/credit-card", getCreditCardReferrals);

/* ========================================
   STATUS
======================================== */

router.get("/pending", getPendingReferrals);
router.get("/approved", getApprovedReferrals);
router.get("/rejected", getRejectedReferrals);
router.get("/rewarded", getRewardedReferrals);
router.get("/paid", getPaidReferrals);
router.get("/expired", getExpiredReferrals);

/* ========================================
   REFERRAL CODE
======================================== */

router.post("/generate-code", generateReferralCode);
router.post("/validate-code", validateReferralCode);
router.post("/apply-code", applyReferralCode);

/* ========================================
   USER REFERRALS
======================================== */

router.get("/user/:userId", getUserReferrals);
router.get("/customer/:customerId", getCustomerReferrals);
router.get("/dsa/:dsaId", getDsaReferrals);
router.get("/partner/:partnerId", getPartnerReferrals);

/* ========================================
   EARNINGS
======================================== */

router.get("/earnings/:userId", getReferralEarnings);
router.get("/rewards/:userId", getReferralRewards);
router.get("/commissions/:userId", getReferralCommissions);

/* ========================================
   FRAUD MANAGEMENT
======================================== */

router.get("/fraud-check", detectFraudReferrals);
router.get("/duplicate-check", detectDuplicateReferrals);
router.get("/audit-logs", getReferralAuditLogs);

/* ========================================
   EXPORTS
======================================== */

router.get("/export/excel", exportReferralExcel);
router.get("/export/pdf", exportReferralPdf);

/* ========================================
   SEARCH
======================================== */

router.get("/search", searchReferrals);

/* ========================================
   CRUD
======================================== */

router.post("/", createReferral);

router.get("/", getAllReferrals);

router.get("/:id", getReferralById);

router.put("/:id", updateReferral);

router.delete("/:id", deleteReferral);

/* ========================================
   ACTIONS
======================================== */

router.patch("/:id/approve", approveReferral);

router.patch("/:id/reject", rejectReferral);

router.patch("/:id/reward", rewardReferral);

router.patch("/:id/mark-paid", markReferralPaid);

/* ========================================
   BULK ACTIONS
======================================== */

router.post("/bulk/approve", bulkApproveReferrals);

router.post("/bulk/reject", bulkRejectReferrals);

router.post("/bulk/reward", bulkRewardReferrals);

router.post("/bulk/delete", bulkDeleteReferrals);

export default router;