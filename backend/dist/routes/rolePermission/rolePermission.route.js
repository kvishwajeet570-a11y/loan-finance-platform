"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const rolePermission_controller_1 = require("../../controllers/rolePermission/rolePermission.controller");
const router = (0, express_1.Router)();
// Assign permission to role
router.post("/assign", rolePermission_controller_1.assignPermission);
// Bulk assign permissions
router.post("/assign/bulk", rolePermission_controller_1.bulkAssignPermissions);
// Get permissions of a role
router.get("/:roleId", rolePermission_controller_1.getRolePermissions);
// Remove one permission from role
router.delete("/remove", rolePermission_controller_1.removePermission);
// Remove all permissions from role
router.delete("/:roleId/remove-all", rolePermission_controller_1.removeAllPermissions);
// Analytics
router.get("/analytics/overview", rolePermission_controller_1.rolePermissionAnalytics);
exports.default = router;
