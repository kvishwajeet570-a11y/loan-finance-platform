"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const commission_controller_1 = __importDefault(require("../../controllers/commission/commission.controller"));
const router = (0, express_1.Router)();
/* ========================================
   ANALYTICS
======================================== */
router.get("/analytics", commission_controller_1.default.getCommissionAnalytics);
router.get("/top-earners", commission_controller_1.default.getTopEarners);
router.get("/monthly", commission_controller_1.default.getMonthlyCommission);
/* ========================================
   COMMISSIONS
======================================== */
router.post("/", commission_controller_1.default.createCommission);
router.get("/", commission_controller_1.default.getAllCommissions);
router.get("/pending", commission_controller_1.default.getPendingCommissions);
router.get("/search", commission_controller_1.default.searchCommissions);
router.get("/user/:userId", commission_controller_1.default.getUserCommissions);
router.get("/:id", commission_controller_1.default.getCommissionById);
/* ========================================
   APPROVAL FLOW
======================================== */
router.patch("/:id/approve", commission_controller_1.default.approveCommission);
router.patch("/:id/reject", commission_controller_1.default.rejectCommission);
router.patch("/:id/pay", commission_controller_1.default.markCommissionPaid);
exports.default = router;
