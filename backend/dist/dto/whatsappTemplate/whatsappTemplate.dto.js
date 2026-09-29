"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.whatsappTemplateAnalyticsSchema = exports.whatsappTemplateFilterSchema = exports.bulkWhatsappCampaignSchema = exports.sendTestWhatsappSchema = exports.rejectWhatsappTemplateSchema = exports.approveWhatsappTemplateSchema = exports.updateWhatsappTemplateSchema = exports.createWhatsappTemplateSchema = exports.whatsappLanguageEnum = exports.whatsappTemplateStatusEnum = exports.whatsappTemplateTypeEnum = exports.whatsappTemplateCategoryEnum = void 0;
const zod_1 = require("zod");
/* =========================================
   TEMPLATE CATEGORY
========================================= */
exports.whatsappTemplateCategoryEnum = zod_1.z.enum([
    "OTP",
    "AUTH",
    "LOAN",
    "KYC",
    "PAYMENT",
    "COMMISSION",
    "REFERRAL",
    "SUPPORT",
    "MARKETING",
    "INSURANCE",
    "FASTAG",
    "RECHARGE",
    "INVESTMENT",
    "PARTNER",
    "DSA",
    "SYSTEM",
]);
/* =========================================
   TEMPLATE TYPE
========================================= */
exports.whatsappTemplateTypeEnum = zod_1.z.enum([
    "TEXT",
    "MEDIA",
    "INTERACTIVE",
    "BUTTON",
    "CAROUSEL",
]);
/* =========================================
   TEMPLATE STATUS
========================================= */
exports.whatsappTemplateStatusEnum = zod_1.z.enum([
    "DRAFT",
    "PENDING_APPROVAL",
    "APPROVED",
    "REJECTED",
    "DISABLED",
]);
/* =========================================
   LANGUAGE
========================================= */
exports.whatsappLanguageEnum = zod_1.z.enum([
    "en",
    "hi",
    "bn",
    "gu",
    "mr",
    "ta",
    "te",
    "kn",
    "ml",
    "pa",
]);
/* =========================================
   CREATE TEMPLATE
========================================= */
exports.createWhatsappTemplateSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(2)
        .max(100),
    category: exports.whatsappTemplateCategoryEnum,
    type: exports.whatsappTemplateTypeEnum,
    language: exports.whatsappLanguageEnum,
    templateBody: zod_1.z
        .string()
        .min(5)
        .max(5000),
    variables: zod_1.z
        .array(zod_1.z.string())
        .optional(),
    mediaUrl: zod_1.z
        .string()
        .url()
        .optional(),
    active: zod_1.z
        .boolean()
        .default(true),
});
/* =========================================
   UPDATE TEMPLATE
========================================= */
exports.updateWhatsappTemplateSchema = zod_1.z.object({
    templateId: zod_1.z
        .string()
        .cuid(),
    name: zod_1.z
        .string()
        .max(100)
        .optional(),
    templateBody: zod_1.z
        .string()
        .max(5000)
        .optional(),
    mediaUrl: zod_1.z
        .string()
        .url()
        .optional(),
    active: zod_1.z
        .boolean()
        .optional(),
});
/* =========================================
   APPROVE TEMPLATE
========================================= */
exports.approveWhatsappTemplateSchema = zod_1.z.object({
    templateId: zod_1.z
        .string()
        .cuid(),
    approvedBy: zod_1.z
        .string()
        .cuid(),
});
/* =========================================
   REJECT TEMPLATE
========================================= */
exports.rejectWhatsappTemplateSchema = zod_1.z.object({
    templateId: zod_1.z
        .string()
        .cuid(),
    reason: zod_1.z
        .string()
        .min(3)
        .max(1000),
});
/* =========================================
   SEND TEST MESSAGE
========================================= */
exports.sendTestWhatsappSchema = zod_1.z.object({
    templateId: zod_1.z
        .string()
        .cuid(),
    mobileNumber: zod_1.z
        .string()
        .min(10)
        .max(15),
    variables: zod_1.z
        .record(zod_1.z.string(), zod_1.z.any())
        .optional(),
});
/* =========================================
   BULK CAMPAIGN
========================================= */
exports.bulkWhatsappCampaignSchema = zod_1.z.object({
    templateId: zod_1.z
        .string()
        .cuid(),
    recipients: zod_1.z
        .array(zod_1.z.string()
        .min(10)
        .max(15))
        .min(1),
    scheduledAt: zod_1.z
        .string()
        .optional(),
});
/* =========================================
   TEMPLATE FILTER
========================================= */
exports.whatsappTemplateFilterSchema = zod_1.z.object({
    category: exports.whatsappTemplateCategoryEnum
        .optional(),
    type: exports.whatsappTemplateTypeEnum
        .optional(),
    status: exports.whatsappTemplateStatusEnum
        .optional(),
    language: exports.whatsappLanguageEnum
        .optional(),
    active: zod_1.z
        .boolean()
        .optional(),
    page: zod_1.z.coerce
        .number()
        .int()
        .min(1)
        .default(1),
    limit: zod_1.z.coerce
        .number()
        .int()
        .min(1)
        .max(100)
        .default(20),
});
/* =========================================
   ANALYTICS
========================================= */
exports.whatsappTemplateAnalyticsSchema = zod_1.z.object({
    startDate: zod_1.z.string(),
    endDate: zod_1.z.string(),
    category: exports.whatsappTemplateCategoryEnum
        .optional(),
});
