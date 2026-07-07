"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const transaction_controller_1 = require("../../controllers/transaction/transaction.controller");
const router = (0, express_1.Router)();
/* =====================================
   DASHBOARD
===================================== */
router.get("/dashboard", transaction_controller_1.getTransactionDashboard);
router.get("/analytics", transaction_controller_1.getTransactionAnalytics);
router.get("/statistics", transaction_controller_1.getTransactionStatistics);
router.get("/live", transaction_controller_1.getLiveTransactions);
/* =====================================
   TIME REPORTS
===================================== */
router.get("/daily", transaction_controller_1.getDailyTransactions);
router.get("/weekly", transaction_controller_1.getWeeklyTransactions);
router.get("/monthly", transaction_controller_1.getMonthlyTransactions);
router.get("/yearly", transaction_controller_1.getYearlyTransactions);
/* =====================================
   STATUS
===================================== */
router.get("/pending", transaction_controller_1.getPendingTransactions);
router.get("/success", transaction_controller_1.getSuccessTransactions);
router.get("/failed", transaction_controller_1.getFailedTransactions);
router.get("/refunded", transaction_controller_1.getRefundedTransactions);
/* =====================================
   TYPE
===================================== */
router.get("/credit", transaction_controller_1.getCreditTransactions);
router.get("/debit", transaction_controller_1.getDebitTransactions);
/* =====================================
   BUSINESS TRANSACTIONS
===================================== */
router.get("/loan", transaction_controller_1.getLoanTransactions);
router.get("/commission", transaction_controller_1.getCommissionTransactions);
router.get("/referral", transaction_controller_1.getReferralTransactions);
router.get("/recharge", transaction_controller_1.getRechargeTransactions);
router.get("/insurance", transaction_controller_1.getInsuranceTransactions);
router.get("/investment", transaction_controller_1.getInvestmentTransactions);
router.get("/revenue", transaction_controller_1.getRevenueTransactions);
/* =====================================
   USER BASED
===================================== */
router.get("/user/:userId", transaction_controller_1.getUserTransactions);
router.get("/customer/:customerId", transaction_controller_1.getCustomerTransactions);
router.get("/dsa/:dsaId", transaction_controller_1.getDsaTransactions);
router.get("/partner/:partnerId", transaction_controller_1.getPartnerTransactions);
/* =====================================
   LEADERBOARD
===================================== */
router.get("/top", transaction_controller_1.getTopTransactions);
router.get("/top-customers", transaction_controller_1.getTopCustomers);
router.get("/top-dsa", transaction_controller_1.getTopDsa);
router.get("/top-partners", transaction_controller_1.getTopPartners);
/* =====================================
   SEARCH
===================================== */
router.get("/search", transaction_controller_1.searchTransactions);
/* =====================================
   EXPORT
===================================== */
router.get("/export/excel", transaction_controller_1.exportTransactionsExcel);
router.get("/export/pdf", transaction_controller_1.exportTransactionsPdf);
router.get("/export/csv", transaction_controller_1.exportTransactionsCsv);
/* =====================================
   AUDIT
===================================== */
router.get("/audit-logs", transaction_controller_1.getTransactionAuditLogs);
/* =====================================
   CRUD
===================================== */
router.post("/", transaction_controller_1.createTransaction);
router.get("/", transaction_controller_1.getAllTransactions);
router.get("/:id", transaction_controller_1.getTransactionById);
router.put("/:id", transaction_controller_1.updateTransaction);
router.delete("/:id", transaction_controller_1.deleteTransaction);
/* =====================================
   ACTIONS
===================================== */
router.patch("/:id/process", transaction_controller_1.processTransaction);
router.patch("/:id/verify", transaction_controller_1.verifyTransaction);
router.patch("/:id/approve", transaction_controller_1.approveTransaction);
router.patch("/:id/reject", transaction_controller_1.rejectTransaction);
router.patch("/:id/refund", transaction_controller_1.refundTransaction);
/* =====================================
   BULK ACTIONS
===================================== */
router.post("/bulk/approve", transaction_controller_1.bulkApproveTransactions);
router.post("/bulk/reject", transaction_controller_1.bulkRejectTransactions);
router.post("/bulk/refund", transaction_controller_1.bulkRefundTransactions);
router.post("/bulk/delete", transaction_controller_1.bulkDeleteTransactions);
exports.default = router;
