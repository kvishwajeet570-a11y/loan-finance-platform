"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const insurance_controller_1 = require("../../controllers/insurance/insurance.controller");
const router = (0, express_1.Router)();
/* ========================================
   ANALYTICS
======================================== */
router.get("/analytics", insurance_controller_1.getInsuranceAnalytics);
router.get("/dashboard", insurance_controller_1.getInsuranceDashboard);
router.get("/top-agents", insurance_controller_1.getTopAgents);
router.get("/top-policies", insurance_controller_1.getTopPolicies);
router.get("/monthly-policies", insurance_controller_1.getMonthlyPolicies);
/* ========================================
   EXPORT
======================================== */
router.get("/export/excel", insurance_controller_1.exportInsuranceExcel);
router.get("/export/pdf", insurance_controller_1.exportInsurancePdf);
/* ========================================
   POLICY STATUS
======================================== */
router.get("/pending", insurance_controller_1.getPendingPolicies);
router.get("/active", insurance_controller_1.getActivePolicies);
router.get("/expired", insurance_controller_1.getExpiredPolicies);
router.get("/cancelled", insurance_controller_1.getCancelledPolicies);
/* ========================================
   POLICY MANAGEMENT
======================================== */
router.post("/", insurance_controller_1.createInsurance);
router.get("/", insurance_controller_1.getAllInsurances);
router.get("/search", insurance_controller_1.searchPolicies);
router.get("/policy/:policyNo", insurance_controller_1.getPolicyByNumber);
router.get("/user/:userId", insurance_controller_1.getUserPolicies);
router.get("/:id", insurance_controller_1.getInsuranceById);
router.put("/:id", insurance_controller_1.updateInsurance);
router.delete("/:id", insurance_controller_1.deleteInsurance);
/* ========================================
   POLICY ACTIONS
======================================== */
router.patch("/:id/approve", insurance_controller_1.approveInsurance);
router.patch("/:id/reject", insurance_controller_1.rejectInsurance);
router.patch("/:id/activate", insurance_controller_1.activatePolicy);
router.patch("/:id/deactivate", insurance_controller_1.deactivatePolicy);
router.patch("/:id/renew", insurance_controller_1.renewPolicy);
router.patch("/:id/cancel", insurance_controller_1.cancelPolicy);
/* ========================================
   CLAIMS
======================================== */
router.get("/:id/claims", insurance_controller_1.getPolicyClaims);
router.post("/:id/claims", insurance_controller_1.createClaim);
router.patch("/claim/:claimId/approve", insurance_controller_1.approveClaim);
router.patch("/claim/:claimId/reject", insurance_controller_1.rejectClaim);
/* ========================================
   BULK ACTIONS
======================================== */
router.post("/bulk-approve", insurance_controller_1.bulkApprovePolicies);
router.post("/bulk-reject", insurance_controller_1.bulkRejectPolicies);
exports.default = router;
