import { Router } from "express";

import {
  createTransaction,
  getTransactionById,
  getAllTransactions,
  updateTransaction,
  deleteTransaction,

  getUserTransactions,
  getCustomerTransactions,
  getDsaTransactions,
  getPartnerTransactions,

  getCreditTransactions,
  getDebitTransactions,

  getPendingTransactions,
  getSuccessTransactions,
  getFailedTransactions,
  getRefundedTransactions,

  processTransaction,
  verifyTransaction,

  approveTransaction,
  rejectTransaction,

  refundTransaction,

  getTransactionAnalytics,
  getTransactionDashboard,

  getDailyTransactions,
  getWeeklyTransactions,
  getMonthlyTransactions,
  getYearlyTransactions,

  getTopTransactions,
  getTopCustomers,
  getTopDsa,
  getTopPartners,

  getRevenueTransactions,
  getCommissionTransactions,
  getReferralTransactions,
  getLoanTransactions,
  getRechargeTransactions,
  getInsuranceTransactions,
  getInvestmentTransactions,

  getTransactionStatistics,

  getLiveTransactions,

  searchTransactions,

  getTransactionAuditLogs,

  exportTransactionsExcel,
  exportTransactionsPdf,
  exportTransactionsCsv,

  bulkApproveTransactions,
  bulkRejectTransactions,
  bulkRefundTransactions,
  bulkDeleteTransactions,

} from "../../controllers/transaction/transaction.controller";

const router = Router();

/* =====================================
   DASHBOARD
===================================== */

router.get("/dashboard", getTransactionDashboard);

router.get("/analytics", getTransactionAnalytics);

router.get("/statistics", getTransactionStatistics);

router.get("/live", getLiveTransactions);

/* =====================================
   TIME REPORTS
===================================== */

router.get("/daily", getDailyTransactions);

router.get("/weekly", getWeeklyTransactions);

router.get("/monthly", getMonthlyTransactions);

router.get("/yearly", getYearlyTransactions);

/* =====================================
   STATUS
===================================== */

router.get("/pending", getPendingTransactions);

router.get("/success", getSuccessTransactions);

router.get("/failed", getFailedTransactions);

router.get("/refunded", getRefundedTransactions);

/* =====================================
   TYPE
===================================== */

router.get("/credit", getCreditTransactions);

router.get("/debit", getDebitTransactions);

/* =====================================
   BUSINESS TRANSACTIONS
===================================== */

router.get("/loan", getLoanTransactions);

router.get("/commission", getCommissionTransactions);

router.get("/referral", getReferralTransactions);

router.get("/recharge", getRechargeTransactions);

router.get("/insurance", getInsuranceTransactions);

router.get("/investment", getInvestmentTransactions);

router.get("/revenue", getRevenueTransactions);

/* =====================================
   USER BASED
===================================== */

router.get("/user/:userId", getUserTransactions);

router.get("/customer/:customerId", getCustomerTransactions);

router.get("/dsa/:dsaId", getDsaTransactions);

router.get("/partner/:partnerId", getPartnerTransactions);

/* =====================================
   LEADERBOARD
===================================== */

router.get("/top", getTopTransactions);

router.get("/top-customers", getTopCustomers);

router.get("/top-dsa", getTopDsa);

router.get("/top-partners", getTopPartners);

/* =====================================
   SEARCH
===================================== */

router.get("/search", searchTransactions);

/* =====================================
   EXPORT
===================================== */

router.get("/export/excel", exportTransactionsExcel);

router.get("/export/pdf", exportTransactionsPdf);

router.get("/export/csv", exportTransactionsCsv);

/* =====================================
   AUDIT
===================================== */

router.get("/audit-logs", getTransactionAuditLogs);

/* =====================================
   CRUD
===================================== */

router.post("/", createTransaction);

router.get("/", getAllTransactions);

router.get("/:id", getTransactionById);

router.put("/:id", updateTransaction);

router.delete("/:id", deleteTransaction);

/* =====================================
   ACTIONS
===================================== */

router.patch("/:id/process", processTransaction);

router.patch("/:id/verify", verifyTransaction);

router.patch("/:id/approve", approveTransaction);

router.patch("/:id/reject", rejectTransaction);

router.patch("/:id/refund", refundTransaction);

/* =====================================
   BULK ACTIONS
===================================== */

router.post(
  "/bulk/approve",
  bulkApproveTransactions
);

router.post(
  "/bulk/reject",
  bulkRejectTransactions
);

router.post(
  "/bulk/refund",
  bulkRefundTransactions
);

router.post(
  "/bulk/delete",
  bulkDeleteTransactions
);

export default router;