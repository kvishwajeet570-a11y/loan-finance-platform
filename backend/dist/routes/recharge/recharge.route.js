"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const recharge_controller_1 = require("../../controllers/recharge/recharge.controller");
const router = (0, express_1.Router)();
/* ========================================
   DASHBOARD & ANALYTICS
======================================== */
router.get("/dashboard", recharge_controller_1.getRechargeDashboard);
router.get("/analytics", recharge_controller_1.getRechargeAnalytics);
router.get("/top-users", recharge_controller_1.getTopRechargeUsers);
router.get("/monthly", recharge_controller_1.getMonthlyRecharges);
/* ========================================
   EXPORT
======================================== */
router.get("/export/excel", recharge_controller_1.exportRechargeExcel);
router.get("/export/pdf", recharge_controller_1.exportRechargePdf);
/* ========================================
   STATUS
======================================== */
router.get("/pending", recharge_controller_1.getPendingRecharges);
router.get("/success", recharge_controller_1.getSuccessRecharges);
router.get("/failed", recharge_controller_1.getFailedRecharges);
router.get("/refunded", recharge_controller_1.getRefundedRecharges);
/* ========================================
   CATEGORY
======================================== */
router.get("/mobile", recharge_controller_1.getMobileRecharges);
router.get("/dth", recharge_controller_1.getDthRecharges);
router.get("/fastag", recharge_controller_1.getFastagRecharges);
/* ========================================
   RECHARGE MANAGEMENT
======================================== */
router.post("/", recharge_controller_1.createRecharge);
router.post("/process", recharge_controller_1.processRecharge);
router.post("/verify", recharge_controller_1.verifyRecharge);
router.get("/", recharge_controller_1.getAllRecharges);
router.get("/search", recharge_controller_1.searchRecharges);
router.get("/user/:userId", recharge_controller_1.getUserRecharges);
router.get("/:id", recharge_controller_1.getRechargeById);
router.put("/:id", recharge_controller_1.updateRecharge);
router.delete("/:id", recharge_controller_1.deleteRecharge);
/* ========================================
   RECHARGE ACTIONS
======================================== */
router.patch("/:id/success", recharge_controller_1.markRechargeSuccess);
router.patch("/:id/failed", recharge_controller_1.markRechargeFailed);
router.patch("/:id/refund", recharge_controller_1.refundRecharge);
/* ========================================
   BULK ACTIONS
======================================== */
router.post("/bulk-process", recharge_controller_1.bulkProcessRecharge);
router.post("/bulk-refund", recharge_controller_1.bulkRefundRecharge);
exports.default = router;
