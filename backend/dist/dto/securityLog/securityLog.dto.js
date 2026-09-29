"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.securityAnalyticsSchema = exports.suspiciousActivitySchema = exports.securityLogFilterSchema = exports.investigateSecurityLogSchema = exports.updateSecurityStatusSchema = exports.createSecurityLogSchema = exports.securityStatusEnum = exports.securityRiskLevelEnum = exports.securityEventTypeEnum = void 0;
const zod_1 = require("zod");
/* =========================================
   SECURITY EVENT TYPES
========================================= */
exports.securityEventTypeEnum = zod_1.z.enum([
    "LOGIN_SUCCESS",
    "LOGIN_FAILED",
    "LOGOUT",
    "PASSWORD_CHANGED",
    "PASSWORD_RESET",
    "OTP_SENT",
    "OTP_VERIFIED",
    "ACCOUNT_LOCKED",
    "ACCOUNT_UNLOCKED",
    "UNAUTHORIZED_ACCESS",
    "PERMISSION_DENIED",
    "ROLE_CHANGED",
    "USER_BLOCKED",
    "USER_UNBLOCKED",
    "SUSPICIOUS_ACTIVITY",
    "DEVICE_REGISTERED",
    "DEVICE_REMOVED",
    "TOKEN_REVOKED",
    "MULTIPLE_LOGIN_ATTEMPT",
    "API_ABUSE",
    "SQL_INJECTION_ATTEMPT",
    "XSS_ATTEMPT",
    "BRUTE_FORCE_ATTACK",
    "DATA_EXPORT",
    "FILE_DOWNLOAD",
    "FILE_UPLOAD",
    "LOAN_APPROVAL",
    "LOAN_REJECTION",
    "PAYMENT_PROCESSED",
    "COMMISSION_APPROVED",
    "SYSTEM_SETTING_CHANGED",
]);
/* =========================================
   RISK LEVEL
========================================= */
exports.securityRiskLevelEnum = zod_1.z.enum([
    "LOW",
    "MEDIUM",
    "HIGH",
    "CRITICAL",
]);
/* =========================================
   SECURITY STATUS
========================================= */
exports.securityStatusEnum = zod_1.z.enum([
    "OPEN",
    "INVESTIGATING",
    "RESOLVED",
    "FALSE_POSITIVE",
]);
/* =========================================
   CREATE SECURITY LOG
========================================= */
exports.createSecurityLogSchema = zod_1.z.object({
    userId: zod_1.z.string().cuid().optional(),
    eventType: exports.securityEventTypeEnum,
    riskLevel: exports.securityRiskLevelEnum,
    ipAddress: zod_1.z.string().max(100),
    deviceInfo: zod_1.z.string().max(500).optional(),
    browser: zod_1.z.string().max(100).optional(),
    operatingSystem: zod_1.z.string().max(100).optional(),
    location: zod_1.z.string().max(255).optional(),
    endpoint: zod_1.z.string().max(255).optional(),
    description: zod_1.z.string().min(5).max(1000),
    metadata: zod_1.z.record(zod_1.z.string(), zod_1.z.unknown()).optional(),
});
/* =========================================
   UPDATE SECURITY STATUS
========================================= */
exports.updateSecurityStatusSchema = zod_1.z.object({
    securityLogId: zod_1.z.string().cuid(),
    status: exports.securityStatusEnum,
    remarks: zod_1.z.string().max(1000).optional(),
});
/* =========================================
   INVESTIGATION
========================================= */
exports.investigateSecurityLogSchema = zod_1.z.object({
    securityLogId: zod_1.z.string().cuid(),
    assignedTo: zod_1.z.string().cuid(),
    notes: zod_1.z.string().min(5).max(2000),
});
/* =========================================
   SECURITY FILTER
========================================= */
exports.securityLogFilterSchema = zod_1.z.object({
    userId: zod_1.z.string().cuid().optional(),
    eventType: exports.securityEventTypeEnum.optional(),
    riskLevel: exports.securityRiskLevelEnum.optional(),
    status: exports.securityStatusEnum.optional(),
    startDate: zod_1.z.string().optional(),
    endDate: zod_1.z.string().optional(),
    page: zod_1.z.coerce.number().default(1),
    limit: zod_1.z.coerce.number()
        .min(1)
        .max(100)
        .default(20),
});
/* =========================================
   SUSPICIOUS ACTIVITY
========================================= */
exports.suspiciousActivitySchema = zod_1.z.object({
    userId: zod_1.z.string().cuid(),
    activityType: exports.securityEventTypeEnum,
    description: zod_1.z.string().min(5),
    riskLevel: exports.securityRiskLevelEnum,
});
/* =========================================
   SECURITY ANALYTICS
========================================= */
exports.securityAnalyticsSchema = zod_1.z.object({
    startDate: zod_1.z.string(),
    endDate: zod_1.z.string(),
    riskLevel: exports.securityRiskLevelEnum
        .optional(),
});
