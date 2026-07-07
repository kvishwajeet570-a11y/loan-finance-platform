import { Router } from "express";

import {
  getOverallLeaderboard,

  getCustomerLeaderboard,
  getDsaLeaderboard,
  getPartnerLeaderboard,

  getLoanLeaderboard,
  getCommissionLeaderboard,
  getReferralLeaderboard,

  getInsuranceLeaderboard,
  getInvestmentLeaderboard,
  getFastagLeaderboard,

  getTopCustomers,
  getTopDsa,
  getTopPartners,

  getDailyLeaderboard,
  getWeeklyLeaderboard,
  getMonthlyLeaderboard,
  getYearlyLeaderboard,

  getRevenueLeaderboard,
  getWalletLeaderboard,

  getAchievementLeaderboard,

  getLeaderboardAnalytics,
  getLeaderboardDashboard,

  exportLeaderboardExcel,
  exportLeaderboardPdf,
} from "../../controllers/leaderboard/leaderboard.controller";

const router = Router();

/* ========================================
   DASHBOARD
======================================== */

router.get(
  "/dashboard",
  getLeaderboardDashboard
);

router.get(
  "/analytics",
  getLeaderboardAnalytics
);

/* ========================================
   MAIN LEADERBOARD
======================================== */

router.get(
  "/",
  getOverallLeaderboard
);

router.get(
  "/overall",
  getOverallLeaderboard
);

/* ========================================
   USER LEADERBOARDS
======================================== */

router.get(
  "/customers",
  getCustomerLeaderboard
);

router.get(
  "/dsa",
  getDsaLeaderboard
);

router.get(
  "/partners",
  getPartnerLeaderboard
);

/* ========================================
   TOP PERFORMERS
======================================== */

router.get(
  "/top-customers",
  getTopCustomers
);

router.get(
  "/top-dsa",
  getTopDsa
);

router.get(
  "/top-partners",
  getTopPartners
);

/* ========================================
   BUSINESS LEADERBOARDS
======================================== */

router.get(
  "/loans",
  getLoanLeaderboard
);

router.get(
  "/commissions",
  getCommissionLeaderboard
);

router.get(
  "/referrals",
  getReferralLeaderboard
);

router.get(
  "/insurance",
  getInsuranceLeaderboard
);

router.get(
  "/investments",
  getInvestmentLeaderboard
);

router.get(
  "/fastag",
  getFastagLeaderboard
);

/* ========================================
   FINANCIAL LEADERBOARDS
======================================== */

router.get(
  "/revenue",
  getRevenueLeaderboard
);

router.get(
  "/wallet",
  getWalletLeaderboard
);

/* ========================================
   ACHIEVEMENTS
======================================== */

router.get(
  "/achievements",
  getAchievementLeaderboard
);

/* ========================================
   PERIOD WISE
======================================== */

router.get(
  "/daily",
  getDailyLeaderboard
);

router.get(
  "/weekly",
  getWeeklyLeaderboard
);

router.get(
  "/monthly",
  getMonthlyLeaderboard
);

router.get(
  "/yearly",
  getYearlyLeaderboard
);

/* ========================================
   EXPORT
======================================== */

router.get(
  "/export/excel",
  exportLeaderboardExcel
);

router.get(
  "/export/pdf",
  exportLeaderboardPdf
);

export default router;