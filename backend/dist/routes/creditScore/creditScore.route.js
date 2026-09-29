"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const creditScore_controller_1 = require("../../controllers/creditScore/creditScore.controller");
const router = (0, express_1.Router)();
/* ========================================
   ANALYTICS
======================================== */
router.get("/analytics", creditScore_controller_1.getCreditAnalytics);
/* ========================================
   CREDIT SCORE
======================================== */
router.post("/check", creditScore_controller_1.checkCreditScore);
router.get("/", creditScore_controller_1.getAllCreditScores);
router.get("/:id", creditScore_controller_1.getCreditScoreById);
router.delete("/:id", creditScore_controller_1.deleteCreditScore);
exports.default = router;
