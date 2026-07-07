import { Router } from "express";

import {
  createFastag,
  getFastagById,
  getAllFastags,
  updateFastag,
  deleteFastag,

  activateFastag,
  deactivateFastag,
  blockFastag,
  unblockFastag,

  rechargeFastag,
  getFastagTransactions,

  getUserFastags,
  getFastagByVehicle,

  searchFastags,

  getActiveFastags,
  getInactiveFastags,
  getBlockedFastags,

  getFastagAnalytics,
  getFastagDashboard,

  getTopRechargeUsers,
  getMonthlyRecharges,

  exportFastagExcel,
  exportFastagPdf,

  bulkActivateFastags,
  bulkBlockFastags,
} from "../../controllers/fastag/fastag.controller";

const router = Router();

/* ========================================
   ANALYTICS
======================================== */

router.get(
  "/analytics",
  getFastagAnalytics
);

router.get(
  "/dashboard",
  getFastagDashboard
);

router.get(
  "/top-recharges",
  getTopRechargeUsers
);

router.get(
  "/monthly-recharges",
  getMonthlyRecharges
);

/* ========================================
   EXPORT
======================================== */

router.get(
  "/export/excel",
  exportFastagExcel
);

router.get(
  "/export/pdf",
  exportFastagPdf
);

/* ========================================
   STATUS
======================================== */

router.get(
  "/active",
  getActiveFastags
);

router.get(
  "/inactive",
  getInactiveFastags
);

router.get(
  "/blocked",
  getBlockedFastags
);

/* ========================================
   MANAGEMENT
======================================== */

router.post(
  "/",
  createFastag
);

router.get(
  "/",
  getAllFastags
);

router.get(
  "/search",
  searchFastags
);

router.get(
  "/vehicle/:vehicleNo",
  getFastagByVehicle
);

router.get(
  "/user/:userId",
  getUserFastags
);

router.get(
  "/:id",
  getFastagById
);

router.put(
  "/:id",
  updateFastag
);

router.delete(
  "/:id",
  deleteFastag
);

/* ========================================
   FASTAG ACTIONS
======================================== */

router.patch(
  "/:id/activate",
  activateFastag
);

router.patch(
  "/:id/deactivate",
  deactivateFastag
);

router.patch(
  "/:id/block",
  blockFastag
);

router.patch(
  "/:id/unblock",
  unblockFastag
);

router.post(
  "/:id/recharge",
  rechargeFastag
);

/* ========================================
   TRANSACTIONS
======================================== */

router.get(
  "/:id/transactions",
  getFastagTransactions
);

/* ========================================
   BULK ACTIONS
======================================== */

router.post(
  "/bulk-activate",
  bulkActivateFastags
);

router.post(
  "/bulk-block",
  bulkBlockFastags
);

export default router;