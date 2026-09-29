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

import authenticate from "../../middlewares/AuthMiddleware";
import roleMiddleware from "../../middlewares/RoleMiddleware";

const router = Router();

/* ========================================
   GLOBAL SECURITY
======================================== */

router.use(authenticate);

/* ========================================
   DASHBOARD
======================================== */

router.get(
  "/dashboard",
  roleMiddleware("SUPER_ADMIN", "ADMIN", "PARTNER"),
  getPartnerDashboard
);

router.get(
  "/analytics",
  roleMiddleware("SUPER_ADMIN", "ADMIN"),
  getPartnerAnalytics
);

router.get(
  "/top-performers",
  roleMiddleware("SUPER_ADMIN", "ADMIN"),
  getTopPartners
);

router.get(
  "/monthly",
  roleMiddleware("SUPER_ADMIN", "ADMIN"),
  getMonthlyPartners
);

/* ========================================
   EXPORTS
======================================== */

router.get(
  "/export/excel",
  roleMiddleware("SUPER_ADMIN", "ADMIN"),
  exportPartnersExcel
);

router.get(
  "/export/pdf",
  roleMiddleware("SUPER_ADMIN", "ADMIN"),
  exportPartnersPdf
);

/* ========================================
   STATUS FILTERS
======================================== */

router.get(
  "/pending",
  roleMiddleware("SUPER_ADMIN", "ADMIN"),
  getPendingPartners
);

router.get(
  "/verified",
  roleMiddleware("SUPER_ADMIN", "ADMIN"),
  getVerifiedPartners
);

router.get(
  "/blocked",
  roleMiddleware("SUPER_ADMIN", "ADMIN"),
  getBlockedPartners
);

router.get(
  "/active",
  roleMiddleware("SUPER_ADMIN", "ADMIN"),
  getActivePartners
);

/* ========================================
   SEARCH
======================================== */

router.get(
  "/search",
  roleMiddleware("SUPER_ADMIN", "ADMIN"),
  searchPartners
);

/* ========================================
   EXPORT ROUTER
======================================== */

export default router;