import { Router } from "express";

import {
  getDashboardStats,
  getAllUsers,
  getUserById,
  blockUser,
  unblockUser,
  verifyUser,
  getRecentLoans,
  getLoanById,
  updateLoanAmount,
  approveLoan,
  rejectLoan,
} from "../../controllers/admin/admin.controller";

import authMiddleware from "../../middlewares/auth";
import adminMiddleware from "../../middlewares/admin";

const router = Router();

/*
==================================================
ADMIN SECURITY
==================================================
All admin routes require:

1. Valid JWT
2. User role = admin
==================================================
*/

router.use(authMiddleware);
router.use(adminMiddleware);

/* ==========================================
   DASHBOARD
========================================== */

router.get(
  "/dashboard",
  getDashboardStats
);

/* ==========================================
   USER MANAGEMENT
========================================== */

router.get(
  "/users",
  getAllUsers
);

router.get(
  "/users/:id",
  getUserById
);

router.patch(
  "/users/:id/block",
  blockUser
);

router.patch(
  "/users/:id/unblock",
  unblockUser
);

router.patch(
  "/users/:id/verify",
  verifyUser
);

/* ==========================================
   LOAN MANAGEMENT
========================================== */

router.get(
  "/loans",
  getRecentLoans
);

router.get(
  "/loans/:id",
  getLoanById
);

router.patch(
  "/loans/:id/amount",
  updateLoanAmount
);

router.patch(
  "/loans/:id/approve",
  approveLoan
);

router.patch(
  "/loans/:id/reject",
  rejectLoan
);

export default router;
