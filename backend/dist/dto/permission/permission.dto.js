"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.permissionAnalyticsSchema = exports.permissionFilterSchema = exports.bulkAssignPermissionSchema = exports.assignPermissionToUserSchema = exports.assignPermissionToRoleSchema = exports.updatePermissionSchema = exports.createPermissionSchema = exports.permissionStatusEnum = exports.permissionModuleEnum = void 0;
const zod_1 = require("zod");
/* =========================================
   MODULE ENUM
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
   STATUS ENUM
========================================= */
exports.permissionStatusEnum = zod_1.z.enum([
    "ACTIVE",
    "INACTIVE",
]);
/* =========================================
   CREATE PERMISSION
========================================= */
exports.createPermissionSchema = zod_1.z.object({
    name: zod_1.z.string().min(3).max(100),
    code: zod_1.z.string().min(3).max(100),
    module: exports.permissionModuleEnum,
    description: zod_1.z.string().max(500).optional(),
    slug: zod_1.z.string().optional(),
    status: exports.permissionStatusEnum.optional(),
});
/* =========================================
   UPDATE PERMISSION
========================================= */
exports.updatePermissionSchema = zod_1.z.object({
    name: zod_1.z.string().min(3).max(100).optional(),
    code: zod_1.z.string().min(3).max(100).optional(),
    module: exports.permissionModuleEnum.optional(),
    description: zod_1.z.string().max(500).optional(),
    slug: zod_1.z.string().optional(),
    status: exports.permissionStatusEnum.optional(),
});
/* =========================================
   ASSIGN ROLE PERMISSION
========================================= */
exports.assignPermissionToRoleSchema = zod_1.z.object({
    role: zod_1.z.string().min(1),
    permissionId: zod_1.z.string().cuid(),
});
/* =========================================
   ASSIGN USER PERMISSION
========================================= */
exports.assignPermissionToUserSchema = zod_1.z.object({
    userId: zod_1.z.string().cuid(),
    permissionId: zod_1.z.string().cuid(),
});
/* =========================================
   BULK ASSIGN
========================================= */
exports.bulkAssignPermissionSchema = zod_1.z.object({
    role: zod_1.z.string().min(1),
    permissionIds: zod_1.z.array(zod_1.z.string().cuid()).min(1),
});
/* =========================================
   FILTER
========================================= */
exports.permissionFilterSchema = zod_1.z.object({
    search: zod_1.z.string().optional(),
    module: exports.permissionModuleEnum.optional(),
    status: exports.permissionStatusEnum.optional(),
    page: zod_1.z.coerce.number().default(1),
    limit: zod_1.z.coerce.number()
        .min(1)
        .max(100)
        .default(20),
});
/* =========================================
   ANALYTICS
========================================= */
exports.permissionAnalyticsSchema = zod_1.z.object({
    startDate: zod_1.z.string().optional(),
    endDate: zod_1.z.string().optional(),
});
