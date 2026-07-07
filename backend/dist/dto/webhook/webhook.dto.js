"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.webhookSecuritySchema = exports.webhookAnalyticsSchema = exports.webhookFilterSchema = exports.webhookDeliverySchema = exports.retryWebhookSchema = exports.testWebhookSchema = exports.updateWebhookSchema = exports.createWebhookSchema = exports.webhookMethodEnum = exports.webhookStatusEnum = exports.webhookEventEnum = exports.webhookProviderEnum = void 0;
const zod_1 = require("zod");
/* =========================================
   WEBHOOK PROVIDER
========================================= */
exports.webhookProviderEnum = zod_1.z.enum([
    "RAZORPAY",
    "CASHFREE",
    "PHONEPE",
    "PAYTM",
    "BANK",
    "NBFC",
    "INSURANCE",
    "FASTAG",
    "INTERNAL",
    "CUSTOM",
]);
/* =========================================
   WEBHOOK EVENT
========================================= */
exports.webhookEventEnum = zod_1.z.enum([
    "PAYMENT_SUCCESS",
    "PAYMENT_FAILED",
    "PAYMENT_REFUNDED",
    "LOAN_APPLIED",
    "LOAN_APPROVED",
    "LOAN_REJECTED",
    "LOAN_DISBURSED",
    "KYC_SUBMITTED",
    "KYC_APPROVED",
    "KYC_REJECTED",
    "PARTNER_CREATED",
    "PARTNER_APPROVED",
    "DSA_REGISTERED",
    "DSA_APPROVED",
    "INSURANCE_POLICY_CREATED",
    "INSURANCE_POLICY_RENEWED",
    "FASTAG_CREATED",
    "FASTAG_RECHARGED",
]);
/* =========================================
   WEBHOOK STATUS
========================================= */
exports.webhookStatusEnum = zod_1.z.enum([
    "PENDING",
    "PROCESSING",
    "SUCCESS",
    "FAILED",
    "RETRYING",
    "CANCELLED",
]);
/* =========================================
   HTTP METHOD
========================================= */
exports.webhookMethodEnum = zod_1.z.enum([
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
]);
/* =========================================
   REGISTER WEBHOOK
========================================= */
exports.createWebhookSchema = zod_1.z.object({
    name: zod_1.z.string()
        .min(2)
        .max(255),
    provider: exports.webhookProviderEnum,
    event: exports.webhookEventEnum,
    url: zod_1.z.string().url(),
    method: exports.webhookMethodEnum
        .default("POST"),
    secretKey: zod_1.z.string()
        .min(8),
    active: zod_1.z.boolean()
        .default(true),
    headers: zod_1.z.record(zod_1.z.string())
        .optional(),
});
/* =========================================
   UPDATE WEBHOOK
========================================= */
exports.updateWebhookSchema = zod_1.z.object({
    webhookId: zod_1.z.string().cuid(),
    name: zod_1.z.string()
        .max(255)
        .optional(),
    url: zod_1.z.string()
        .url()
        .optional(),
    active: zod_1.z.boolean()
        .optional(),
    headers: zod_1.z.record(zod_1.z.string())
        .optional(),
});
/* =========================================
   TEST WEBHOOK
========================================= */
exports.testWebhookSchema = zod_1.z.object({
    webhookId: zod_1.z.string().cuid(),
    payload: zod_1.z.record(zod_1.z.any())
        .optional(),
});
/* =========================================
   RETRY WEBHOOK
========================================= */
exports.retryWebhookSchema = zod_1.z.object({
    webhookLogId: zod_1.z.string().cuid(),
});
/* =========================================
   WEBHOOK DELIVERY
========================================= */
exports.webhookDeliverySchema = zod_1.z.object({
    webhookId: zod_1.z.string().cuid(),
    event: exports.webhookEventEnum,
    payload: zod_1.z.record(zod_1.z.any()),
});
/* =========================================
   WEBHOOK FILTER
========================================= */
exports.webhookFilterSchema = zod_1.z.object({
    provider: exports.webhookProviderEnum
        .optional(),
    event: exports.webhookEventEnum
        .optional(),
    status: exports.webhookStatusEnum
        .optional(),
    active: zod_1.z.boolean()
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
   WEBHOOK ANALYTICS
========================================= */
exports.webhookAnalyticsSchema = zod_1.z.object({
    startDate: zod_1.z.string(),
    endDate: zod_1.z.string(),
    provider: exports.webhookProviderEnum
        .optional(),
});
/* =========================================
   WEBHOOK SECURITY
========================================= */
exports.webhookSecuritySchema = zod_1.z.object({
    webhookId: zod_1.z.string().cuid(),
    secretKey: zod_1.z.string()
        .min(8),
    verifySignature: zod_1.z.boolean()
        .default(true),
});
