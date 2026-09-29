import { Router } from "express";

import {
  getAllLoginHistory,
  getUserLoginHistory,
  logoutSession,
  loginAnalytics,
} from "../../controllers/loginHistory/loginHistory.controller";

const router = Router();

router.get("/", getAllLoginHistory);

router.get("/analytics", loginAnalytics);

router.get("/user/:userId", getUserLoginHistory);

router.put("/logout/:id", logoutSession);

export default router;