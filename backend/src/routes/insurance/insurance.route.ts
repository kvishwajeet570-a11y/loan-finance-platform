import { Router } from "express";

import {
  createInsurance,
  getAllInsurances,
  getInsuranceById,
  updateInsurance,
  deleteInsurance,

  approveInsurance,
  rejectInsurance,

  getUserPolicies,

  createClaim,
  getPolicyClaims,
  approveClaim,
  rejectClaim,

  getInsuranceAnalytics,
} from "../../controllers/insurance/insurance.controller";

const router = Router();

/* =========================================
   ANALYTICS
========================================= */

router.get(
  "/analytics",
  getInsuranceAnalytics
);

/* =========================================
   USER POLICIES
========================================= */

router.get(
  "/user/:userId",
  getUserPolicies
);

/* =========================================
   CLAIMS
========================================= */

router.get(
  "/:id/claims",
  getPolicyClaims
);

router.post(
  "/:id/claims",
  createClaim
);

router.patch(
  "/claim/:claimId/approve",
  approveClaim
);

router.patch(
  "/claim/:claimId/reject",
  rejectClaim
);

/* =========================================
   INSURANCE CRUD
========================================= */

router.post(
  "/",
  createInsurance
);

router.get(
  "/",
  getAllInsurances
);

router.get(
  "/:id",
  getInsuranceById
);

router.put(
  "/:id",
  updateInsurance
);

router.delete(
  "/:id",
  deleteInsurance
);

/* =========================================
   APPLICATION ACTIONS
========================================= */

router.patch(
  "/:id/approve",
  approveInsurance
);

router.patch(
  "/:id/reject",
  rejectInsurance
);

export default router;