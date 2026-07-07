"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.permissionAnalyticsSchema = exports.rolePermissionMatrixSchema = exports.permissionFilterSchema = exports.bulkAssignPermissionSchema = exports.removePermissionSchema = exports.assignPermissionSchema = exports.updatePermissionSchema = exports.createPermissionSchema = exports.permissionStatusEnum = exports.permissionActionEnum = exports.permissionModuleEnum = void 0;
const zod_1 = require("zod");
/* =========================================
   PERMISSION MODULE
========================================= */
exports.permissionModuleEnum = zod_1.z.enum([
    "DASHBOARD",
    "USER",
    "CUSTOMER",
    "LOAN",
    "KYC",
    "DOCUMENT",
    "PAYMENT",
    "COMMISSION",
    "REFERRAL",
    "PARTNER",
    "DSA",
    "INSURANCE",
    "FASTAG",
    "INVESTMENT",
    "BLOG",
    "CMS",
    "MEDIA",
    "REPORT",
    "ANALYTICS",
    "NOTIFICATION",
    "SUPPORT",
    "SETTINGS",
    "ROLE",
    "PERMISSION",
    "ADMIN",
    "AUDIT",
]);
/* =========================================
   PERMISSION ACTION
========================================= */
exports.permissionActionEnum = zod_1.z.enum([
    "CREATE",
    "READ",
    "UPDATE",
    "DELETE",
    "APPROVE",
    "REJECT",
    "EXPORT",
    "IMPORT",
    "ASSIGN",
    "VIEW_ALL",
    "MANAGE",
]);
/* =========================================
   PERMISSION STATUS
========================================= */
exports.permissionStatusEnum = zod_1.z.enum([
    "ACTIVE",
    "INACTIVE",
]);
/* =========================================
   CREATE PERMISSION
========================================= */
exports.createPermissionSchema = zod_1.z.object({
    name: zod_1.z.string()
        .min(3)
        .max(100),
    code: zod_1.z.string()
        .min(3)
        .max(100)
        .toUpperCase(),
    module: exports.permissionModuleEnum,
    action: exports.permissionActionEnum,
    description: zod_1.z.string()
        .max(500)
        .optional(),
    status: exports.permissionStatusEnum
        .default("ACTIVE"),
});
/* =========================================
   UPDATE PERMISSION
========================================= */
exports.updatePermissionSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    module: exports.permissionModuleEnum.optional(),
    action: exports.permissionActionEnum.optional(),
    description: zod_1.z.string().optional(),
    status: exports.permissionStatusEnum.optional(),
});
/* =========================================
   ASSIGN PERMISSION TO ROLE
========================================= */
exports.assignPermissionSchema = zod_1.z.object({
    roleId: zod_1.z.string().cuid(),
    permissionIds: zod_1.z.array(zod_1.z.string().cuid()).min(1),
});
/* =========================================
   REMOVE PERMISSION
========================================= */
exports.removePermissionSchema = zod_1.z.object({
    roleId: zod_1.z.string().cuid(),
    permissionId: zod_1.z.string().cuid(),
});
/* =========================================
   BULK PERMISSION ASSIGN
========================================= */
exports.bulkAssignPermissionSchema = zod_1.z.object({
    roleIds: zod_1.z.array(zod_1.z.string().cuid()).min(1),
    permissionIds: zod_1.z.array(zod_1.z.string().cuid()).min(1),
});
/* =========================================
   PERMISSION FILTER
========================================= */
exports.permissionFilterSchema = zod_1.z.object({
    search: zod_1.z.string().optional(),
    module: exports.permissionModuleEnum.optional(),
    action: exports.permissionActionEnum.optional(),
    status: exports.permissionStatusEnum.optional(),
    page: zod_1.z.coerce.number()
        .default(1),
    limit: zod_1.z.coerce.number()
        .min(1)
        .max(100)
        .default(20),
});
/* =========================================
   ROLE PERMISSION MATRIX
========================================= */
exports.rolePermissionMatrixSchema = zod_1.z.object({
    roleId: zod_1.z.string().cuid(),
});
/* =========================================
   PERMISSION ANALYTICS
========================================= */
exports.permissionAnalyticsSchema = zod_1.z.object({
    startDate: zod_1.z.string().optional(),
    endDate: zod_1.z.string().optional(),
});
