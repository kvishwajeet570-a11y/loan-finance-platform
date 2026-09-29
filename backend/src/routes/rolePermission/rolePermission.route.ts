import { Router } from "express";

import {
  assignPermission,
  bulkAssignPermissions,
  getRolePermissions,
  removePermission,
  removeAllPermissions,
  rolePermissionAnalytics,
} from "../../controllers/rolePermission/rolePermission.controller";

const router = Router();

// Assign permission to role
router.post("/assign", assignPermission);

// Bulk assign permissions
router.post("/assign/bulk", bulkAssignPermissions);

// Get permissions of a role
router.get("/:roleId", getRolePermissions);

// Remove one permission from role
router.delete("/remove", removePermission);

// Remove all permissions from role
router.delete("/:roleId/remove-all", removeAllPermissions);

// Analytics
router.get("/analytics/overview", rolePermissionAnalytics);

export default router;