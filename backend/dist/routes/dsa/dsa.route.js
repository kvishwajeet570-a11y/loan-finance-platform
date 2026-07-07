"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dsa_controller_1 = require("../../controllers/dsa/dsa.controller");
const router = (0, express_1.Router)();
/* ========================================
   ANALYTICS
======================================== */
router.get("/analytics", dsa_controller_1.getDsaAnalytics);
router.get("/dashboard", dsa_controller_1.getDsaDashboard);
router.get("/top-performers", dsa_controller_1.getTopDsa);
router.get("/monthly", dsa_controller_1.getMonthlyDsa);
/* ========================================
   EXPORT
======================================== */
router.get("/export/excel", dsa_controller_1.exportDsaExcel);
router.get("/export/pdf", dsa_controller_1.exportDsaPdf);
/* ========================================
   STATUS
======================================== */
router.get("/active", dsa_controller_1.getActiveDsa);
router.get("/inactive", dsa_controller_1.getInactiveDsa);
router.get("/pending", dsa_controller_1.getPendingDsa);
router.get("/verified", dsa_controller_1.getVerifiedDsa);
/* ========================================
   MANAGEMENT
======================================== */
router.post("/", dsa_controller_1.createDsa);
router.get("/", dsa_controller_1.getAllDsa);
router.get("/search", dsa_controller_1.searchDsa);
router.get("/profile/:dsaId", dsa_controller_1.getDsaProfile);
router.get("/:id", dsa_controller_1.getDsaById);
router.put("/:id", dsa_controller_1.updateDsa);
router.delete("/:id", dsa_controller_1.deleteDsa);
/* ========================================
   VERIFICATION
======================================== */
router.patch("/:id/verify", dsa_controller_1.verifyDsa);
router.patch("/:id/reject", dsa_controller_1.rejectDsa);
router.patch("/:id/block", dsa_controller_1.blockDsa);
router.patch("/:id/unblock", dsa_controller_1.unblockDsa);
/* ========================================
   RELATIONS
======================================== */
router.get("/:dsaId/customers", dsa_controller_1.getDsaCustomers);
router.get("/:dsaId/loans", dsa_controller_1.getDsaLoans);
router.get("/:dsaId/commissions", dsa_controller_1.getDsaCommissions);
router.get("/:dsaId/referrals", dsa_controller_1.getDsaReferrals);
/* ========================================
   BULK ACTIONS
======================================== */
router.post("/bulk-verify", dsa_controller_1.bulkVerifyDsa);
router.post("/bulk-block", dsa_controller_1.bulkBlockDsa);
exports.default = router;
