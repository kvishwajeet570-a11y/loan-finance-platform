"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const creditScore_controller_1 = require("../../controllers/creditScore/creditScore.controller");
const router = (0, express_1.Router)();
/* ========================================
   ANALYTICS
======================================== */
router.get("/analytics", creditScore_controller_1.getCreditScoreAnalytics);
router.get("/distribution", creditScore_controller_1.getScoreDistribution);
router.get("/top-scores", creditScore_controller_1.getTopCreditScores);
router.get("/low-scores", creditScore_controller_1.getLowCreditScores);
router.get("/eligible-users", creditScore_controller_1.getEligibleUsers);
router.get("/monthly-checks", creditScore_controller_1.getMonthlyCreditChecks);
/* ========================================
   CREDIT SCORE
======================================== */
router.post("/check", creditScore_controller_1.checkCreditScore);
router.get("/", creditScore_controller_1.getAllCreditScores);
router.get("/search", creditScore_controller_1.searchCreditScores);
router.get("/latest/:userId", creditScore_controller_1.getLatestCreditScore);
router.get("/history/:userId", creditScore_controller_1.getCreditScoreHistory);
router.get("/user/:userId", creditScore_controller_1.getUserCreditScores);
router.get("/:id", creditScore_controller_1.getCreditScoreById);
router.put("/:id", creditScore_controller_1.updateCreditScore);
router.delete("/:id", creditScore_controller_1.deleteCreditScore);
router.patch("/refresh/:userId", creditScore_controller_1.refreshCreditScore);
exports.default = router;
