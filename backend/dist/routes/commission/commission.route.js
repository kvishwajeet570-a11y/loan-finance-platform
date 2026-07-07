"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const commission_controller_1 = require("../../controllers/commission/commission.controller");
const router = (0, express_1.Router)();
/* ========================================
   ANALYTICS
======================================== */
router.get("/analytics", commission_controller_1.getCommissionAnalytics);
router.get("/top-earners", commission_controller_1.getTopEarners);
router.get("/monthly", commission_controller_1.getMonthlyCommission);
/* ========================================
   COMMISSIONS
======================================== */
router.post("/", commission_controller_1.createCommission);
router.get("/", commission_controller_1.getAllCommissions);
router.get("/pending", commission_controller_1.getPendingCommissions);
router.get("/search", commission_controller_1.searchCommissions);
router.get("/user/:userId", commission_controller_1.getUserCommissions);
router.get("/:id", commission_controller_1.getCommissionById);
/* ========================================
   APPROVAL FLOW
======================================== */
router.patch("/:id/approve", commission_controller_1.approveCommission);
router.patch("/:id/reject", commission_controller_1.rejectCommission);
router.patch("/:id/pay", commission_controller_1.markCommissionPaid);
exports.default = router;
