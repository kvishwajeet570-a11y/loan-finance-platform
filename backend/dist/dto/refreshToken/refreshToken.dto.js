"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenAnalyticsSchema = exports.refreshTokenFilterSchema = exports.verifyRefreshTokenSchema = exports.logoutAllDevicesSchema = exports.logoutDeviceSchema = exports.revokeRefreshTokenSchema = exports.rotateRefreshTokenSchema = exports.createRefreshTokenSchema = exports.refreshTokenStatusEnum = exports.deviceTypeEnum = void 0;
const zod_1 = require("zod");
/* =========================================
   DEVICE TYPE
========================================= */
exports.deviceTypeEnum = zod_1.z.enum([
    "WEB",
    "ANDROID",
    "IOS",
    "WINDOWS",
    "MAC",
    "LINUX",
]);
/* =========================================
   TOKEN STATUS
========================================= */
exports.refreshTokenStatusEnum = zod_1.z.enum([
    "ACTIVE",
    "EXPIRED",
    "REVOKED",
    "BLACKLISTED",
]);
/* =========================================
   CREATE REFRESH TOKEN
========================================= */
exports.createRefreshTokenSchema = zod_1.z.object({
    userId: zod_1.z.string().cuid(),
    refreshToken: zod_1.z.string().min(20),
    accessToken: zod_1.z.string().min(20),
    deviceId: zod_1.z.string(),
    deviceType: exports.deviceTypeEnum,
    deviceName: zod_1.z.string().optional(),
    ipAddress: zod_1.z.string(),
    userAgent: zod_1.z.string(),
    expiresAt: zod_1.z.string(),
});
/* =========================================
   ROTATE REFRESH TOKEN
========================================= */
exports.rotateRefreshTokenSchema = zod_1.z.object({
    refreshToken: zod_1.z.string().min(20),
});
/* =========================================
   REVOKE TOKEN
========================================= */
exports.revokeRefreshTokenSchema = zod_1.z.object({
    tokenId: zod_1.z.string().cuid(),
    reason: zod_1.z.string()
        .min(3)
        .max(500)
        .optional(),
});
/* =========================================
   LOGOUT DEVICE
========================================= */
exports.logoutDeviceSchema = zod_1.z.object({
    deviceId: zod_1.z.string(),
    userId: zod_1.z.string().cuid(),
});
/* =========================================
   LOGOUT ALL DEVICES
========================================= */
exports.logoutAllDevicesSchema = zod_1.z.object({
    userId: zod_1.z.string().cuid(),
});
/* =========================================
   VERIFY REFRESH TOKEN
========================================= */
exports.verifyRefreshTokenSchema = zod_1.z.object({
    refreshToken: zod_1.z.string().min(20),
});
/* =========================================
   REFRESH TOKEN FILTER
========================================= */
exports.refreshTokenFilterSchema = zod_1.z.object({
    userId: zod_1.z.string()
        .cuid()
        .optional(),
    deviceType: exports.deviceTypeEnum.optional(),
    status: exports.refreshTokenStatusEnum.optional(),
    page: zod_1.z.coerce.number()
        .default(1),
    limit: zod_1.z.coerce.number()
        .min(1)
        .max(100)
        .default(20),
});
/* =========================================
   TOKEN ANALYTICS
========================================= */
exports.refreshTokenAnalyticsSchema = zod_1.z.object({
    startDate: zod_1.z.string().optional(),
    endDate: zod_1.z.string().optional(),
    deviceType: exports.deviceTypeEnum.optional(),
});
