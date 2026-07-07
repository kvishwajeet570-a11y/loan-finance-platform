import { Router } from "express";

import {
  createInsurance,
  getInsuranceById,
  getAllInsurances,
  updateInsurance,
  deleteInsurance,

  approveInsurance,
  rejectInsurance,

  activatePolicy,
  deactivatePolicy,

  renewPolicy,
  cancelPolicy,

  getUserPolicies,
  getPolicyByNumber,

  searchPolicies,

  getPendingPolicies,
  getActivePolicies,
  getExpiredPolicies,
  getCancelledPolicies,

  getInsuranceAnalytics,
  getInsuranceDashboard,

  getTopAgents,
  getTopPolicies,
  getMonthlyPolicies,

  getPolicyClaims,
  createClaim,
  approveClaim,
  rejectClaim,

  exportInsuranceExcel,
  exportInsurancePdf,

  bulkApprovePolicies,
  bulkRejectPolicies,
} from "../../controllers/insurance/insurance.controller";

const router = Router();

/* ========================================
   ANALYTICS
======================================== */

router.get(
  "/analytics",
  getInsuranceAnalytics
);

router.get(
  "/dashboard",
  getInsuranceDashboard
);

router.get(
  "/top-agents",
  getTopAgents
);

router.get(
  "/top-policies",
  getTopPolicies
);

router.get(
  "/monthly-policies",
  getMonthlyPolicies
);

/* ========================================
   EXPORT
======================================== */

router.get(
  "/export/excel",
  exportInsuranceExcel
);

router.get(
  "/export/pdf",
  exportInsurancePdf
);

/* ========================================
   POLICY STATUS
======================================== */

router.get(
  "/pending",
  getPendingPolicies
);

router.get(
  "/active",
  getActivePolicies
);

router.get(
  "/expired",
  getExpiredPolicies
);

router.get(
  "/cancelled",
  getCancelledPolicies
);

/* ========================================
   POLICY MANAGEMENT
======================================== */

router.post(
  "/",
  createInsurance
);

router.get(
  "/",
  getAllInsurances
);

router.get(
  "/search",
  searchPolicies
);

router.get(
  "/policy/:policyNo",
  getPolicyByNumber
);

router.get(
  "/user/:userId",
  getUserPolicies
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

/* ========================================
   POLICY ACTIONS
======================================== */

router.patch(
  "/:id/approve",
  approveInsurance
);

router.patch(
  "/:id/reject",
  rejectInsurance
);

router.patch(
  "/:id/activate",
  activatePolicy
);

router.patch(
  "/:id/deactivate",
  deactivatePolicy
);

router.patch(
  "/:id/renew",
  renewPolicy
);

router.patch(
  "/:id/cancel",
  cancelPolicy
);

/* ========================================
   CLAIMS
======================================== */

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

/* ========================================
   BULK ACTIONS
======================================== */

router.post(
  "/bulk-approve",
  bulkApprovePolicies
);

router.post(
  "/bulk-reject",
  bulkRejectPolicies
);

export default router;