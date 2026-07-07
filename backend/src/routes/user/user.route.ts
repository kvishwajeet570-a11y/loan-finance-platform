import { Router } from "express";

import {
  createUser,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,

  getUserProfile,
  updateProfile,

  verifyUser,
  blockUser,
  unblockUser,

  activateUser,
  deactivateUser,

  getUserDashboard,
  getUserAnalytics,

  getUserLoans,
  getUserTransactions,
  getUserDocuments,
  getUserKyc,

  getUserWallet,
  getUserNotifications,

  getUserReferrals,
  getUserCommissions,

  getUserAchievements,
  getUserLeaderboardRank,

  uploadProfileImage,
  removeProfileImage,

  changePassword,
  resetPassword,

  updateEmail,
  updatePhone,

  verifyEmail,
  verifyPhone,

  enableTwoFactorAuth,
  disableTwoFactorAuth,

  getLoginHistory,
  getActivityLogs,

  getPendingUsers,
  getVerifiedUsers,
  getBlockedUsers,
  getActiveUsers,

  searchUsers,

  getTopUsers,
  getNewUsers,
  getRecentUsers,

  exportUsersExcel,
  exportUsersPdf,

  getUserAuditLogs,

  bulkVerifyUsers,
  bulkBlockUsers,
  bulkUnblockUsers,
  bulkDeleteUsers,
} from "../../controllers/user/user.controller";

const router = Router();

/* =====================================
   DASHBOARD
===================================== */

router.get("/dashboard", getUserDashboard);

router.get("/analytics", getUserAnalytics);

/* =====================================
   STATUS
===================================== */

router.get("/pending", getPendingUsers);

router.get("/verified", getVerifiedUsers);

router.get("/blocked", getBlockedUsers);

router.get("/active", getActiveUsers);

/* =====================================
   USER LISTS
===================================== */

router.get("/top-users", getTopUsers);

router.get("/new-users", getNewUsers);

router.get("/recent-users", getRecentUsers);

/* =====================================
   SEARCH
===================================== */

router.get("/search", searchUsers);

/* =====================================
   PROFILE
===================================== */

router.get("/profile", getUserProfile);

router.put("/profile", updateProfile);

router.post(
  "/profile/upload-image",
  uploadProfileImage
);

router.delete(
  "/profile/remove-image",
  removeProfileImage
);

/* =====================================
   SECURITY
===================================== */

router.patch(
  "/change-password",
  changePassword
);

router.patch(
  "/reset-password",
  resetPassword
);

router.patch(
  "/update-email",
  updateEmail
);

router.patch(
  "/update-phone",
  updatePhone
);

router.patch(
  "/verify-email",
  verifyEmail
);

router.patch(
  "/verify-phone",
  verifyPhone
);

router.patch(
  "/enable-2fa",
  enableTwoFactorAuth
);

router.patch(
  "/disable-2fa",
  disableTwoFactorAuth
);

/* =====================================
   USER RESOURCES
===================================== */

router.get(
  "/:userId/loans",
  getUserLoans
);

router.get(
  "/:userId/transactions",
  getUserTransactions
);

router.get(
  "/:userId/documents",
  getUserDocuments
);

router.get(
  "/:userId/kyc",
  getUserKyc
);

router.get(
  "/:userId/wallet",
  getUserWallet
);

router.get(
  "/:userId/notifications",
  getUserNotifications
);

router.get(
  "/:userId/referrals",
  getUserReferrals
);

router.get(
  "/:userId/commissions",
  getUserCommissions
);

router.get(
  "/:userId/achievements",
  getUserAchievements
);

router.get(
  "/:userId/rank",
  getUserLeaderboardRank
);

/* =====================================
   HISTORY
===================================== */

router.get(
  "/:userId/login-history",
  getLoginHistory
);

router.get(
  "/:userId/activity-logs",
  getActivityLogs
);

/* =====================================
   USER ACTIONS
===================================== */

router.patch(
  "/:id/verify",
  verifyUser
);

router.patch(
  "/:id/block",
  blockUser
);

router.patch(
  "/:id/unblock",
  unblockUser
);

router.patch(
  "/:id/activate",
  activateUser
);

router.patch(
  "/:id/deactivate",
  deactivateUser
);

/* =====================================
   EXPORT
===================================== */

router.get(
  "/export/excel",
  exportUsersExcel
);

router.get(
  "/export/pdf",
  exportUsersPdf
);

/* =====================================
   AUDIT
===================================== */

router.get(
  "/audit-logs",
  getUserAuditLogs
);

/* =====================================
   CRUD
===================================== */

router.post("/", createUser);

router.get("/", getAllUsers);

router.get("/:id", getUserById);

router.put("/:id", updateUser);

router.delete("/:id", deleteUser);

/* =====================================
   BULK ACTIONS
===================================== */

router.post(
  "/bulk/verify",
  bulkVerifyUsers
);

router.post(
  "/bulk/block",
  bulkBlockUsers
);

router.post(
  "/bulk/unblock",
  bulkUnblockUsers
);

router.post(
  "/bulk/delete",
  bulkDeleteUsers
);

export default router;