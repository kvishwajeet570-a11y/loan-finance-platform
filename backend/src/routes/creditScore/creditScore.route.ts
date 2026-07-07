import { Router } from "express";

import {
  checkCreditScore,
  getCreditScoreById,
  getUserCreditScores,
  getLatestCreditScore,
  getCreditScoreHistory,
  updateCreditScore,
  deleteCreditScore,
  searchCreditScores,
  getAllCreditScores,
  getCreditScoreAnalytics,
  getScoreDistribution,
  getTopCreditScores,
  getLowCreditScores,
  getEligibleUsers,
  getMonthlyCreditChecks,
  refreshCreditScore,
} from "../../controllers/creditScore/creditScore.controller";

const router = Router();

/* ========================================
   ANALYTICS
======================================== */

router.get(
  "/analytics",
  getCreditScoreAnalytics
);

router.get(
  "/distribution",
  getScoreDistribution
);

router.get(
  "/top-scores",
  getTopCreditScores
);

router.get(
  "/low-scores",
  getLowCreditScores
);

router.get(
  "/eligible-users",
  getEligibleUsers
);

router.get(
  "/monthly-checks",
  getMonthlyCreditChecks
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
  "/search",
  searchCreditScores
);

router.get(
  "/latest/:userId",
  getLatestCreditScore
);

router.get(
  "/history/:userId",
  getCreditScoreHistory
);

router.get(
  "/user/:userId",
  getUserCreditScores
);

router.get(
  "/:id",
  getCreditScoreById
);

router.put(
  "/:id",
  updateCreditScore
);

router.delete(
  "/:id",
  deleteCreditScore
);

router.patch(
  "/refresh/:userId",
  refreshCreditScore
);

export default router;