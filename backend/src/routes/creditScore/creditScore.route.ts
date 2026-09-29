import { Router } from "express";

import {
  checkCreditScore,
  getCreditScoreById,
  getAllCreditScores,
  deleteCreditScore,
  getCreditAnalytics,
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

router.post(
  "/check",
  checkCreditScore
);

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