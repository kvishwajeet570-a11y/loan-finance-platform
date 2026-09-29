"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dsa_controller_1 = require("../../controllers/dsa/dsa.controller");
const router = (0, express_1.Router)();
/* ==========================
   ANALYTICS
========================== */
router.get("/analytics", dsa_controller_1.getDSAAnalytics);
router.get("/top-performers", dsa_controller_1.getTopDSA);
/* ==========================
   DASHBOARD
========================== */
router.get("/dashboard/:id", dsa_controller_1.getDSADashboard);
/* ==========================
   MANAGEMENT
========================== */
router.post("/", dsa_controller_1.createDSA);
router.get("/", dsa_controller_1.getDSAs);
router.get("/:id", dsa_controller_1.getDSAById);
/* ==========================
   VERIFICATION
========================== */
router.patch("/:id/approve", dsa_controller_1.approveDSA);
router.patch("/:id/reject", dsa_controller_1.rejectDSA);
router.patch("/:id/block", dsa_controller_1.blockDSA);
router.patch("/:id/unblock", dsa_controller_1.unblockDSA);
/* ==========================
   DSA LOANS
========================== */
router.get("/:id/loans", dsa_controller_1.getDSALoans);
exports.default = router;
