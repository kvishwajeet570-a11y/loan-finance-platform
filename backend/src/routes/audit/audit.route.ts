import { Router } from "express";

import {
  createAuditLog,
  getAuditLogs,
  getUserAuditLogs,
  getModuleLogs,
  getActionLogs,
  searchAuditLogs,
  getAuditStats,
  deleteOldLogs,
} from "../../controllers/audit/audit.controller";

const router = Router();

/* ========================================
   AUDIT DASHBOARD
======================================== */

router.get(
  "/stats",
  getAuditStats
);

/* ========================================
   AUDIT LOGS
======================================== */

router.get(
  "/",
  getAuditLogs
);

router.post(
  "/",
  createAuditLog
);

/* ========================================
   USER LOGS
======================================== */

router.get(
  "/user/:userId",
  getUserAuditLogs
);

/* ========================================
   MODULE LOGS
======================================== */

router.get(
  "/module/:module",
  getModuleLogs
);

/* ========================================
   ACTION LOGS
======================================== */

router.get(
  "/action/:action",
  getActionLogs
);

/* ========================================
   SEARCH
======================================== */

router.get(
  "/search/:keyword",
  searchAuditLogs
);

/* ========================================
   CLEANUP
======================================== */

router.delete(
  "/cleanup",
  deleteOldLogs
);

export default router;