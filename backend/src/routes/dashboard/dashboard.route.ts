import { Router } from "express";

import {
  getDashboardOverview,

  getAdminDashboard,
  getSuperAdminDashboard,

  getCustomerDashboard,
  getDsaDashboard,
  getPartnerDashboard,

  getLoanDashboard,
  getCommissionDashboard,
  getWalletDashboard,
  getRevenueDashboard,

  getAnalyticsDashboard,
  getLeaderboardDashboard,

  getRecentActivities,
  getRecentLoans,
  getRecentUsers,
  getRecentTransactions,

  getNotifications,

  getMonthlyStats,
  getTodayStats,

  getTopCustomers,
  getTopDsa,
  getTopPartners,

  getPendingApprovals,
  getPendingKyc,
  getPendingLoans,

  getSystemHealth,
} from "../../controllers/dashboard/dashboard.controller";

const router = Router();

/* ========================================
   MAIN DASHBOARD
======================================== */

router.get(
  "/",
  getDashboardOverview
);

router.get(
  "/overview",
  getDashboardOverview
);

/* ========================================
   ROLE DASHBOARD
======================================== */

router.get(
  "/admin",
  getAdminDashboard
);

router.get(
  "/super-admin",
  getSuperAdminDashboard
);

router.get(
  "/customer",
  getCustomerDashboard
);

router.get(
  "/dsa",
  getDsaDashboard
);

router.get(
  "/partner",
  getPartnerDashboard
);

/* ========================================
   MODULE DASHBOARD
======================================== */

router.get(
  "/loan",
  getLoanDashboard
);

router.get(
  "/commission",
  getCommissionDashboard
);

router.get(
  "/wallet",
  getWalletDashboard
);

router.get(
  "/revenue",
  getRevenueDashboard
);

router.get(
  "/analytics",
  getAnalyticsDashboard
);

router.get(
  "/leaderboard",
  getLeaderboardDashboard
);

/* ========================================
   RECENT DATA
======================================== */

router.get(
  "/recent-activities",
  getRecentActivities
);

router.get(
  "/recent-loans",
  getRecentLoans
);

router.get(
  "/recent-users",
  getRecentUsers
);

router.get(
  "/recent-transactions",
  getRecentTransactions
);

/* ========================================
   PENDING DATA
======================================== */

router.get(
  "/pending-approvals",
  getPendingApprovals
);

router.get(
  "/pending-kyc",
  getPendingKyc
);

router.get(
  "/pending-loans",
  getPendingLoans
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
   STATS
======================================== */

router.get(
  "/today-stats",
  getTodayStats
);

router.get(
  "/monthly-stats",
  getMonthlyStats
);

/* ========================================
   NOTIFICATIONS
======================================== */

router.get(
  "/notifications",
  getNotifications
);

/* ========================================
   SYSTEM
======================================== */

router.get(
  "/system-health",
  getSystemHealth
);

export default router;