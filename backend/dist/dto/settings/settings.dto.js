"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.settingFilterSchema = exports.paymentConfigurationSchema = exports.notificationConfigurationSchema = exports.securityConfigurationSchema = exports.commissionConfigurationSchema = exports.loanConfigurationSchema = exports.featureFlagSchema = exports.bulkUpdateSettingsSchema = exports.updateSettingSchema = exports.createSettingSchema = exports.settingTypeEnum = exports.settingCategoryEnum = void 0;
const zod_1 = require("zod");
/* =========================================
   SETTING CATEGORY
========================================= */
exports.settingCategoryEnum = zod_1.z.enum([
    "APPLICATION",
    "LOAN",
    "KYC",
    "COMMISSION",
    "REFERRAL",
    "PAYMENT",
    "NOTIFICATION",
    "SECURITY",
    "BRANDING",
    "EMAIL",
    "SMS",
    "WHATSAPP",
    "API",
    "FEATURE_FLAG",
    "SYSTEM",
]);
/* =========================================
   SETTING DATA TYPE
========================================= */
exports.settingTypeEnum = zod_1.z.enum([
    "STRING",
    "NUMBER",
    "BOOLEAN",
    "JSON",
    "ARRAY",
]);
/* =========================================
   CREATE SETTING
========================================= */
exports.createSettingSchema = zod_1.z.object({
    category: exports.settingCategoryEnum,
    key: zod_1.z
        .string()
        .min(2)
        .max(100),
    value: zod_1.z.any(),
    type: exports.settingTypeEnum,
    description: zod_1.z
        .string()
        .max(1000)
        .optional(),
    isPublic: zod_1.z.boolean().default(false),
    isEditable: zod_1.z.boolean().default(true),
});
/* =========================================
   UPDATE SETTING
========================================= */
exports.updateSettingSchema = zod_1.z.object({
    settingId: zod_1.z.string().cuid(),
    value: zod_1.z.any(),
    description: zod_1.z.string()
        .max(1000)
        .optional(),
});
/* =========================================
   BULK UPDATE SETTINGS
========================================= */
exports.bulkUpdateSettingsSchema = zod_1.z.object({
    settings: zod_1.z.array(zod_1.z.object({
        settingId: zod_1.z.string().cuid(),
        value: zod_1.z.any(),
    })),
});
/* =========================================
   FEATURE FLAG
========================================= */
exports.featureFlagSchema = zod_1.z.object({
    featureKey: zod_1.z.string()
        .min(2)
        .max(100),
    enabled: zod_1.z.boolean(),
});
/* =========================================
   LOAN CONFIGURATION
========================================= */
exports.loanConfigurationSchema = zod_1.z.object({
    minLoanAmount: zod_1.z.number().positive(),
    maxLoanAmount: zod_1.z.number().positive(),
    minTenureMonths: zod_1.z.number().positive(),
    maxTenureMonths: zod_1.z.number().positive(),
    minInterestRate: zod_1.z.number(),
    maxInterestRate: zod_1.z.number(),
});
/* =========================================
   COMMISSION CONFIGURATION
========================================= */
exports.commissionConfigurationSchema = zod_1.z.object({
    loanCommission: zod_1.z.number(),
    insuranceCommission: zod_1.z.number(),
    creditCardCommission: zod_1.z.number(),
    fastagCommission: zod_1.z.number(),
    referralCommission: zod_1.z.number(),
});
/* =========================================
   SECURITY CONFIGURATION
========================================= */
exports.securityConfigurationSchema = zod_1.z.object({
    otpExpiryMinutes: zod_1.z.number().positive(),
    maxLoginAttempts: zod_1.z.number().positive(),
    passwordMinLength: zod_1.z.number().positive(),
    sessionTimeoutMinutes: zod_1.z.number().positive(),
    twoFactorAuth: zod_1.z.boolean(),
});
/* =========================================
   NOTIFICATION CONFIGURATION
========================================= */
exports.notificationConfigurationSchema = zod_1.z.object({
    emailEnabled: zod_1.z.boolean(),
    smsEnabled: zod_1.z.boolean(),
    whatsappEnabled: zod_1.z.boolean(),
    pushEnabled: zod_1.z.boolean(),
});
/* =========================================
   PAYMENT CONFIGURATION
========================================= */
exports.paymentConfigurationSchema = zod_1.z.object({
    paymentGateway: zod_1.z.string(),
    autoSettlement: zod_1.z.boolean(),
    settlementDays: zod_1.z.number().positive(),
});
/* =========================================
   SETTINGS FILTER
========================================= */
exports.settingFilterSchema = zod_1.z.object({
    category: exports.settingCategoryEnum
        .optional(),
    key: zod_1.z.string()
        .optional(),
    page: zod_1.z.coerce.number()
        .default(1),
    limit: zod_1.z.coerce.number()
        .min(1)
        .max(100)
        .default(20),
});
