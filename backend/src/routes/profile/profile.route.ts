import { Router } from "express";

import {
  getMyProfile,
  getProfileById,
  updateProfile,

  updateProfileImage,
  removeProfileImage,

  updatePersonalInfo,
  updateAddressInfo,

  changePassword,
  changeEmail,
  changePhone,

  verifyEmail,
  verifyPhone,

  enableTwoFactorAuth,
  disableTwoFactorAuth,

  getProfileAnalytics,
  getProfileDashboard,

  getProfileActivity,
  getLoginHistory,

  getProfileDocuments,
  getProfileKyc,
  getProfileLoans,
  getProfileWallet,
  getProfileTransactions,
  getProfileNotifications,

  deactivateProfile,
  reactivateProfile,

  exportProfilePdf,
  exportProfileExcel,
} from "../../controllers/profile/profile.controller";

const router = Router();

/* ========================================
   DASHBOARD & ANALYTICS
======================================== */

router.get(
  "/dashboard",
  getProfileDashboard
);

router.get(
  "/analytics",
  getProfileAnalytics
);

/* ========================================
   MY PROFILE
======================================== */

router.get(
  "/me",
  getMyProfile
);

router.put(
  "/update",
  updateProfile
);

router.put(
  "/personal-info",
  updatePersonalInfo
);

router.put(
  "/address-info",
  updateAddressInfo
);

/* ========================================
   PROFILE IMAGE
======================================== */

router.patch(
  "/image",
  updateProfileImage
);

router.delete(
  "/image",
  removeProfileImage
);

/* ========================================
   ACCOUNT SETTINGS
======================================== */

router.patch(
  "/change-password",
  changePassword
);

router.patch(
  "/change-email",
  changeEmail
);

router.patch(
  "/change-phone",
  changePhone
);

/* ========================================
   VERIFICATION
======================================== */

router.patch(
  "/verify-email",
  verifyEmail
);

router.patch(
  "/verify-phone",
  verifyPhone
);

/* ========================================
   SECURITY
======================================== */

router.patch(
  "/enable-2fa",
  enableTwoFactorAuth
);

router.patch(
  "/disable-2fa",
  disableTwoFactorAuth
);

router.get(
  "/login-history",
  getLoginHistory
);

router.get(
  "/activity",
  getProfileActivity
);

/* ========================================
   PROFILE MODULES
======================================== */

router.get(
  "/documents",
  getProfileDocuments
);

router.get(
  "/kyc",
  getProfileKyc
);

router.get(
  "/loans",
  getProfileLoans
);

router.get(
  "/wallet",
  getProfileWallet
);

router.get(
  "/transactions",
  getProfileTransactions
);

router.get(
  "/notifications",
  getProfileNotifications
);

/* ========================================
   PROFILE STATUS
======================================== */

router.patch(
  "/deactivate",
  deactivateProfile
);

router.patch(
  "/reactivate",
  reactivateProfile
);

/* ========================================
   EXPORT
======================================== */

router.get(
  "/export/pdf",
  exportProfilePdf
);

router.get(
  "/export/excel",
  exportProfileExcel
);

/* ========================================
   ADMIN PROFILE ACCESS
======================================== */

router.get(
  "/:id",
  getProfileById
);

export default router;