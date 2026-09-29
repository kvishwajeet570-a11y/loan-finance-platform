import { Router } from "express";
import authMiddleware from "../../middlewares/auth";

import {
  createWallet,
  getWalletById,
  getAllWallets,
  updateWallet,
  deleteWallet,

  getMyWallet,
  getWalletBalance,

  creditWallet,
  debitWallet,

  freezeWallet,
  unfreezeWallet,

  blockWallet,
  unblockWallet,

  addMoney,
  withdrawMoney,

  transferMoney,

  getWalletTransactions,
  getWalletStatement,

  getPendingWithdrawals,
  approveWithdrawal,
  rejectWithdrawal,

  getWalletAnalytics,
  getWalletDashboard,

  getTopWalletUsers,
  getHighestBalances,

  getDailyWalletReport,
  getMonthlyWalletReport,

  getWalletRevenue,
  getWalletCommission,

  getWalletReferrals,

  searchWallets,

  exportWalletExcel,
  exportWalletPdf,

  getWalletAuditLogs,

  bulkCreditWallets,
  bulkDebitWallets,

  bulkFreezeWallets,
  bulkUnfreezeWallets,

  bulkDeleteWallets,

  getLiveWalletActivities,
} from "../../controllers/wallet/wallet.controller";

const router = Router();

/* =====================================
   AUTHENTICATION
===================================== */

router.use(authMiddleware);

/* =====================================
   DASHBOARD
===================================== */

router.get("/dashboard", getWalletDashboard);
router.get("/analytics", getWalletAnalytics);
router.get("/live", getLiveWalletActivities);

/* =====================================
   REPORTS
===================================== */

router.get("/daily-report", getDailyWalletReport);
router.get("/monthly-report", getMonthlyWalletReport);
router.get("/revenue", getWalletRevenue);
router.get("/commission", getWalletCommission);
router.get("/referrals", getWalletReferrals);

/* =====================================
   LEADERBOARD
===================================== */

router.get("/top-users", getTopWalletUsers);
router.get("/highest-balances", getHighestBalances);

/* =====================================
   MY WALLET
===================================== */

router.get("/me", getMyWallet);
router.get("/balance", getWalletBalance);

/* =====================================
   MONEY OPERATIONS
===================================== */

router.post("/add-money", addMoney);
router.post("/withdraw", withdrawMoney);
router.post("/transfer", transferMoney);

/* =====================================
   WALLET ADMIN OPERATIONS
===================================== */

router.patch("/:id/credit", creditWallet);
router.patch("/:id/debit", debitWallet);

router.patch("/:id/freeze", freezeWallet);
router.patch("/:id/unfreeze", unfreezeWallet);

router.patch("/:id/block", blockWallet);
router.patch("/:id/unblock", unblockWallet);

/* =====================================
   WITHDRAWALS
===================================== */

router.get("/withdrawals/pending", getPendingWithdrawals);
router.patch("/withdrawals/:id/approve", approveWithdrawal);
router.patch("/withdrawals/:id/reject", rejectWithdrawal);

/* =====================================
   TRANSACTIONS
===================================== */

router.get("/:walletId/transactions", getWalletTransactions);
router.get("/:walletId/statement", getWalletStatement);

/* =====================================
   SEARCH / EXPORT / AUDIT
===================================== */

router.get("/search", searchWallets);
router.get("/export/excel", exportWalletExcel);
router.get("/export/pdf", exportWalletPdf);
router.get("/audit-logs", getWalletAuditLogs);

/* =====================================
   WALLET CRUD
===================================== */

router.post("/", createWallet);
router.get("/", getAllWallets);
router.get("/:id", getWalletById);
router.put("/:id", updateWallet);
router.delete("/:id", deleteWallet);

/* =====================================
   BULK OPERATIONS
===================================== */

router.post("/bulk/credit", bulkCreditWallets);
router.post("/bulk/debit", bulkDebitWallets);
router.post("/bulk/freeze", bulkFreezeWallets);
router.post("/bulk/unfreeze", bulkUnfreezeWallets);
router.post("/bulk/delete", bulkDeleteWallets);

export default router;
