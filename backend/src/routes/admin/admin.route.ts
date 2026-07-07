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
  approveLoan,
  rejectLoan,
} from "../../controllers/admin/admin.controller";

const router = Router();

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
  "/loans/:id/approve",
  approveLoan
);

router.patch(
  "/loans/:id/reject",
  rejectLoan
);

export default router;