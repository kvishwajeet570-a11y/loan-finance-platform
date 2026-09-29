import { Router } from "express";

import {
  getAllSessions,
  getUserSessions,
  getSessionById,
  forceLogoutSession,
  logoutAllUserSessions,
  sessionAnalytics,
  cleanupExpiredSessions,
  deleteSession,
  userSessionSummary,
} from "../../controllers/session/session.controller";

// Uncomment according to your project
// import { authenticate } from "../../middlewares/auth.middleware";
// import { authorize } from "../../middlewares/role.middleware";
// import { validate } from "../../middlewares/validate.middleware";

// import {
//   sessionIdSchema,
//   userSessionSchema,
//   sessionQuerySchema,
//   cleanupSessionSchema,
// } from "../../dto/session/session.dto";

const router = Router();

/* ==========================================================
   SESSION MANAGEMENT
========================================================== */

// Get All Sessions
router.get(
  "/",
  // authenticate,
  // authorize("SUPER_ADMIN", "ADMIN"),
  // validate(sessionQuerySchema),
  getAllSessions
);

// Session Analytics Dashboard
router.get(
  "/analytics",
  // authenticate,
  // authorize("SUPER_ADMIN"),
  sessionAnalytics
);

// Cleanup Expired Sessions
router.delete(
  "/cleanup",
  // authenticate,
  // authorize("SUPER_ADMIN"),
  // validate(cleanupSessionSchema),
  cleanupExpiredSessions
);

// Get Session By ID
router.get(
  "/:id",
  // authenticate,
  // validate(sessionIdSchema),
  getSessionById
);

// Force Logout Single Session
router.patch(
  "/:id/logout",
  // authenticate,
  // authorize("SUPER_ADMIN", "ADMIN"),
  // validate(sessionIdSchema),
  forceLogoutSession
);

// Delete Session
router.delete(
  "/:id",
  // authenticate,
  // authorize("SUPER_ADMIN"),
  // validate(sessionIdSchema),
  deleteSession
);

// Get User Sessions
router.get(
  "/user/:userId",
  // authenticate,
  // validate(userSessionSchema),
  getUserSessions
);

// User Session Summary
router.get(
  "/user/:userId/summary",
  // authenticate,
  // validate(userSessionSchema),
  userSessionSummary
);

// Logout All User Sessions
router.patch(
  "/user/:userId/logout-all",
  // authenticate,
  // authorize("SUPER_ADMIN", "ADMIN"),
  // validate(userSessionSchema),
  logoutAllUserSessions
);

export default router;