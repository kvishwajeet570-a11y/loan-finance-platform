import { Router } from "express";

import {
  createDsa,
  getDsaById,
  getAllDsa,
  updateDsa,
  deleteDsa,

  verifyDsa,
  rejectDsa,
  blockDsa,
  unblockDsa,

  searchDsa,

  getActiveDsa,
  getInactiveDsa,
  getPendingDsa,
  getVerifiedDsa,

  getDsaProfile,
  getDsaDashboard,

  getDsaCustomers,
  getDsaLoans,
  getDsaCommissions,
  getDsaReferrals,

  getTopDsa,
  getMonthlyDsa,

  getDsaAnalytics,

  exportDsaExcel,
  exportDsaPdf,

  bulkVerifyDsa,
  bulkBlockDsa,
} from "../../controllers/dsa/dsa.controller";

const router = Router();

/* ========================================
   ANALYTICS
======================================== */

router.get(
  "/analytics",
  getDsaAnalytics
);

router.get(
  "/dashboard",
  getDsaDashboard
);

router.get(
  "/top-performers",
  getTopDsa
);

router.get(
  "/monthly",
  getMonthlyDsa
);

/* ========================================
   EXPORT
======================================== */

router.get(
  "/export/excel",
  exportDsaExcel
);

router.get(
  "/export/pdf",
  exportDsaPdf
);

/* ========================================
   STATUS
======================================== */

router.get(
  "/active",
  getActiveDsa
);

router.get(
  "/inactive",
  getInactiveDsa
);

router.get(
  "/pending",
  getPendingDsa
);

router.get(
  "/verified",
  getVerifiedDsa
);

/* ========================================
   MANAGEMENT
======================================== */

router.post(
  "/",
  createDsa
);

router.get(
  "/",
  getAllDsa
);

router.get(
  "/search",
  searchDsa
);

router.get(
  "/profile/:dsaId",
  getDsaProfile
);

router.get(
  "/:id",
  getDsaById
);

router.put(
  "/:id",
  updateDsa
);

router.delete(
  "/:id",
  deleteDsa
);

/* ========================================
   VERIFICATION
======================================== */

router.patch(
  "/:id/verify",
  verifyDsa
);

router.patch(
  "/:id/reject",
  rejectDsa
);

router.patch(
  "/:id/block",
  blockDsa
);

router.patch(
  "/:id/unblock",
  unblockDsa
);

/* ========================================
   RELATIONS
======================================== */

router.get(
  "/:dsaId/customers",
  getDsaCustomers
);

router.get(
  "/:dsaId/loans",
  getDsaLoans
);

router.get(
  "/:dsaId/commissions",
  getDsaCommissions
);

router.get(
  "/:dsaId/referrals",
  getDsaReferrals
);

/* ========================================
   BULK ACTIONS
======================================== */

router.post(
  "/bulk-verify",
  bulkVerifyDsa
);

router.post(
  "/bulk-block",
  bulkBlockDsa
);

export default router;