"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const loanStatusHistory_controller_1 = require("../../controllers/loanStatusHistory/loanStatusHistory.controller");
const router = (0, express_1.Router)();
/* ========================================
   ANALYTICS
======================================== */
router.get("/analytics", loanStatusHistory_controller_1.getStatusAnalytics);
/* ========================================
   LOAN STATUS HISTORY
======================================== */
// Get history by Loan ID
router.get("/:loanId", loanStatusHistory_controller_1.getLoanStatusHistory);
// Create status entry
router.post("/", loanStatusHistory_controller_1.createStatusEntry);
// Update loan status
router.put("/:loanId", loanStatusHistory_controller_1.updateLoanStatus);
/* ========================================
   EXPORT ROUTER
======================================== */
exports.default = router;
