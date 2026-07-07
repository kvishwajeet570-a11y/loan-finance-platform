import { Router } from "express";

import {
  createRecharge,
  getRechargeById,
  getAllRecharges,

  updateRecharge,
  deleteRecharge,

  processRecharge,
  verifyRecharge,

  markRechargeSuccess,
  markRechargeFailed,
  refundRecharge,

  getUserRecharges,
  getMobileRecharges,
  getDthRecharges,
  getFastagRecharges,

  searchRecharges,

  getPendingRecharges,
  getSuccessRecharges,
  getFailedRecharges,
  getRefundedRecharges,

  getRechargeAnalytics,
  getRechargeDashboard,

  getTopRechargeUsers,
  getMonthlyRecharges,

  exportRechargeExcel,
  exportRechargePdf,

  bulkProcessRecharge,
  bulkRefundRecharge,
} from "../../controllers/recharge/recharge.controller";

const router = Router();

/* ========================================
   DASHBOARD & ANALYTICS
======================================== */

router.get(
  "/dashboard",
  getRechargeDashboard
);

router.get(
  "/analytics",
  getRechargeAnalytics
);

router.get(
  "/top-users",
  getTopRechargeUsers
);

router.get(
  "/monthly",
  getMonthlyRecharges
);

/* ========================================
   EXPORT
======================================== */

router.get(
  "/export/excel",
  exportRechargeExcel
);

router.get(
  "/export/pdf",
  exportRechargePdf
);

/* ========================================
   STATUS
======================================== */

router.get(
  "/pending",
  getPendingRecharges
);

router.get(
  "/success",
  getSuccessRecharges
);

router.get(
  "/failed",
  getFailedRecharges
);

router.get(
  "/refunded",
  getRefundedRecharges
);

/* ========================================
   CATEGORY
======================================== */

router.get(
  "/mobile",
  getMobileRecharges
);

router.get(
  "/dth",
  getDthRecharges
);

router.get(
  "/fastag",
  getFastagRecharges
);

/* ========================================
   RECHARGE MANAGEMENT
======================================== */

router.post(
  "/",
  createRecharge
);

router.post(
  "/process",
  processRecharge
);

router.post(
  "/verify",
  verifyRecharge
);

router.get(
  "/",
  getAllRecharges
);

router.get(
  "/search",
  searchRecharges
);

router.get(
  "/user/:userId",
  getUserRecharges
);

router.get(
  "/:id",
  getRechargeById
);

router.put(
  "/:id",
  updateRecharge
);

router.delete(
  "/:id",
  deleteRecharge
);

/* ========================================
   RECHARGE ACTIONS
======================================== */

router.patch(
  "/:id/success",
  markRechargeSuccess
);

router.patch(
  "/:id/failed",
  markRechargeFailed
);

router.patch(
  "/:id/refund",
  refundRecharge
);

/* ========================================
   BULK ACTIONS
======================================== */

router.post(
  "/bulk-process",
  bulkProcessRecharge
);

router.post(
  "/bulk-refund",
  bulkRefundRecharge
);

export default router;