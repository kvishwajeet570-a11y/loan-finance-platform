"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const insurance_controller_1 = require("../../controllers/insurance/insurance.controller");
const router = (0, express_1.Router)();
/* =========================================
   ANALYTICS
========================================= */
router.get("/analytics", insurance_controller_1.getInsuranceAnalytics);
/* =========================================
   USER POLICIES
========================================= */
router.get("/user/:userId", insurance_controller_1.getUserPolicies);
/* =========================================
   CLAIMS
========================================= */
router.get("/:id/claims", insurance_controller_1.getPolicyClaims);
router.post("/:id/claims", insurance_controller_1.createClaim);
router.patch("/claim/:claimId/approve", insurance_controller_1.approveClaim);
router.patch("/claim/:claimId/reject", insurance_controller_1.rejectClaim);
/* =========================================
   INSURANCE CRUD
========================================= */
router.post("/", insurance_controller_1.createInsurance);
router.get("/", insurance_controller_1.getAllInsurances);
router.get("/:id", insurance_controller_1.getInsuranceById);
router.put("/:id", insurance_controller_1.updateInsurance);
router.delete("/:id", insurance_controller_1.deleteInsurance);
/* =========================================
   APPLICATION ACTIONS
========================================= */
router.patch("/:id/approve", insurance_controller_1.approveInsurance);
router.patch("/:id/reject", insurance_controller_1.rejectInsurance);
exports.default = router;
