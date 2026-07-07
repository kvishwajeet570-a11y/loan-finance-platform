"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const investment_controller_1 = require("../../controllers/investment/investment.controller");
const router = (0, express_1.Router)();
/* ========================================
   ANALYTICS
======================================== */
router.get("/analytics", investment_controller_1.getInvestmentAnalytics);
router.get("/dashboard", investment_controller_1.getInvestmentDashboard);
router.get("/top-investors", investment_controller_1.getTopInvestors);
router.get("/top-plans", investment_controller_1.getTopPlans);
router.get("/monthly", investment_controller_1.getMonthlyInvestments);
/* ========================================
   EXPORT
======================================== */
router.get("/export/excel", investment_controller_1.exportInvestmentsExcel);
router.get("/export/pdf", investment_controller_1.exportInvestmentsPdf);
/* ========================================
   STATUS
======================================== */
router.get("/pending", investment_controller_1.getPendingInvestments);
router.get("/active", investment_controller_1.getActiveInvestments);
router.get("/closed", investment_controller_1.getClosedInvestments);
router.get("/rejected", investment_controller_1.getRejectedInvestments);
/* ========================================
   INVESTMENT MANAGEMENT
======================================== */
router.post("/", investment_controller_1.createInvestment);
router.get("/", investment_controller_1.getAllInvestments);
router.get("/search", investment_controller_1.searchInvestments);
router.get("/user/:userId", investment_controller_1.getUserInvestments);
router.get("/:id", investment_controller_1.getInvestmentById);
router.put("/:id", investment_controller_1.updateInvestment);
router.delete("/:id", investment_controller_1.deleteInvestment);
/* ========================================
   APPROVAL
======================================== */
router.patch("/:id/approve", investment_controller_1.approveInvestment);
router.patch("/:id/reject", investment_controller_1.rejectInvestment);
/* ========================================
   INVESTMENT ACTIONS
======================================== */
router.patch("/:id/activate", investment_controller_1.activateInvestment);
router.patch("/:id/close", investment_controller_1.closeInvestment);
router.get("/:id/returns", investment_controller_1.getInvestmentReturns);
router.post("/calculate-returns", investment_controller_1.calculateReturns);
/* ========================================
   BULK ACTIONS
======================================== */
router.post("/bulk-approve", investment_controller_1.bulkApproveInvestments);
router.post("/bulk-reject", investment_controller_1.bulkRejectInvestments);
exports.default = router;
