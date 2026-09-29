"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.systemSettingAnalyticsSchema = exports.systemSettingFilterSchema = exports.apiRateLimitSchema = exports.commissionEngineConfigurationSchema = exports.loanEngineConfigurationSchema = exports.systemSecurityConfigurationSchema = exports.authConfigurationSchema = exports.maintenanceConfigurationSchema = exports.systemFeatureFlagSchema = exports.bulkUpdateSystemSettingSchema = exports.updateSystemSettingSchema = exports.createSystemSettingSchema = exports.systemSettingTypeEnum = exports.systemSettingCategoryEnum = void 0;
const zod_1 = require("zod");
/* =========================================
   SYSTEM SETTING CATEGORY
========================================= */
exports.systemSettingCategoryEnum = zod_1.z.enum([
    "SYSTEM",
    "APPLICATION",
    "SECURITY",
    "AUTH",
    "DATABASE",
    "API",
    "LOAN_ENGINE",
    "COMMISSION_ENGINE",
    "PAYMENT",
    "NOTIFICATION",
    "AUDIT",
    "FEATURE_FLAG",
    "ENVIRONMENT",
]);
/* =========================================
   VALUE TYPE
========================================= */
exports.systemSettingTypeEnum = zod_1.z.enum([
    "STRING",
    "NUMBER",
    "BOOLEAN",
    "JSON",
    "ARRAY",
]);
/* =========================================
   CREATE SYSTEM SETTING
========================================= */
exports.createSystemSettingSchema = zod_1.z.object({
    category: exports.systemSettingCategoryEnum,
    key: zod_1.z
        .string()
        .min(2, "Key must be at least 2 characters")
        .max(100, "Key cannot exceed 100 characters"),
    value: zod_1.z.any(),
    dataType: exports.systemSettingTypeEnum,
    description: zod_1.z
        .string()
        .max(1000)
        .optional(),
    isEditable: zod_1.z
        .boolean()
        .default(true),
    isEncrypted: zod_1.z
        .boolean()
        .default(false),
});
/* =========================================
   UPDATE SYSTEM SETTING
========================================= */
exports.updateSystemSettingSchema = zod_1.z.object({
    key: zod_1.z
        .string()
        .min(2)
        .max(100),
    value: zod_1.z
        .any()
        .optional(),
    description: zod_1.z
        .string()
        .max(1000)
        .optional(),
    isEditable: zod_1.z
        .boolean()
        .optional(),
    isEncrypted: zod_1.z
        .boolean()
        .optional(),
    dataType: exports.systemSettingTypeEnum.optional(),
    category: exports.systemSettingCategoryEnum.optional(),
});
/* =========================================
   BULK UPDATE
========================================= */
exports.bulkUpdateSystemSettingSchema = zod_1.z.object({
    settings: zod_1.z
        .array(zod_1.z.object({
        key: zod_1.z
            .string()
            .min(2)
            .max(100),
        value: zod_1.z.any(),
    }))
        .min(1),
});
/* =========================================
   FEATURE FLAG
========================================= */
exports.systemFeatureFlagSchema = zod_1.z.object({
    key: zod_1.z.string(),
    enabled: zod_1.z.boolean(),
    rolloutPercentage: zod_1.z
        .number()
        .min(0)
        .max(100)
        .default(100),
});
/* =========================================
   MAINTENANCE MODE
========================================= */
exports.maintenanceConfigurationSchema = zod_1.z.object({
    enabled: zod_1.z.boolean(),
    title: zod_1.z.string().optional(),
    message: zod_1.z.string().optional(),
    expectedRestoreTime: zod_1.z.string().optional(),
});
/* =========================================
   AUTH CONFIG
========================================= */
exports.authConfigurationSchema = zod_1.z.object({
    jwtExpiryMinutes: zod_1.z.number().positive(),
    refreshTokenDays: zod_1.z.number().positive(),
    otpExpiryMinutes: zod_1.z.number().positive(),
    maxLoginAttempts: zod_1.z.number().positive(),
    lockoutMinutes: zod_1.z.number().positive(),
    enableTwoFactor: zod_1.z.boolean(),
});
/* =========================================
   SECURITY CONFIG
========================================= */
exports.systemSecurityConfigurationSchema = zod_1.z.object({
    passwordMinLength: zod_1.z.number().positive(),
    passwordRequireUppercase: zod_1.z.boolean(),
    passwordRequireLowercase: zod_1.z.boolean(),
    passwordRequireNumber: zod_1.z.boolean(),
    passwordRequireSpecialChar: zod_1.z.boolean(),
    sessionTimeoutMinutes: zod_1.z.number().positive(),
});
/* =========================================
   LOAN ENGINE CONFIG
========================================= */
exports.loanEngineConfigurationSchema = zod_1.z.object({
    minLoanAmount: zod_1.z.number().positive(),
    maxLoanAmount: zod_1.z.number().positive(),
    minimumCibilScore: zod_1.z.number(),
    autoApproveLoans: zod_1.z.boolean(),
    autoAssignLeads: zod_1.z.boolean(),
});
/* =========================================
   COMMISSION ENGINE CONFIG
========================================= */
exports.commissionEngineConfigurationSchema = zod_1.z.object({
    autoCommissionApproval: zod_1.z.boolean(),
    payoutCycleDays: zod_1.z.number().positive(),
    minimumPayoutAmount: zod_1.z.number().positive(),
});
/* =========================================
   API RATE LIMIT CONFIG
========================================= */
exports.apiRateLimitSchema = zod_1.z.object({
    requestsPerMinute: zod_1.z.number().positive(),
    requestsPerHour: zod_1.z.number().positive(),
    requestsPerDay: zod_1.z.number().positive(),
});
/* =========================================
   FILTER
========================================= */
exports.systemSettingFilterSchema = zod_1.z.object({
    category: exports.systemSettingCategoryEnum.optional(),
    key: zod_1.z.string().optional(),
    search: zod_1.z.string().optional(),
    page: zod_1.z.coerce.number().default(1),
    limit: zod_1.z.coerce.number().min(1).max(100).default(20),
});
/* =========================================
   ANALYTICS
========================================= */
exports.systemSettingAnalyticsSchema = zod_1.z.object({
    startDate: zod_1.z.string().optional(),
    endDate: zod_1.z.string().optional(),
});
