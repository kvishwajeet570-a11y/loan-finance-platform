"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const wallet_controller_1 = require("../../controllers/wallet/wallet.controller");
const router = (0, express_1.Router)();
/* =====================================
   DASHBOARD
===================================== */
router.get("/dashboard", wallet_controller_1.getWalletDashboard);
router.get("/analytics", wallet_controller_1.getWalletAnalytics);
router.get("/live", wallet_controller_1.getLiveWalletActivities);
/* =====================================
   REPORTS
===================================== */
router.get("/daily-report", wallet_controller_1.getDailyWalletReport);
router.get("/monthly-report", wallet_controller_1.getMonthlyWalletReport);
router.get("/revenue", wallet_controller_1.getWalletRevenue);
router.get("/commission", wallet_controller_1.getWalletCommission);
router.get("/referrals", wallet_controller_1.getWalletReferrals);
/* =====================================
   LEADERBOARD
===================================== */
router.get("/top-users", wallet_controller_1.getTopWalletUsers);
router.get("/highest-balances", wallet_controller_1.getHighestBalances);
/* =====================================
   MY WALLET
===================================== */
router.get("/me", wallet_controller_1.getMyWallet);
router.get("/balance", wallet_controller_1.getWalletBalance);
/* =====================================
   MONEY OPERATIONS
===================================== */
router.post("/add-money", wallet_controller_1.addMoney);
router.post("/withdraw", wallet_controller_1.withdrawMoney);
router.post("/transfer", wallet_controller_1.transferMoney);
router.patch("/:id/credit", wallet_controller_1.creditWallet);
router.patch("/:id/debit", wallet_controller_1.debitWallet);
/* =====================================
   WITHDRAWAL
===================================== */
router.get("/withdrawals/pending", wallet_controller_1.getPendingWithdrawals);
router.patch("/withdrawals/:id/approve", wallet_controller_1.approveWithdrawal);
router.patch("/withdrawals/:id/reject", wallet_controller_1.rejectWithdrawal);
/* =====================================
   WALLET STATUS
===================================== */
router.patch("/:id/freeze", wallet_controller_1.freezeWallet);
router.patch("/:id/unfreeze", wallet_controller_1.unfreezeWallet);
router.patch("/:id/block", wallet_controller_1.blockWallet);
router.patch("/:id/unblock", wallet_controller_1.unblockWallet);
/* =====================================
   TRANSACTIONS
===================================== */
router.get("/:walletId/transactions", wallet_controller_1.getWalletTransactions);
router.get("/:walletId/statement", wallet_controller_1.getWalletStatement);
/* =====================================
   SEARCH
===================================== */
router.get("/search", wallet_controller_1.searchWallets);
/* =====================================
   EXPORT
===================================== */
router.get("/export/excel", wallet_controller_1.exportWalletExcel);
router.get("/export/pdf", wallet_controller_1.exportWalletPdf);
/* =====================================
   AUDIT
===================================== */
router.get("/audit-logs", wallet_controller_1.getWalletAuditLogs);
/* =====================================
   CRUD
===================================== */
router.post("/", wallet_controller_1.createWallet);
router.get("/", wallet_controller_1.getAllWallets);
router.get("/:id", wallet_controller_1.getWalletById);
router.put("/:id", wallet_controller_1.updateWallet);
router.delete("/:id", wallet_controller_1.deleteWallet);
/* =====================================
   BULK ACTIONS
===================================== */
router.post("/bulk/credit", wallet_controller_1.bulkCreditWallets);
router.post("/bulk/debit", wallet_controller_1.bulkDebitWallets);
router.post("/bulk/freeze", wallet_controller_1.bulkFreezeWallets);
router.post("/bulk/unfreeze", wallet_controller_1.bulkUnfreezeWallets);
router.post("/bulk/delete", wallet_controller_1.bulkDeleteWallets);
exports.default = router;
