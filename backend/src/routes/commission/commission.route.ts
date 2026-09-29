import { Router } from "express";
import CommissionController from "../../controllers/commission/commission.controller";

const router = Router();

/* ========================================
   ANALYTICS
======================================== */

router.get(
  "/analytics",
  CommissionController.getCommissionAnalytics
);

router.get(
  "/top-earners",
  CommissionController.getTopEarners
);

router.get(
  "/monthly",
  CommissionController.getMonthlyCommission
);

/* ========================================
   COMMISSIONS
======================================== */

router.post(
  "/",
  CommissionController.createCommission
);

router.get(
  "/",
  CommissionController.getAllCommissions
);

router.get(
  "/pending",
  CommissionController.getPendingCommissions
);

router.get(
  "/search",
  CommissionController.searchCommissions
);

router.get(
  "/user/:userId",
  CommissionController.getUserCommissions
);

router.get(
  "/:id",
  CommissionController.getCommissionById
);

/* ========================================
   APPROVAL FLOW
======================================== */

router.patch(
  "/:id/approve",
  CommissionController.approveCommission
);

router.patch(
  "/:id/reject",
  CommissionController.rejectCommission
);

router.patch(
  "/:id/pay",
  CommissionController.markCommissionPaid
);

export default router;