import { Router } from "express";

import {
  getDSAs,
  getDSAById,
  createDSA,
  approveDSA,
  rejectDSA,
  blockDSA,
  unblockDSA,
  getDSALoans,
  getDSADashboard,
  getTopDSA,
  getDSAAnalytics,
} from "../../controllers/dsa/dsa.controller";

const router = Router();

/* ==========================
   ANALYTICS
========================== */

router.get(
  "/analytics",
  getDSAAnalytics
);

router.get(
  "/top-performers",
  getTopDSA
);

/* ==========================
   DASHBOARD
========================== */

router.get(
  "/dashboard/:id",
  getDSADashboard
);

/* ==========================
   MANAGEMENT
========================== */

router.post(
  "/",
  createDSA
);

router.get(
  "/",
  getDSAs
);

router.get(
  "/:id",
  getDSAById
);

/* ==========================
   VERIFICATION
========================== */

router.patch(
  "/:id/approve",
  approveDSA
);

router.patch(
  "/:id/reject",
  rejectDSA
);

router.patch(
  "/:id/block",
  blockDSA
);

router.patch(
  "/:id/unblock",
  unblockDSA
);

/* ==========================
   DSA LOANS
========================== */

router.get(
  "/:id/loans",
  getDSALoans
);

export default router;