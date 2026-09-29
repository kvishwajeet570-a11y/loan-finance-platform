"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.platformAnalyticsSchema = exports.emergencyActionSchema = exports.superAdminFilterSchema = exports.systemAnnouncementSchema = exports.updateGlobalSettingsSchema = exports.assignRoleToAdminSchema = exports.resetAdminPasswordSchema = exports.unblockAdminSchema = exports.blockAdminSchema = exports.updateAdminBySuperAdminSchema = exports.createAdminBySuperAdminSchema = exports.maintenanceModeSchema = exports.adminStatusEnum = exports.superAdminRoleEnum = void 0;
const zod_1 = require("zod");
/* =========================================
   SUPER ADMIN ROLE
========================================= */
exports.superAdminRoleEnum = zod_1.z.enum([
    "SUPER_ADMIN",
    "ROOT_ADMIN",
    "PLATFORM_ADMIN",
]);
/* =========================================
   ADMIN STATUS
========================================= */
exports.adminStatusEnum = zod_1.z.enum([
    "ACTIVE",
    "INACTIVE",
    "BLOCKED",
    "SUSPENDED",
]);
/* =========================================
   MAINTENANCE MODE
========================================= */
exports.maintenanceModeSchema = zod_1.z.object({
    enabled: zod_1.z.boolean(),
    title: zod_1.z.string()
        .max(200)
        .optional(),
    message: zod_1.z.string()
        .max(1000)
        .optional(),
    estimatedRestoreTime: zod_1.z.string()
        .optional(),
});
/* =========================================
   CREATE ADMIN
========================================= */
exports.createAdminBySuperAdminSchema = zod_1.z.object({
    name: zod_1.z.string()
        .min(2)
        .max(100),
    email: zod_1.z.string()
        .email(),
    phoneNo: zod_1.z.string()
        .min(10)
        .max(15),
    password: zod_1.z.string()
        .min(8),
    roleId: zod_1.z.string()
        .cuid(),
});
/* =========================================
   UPDATE ADMIN
========================================= */
exports.updateAdminBySuperAdminSchema = zod_1.z.object({
    adminId: zod_1.z.string().cuid(),
    name: zod_1.z.string()
        .min(2)
        .max(100)
        .optional(),
    email: zod_1.z.string()
        .email()
        .optional(),
    phoneNo: zod_1.z.string()
        .optional(),
    roleId: zod_1.z.string()
        .cuid()
        .optional(),
});
/* =========================================
   BLOCK ADMIN
========================================= */
exports.blockAdminSchema = zod_1.z.object({
    adminId: zod_1.z.string().cuid(),
    reason: zod_1.z.string()
        .min(3)
        .max(500),
});
/* =========================================
   UNBLOCK ADMIN
========================================= */
exports.unblockAdminSchema = zod_1.z.object({
    adminId: zod_1.z.string().cuid(),
});
/* =========================================
   RESET ADMIN PASSWORD
========================================= */
exports.resetAdminPasswordSchema = zod_1.z.object({
    adminId: zod_1.z.string().cuid(),
    newPassword: zod_1.z.string()
        .min(8),
});
/* =========================================
   ASSIGN ROLE
========================================= */
exports.assignRoleToAdminSchema = zod_1.z.object({
    adminId: zod_1.z.string().cuid(),
    roleId: zod_1.z.string().cuid(),
});
/* =========================================
   GLOBAL SETTINGS UPDATE
========================================= */
exports.updateGlobalSettingsSchema = zod_1.z.object({
    settings: zod_1.z.record(zod_1.z.string(), zod_1.z.any()),
});
/* =========================================
   SYSTEM ANNOUNCEMENT
========================================= */
exports.systemAnnouncementSchema = zod_1.z.object({
    title: zod_1.z.string()
        .min(3)
        .max(200),
    message: zod_1.z.string()
        .min(5)
        .max(5000),
    expiresAt: zod_1.z.string()
        .optional(),
});
/* =========================================
   PLATFORM FILTER
========================================= */
exports.superAdminFilterSchema = zod_1.z.object({
    startDate: zod_1.z.string()
        .optional(),
    endDate: zod_1.z.string()
        .optional(),
    page: zod_1.z.coerce.number()
        .default(1),
    limit: zod_1.z.coerce.number()
        .min(1)
        .max(100)
        .default(20),
});
/* =========================================
   EMERGENCY SYSTEM ACTION
========================================= */
exports.emergencyActionSchema = zod_1.z.object({
    action: zod_1.z.enum([
        "DISABLE_LOGIN",
        "DISABLE_REGISTRATION",
        "DISABLE_LOAN_APPLICATION",
        "ENABLE_MAINTENANCE",
        "DISABLE_API_ACCESS",
    ]),
    reason: zod_1.z.string()
        .min(5)
        .max(1000),
});
/* =========================================
   PLATFORM ANALYTICS
========================================= */
exports.platformAnalyticsSchema = zod_1.z.object({
    startDate: zod_1.z.string(),
    endDate: zod_1.z.string(),
});
