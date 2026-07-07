"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payment_controller_1 = require("../../controllers/payment/payment.controller");
const router = (0, express_1.Router)();
/* ========================================
   DASHBOARD & ANALYTICS
======================================== */
router.get("/dashboard", payment_controller_1.getPaymentDashboard);
router.get("/analytics", payment_controller_1.getPaymentAnalytics);
router.get("/daily", payment_controller_1.getDailyPayments);
router.get("/monthly", payment_controller_1.getMonthlyPayments);
/* ========================================
   EXPORTS
======================================== */
router.get("/export/excel", payment_controller_1.exportPaymentsExcel);
router.get("/export/pdf", payment_controller_1.exportPaymentsPdf);
/* ========================================
   STATUS
======================================== */
router.get("/pending", payment_controller_1.getPendingPayments);
router.get("/success", payment_controller_1.getSuccessPayments);
router.get("/failed", payment_controller_1.getFailedPayments);
router.get("/refunded", payment_controller_1.getRefundedPayments);
/* ========================================
   PAYMENT PROCESSING
======================================== */
router.post("/initiate", payment_controller_1.initiatePayment);
router.post("/verify", payment_controller_1.verifyPayment);
router.post("/refund/:id", payment_controller_1.refundPayment);
/* ========================================
   PAYMENT MANAGEMENT
======================================== */
router.post("/", payment_controller_1.createPayment);
router.get("/", payment_controller_1.getAllPayments);
router.get("/search", payment_controller_1.searchPayments);
router.get("/user/:userId", payment_controller_1.getUserPayments);
router.get("/loan/:loanId", payment_controller_1.getLoanPayments);
router.get("/transaction/:transactionId", payment_controller_1.getTransactionPayments);
router.get("/:id", payment_controller_1.getPaymentById);
router.put("/:id", payment_controller_1.updatePayment);
router.delete("/:id", payment_controller_1.deletePayment);
/* ========================================
   PAYMENT ACTIONS
======================================== */
router.patch("/:id/success", payment_controller_1.markPaymentSuccess);
router.patch("/:id/failed", payment_controller_1.markPaymentFailed);
router.patch("/:id/refunded", payment_controller_1.markPaymentRefunded);
/* ========================================
   BULK ACTIONS
======================================== */
router.post("/bulk-verify", payment_controller_1.bulkVerifyPayments);
router.post("/bulk-refund", payment_controller_1.bulkRefundPayments);
exports.default = router;
