"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const profile_controller_1 = require("../../controllers/profile/profile.controller");
const router = (0, express_1.Router)();
/* ========================================
   DASHBOARD & ANALYTICS
======================================== */
router.get("/dashboard", profile_controller_1.getProfileDashboard);
router.get("/analytics", profile_controller_1.getProfileAnalytics);
/* ========================================
   MY PROFILE
======================================== */
router.get("/me", profile_controller_1.getMyProfile);
router.put("/update", profile_controller_1.updateProfile);
router.put("/personal-info", profile_controller_1.updatePersonalInfo);
router.put("/address-info", profile_controller_1.updateAddressInfo);
/* ========================================
   PROFILE IMAGE
======================================== */
router.patch("/image", profile_controller_1.updateProfileImage);
router.delete("/image", profile_controller_1.removeProfileImage);
/* ========================================
   ACCOUNT SETTINGS
======================================== */
router.patch("/change-password", profile_controller_1.changePassword);
router.patch("/change-email", profile_controller_1.changeEmail);
router.patch("/change-phone", profile_controller_1.changePhone);
/* ========================================
   VERIFICATION
======================================== */
router.patch("/verify-email", profile_controller_1.verifyEmail);
router.patch("/verify-phone", profile_controller_1.verifyPhone);
/* ========================================
   SECURITY
======================================== */
router.patch("/enable-2fa", profile_controller_1.enableTwoFactorAuth);
router.patch("/disable-2fa", profile_controller_1.disableTwoFactorAuth);
router.get("/login-history", profile_controller_1.getLoginHistory);
router.get("/activity", profile_controller_1.getProfileActivity);
/* ========================================
   PROFILE MODULES
======================================== */
router.get("/documents", profile_controller_1.getProfileDocuments);
router.get("/kyc", profile_controller_1.getProfileKyc);
router.get("/loans", profile_controller_1.getProfileLoans);
router.get("/wallet", profile_controller_1.getProfileWallet);
router.get("/transactions", profile_controller_1.getProfileTransactions);
router.get("/notifications", profile_controller_1.getProfileNotifications);
/* ========================================
   PROFILE STATUS
======================================== */
router.patch("/deactivate", profile_controller_1.deactivateProfile);
router.patch("/reactivate", profile_controller_1.reactivateProfile);
/* ========================================
   EXPORT
======================================== */
router.get("/export/pdf", profile_controller_1.exportProfilePdf);
router.get("/export/excel", profile_controller_1.exportProfileExcel);
/* ========================================
   ADMIN PROFILE ACCESS
======================================== */
router.get("/:id", profile_controller_1.getProfileById);
exports.default = router;
