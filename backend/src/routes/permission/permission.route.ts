import { Router } from "express";

import {
  createPermission,
  getPermissionById,
  getAllPermissions,

  updatePermission,
  deletePermission,

  assignPermissionToRole,
  removePermissionFromRole,

  assignPermissionToUser,
  removePermissionFromUser,

  getRolePermissions,
  getUserPermissions,

  searchPermissions,

  getPermissionAnalytics,
  getPermissionDashboard,

  getModules,
  getActions,

  bulkAssignPermissions,
  bulkRemovePermissions,

  exportPermissionsExcel,
  exportPermissionsPdf,
} from "../../controllers/permission/permission.controller";

const router = Router();

/* ========================================
   DASHBOARD & ANALYTICS
======================================== */

router.get(
  "/dashboard",
  getPermissionDashboard
);

router.get(
  "/analytics",
  getPermissionAnalytics
);

/* ========================================
   EXPORTS
======================================== */

router.get(
  "/export/excel",
  exportPermissionsExcel
);

router.get(
  "/export/pdf",
  exportPermissionsPdf
);

/* ========================================
   MASTER DATA
======================================== */

router.get(
  "/modules",
  getModules
);

router.get(
  "/actions",
  getActions
);

/* ========================================
   PERMISSION MANAGEMENT
======================================== */

router.post(
  "/",
  createPermission
);

router.get(
  "/",
  getAllPermissions
);

router.get(
  "/search",
  searchPermissions
);

router.get(
  "/:id",
  getPermissionById
);

router.put(
  "/:id",
  updatePermission
);

router.delete(
  "/:id",
  deletePermission
);

/* ========================================
   ROLE PERMISSIONS
======================================== */

router.get(
  "/role/:roleId",
  getRolePermissions
);

router.post(
  "/role/:roleId/assign",
  assignPermissionToRole
);

router.delete(
  "/role/:roleId/remove/:permissionId",
  removePermissionFromRole
);

/* ========================================
   USER PERMISSIONS
======================================== */

router.get(
  "/user/:userId",
  getUserPermissions
);

router.post(
  "/user/:userId/assign",
  assignPermissionToUser
);

router.delete(
  "/user/:userId/remove/:permissionId",
  removePermissionFromUser
);

/* ========================================
   BULK ACTIONS
======================================== */

router.post(
  "/bulk-assign",
  bulkAssignPermissions
);

router.post(
  "/bulk-remove",
  bulkRemovePermissions
);

export default router;