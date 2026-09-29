import { Router } from "express";

import {
  applyLoan,
  getAllLoans,
  getSingleLoan,
  approveLoan,
  rejectLoan,
  deleteLoan,
  assignLoan,
  startLoanApplication,
  updateLoanApplication,
} from "../../controllers/loan/loan.controller";

import authMiddleware, { optionalAuthMiddleware } from "../../middlewares/auth";
import adminMiddleware from "../../middlewares/admin";

const router = Router();

// Customer: Apply Loan
router.post("/", applyLoan);

// Public / DSA: Start loan application
router.post("/start", optionalAuthMiddleware, startLoanApplication);

// Existing loan listing/details
router.get("/", getAllLoans);

// DSA / Customer: Update existing loan application
router.patch("/:id", updateLoanApplication);

router.get("/:id", getSingleLoan);

// Admin: Approve Loan
router.patch(
  "/:id/approve",
  authMiddleware,
  adminMiddleware,
  approveLoan
);

// Admin: Reject Loan
router.patch(
  "/:id/reject",
  authMiddleware,
  adminMiddleware,
  rejectLoan
);

// Admin: Delete Loan
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteLoan
);

// Admin: Assign Loan to DSA
router.patch(
  "/:id/assign",
  authMiddleware,
  adminMiddleware,
  assignLoan
);

export default router;


