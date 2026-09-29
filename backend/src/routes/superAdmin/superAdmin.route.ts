import { Router } from "express";

import authMiddleware from "../../middlewares/AuthMiddleware";
import { rbac } from "../../middlewares/rbac";
import { Role } from "../../middlewares/role";

import {
  getSuperAdminDashboard,

  getSystemAnalytics,
  getBusinessAnalytics,
  getRevenueAnalytics,
  getUserAnalytics,
  getLoanAnalytics,

  getAllAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  blockAdmin,
  unblockAdmin,

  assignRole,
  removeRole,

  getSystemSettings,
  updateSystemSettings,

  getAllUsers,
  blockUser,
  unblockUser,
  deleteUser,

  getAllLoans,
  updateLoanAmount,
  approveLoan,
  rejectLoan,
  disburseLoan,

  getAllDsa,
  verifyDsa,
  blockDsa,

  getAllPartners,
  verifyPartner,
  blockPartner,

  getAllTransactions,
  getAllCommissions,
  getAllReferrals,

  getAuditLogs,
  getSystemLogs,

  getServerHealth,
  getDatabaseHealth,

  backupDatabase,
  restoreDatabase,

  getReports,
  exportExcel,
  exportPdf,

  getRevenueDashboard,
  getCommissionDashboard,

  bulkBlockUsers,
  bulkDeleteUsers,
  bulkApproveLoans,

  getLiveActivities,
  getNotifications,

  searchSystem,
} from "../../controllers/superAdmin/superAdmin.controller";

const router = Router();

/*
==================================================
SUPER ADMIN SECURITY
==================================================
Every route in this router requires:

1. Valid JWT
2. Existing, unblocked user
3. SUPER_ADMIN role
==================================================
*/

router.use(authMiddleware);
router.use(rbac(Role.SUPER_ADMIN));

/* ====================================
   DASHBOARD
==================================== */

router.get(
  "/dashboard",
  getSuperAdminDashboard
);

router.get(
  "/live-activities",
  getLiveActivities
);

router.get(
  "/notifications",
  getNotifications
);

/* ====================================
   ANALYTICS
==================================== */

router.get(
  "/analytics/system",
  getSystemAnalytics
);

router.get(
  "/analytics/business",
  getBusinessAnalytics
);

router.get(
  "/analytics/revenue",
  getRevenueAnalytics
);

router.get(
  "/analytics/users",
  getUserAnalytics
);

router.get(
  "/analytics/loans",
  getLoanAnalytics
);

/* ====================================
   ADMIN MANAGEMENT
==================================== */

router.get(
  "/admins",
  getAllAdmins
);

router.post(
  "/admins",
  createAdmin
);

router.put(
  "/admins/:id",
  updateAdmin
);

router.delete(
  "/admins/:id",
  deleteAdmin
);

router.patch(
  "/admins/:id/block",
  blockAdmin
);

router.patch(
  "/admins/:id/unblock",
  unblockAdmin
);

/* ====================================
   ROLE MANAGEMENT
==================================== */

router.post(
  "/roles/assign",
  assignRole
);

router.post(
  "/roles/remove",
  removeRole
);

/* ====================================
   USER MANAGEMENT
==================================== */

router.get(
  "/users",
  getAllUsers
);

router.patch(
  "/users/:id/block",
  blockUser
);

router.patch(
  "/users/:id/unblock",
  unblockUser
);

router.delete(
  "/users/:id",
  deleteUser
);

/* ====================================
   LOAN MANAGEMENT
==================================== */

router.get(
  "/loans",
  getAllLoans
);

router.patch(
  "/loans/:id/amount",
  updateLoanAmount
);

router.patch(
  "/loans/:id/approve",
  approveLoan
);

router.patch(
  "/loans/:id/reject",
  rejectLoan
);

router.patch(
  "/loans/:id/disburse",
  disburseLoan
);

/* ====================================
   DSA MANAGEMENT
==================================== */

router.get(
  "/dsa",
  getAllDsa
);

router.patch(
  "/dsa/:id/verify",
  verifyDsa
);

router.patch(
  "/dsa/:id/block",
  blockDsa
);

/* ====================================
   PARTNER MANAGEMENT
==================================== */

router.get(
  "/partners",
  getAllPartners
);

router.patch(
  "/partners/:id/verify",
  verifyPartner
);

router.patch(
  "/partners/:id/block",
  blockPartner
);

/* ====================================
   SETTINGS
==================================== */

router.get(
  "/settings",
  getSystemSettings
);

router.put(
  "/settings",
  updateSystemSettings
);

/* ====================================
   FINANCIAL
==================================== */

router.get(
  "/transactions",
  getAllTransactions
);

router.get(
  "/commissions",
  getAllCommissions
);

router.get(
  "/referrals",
  getAllReferrals
);

router.get(
  "/revenue-dashboard",
  getRevenueDashboard
);

router.get(
  "/commission-dashboard",
  getCommissionDashboard
);

/* ====================================
   AUDIT & LOGS
==================================== */

router.get(
  "/audit-logs",
  getAuditLogs
);

router.get(
  "/system-logs",
  getSystemLogs
);

/* ====================================
   SYSTEM HEALTH
==================================== */

router.get(
  "/health/server",
  getServerHealth
);

router.get(
  "/health/database",
  getDatabaseHealth
);

/* ====================================
   BACKUP
==================================== */

router.post(
  "/backup",
  backupDatabase
);

router.post(
  "/restore",
  restoreDatabase
);

/* ====================================
   REPORTS
==================================== */

router.get(
  "/reports",
  getReports
);

router.get(
  "/export/excel",
  exportExcel
);

router.get(
  "/export/pdf",
  exportPdf
);

/* ====================================
   SEARCH
==================================== */

router.get(
  "/search",
  searchSystem
);

/* ====================================
   BULK ACTIONS
==================================== */

router.post(
  "/bulk/block-users",
  bulkBlockUsers
);

router.post(
  "/bulk/delete-users",
  bulkDeleteUsers
);

router.post(
  "/bulk/approve-loans",
  bulkApproveLoans
);

export default router;

