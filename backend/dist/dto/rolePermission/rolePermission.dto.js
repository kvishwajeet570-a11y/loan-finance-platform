"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rolePermissionAuditSchema = exports.roleAccessMatrixSchema = exports.rolePermissionFilterSchema = exports.updateRolePermissionStatusSchema = exports.copyRolePermissionsSchema = exports.bulkAssignRolePermissionsSchema = exports.removeRolePermissionSchema = exports.assignRolePermissionsSchema = exports.rolePermissionStatusEnum = void 0;
const zod_1 = require("zod");
/* =========================================
   ROLE PERMISSION STATUS
========================================= */
exports.rolePermissionStatusEnum = zod_1.z.enum([
    "ACTIVE",
    "INACTIVE",
]);
/* =========================================
   ASSIGN PERMISSIONS TO ROLE
========================================= */
exports.assignRolePermissionsSchema = zod_1.z.object({
    roleId: zod_1.z.string().cuid(),
    permissionIds: zod_1.z.array(zod_1.z.string().cuid()).min(1),
});
/* =========================================
   REMOVE ROLE PERMISSION
========================================= */
exports.removeRolePermissionSchema = zod_1.z.object({
    roleId: zod_1.z.string().cuid(),
    permissionId: zod_1.z.string().cuid(),
});
/* =========================================
   BULK ASSIGN
========================================= */
exports.bulkAssignRolePermissionsSchema = zod_1.z.object({
    roleIds: zod_1.z.array(zod_1.z.string().cuid()).min(1),
    permissionIds: zod_1.z.array(zod_1.z.string().cuid()).min(1),
});
/* =========================================
   COPY ROLE PERMISSIONS
========================================= */
exports.copyRolePermissionsSchema = zod_1.z.object({
    sourceRoleId: zod_1.z.string().cuid(),
    targetRoleId: zod_1.z.string().cuid(),
});
/* =========================================
   UPDATE ROLE PERMISSION STATUS
========================================= */
exports.updateRolePermissionStatusSchema = zod_1.z.object({
    rolePermissionId: zod_1.z.string().cuid(),
    status: exports.rolePermissionStatusEnum,
});
/* =========================================
   ROLE PERMISSION FILTER
========================================= */
exports.rolePermissionFilterSchema = zod_1.z.object({
    roleId: zod_1.z.string()
        .cuid()
        .optional(),
    permissionId: zod_1.z.string()
        .cuid()
        .optional(),
    status: exports.rolePermissionStatusEnum
        .optional(),
    page: zod_1.z.coerce.number()
        .default(1),
    limit: zod_1.z.coerce.number()
        .min(1)
        .max(100)
        .default(20),
});
/* =========================================
   ROLE ACCESS MATRIX
========================================= */
exports.roleAccessMatrixSchema = zod_1.z.object({
    roleId: zod_1.z.string().cuid(),
});
/* =========================================
   ROLE PERMISSION AUDIT
========================================= */
exports.rolePermissionAuditSchema = zod_1.z.object({
    roleId: zod_1.z.string()
        .cuid()
        .optional(),
    startDate: zod_1.z.string()
        .optional(),
    endDate: zod_1.z.string()
        .optional(),
});
