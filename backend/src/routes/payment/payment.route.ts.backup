import { Router } from "express";

import {
  createPayment,
  getPaymentById,
  getAllPayments,

  updatePayment,
  deletePayment,

  initiatePayment,
  verifyPayment,

  markPaymentSuccess,
  markPaymentFailed,
  markPaymentRefunded,

  refundPayment,

  getUserPayments,
  getLoanPayments,
  getTransactionPayments,

  searchPayments,

  getPendingPayments,
  getSuccessPayments,
  getFailedPayments,
  getRefundedPayments,

  getPaymentAnalytics,
  getPaymentDashboard,

  getDailyPayments,
  getMonthlyPayments,

  exportPaymentsExcel,
  exportPaymentsPdf,

  bulkVerifyPayments,
  bulkRefundPayments,
} from "../../controllers/payment/payment.controller";

const router = Router();

/* ========================================
   DASHBOARD & ANALYTICS
======================================== */

router.get(
  "/dashboard",
  getPaymentDashboard
);

router.get(
  "/analytics",
  getPaymentAnalytics
);

router.get(
  "/daily",
  getDailyPayments
);

router.get(
  "/monthly",
  getMonthlyPayments
);

/* ========================================
   EXPORTS
======================================== */

router.get(
  "/export/excel",
  exportPaymentsExcel
);

router.get(
  "/export/pdf",
  exportPaymentsPdf
);

/* ========================================
   STATUS
======================================== */

router.get(
  "/pending",
  getPendingPayments
);

router.get(
  "/success",
  getSuccessPayments
);

router.get(
  "/failed",
  getFailedPayments
);

router.get(
  "/refunded",
  getRefundedPayments
);

/* ========================================
   PAYMENT PROCESSING
======================================== */

router.post(
  "/initiate",
  initiatePayment
);

router.post(
  "/verify",
  verifyPayment
);

router.post(
  "/refund/:id",
  refundPayment
);

/* ========================================
   PAYMENT MANAGEMENT
======================================== */

router.post(
  "/",
  createPayment
);

router.get(
  "/",
  getAllPayments
);

router.get(
  "/search",
  searchPayments
);

router.get(
  "/user/:userId",
  getUserPayments
);

router.get(
  "/loan/:loanId",
  getLoanPayments
);

router.get(
  "/transaction/:transactionId",
  getTransactionPayments
);

router.get(
  "/:id",
  getPaymentById
);

router.put(
  "/:id",
  updatePayment
);

router.delete(
  "/:id",
  deletePayment
);

/* ========================================
   PAYMENT ACTIONS
======================================== */

router.patch(
  "/:id/success",
  markPaymentSuccess
);

router.patch(
  "/:id/failed",
  markPaymentFailed
);

router.patch(
  "/:id/refunded",
  markPaymentRefunded
);

/* ========================================
   BULK ACTIONS
======================================== */

router.post(
  "/bulk-verify",
  bulkVerifyPayments
);

router.post(
  "/bulk-refund",
  bulkRefundPayments
);

export default router;