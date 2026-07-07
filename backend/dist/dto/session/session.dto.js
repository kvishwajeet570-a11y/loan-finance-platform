"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activeSessionSchema = exports.sessionAnalyticsSchema = exports.sessionFilterSchema = exports.revokeSessionSchema = exports.terminateAllSessionsSchema = exports.terminateSessionSchema = exports.updateSessionSchema = exports.createSessionSchema = exports.deviceTypeEnum = exports.sessionStatusEnum = void 0;
const zod_1 = require("zod");
/* =========================================
   SESSION STATUS
========================================= */
exports.sessionStatusEnum = zod_1.z.enum([
    "ACTIVE",
    "EXPIRED",
    "REVOKED",
    "LOGGED_OUT",
]);
/* =========================================
   DEVICE TYPE
========================================= */
exports.deviceTypeEnum = zod_1.z.enum([
    "WEB",
    "ANDROID",
    "IOS",
    "TABLET",
    "DESKTOP",
]);
/* =========================================
   CREATE SESSION
========================================= */
exports.createSessionSchema = zod_1.z.object({
    userId: zod_1.z.string().cuid(),
    refreshTokenId: zod_1.z.string().cuid().optional(),
    deviceType: exports.deviceTypeEnum,
    deviceName: zod_1.z.string().max(255).optional(),
    browser: zod_1.z.string().max(100).optional(),
    operatingSystem: zod_1.z.string().max(100).optional(),
    ipAddress: zod_1.z.string().max(100),
    location: zod_1.z.string().max(255).optional(),
    userAgent: zod_1.z.string().max(1000).optional(),
});
/* =========================================
   UPDATE SESSION
========================================= */
exports.updateSessionSchema = zod_1.z.object({
    sessionId: zod_1.z.string().cuid(),
    lastActivityAt: zod_1.z.coerce.date().optional(),
    ipAddress: zod_1.z.string().optional(),
    location: zod_1.z.string().optional(),
});
/* =========================================
   TERMINATE SESSION
========================================= */
exports.terminateSessionSchema = zod_1.z.object({
    sessionId: zod_1.z.string().cuid(),
    reason: zod_1.z.string()
        .min(3)
        .max(500)
        .optional(),
});
/* =========================================
   TERMINATE ALL SESSIONS
========================================= */
exports.terminateAllSessionsSchema = zod_1.z.object({
    userId: zod_1.z.string().cuid(),
    exceptCurrent: zod_1.z.boolean().default(true),
});
/* =========================================
   REVOKE SESSION
========================================= */
exports.revokeSessionSchema = zod_1.z.object({
    sessionId: zod_1.z.string().cuid(),
    remarks: zod_1.z.string()
        .max(500)
        .optional(),
});
/* =========================================
   SESSION FILTER
========================================= */
exports.sessionFilterSchema = zod_1.z.object({
    userId: zod_1.z.string()
        .cuid()
        .optional(),
    deviceType: exports.deviceTypeEnum
        .optional(),
    status: exports.sessionStatusEnum
        .optional(),
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
   SESSION ANALYTICS
========================================= */
exports.sessionAnalyticsSchema = zod_1.z.object({
    startDate: zod_1.z.string(),
    endDate: zod_1.z.string(),
    userId: zod_1.z.string()
        .cuid()
        .optional(),
});
/* =========================================
   ACTIVE SESSION CHECK
========================================= */
exports.activeSessionSchema = zod_1.z.object({
    userId: zod_1.z.string().cuid(),
});
