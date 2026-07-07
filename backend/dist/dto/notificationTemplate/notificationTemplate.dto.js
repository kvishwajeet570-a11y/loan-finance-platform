"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationTemplateAnalyticsSchema = exports.updateTemplateStatusSchema = exports.notificationTemplateFilterSchema = exports.previewTemplateSchema = exports.testTemplateSchema = exports.duplicateTemplateSchema = exports.updateNotificationTemplateSchema = exports.createNotificationTemplateSchema = exports.templateStatusEnum = exports.templateTypeEnum = exports.templateChannelEnum = void 0;
const zod_1 = require("zod");
/* =========================================
   TEMPLATE CHANNEL
========================================= */
exports.templateChannelEnum = zod_1.z.enum([
    "EMAIL",
    "SMS",
    "WHATSAPP",
    "PUSH",
    "IN_APP",
]);
/* =========================================
   TEMPLATE TYPE
========================================= */
exports.templateTypeEnum = zod_1.z.enum([
    "OTP",
    "WELCOME",
    "LOAN_APPLICATION",
    "LOAN_APPROVED",
    "LOAN_REJECTED",
    "LOAN_DISBURSED",
    "EMI_REMINDER",
    "KYC_PENDING",
    "KYC_APPROVED",
    "KYC_REJECTED",
    "COMMISSION_CREDITED",
    "REFERRAL_REWARD",
    "PASSWORD_RESET",
    "SECURITY_ALERT",
    "LOGIN_ALERT",
    "SUPPORT_UPDATE",
    "INSURANCE_RENEWAL",
    "FASTAG_RECHARGE",
    "MARKETING",
    "CUSTOM",
]);
/* =========================================
   TEMPLATE STATUS
========================================= */
exports.templateStatusEnum = zod_1.z.enum([
    "ACTIVE",
    "INACTIVE",
    "DRAFT",
    "ARCHIVED",
]);
/* =========================================
   CREATE TEMPLATE
========================================= */
exports.createNotificationTemplateSchema = zod_1.z.object({
    name: zod_1.z.string()
        .min(3)
        .max(100),
    code: zod_1.z.string()
        .min(2)
        .max(50)
        .toUpperCase(),
    type: exports.templateTypeEnum,
    channel: exports.templateChannelEnum,
    subject: zod_1.z.string()
        .max(255)
        .optional(),
    title: zod_1.z.string()
        .max(255)
        .optional(),
    content: zod_1.z.string()
        .min(5),
    variables: zod_1.z.array(zod_1.z.string())
        .optional(),
    status: exports.templateStatusEnum
        .default("ACTIVE"),
});
/* =========================================
   UPDATE TEMPLATE
========================================= */
exports.updateNotificationTemplateSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    type: exports.templateTypeEnum.optional(),
    channel: exports.templateChannelEnum.optional(),
    subject: zod_1.z.string().optional(),
    title: zod_1.z.string().optional(),
    content: zod_1.z.string().optional(),
    variables: zod_1.z.array(zod_1.z.string())
        .optional(),
    status: exports.templateStatusEnum.optional(),
});
/* =========================================
   DUPLICATE TEMPLATE
========================================= */
exports.duplicateTemplateSchema = zod_1.z.object({
    templateId: zod_1.z.string().cuid(),
    newName: zod_1.z.string()
        .min(3)
        .max(100),
});
/* =========================================
   TEST TEMPLATE
========================================= */
exports.testTemplateSchema = zod_1.z.object({
    templateId: zod_1.z.string().cuid(),
    recipient: zod_1.z.string()
        .min(3),
    sampleData: zod_1.z.record(zod_1.z.any())
        .optional(),
});
/* =========================================
   TEMPLATE PREVIEW
========================================= */
exports.previewTemplateSchema = zod_1.z.object({
    templateId: zod_1.z.string().cuid(),
    variables: zod_1.z.record(zod_1.z.any())
        .optional(),
});
/* =========================================
   TEMPLATE FILTER
========================================= */
exports.notificationTemplateFilterSchema = zod_1.z.object({
    search: zod_1.z.string().optional(),
    type: exports.templateTypeEnum.optional(),
    channel: exports.templateChannelEnum.optional(),
    status: exports.templateStatusEnum.optional(),
    page: zod_1.z.coerce.number()
        .default(1),
    limit: zod_1.z.coerce.number()
        .min(1)
        .max(100)
        .default(20),
});
/* =========================================
   TEMPLATE STATUS UPDATE
========================================= */
exports.updateTemplateStatusSchema = zod_1.z.object({
    templateId: zod_1.z.string().cuid(),
    status: exports.templateStatusEnum,
});
/* =========================================
   TEMPLATE ANALYTICS
========================================= */
exports.notificationTemplateAnalyticsSchema = zod_1.z.object({
    type: exports.templateTypeEnum.optional(),
    channel: exports.templateChannelEnum.optional(),
    startDate: zod_1.z.string().optional(),
    endDate: zod_1.z.string().optional(),
});
