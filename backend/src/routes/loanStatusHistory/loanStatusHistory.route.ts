import { Router } from "express";

import {
  getLoanStatusHistory,
  createStatusEntry,
  updateLoanStatus,
  getStatusAnalytics,
} from "../../controllers/loanStatusHistory/loanStatusHistory.controller";

const router = Router();

/* ========================================
   ANALYTICS
======================================== */

router.get(
  "/analytics",
  getStatusAnalytics
);

/* ========================================
   LOAN STATUS HISTORY
======================================== */

// Get history by Loan ID
router.get(
  "/:loanId",
  getLoanStatusHistory
);

// Create status entry
router.post(
  "/",
  createStatusEntry
);

// Update loan status
router.put(
  "/:loanId",
  updateLoanStatus
);

/* ========================================
   EXPORT ROUTER
======================================== */

export default router;