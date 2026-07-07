"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deviceSecuritySchema = exports.deviceFilterSchema = exports.trustDeviceSchema = exports.deviceLoginSchema = exports.updateDeviceStatusSchema = exports.blockDeviceSchema = exports.updateDeviceSchema = exports.registerDeviceSchema = exports.deviceStatusEnum = exports.deviceTypeEnum = void 0;
const zod_1 = require("zod");
/* =========================================
   DEVICE TYPE
========================================= */
exports.deviceTypeEnum = zod_1.z.enum([
    "ANDROID",
    "IOS",
    "WEB",
    "WINDOWS",
    "MAC",
    "LINUX",
]);
/* =========================================
   DEVICE STATUS
========================================= */
exports.deviceStatusEnum = zod_1.z.enum([
    "ACTIVE",
    "INACTIVE",
    "BLOCKED",
    "SUSPICIOUS",
]);
/* =========================================
   REGISTER DEVICE
========================================= */
exports.registerDeviceSchema = zod_1.z.object({
    userId: zod_1.z.string().cuid(),
    deviceId: zod_1.z.string().min(5),
    deviceName: zod_1.z.string().min(2),
    deviceType: exports.deviceTypeEnum,
    deviceModel: zod_1.z.string().optional(),
    operatingSystem: zod_1.z.string().optional(),
    browser: zod_1.z.string().optional(),
    ipAddress: zod_1.z.string().optional(),
    location: zod_1.z.string().optional(),
    pushToken: zod_1.z.string().optional(),
});
/* =========================================
   UPDATE DEVICE
========================================= */
exports.updateDeviceSchema = zod_1.z.object({
    deviceName: zod_1.z.string().optional(),
    deviceModel: zod_1.z.string().optional(),
    operatingSystem: zod_1.z.string().optional(),
    browser: zod_1.z.string().optional(),
    pushToken: zod_1.z.string().optional(),
});
/* =========================================
   BLOCK DEVICE
========================================= */
exports.blockDeviceSchema = zod_1.z.object({
    deviceId: zod_1.z.string().min(5),
    reason: zod_1.z
        .string()
        .min(5)
        .max(500),
});
/* =========================================
   DEVICE STATUS UPDATE
========================================= */
exports.updateDeviceStatusSchema = zod_1.z.object({
    deviceId: zod_1.z.string().min(5),
    status: exports.deviceStatusEnum,
});
/* =========================================
   DEVICE LOGIN TRACKING
========================================= */
exports.deviceLoginSchema = zod_1.z.object({
    deviceId: zod_1.z.string(),
    userId: zod_1.z.string().cuid(),
    ipAddress: zod_1.z.string(),
    location: zod_1.z.string().optional(),
});
/* =========================================
   TRUST DEVICE
========================================= */
exports.trustDeviceSchema = zod_1.z.object({
    deviceId: zod_1.z.string(),
    userId: zod_1.z.string().cuid(),
});
/* =========================================
   DEVICE FILTER
========================================= */
exports.deviceFilterSchema = zod_1.z.object({
    search: zod_1.z.string().optional(),
    deviceType: exports.deviceTypeEnum.optional(),
    status: exports.deviceStatusEnum.optional(),
    userId: zod_1.z.string().cuid().optional(),
    page: zod_1.z.coerce.number()
        .default(1),
    limit: zod_1.z.coerce.number()
        .min(1)
        .max(100)
        .default(10),
});
/* =========================================
   DEVICE SECURITY CHECK
========================================= */
exports.deviceSecuritySchema = zod_1.z.object({
    deviceId: zod_1.z.string(),
    ipAddress: zod_1.z.string(),
    location: zod_1.z.string(),
    riskScore: zod_1.z.number()
        .min(0)
        .max(100),
});
