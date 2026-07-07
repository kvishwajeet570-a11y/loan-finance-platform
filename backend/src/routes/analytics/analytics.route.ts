import { Router } from "express";

import {
  getOverviewAnalytics,
  getLoanAmountAnalytics,
  getLoanStatusAnalytics,
  getLoanTypeAnalytics,
  getUserRoleAnalytics,
  getMonthlyLoanAnalytics,
  getMonthlyUserAnalytics,
  getTopCustomers,
  getRecentActivities,
  getDashboardAnalytics,
} from "../../controllers/analytics/analytics.controller";

const router = Router();

/* =========================================
   OVERVIEW
========================================= */

router.get(
  "/overview",
  getOverviewAnalytics
);

/* =========================================
   LOAN ANALYTICS
========================================= */

router.get(
  "/loan-amount",
  getLoanAmountAnalytics
);

router.get(
  "/loan-status",
  getLoanStatusAnalytics
);

router.get(
  "/loan-type",
  getLoanTypeAnalytics
);

router.get(
  "/monthly-loans",
  getMonthlyLoanAnalytics
);

/* =========================================
   USER ANALYTICS
========================================= */

router.get(
  "/user-roles",
  getUserRoleAnalytics
);

router.get(
  "/monthly-users",
  getMonthlyUserAnalytics
);

router.get(
  "/top-customers",
  getTopCustomers
);

/* =========================================
   ACTIVITIES
========================================= */

router.get(
  "/recent-activities",
  getRecentActivities
);

/* =========================================
   DASHBOARD
========================================= */

router.get(
  "/dashboard",
  getDashboardAnalytics
);

export default router;