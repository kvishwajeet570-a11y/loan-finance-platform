import { Router } from "express";

import {
  createInvestment,
  getInvestmentById,
  getAllInvestments,
  updateInvestment,
  deleteInvestment,

  approveInvestment,
  rejectInvestment,

  activateInvestment,
  closeInvestment,

  getUserInvestments,
  searchInvestments,

  getPendingInvestments,
  getActiveInvestments,
  getClosedInvestments,
  getRejectedInvestments,

  getInvestmentAnalytics,
  getInvestmentDashboard,

  getTopInvestors,
  getTopPlans,
  getMonthlyInvestments,

  getInvestmentReturns,
  calculateReturns,

  exportInvestmentsExcel,
  exportInvestmentsPdf,

  bulkApproveInvestments,
  bulkRejectInvestments,
} from "../../controllers/investment/investment.controller";

const router = Router();

/* ========================================
   ANALYTICS
======================================== */

router.get(
  "/analytics",
  getInvestmentAnalytics
);

router.get(
  "/dashboard",
  getInvestmentDashboard
);

router.get(
  "/top-investors",
  getTopInvestors
);

router.get(
  "/top-plans",
  getTopPlans
);

router.get(
  "/monthly",
  getMonthlyInvestments
);

/* ========================================
   EXPORT
======================================== */

router.get(
  "/export/excel",
  exportInvestmentsExcel
);

router.get(
  "/export/pdf",
  exportInvestmentsPdf
);

/* ========================================
   STATUS
======================================== */

router.get(
  "/pending",
  getPendingInvestments
);

router.get(
  "/active",
  getActiveInvestments
);

router.get(
  "/closed",
  getClosedInvestments
);

router.get(
  "/rejected",
  getRejectedInvestments
);

/* ========================================
   INVESTMENT MANAGEMENT
======================================== */

router.post(
  "/",
  createInvestment
);

router.get(
  "/",
  getAllInvestments
);

router.get(
  "/search",
  searchInvestments
);

router.get(
  "/user/:userId",
  getUserInvestments
);

router.get(
  "/:id",
  getInvestmentById
);

router.put(
  "/:id",
  updateInvestment
);

router.delete(
  "/:id",
  deleteInvestment
);

/* ========================================
   APPROVAL
======================================== */

router.patch(
  "/:id/approve",
  approveInvestment
);

router.patch(
  "/:id/reject",
  rejectInvestment
);

/* ========================================
   INVESTMENT ACTIONS
======================================== */

router.patch(
  "/:id/activate",
  activateInvestment
);

router.patch(
  "/:id/close",
  closeInvestment
);

router.get(
  "/:id/returns",
  getInvestmentReturns
);

router.post(
  "/calculate-returns",
  calculateReturns
);

/* ========================================
   BULK ACTIONS
======================================== */

router.post(
  "/bulk-approve",
  bulkApproveInvestments
);

router.post(
  "/bulk-reject",
  bulkRejectInvestments
);

export default router;