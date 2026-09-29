"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rolePermissionAuditSchema = exports.roleAccessMatrixSchema = exports.rolePermissionFilterSchema = exports.copyRolePermissionsSchema = exports.bulkAssignRolePermissionsSchema = exports.removeRolePermissionSchema = exports.assignRolePermissionsSchema = void 0;
const zod_1 = require("zod");
/* =========================================
   ASSIGN ROLE PERMISSIONS
========================================= */
exports.assignRolePermissionsSchema = zod_1.z.object({
    roleId: zod_1.z.string().cuid(),
    permissionIds: zod_1.z
        .array(zod_1.z.string().cuid())
        .min(1, "At least one permission is required"),
});
/* =========================================
   REMOVE ROLE PERMISSION
========================================= */
exports.removeRolePermissionSchema = zod_1.z.object({
    roleId: zod_1.z.string().cuid(),
    permissionId: zod_1.z.string().cuid(),
});
/* =========================================
   BULK ASSIGN ROLE PERMISSIONS
========================================= */
exports.bulkAssignRolePermissionsSchema = zod_1.z.object({
    roleIds: zod_1.z
        .array(zod_1.z.string().cuid())
        .min(1, "At least one role is required"),
    permissionIds: zod_1.z
        .array(zod_1.z.string().cuid())
        .min(1, "At least one permission is required"),
});
/* =========================================
   COPY ROLE PERMISSIONS
========================================= */
exports.copyRolePermissionsSchema = zod_1.z.object({
    sourceRoleId: zod_1.z.string().cuid(),
    targetRoleId: zod_1.z.string().cuid(),
});
/* =========================================
   ROLE PERMISSION FILTER
========================================= */
exports.rolePermissionFilterSchema = zod_1.z.object({
    roleId: zod_1.z.string().cuid().optional(),
    permissionId: zod_1.z.string().cuid().optional(),
    page: zod_1.z.coerce.number().min(1).default(1),
    limit: zod_1.z.coerce.number().min(1).max(100).default(20),
});
/* =========================================
   ROLE ACCESS MATRIX
========================================= */
exports.roleAccessMatrixSchema = zod_1.z.object({
    roleId: zod_1.z.string().cuid(),
});
/* =========================================
   ROLE PERMISSION AUDIT FILTER
========================================= */
exports.rolePermissionAuditSchema = zod_1.z.object({
    roleId: zod_1.z.string().cuid().optional(),
    startDate: zod_1.z.string().optional(),
    endDate: zod_1.z.string().optional(),
});
