"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const permission_controller_1 = require("../../controllers/permission/permission.controller");
const router = (0, express_1.Router)();
/* ========================================
   DASHBOARD & ANALYTICS
======================================== */
router.get("/dashboard", permission_controller_1.getPermissionDashboard);
router.get("/analytics", permission_controller_1.getPermissionAnalytics);
/* ========================================
   EXPORTS
======================================== */
router.get("/export/excel", permission_controller_1.exportPermissionsExcel);
router.get("/export/pdf", permission_controller_1.exportPermissionsPdf);
/* ========================================
   MASTER DATA
======================================== */
router.get("/modules", permission_controller_1.getModules);
router.get("/actions", permission_controller_1.getActions);
/* ========================================
   PERMISSION MANAGEMENT
======================================== */
router.post("/", permission_controller_1.createPermission);
router.get("/", permission_controller_1.getAllPermissions);
router.get("/search", permission_controller_1.searchPermissions);
router.get("/:id", permission_controller_1.getPermissionById);
router.put("/:id", permission_controller_1.updatePermission);
router.delete("/:id", permission_controller_1.deletePermission);
/* ========================================
   ROLE PERMISSIONS
======================================== */
router.get("/role/:roleId", permission_controller_1.getRolePermissions);
router.post("/role/:roleId/assign", permission_controller_1.assignPermissionToRole);
router.delete("/role/:roleId/remove/:permissionId", permission_controller_1.removePermissionFromRole);
/* ========================================
   USER PERMISSIONS
======================================== */
router.get("/user/:userId", permission_controller_1.getUserPermissions);
router.post("/user/:userId/assign", permission_controller_1.assignPermissionToUser);
router.delete("/user/:userId/remove/:permissionId", permission_controller_1.removePermissionFromUser);
/* ========================================
   BULK ACTIONS
======================================== */
router.post("/bulk-assign", permission_controller_1.bulkAssignPermissions);
router.post("/bulk-remove", permission_controller_1.bulkRemovePermissions);
exports.default = router;
