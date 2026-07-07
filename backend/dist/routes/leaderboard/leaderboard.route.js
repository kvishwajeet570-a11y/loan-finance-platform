"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const leaderboard_controller_1 = require("../../controllers/leaderboard/leaderboard.controller");
const router = (0, express_1.Router)();
/* ========================================
   DASHBOARD
======================================== */
router.get("/dashboard", leaderboard_controller_1.getLeaderboardDashboard);
router.get("/analytics", leaderboard_controller_1.getLeaderboardAnalytics);
/* ========================================
   MAIN LEADERBOARD
======================================== */
router.get("/", leaderboard_controller_1.getOverallLeaderboard);
router.get("/overall", leaderboard_controller_1.getOverallLeaderboard);
/* ========================================
   USER LEADERBOARDS
======================================== */
router.get("/customers", leaderboard_controller_1.getCustomerLeaderboard);
router.get("/dsa", leaderboard_controller_1.getDsaLeaderboard);
router.get("/partners", leaderboard_controller_1.getPartnerLeaderboard);
/* ========================================
   TOP PERFORMERS
======================================== */
router.get("/top-customers", leaderboard_controller_1.getTopCustomers);
router.get("/top-dsa", leaderboard_controller_1.getTopDsa);
router.get("/top-partners", leaderboard_controller_1.getTopPartners);
/* ========================================
   BUSINESS LEADERBOARDS
======================================== */
router.get("/loans", leaderboard_controller_1.getLoanLeaderboard);
router.get("/commissions", leaderboard_controller_1.getCommissionLeaderboard);
router.get("/referrals", leaderboard_controller_1.getReferralLeaderboard);
router.get("/insurance", leaderboard_controller_1.getInsuranceLeaderboard);
router.get("/investments", leaderboard_controller_1.getInvestmentLeaderboard);
router.get("/fastag", leaderboard_controller_1.getFastagLeaderboard);
/* ========================================
   FINANCIAL LEADERBOARDS
======================================== */
router.get("/revenue", leaderboard_controller_1.getRevenueLeaderboard);
router.get("/wallet", leaderboard_controller_1.getWalletLeaderboard);
/* ========================================
   ACHIEVEMENTS
======================================== */
router.get("/achievements", leaderboard_controller_1.getAchievementLeaderboard);
/* ========================================
   PERIOD WISE
======================================== */
router.get("/daily", leaderboard_controller_1.getDailyLeaderboard);
router.get("/weekly", leaderboard_controller_1.getWeeklyLeaderboard);
router.get("/monthly", leaderboard_controller_1.getMonthlyLeaderboard);
router.get("/yearly", leaderboard_controller_1.getYearlyLeaderboard);
/* ========================================
   EXPORT
======================================== */
router.get("/export/excel", leaderboard_controller_1.exportLeaderboardExcel);
router.get("/export/pdf", leaderboard_controller_1.exportLeaderboardPdf);
exports.default = router;
