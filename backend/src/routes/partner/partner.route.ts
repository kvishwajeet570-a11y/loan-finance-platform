import { Router } from "express";

import {
  createPartner,
  getPartnerById,
  getAllPartners,

  updatePartner,
  deletePartner,

  verifyPartner,
  rejectPartner,

  blockPartner,
  unblockPartner,

  getPartnerProfile,
  getPartnerDashboard,

  getPartnerCustomers,
  getPartnerLoans,
  getPartnerCommissions,
  getPartnerReferrals,

  getPartnerTransactions,
  getPartnerWallet,

  searchPartners,

  getPendingPartners,
  getVerifiedPartners,
  getBlockedPartners,
  getActivePartners,

  getTopPartners,
  getMonthlyPartners,

  getPartnerAnalytics,

  exportPartnersExcel,
  exportPartnersPdf,

  bulkVerifyPartners,
  bulkBlockPartners,
} from "../../controllers/partner/partner.controller";

const router = Router();

/* ========================================
   DASHBOARD & ANALYTICS
======================================== */

router.get(
  "/dashboard",
  getPartnerDashboard
);

router.get(
  "/analytics",
  getPartnerAnalytics
);

router.get(
  "/top-performers",
  getTopPartners
);

router.get(
  "/monthly",
  getMonthlyPartners
);

/* ========================================
   EXPORTS
======================================== */

router.get(
  "/export/excel",
  exportPartnersExcel
);

router.get(
  "/export/pdf",
  exportPartnersPdf
);

/* ========================================
   STATUS
======================================== */

router.get(
  "/pending",
  getPendingPartners
);

router.get(
  "/verified",
  getVerifiedPartners
);

router.get(
  "/blocked",
  getBlockedPartners
);

router.get(
  "/active",
  getActivePartners
);

/* ========================================
   PARTNER MANAGEMENT
======================================== */

router.post(
  "/",
  createPartner
);

router.get(
  "/",
  getAllPartners
);

router.get(
  "/search",
  searchPartners
);

router.get(
  "/profile/:partnerId",
  getPartnerProfile
);

router.get(
  "/:id",
  getPartnerById
);

router.put(
  "/:id",
  updatePartner
);

router.delete(
  "/:id",
  deletePartner
);

/* ========================================
   VERIFICATION
======================================== */

router.patch(
  "/:id/verify",
  verifyPartner
);

router.patch(
  "/:id/reject",
  rejectPartner
);

router.patch(
  "/:id/block",
  blockPartner
);

router.patch(
  "/:id/unblock",
  unblockPartner
);

/* ========================================
   RELATIONS
======================================== */

router.get(
  "/:partnerId/customers",
  getPartnerCustomers
);

router.get(
  "/:partnerId/loans",
  getPartnerLoans
);

router.get(
  "/:partnerId/commissions",
  getPartnerCommissions
);

router.get(
  "/:partnerId/referrals",
  getPartnerReferrals
);

router.get(
  "/:partnerId/transactions",
  getPartnerTransactions
);

router.get(
  "/:partnerId/wallet",
  getPartnerWallet
);

/* ========================================
   BULK ACTIONS
======================================== */

router.post(
  "/bulk-verify",
  bulkVerifyPartners
);

router.post(
  "/bulk-block",
  bulkBlockPartners
);

export default router;