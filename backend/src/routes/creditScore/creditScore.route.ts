import { Router } from "express";
import authMiddleware from "../../middlewares/AuthMiddleware";
import roleMiddleware from "../../middlewares/RoleMiddleware";

import {
  checkCreditScore,
  checkDsaCreditScore,
  getCreditScoreById,
  getAllCreditScores,
  deleteCreditScore,
  getCreditAnalytics,
  getMyCreditScoreHistory,
} from "../../controllers/creditScore/creditScore.controller";

const router = Router();

/* ========================================
   ANALYTICS
======================================== */

router.get(
  "/analytics",
  getCreditAnalytics
);

/* ========================================
   CREDIT SCORE
======================================== */

router.get("/my-history", authMiddleware, roleMiddleware("CUSTOMER", "USER"), getMyCreditScoreHistory);
router.post("/dsa-check", authMiddleware, roleMiddleware("DSA"), checkDsaCreditScore);
router.post("/check", authMiddleware, roleMiddleware("CUSTOMER", "USER"), checkCreditScore);

router.get(
  "/",
  getAllCreditScores
);

router.get(
  "/:id",
  getCreditScoreById
);

router.delete(
  "/:id",
  deleteCreditScore
);

export default router;







