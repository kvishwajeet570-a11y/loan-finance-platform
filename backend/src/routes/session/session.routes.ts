import { Router } from "express";
import authMiddleware from "../../middlewares/auth";
import adminMiddleware from "../../middlewares/admin";
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

const router = Router();

router.use(authMiddleware, adminMiddleware);

router.get("/analytics", sessionAnalytics);
router.get("/user/:userId/summary", userSessionSummary);
router.get("/user/:userId", getUserSessions);
router.get("/", getAllSessions);
router.get("/:id", getSessionById);
router.patch("/:id/logout", forceLogoutSession);
router.patch("/user/:userId/logout-all", logoutAllUserSessions);
router.delete("/cleanup", cleanupExpiredSessions);
router.delete("/:id", deleteSession);

export default router;
