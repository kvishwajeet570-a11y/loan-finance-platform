"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const audit_controller_1 = require("../../controllers/audit/audit.controller");
const router = (0, express_1.Router)();
/* ========================================
   AUDIT DASHBOARD
======================================== */
router.get("/stats", audit_controller_1.getAuditStats);
/* ========================================
   AUDIT LOGS
======================================== */
router.get("/", audit_controller_1.getAuditLogs);
router.post("/", audit_controller_1.createAuditLog);
/* ========================================
   USER LOGS
======================================== */
router.get("/user/:userId", audit_controller_1.getUserAuditLogs);
/* ========================================
   MODULE LOGS
======================================== */
router.get("/module/:module", audit_controller_1.getModuleLogs);
/* ========================================
   ACTION LOGS
======================================== */
router.get("/action/:action", audit_controller_1.getActionLogs);
/* ========================================
   SEARCH
======================================== */
router.get("/search/:keyword", audit_controller_1.searchAuditLogs);
/* ========================================
   CLEANUP
======================================== */
router.delete("/cleanup", audit_controller_1.deleteOldLogs);
exports.default = router;
