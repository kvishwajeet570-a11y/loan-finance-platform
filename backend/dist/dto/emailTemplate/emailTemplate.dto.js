"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.templatePreviewSchema = exports.updateTemplateStatusSchema = exports.emailTemplateFilterSchema = exports.duplicateTemplateSchema = exports.sendTestEmailSchema = exports.updateEmailTemplateSchema = exports.createEmailTemplateSchema = exports.emailTemplateStatusEnum = exports.emailTemplateTypeEnum = void 0;
const zod_1 = require("zod");
/* =========================================
   TEMPLATE TYPE
========================================= */
exports.emailTemplateTypeEnum = zod_1.z.enum([
    "WELCOME",
    "OTP",
    "FORGOT_PASSWORD",
    "RESET_PASSWORD",
    "LOAN_APPLIED",
    "LOAN_APPROVED",
    "LOAN_REJECTED",
    "LOAN_DISBURSED",
    "KYC_SUBMITTED",
    "KYC_APPROVED",
    "KYC_REJECTED",
    "DSA_REGISTERED",
    "DSA_APPROVED",
    "PARTNER_REGISTERED",
    "PARTNER_APPROVED",
    "COMMISSION_CREDITED",
    "SUPPORT_TICKET",
    "CUSTOM",
]);
/* =========================================
   TEMPLATE STATUS
========================================= */
exports.emailTemplateStatusEnum = zod_1.z.enum([
    "ACTIVE",
    "INACTIVE",
    "DRAFT",
]);
/* =========================================
   CREATE EMAIL TEMPLATE
========================================= */
exports.createEmailTemplateSchema = zod_1.z.object({
    name: zod_1.z.string()
        .min(3)
        .max(100),
    templateCode: zod_1.z.string()
        .min(3)
        .max(50),
    templateType: exports.emailTemplateTypeEnum,
    subject: zod_1.z.string()
        .min(3)
        .max(255),
    body: zod_1.z.string()
        .min(10),
    status: exports.emailTemplateStatusEnum
        .default("ACTIVE"),
    variables: zod_1.z.array(zod_1.z.string())
        .optional(),
});
/* =========================================
   UPDATE EMAIL TEMPLATE
========================================= */
exports.updateEmailTemplateSchema = exports.createEmailTemplateSchema.partial();
/* =========================================
   SEND TEST EMAIL
========================================= */
exports.sendTestEmailSchema = zod_1.z.object({
    templateId: zod_1.z.string().cuid(),
    email: zod_1.z.email(),
});
/* =========================================
   DUPLICATE TEMPLATE
========================================= */
exports.duplicateTemplateSchema = zod_1.z.object({
    templateId: zod_1.z.string().cuid(),
    newTemplateName: zod_1.z.string()
        .min(3)
        .max(100),
});
/* =========================================
   EMAIL TEMPLATE FILTER
========================================= */
exports.emailTemplateFilterSchema = zod_1.z.object({
    search: zod_1.z.string().optional(),
    templateType: exports.emailTemplateTypeEnum
        .optional(),
    status: exports.emailTemplateStatusEnum
        .optional(),
    page: zod_1.z.coerce.number()
        .default(1),
    limit: zod_1.z.coerce.number()
        .min(1)
        .max(100)
        .default(10),
});
/* =========================================
   TEMPLATE STATUS UPDATE
========================================= */
exports.updateTemplateStatusSchema = zod_1.z.object({
    templateId: zod_1.z.string().cuid(),
    status: exports.emailTemplateStatusEnum,
});
/* =========================================
   TEMPLATE PREVIEW
========================================= */
exports.templatePreviewSchema = zod_1.z.object({
    templateId: zod_1.z.string().cuid(),
    variables: zod_1.z.record(zod_1.z.string(), zod_1.z.any()).optional(),
});
