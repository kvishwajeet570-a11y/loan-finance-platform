import { Router } from "express";

import {
  getRevenueAnalytics,
  getMonthlyRevenue,
  getTopUsers,
} from "../../controllers/revenue/revenue.controller";

// Optional (Uncomment if your project uses authentication)
// import { authenticate } from "../../middlewares/auth.middleware";
// import { authorize } from "../../middlewares/authorize.middleware";

const router = Router();

/* =========================================
   REVENUE ANALYTICS
========================================= */

// Dashboard Analytics
router.get(
  "/analytics",
  // authenticate,
  // authorize("SUPER_ADMIN", "ADMIN"),
  getRevenueAnalytics
);

// Monthly Revenue
router.get(
  "/monthly",
  // authenticate,
  // authorize("SUPER_ADMIN", "ADMIN"),
  getMonthlyRevenue
);

// Top Users
router.get(
  "/top-users",
  // authenticate,
  // authorize("SUPER_ADMIN", "ADMIN"),
  getTopUsers
);

export default router;