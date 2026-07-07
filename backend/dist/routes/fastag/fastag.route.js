"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fastag_controller_1 = require("../../controllers/fastag/fastag.controller");
const router = (0, express_1.Router)();
/* ========================================
   ANALYTICS
======================================== */
router.get("/analytics", fastag_controller_1.getFastagAnalytics);
router.get("/dashboard", fastag_controller_1.getFastagDashboard);
router.get("/top-recharges", fastag_controller_1.getTopRechargeUsers);
router.get("/monthly-recharges", fastag_controller_1.getMonthlyRecharges);
/* ========================================
   EXPORT
======================================== */
router.get("/export/excel", fastag_controller_1.exportFastagExcel);
router.get("/export/pdf", fastag_controller_1.exportFastagPdf);
/* ========================================
   STATUS
======================================== */
router.get("/active", fastag_controller_1.getActiveFastags);
router.get("/inactive", fastag_controller_1.getInactiveFastags);
router.get("/blocked", fastag_controller_1.getBlockedFastags);
/* ========================================
   MANAGEMENT
======================================== */
router.post("/", fastag_controller_1.createFastag);
router.get("/", fastag_controller_1.getAllFastags);
router.get("/search", fastag_controller_1.searchFastags);
router.get("/vehicle/:vehicleNo", fastag_controller_1.getFastagByVehicle);
router.get("/user/:userId", fastag_controller_1.getUserFastags);
router.get("/:id", fastag_controller_1.getFastagById);
router.put("/:id", fastag_controller_1.updateFastag);
router.delete("/:id", fastag_controller_1.deleteFastag);
/* ========================================
   FASTAG ACTIONS
======================================== */
router.patch("/:id/activate", fastag_controller_1.activateFastag);
router.patch("/:id/deactivate", fastag_controller_1.deactivateFastag);
router.patch("/:id/block", fastag_controller_1.blockFastag);
router.patch("/:id/unblock", fastag_controller_1.unblockFastag);
router.post("/:id/recharge", fastag_controller_1.rechargeFastag);
/* ========================================
   TRANSACTIONS
======================================== */
router.get("/:id/transactions", fastag_controller_1.getFastagTransactions);
/* ========================================
   BULK ACTIONS
======================================== */
router.post("/bulk-activate", fastag_controller_1.bulkActivateFastags);
router.post("/bulk-block", fastag_controller_1.bulkBlockFastags);
exports.default = router;
