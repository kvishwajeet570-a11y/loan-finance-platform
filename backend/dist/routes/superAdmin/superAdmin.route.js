"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const superAdmin_controller_1 = require("../../controllers/superAdmin/superAdmin.controller");
const router = (0, express_1.Router)();
/* ====================================
   DASHBOARD
==================================== */
router.get("/dashboard", superAdmin_controller_1.getSuperAdminDashboard);
router.get("/live-activities", superAdmin_controller_1.getLiveActivities);
router.get("/notifications", superAdmin_controller_1.getNotifications);
/* ====================================
   ANALYTICS
==================================== */
router.get("/analytics/system", superAdmin_controller_1.getSystemAnalytics);
router.get("/analytics/business", superAdmin_controller_1.getBusinessAnalytics);
router.get("/analytics/revenue", superAdmin_controller_1.getRevenueAnalytics);
router.get("/analytics/users", superAdmin_controller_1.getUserAnalytics);
router.get("/analytics/loans", superAdmin_controller_1.getLoanAnalytics);
/* ====================================
   ADMIN MANAGEMENT
==================================== */
router.get("/admins", superAdmin_controller_1.getAllAdmins);
router.post("/admins", superAdmin_controller_1.createAdmin);
router.put("/admins/:id", superAdmin_controller_1.updateAdmin);
router.delete("/admins/:id", superAdmin_controller_1.deleteAdmin);
router.patch("/admins/:id/block", superAdmin_controller_1.blockAdmin);
router.patch("/admins/:id/unblock", superAdmin_controller_1.unblockAdmin);
/* ====================================
   ROLE MANAGEMENT
==================================== */
router.post("/roles/assign", superAdmin_controller_1.assignRole);
router.post("/roles/remove", superAdmin_controller_1.removeRole);
/* ====================================
   USER MANAGEMENT
==================================== */
router.get("/users", superAdmin_controller_1.getAllUsers);
router.patch("/users/:id/block", superAdmin_controller_1.blockUser);
router.patch("/users/:id/unblock", superAdmin_controller_1.unblockUser);
router.delete("/users/:id", superAdmin_controller_1.deleteUser);
/* ====================================
   LOAN MANAGEMENT
==================================== */
router.get("/loans", superAdmin_controller_1.getAllLoans);
router.patch("/loans/:id/approve", superAdmin_controller_1.approveLoan);
router.patch("/loans/:id/reject", superAdmin_controller_1.rejectLoan);
router.patch("/loans/:id/disburse", superAdmin_controller_1.disburseLoan);
/* ====================================
   DSA MANAGEMENT
==================================== */
router.get("/dsa", superAdmin_controller_1.getAllDsa);
router.patch("/dsa/:id/verify", superAdmin_controller_1.verifyDsa);
router.patch("/dsa/:id/block", superAdmin_controller_1.blockDsa);
/* ====================================
   PARTNER MANAGEMENT
==================================== */
router.get("/partners", superAdmin_controller_1.getAllPartners);
router.patch("/partners/:id/verify", superAdmin_controller_1.verifyPartner);
router.patch("/partners/:id/block", superAdmin_controller_1.blockPartner);
/* ====================================
   SETTINGS
==================================== */
router.get("/settings", superAdmin_controller_1.getSystemSettings);
router.put("/settings", superAdmin_controller_1.updateSystemSettings);
/* ====================================
   FINANCIAL
==================================== */
router.get("/transactions", superAdmin_controller_1.getAllTransactions);
router.get("/commissions", superAdmin_controller_1.getAllCommissions);
router.get("/referrals", superAdmin_controller_1.getAllReferrals);
router.get("/revenue-dashboard", superAdmin_controller_1.getRevenueDashboard);
router.get("/commission-dashboard", superAdmin_controller_1.getCommissionDashboard);
/* ====================================
   AUDIT & LOGS
==================================== */
router.get("/audit-logs", superAdmin_controller_1.getAuditLogs);
router.get("/system-logs", superAdmin_controller_1.getSystemLogs);
/* ====================================
   SYSTEM HEALTH
==================================== */
router.get("/health/server", superAdmin_controller_1.getServerHealth);
router.get("/health/database", superAdmin_controller_1.getDatabaseHealth);
/* ====================================
   BACKUP
==================================== */
router.post("/backup", superAdmin_controller_1.backupDatabase);
router.post("/restore", superAdmin_controller_1.restoreDatabase);
/* ====================================
   REPORTS
==================================== */
router.get("/reports", superAdmin_controller_1.getReports);
router.get("/export/excel", superAdmin_controller_1.exportExcel);
router.get("/export/pdf", superAdmin_controller_1.exportPdf);
/* ====================================
   SEARCH
==================================== */
router.get("/search", superAdmin_controller_1.searchSystem);
/* ====================================
   BULK ACTIONS
==================================== */
router.post("/bulk/block-users", superAdmin_controller_1.bulkBlockUsers);
router.post("/bulk/delete-users", superAdmin_controller_1.bulkDeleteUsers);
router.post("/bulk/approve-loans", superAdmin_controller_1.bulkApproveLoans);
exports.default = router;
