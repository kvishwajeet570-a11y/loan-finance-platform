import { Router } from "express";
import authMiddleware from "../../middlewares/auth";
import adminMiddleware from "../../middlewares/admin";
import {
  getAllSecurityLogs,
  getUserSecurityLogs,
  cleanupSecurityLogs,
  securityAnalytics,
} from "../../controllers/securityLog/securityLog.controller";

const router = Router();

router.use(authMiddleware, adminMiddleware);

router.get("/analytics", securityAnalytics);
router.get("/user/:userId", getUserSecurityLogs);
router.get("/", getAllSecurityLogs);
router.delete("/cleanup", cleanupSecurityLogs);

export default router;
