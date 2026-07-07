"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../../controllers/user/user.controller");
const router = (0, express_1.Router)();
/* =====================================
   DASHBOARD
===================================== */
router.get("/dashboard", user_controller_1.getUserDashboard);
router.get("/analytics", user_controller_1.getUserAnalytics);
/* =====================================
   STATUS
===================================== */
router.get("/pending", user_controller_1.getPendingUsers);
router.get("/verified", user_controller_1.getVerifiedUsers);
router.get("/blocked", user_controller_1.getBlockedUsers);
router.get("/active", user_controller_1.getActiveUsers);
/* =====================================
   USER LISTS
===================================== */
router.get("/top-users", user_controller_1.getTopUsers);
router.get("/new-users", user_controller_1.getNewUsers);
router.get("/recent-users", user_controller_1.getRecentUsers);
/* =====================================
   SEARCH
===================================== */
router.get("/search", user_controller_1.searchUsers);
/* =====================================
   PROFILE
===================================== */
router.get("/profile", user_controller_1.getUserProfile);
router.put("/profile", user_controller_1.updateProfile);
router.post("/profile/upload-image", user_controller_1.uploadProfileImage);
router.delete("/profile/remove-image", user_controller_1.removeProfileImage);
/* =====================================
   SECURITY
===================================== */
router.patch("/change-password", user_controller_1.changePassword);
router.patch("/reset-password", user_controller_1.resetPassword);
router.patch("/update-email", user_controller_1.updateEmail);
router.patch("/update-phone", user_controller_1.updatePhone);
router.patch("/verify-email", user_controller_1.verifyEmail);
router.patch("/verify-phone", user_controller_1.verifyPhone);
router.patch("/enable-2fa", user_controller_1.enableTwoFactorAuth);
router.patch("/disable-2fa", user_controller_1.disableTwoFactorAuth);
/* =====================================
   USER RESOURCES
===================================== */
router.get("/:userId/loans", user_controller_1.getUserLoans);
router.get("/:userId/transactions", user_controller_1.getUserTransactions);
router.get("/:userId/documents", user_controller_1.getUserDocuments);
router.get("/:userId/kyc", user_controller_1.getUserKyc);
router.get("/:userId/wallet", user_controller_1.getUserWallet);
router.get("/:userId/notifications", user_controller_1.getUserNotifications);
router.get("/:userId/referrals", user_controller_1.getUserReferrals);
router.get("/:userId/commissions", user_controller_1.getUserCommissions);
router.get("/:userId/achievements", user_controller_1.getUserAchievements);
router.get("/:userId/rank", user_controller_1.getUserLeaderboardRank);
/* =====================================
   HISTORY
===================================== */
router.get("/:userId/login-history", user_controller_1.getLoginHistory);
router.get("/:userId/activity-logs", user_controller_1.getActivityLogs);
/* =====================================
   USER ACTIONS
===================================== */
router.patch("/:id/verify", user_controller_1.verifyUser);
router.patch("/:id/block", user_controller_1.blockUser);
router.patch("/:id/unblock", user_controller_1.unblockUser);
router.patch("/:id/activate", user_controller_1.activateUser);
router.patch("/:id/deactivate", user_controller_1.deactivateUser);
/* =====================================
   EXPORT
===================================== */
router.get("/export/excel", user_controller_1.exportUsersExcel);
router.get("/export/pdf", user_controller_1.exportUsersPdf);
/* =====================================
   AUDIT
===================================== */
router.get("/audit-logs", user_controller_1.getUserAuditLogs);
/* =====================================
   CRUD
===================================== */
router.post("/", user_controller_1.createUser);
router.get("/", user_controller_1.getAllUsers);
router.get("/:id", user_controller_1.getUserById);
router.put("/:id", user_controller_1.updateUser);
router.delete("/:id", user_controller_1.deleteUser);
/* =====================================
   BULK ACTIONS
===================================== */
router.post("/bulk/verify", user_controller_1.bulkVerifyUsers);
router.post("/bulk/block", user_controller_1.bulkBlockUsers);
router.post("/bulk/unblock", user_controller_1.bulkUnblockUsers);
router.post("/bulk/delete", user_controller_1.bulkDeleteUsers);
exports.default = router;
