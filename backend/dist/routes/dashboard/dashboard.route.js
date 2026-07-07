"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboard_controller_1 = require("../../controllers/dashboard/dashboard.controller");
const router = (0, express_1.Router)();
/* ========================================
   MAIN DASHBOARD
======================================== */
router.get("/", dashboard_controller_1.getDashboardOverview);
router.get("/overview", dashboard_controller_1.getDashboardOverview);
/* ========================================
   ROLE DASHBOARD
======================================== */
router.get("/admin", dashboard_controller_1.getAdminDashboard);
router.get("/super-admin", dashboard_controller_1.getSuperAdminDashboard);
router.get("/customer", dashboard_controller_1.getCustomerDashboard);
router.get("/dsa", dashboard_controller_1.getDsaDashboard);
router.get("/partner", dashboard_controller_1.getPartnerDashboard);
/* ========================================
   MODULE DASHBOARD
======================================== */
router.get("/loan", dashboard_controller_1.getLoanDashboard);
router.get("/commission", dashboard_controller_1.getCommissionDashboard);
router.get("/wallet", dashboard_controller_1.getWalletDashboard);
router.get("/revenue", dashboard_controller_1.getRevenueDashboard);
router.get("/analytics", dashboard_controller_1.getAnalyticsDashboard);
router.get("/leaderboard", dashboard_controller_1.getLeaderboardDashboard);
/* ========================================
   RECENT DATA
======================================== */
router.get("/recent-activities", dashboard_controller_1.getRecentActivities);
router.get("/recent-loans", dashboard_controller_1.getRecentLoans);
router.get("/recent-users", dashboard_controller_1.getRecentUsers);
router.get("/recent-transactions", dashboard_controller_1.getRecentTransactions);
/* ========================================
   PENDING DATA
======================================== */
router.get("/pending-approvals", dashboard_controller_1.getPendingApprovals);
router.get("/pending-kyc", dashboard_controller_1.getPendingKyc);
router.get("/pending-loans", dashboard_controller_1.getPendingLoans);
/* ========================================
   TOP PERFORMERS
======================================== */
router.get("/top-customers", dashboard_controller_1.getTopCustomers);
router.get("/top-dsa", dashboard_controller_1.getTopDsa);
router.get("/top-partners", dashboard_controller_1.getTopPartners);
/* ========================================
   STATS
======================================== */
router.get("/today-stats", dashboard_controller_1.getTodayStats);
router.get("/monthly-stats", dashboard_controller_1.getMonthlyStats);
/* ========================================
   NOTIFICATIONS
======================================== */
router.get("/notifications", dashboard_controller_1.getNotifications);
/* ========================================
   SYSTEM
======================================== */
router.get("/system-health", dashboard_controller_1.getSystemHealth);
exports.default = router;
