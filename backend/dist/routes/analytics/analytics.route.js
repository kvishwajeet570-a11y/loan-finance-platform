"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const analytics_controller_1 = require("../../controllers/analytics/analytics.controller");
const router = (0, express_1.Router)();
/* =========================================
   OVERVIEW
========================================= */
router.get("/overview", analytics_controller_1.getOverviewAnalytics);
/* =========================================
   LOAN ANALYTICS
========================================= */
router.get("/loan-amount", analytics_controller_1.getLoanAmountAnalytics);
router.get("/loan-status", analytics_controller_1.getLoanStatusAnalytics);
router.get("/loan-type", analytics_controller_1.getLoanTypeAnalytics);
router.get("/monthly-loans", analytics_controller_1.getMonthlyLoanAnalytics);
/* =========================================
   USER ANALYTICS
========================================= */
router.get("/user-roles", analytics_controller_1.getUserRoleAnalytics);
router.get("/monthly-users", analytics_controller_1.getMonthlyUserAnalytics);
router.get("/top-customers", analytics_controller_1.getTopCustomers);
/* =========================================
   ACTIVITIES
========================================= */
router.get("/recent-activities", analytics_controller_1.getRecentActivities);
/* =========================================
   DASHBOARD
========================================= */
router.get("/dashboard", analytics_controller_1.getDashboardAnalytics);
exports.default = router;
