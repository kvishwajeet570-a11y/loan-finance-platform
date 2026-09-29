"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginAnalyticsSchema = exports.loginHistoryActiveSessionSchema = exports.loginHistoryFilterSchema = exports.suspiciousLoginSchema = exports.failedLoginSchema = exports.logoutHistorySchema = exports.createLoginHistorySchema = exports.loginHistoryDeviceTypeEnum = exports.loginMethodEnum = exports.loginStatusEnum = void 0;
const zod_1 = require("zod");
/* =========================================
   LOGIN STATUS
========================================= */
exports.loginStatusEnum = zod_1.z.enum([
    "SUCCESS",
    "FAILED",
    "BLOCKED",
    "OTP_REQUIRED",
    "OTP_VERIFIED",
    "LOGOUT",
]);
/* =========================================
   LOGIN METHOD
========================================= */
exports.loginMethodEnum = zod_1.z.enum([
    "EMAIL",
    "PHONE",
    "GOOGLE",
    "OTP",
    "ADMIN_LOGIN",
]);
/* =========================================
   DEVICE TYPE
========================================= */
exports.loginHistoryDeviceTypeEnum = zod_1.z.enum([
    "WEB",
    "ANDROID",
    "IOS",
    "WINDOWS",
    "MAC",
    "LINUX",
]);
/* =========================================
   CREATE LOGIN HISTORY
========================================= */
exports.createLoginHistorySchema = zod_1.z.object({
    userId: zod_1.z.string().cuid(),
    loginMethod: exports.loginMethodEnum,
    status: exports.loginStatusEnum,
    ipAddress: zod_1.z.string(),
    userAgent: zod_1.z.string(),
    deviceType: exports.loginHistoryDeviceTypeEnum,
    deviceName: zod_1.z.string().optional(),
    browser: zod_1.z.string().optional(),
    operatingSystem: zod_1.z.string().optional(),
    country: zod_1.z.string().optional(),
    state: zod_1.z.string().optional(),
    city: zod_1.z.string().optional(),
    latitude: zod_1.z.number().optional(),
    longitude: zod_1.z.number().optional(),
});
/* =========================================
   LOGOUT EVENT
========================================= */
exports.logoutHistorySchema = zod_1.z.object({
    userId: zod_1.z.string().cuid(),
    sessionId: zod_1.z.string().optional(),
    logoutReason: zod_1.z.string().optional(),
});
/* =========================================
   FAILED LOGIN TRACKING
========================================= */
exports.failedLoginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    ipAddress: zod_1.z.string(),
    reason: zod_1.z.string()
        .min(3)
        .max(500),
});
/* =========================================
   SUSPICIOUS LOGIN
========================================= */
exports.suspiciousLoginSchema = zod_1.z.object({
    userId: zod_1.z.string().cuid(),
    ipAddress: zod_1.z.string(),
    riskScore: zod_1.z.number()
        .min(0)
        .max(100),
    reason: zod_1.z.string(),
});
/* =========================================
   LOGIN HISTORY FILTER
========================================= */
exports.loginHistoryFilterSchema = zod_1.z.object({
    userId: zod_1.z.string()
        .cuid()
        .optional(),
    status: exports.loginStatusEnum.optional(),
    loginMethod: exports.loginMethodEnum.optional(),
    deviceType: exports.loginHistoryDeviceTypeEnum.optional(),
    startDate: zod_1.z.string().optional(),
    endDate: zod_1.z.string().optional(),
    page: zod_1.z.coerce
        .number()
        .default(1),
    limit: zod_1.z.coerce
        .number()
        .min(1)
        .max(100)
        .default(20),
});
/* =========================================
   ACTIVE SESSION FILTER
========================================= */
exports.loginHistoryActiveSessionSchema = zod_1.z.object({
    userId: zod_1.z.string()
        .cuid()
        .optional(),
});
/* =========================================
   LOGIN ANALYTICS
========================================= */
exports.loginAnalyticsSchema = zod_1.z.object({
    startDate: zod_1.z.string().optional(),
    endDate: zod_1.z.string().optional(),
    deviceType: exports.loginHistoryDeviceTypeEnum.optional(),
});
