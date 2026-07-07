import { Router } from "express";

import {
  createCommission,
  getCommissionById,
  getUserCommissions,
  getPendingCommissions,
  approveCommission,
  rejectCommission,
  markCommissionPaid,
  getAllCommissions,
  searchCommissions,
  getCommissionAnalytics,
  getTopEarners,
  getMonthlyCommission,
} from "../../controllers/commission/commission.controller";

const router = Router();

/* ========================================
   ANALYTICS
======================================== */

router.get(
  "/analytics",
  getCommissionAnalytics
);

router.get(
  "/top-earners",
  getTopEarners
);

router.get(
  "/monthly",
  getMonthlyCommission
);

/* ========================================
   COMMISSIONS
======================================== */

router.post(
  "/",
  createCommission
);

router.get(
  "/",
  getAllCommissions
);

router.get(
  "/pending",
  getPendingCommissions
);

router.get(
  "/search",
  searchCommissions
);

router.get(
  "/user/:userId",
  getUserCommissions
);

router.get(
  "/:id",
  getCommissionById
);

/* ========================================
   APPROVAL FLOW
======================================== */

router.patch(
  "/:id/approve",
  approveCommission
);

router.patch(
  "/:id/reject",
  rejectCommission
);

router.patch(
  "/:id/pay",
  markCommissionPaid
);

export default router;