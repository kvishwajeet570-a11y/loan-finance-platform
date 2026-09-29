import { z } from "zod";

/* =========================================
   WEBHOOK PROVIDER
========================================= */

export const webhookProviderEnum = z.enum([
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

export const webhookEventEnum = z.enum([
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

export const webhookStatusEnum = z.enum([
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

export const webhookMethodEnum = z.enum([
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
]);

/* =========================================
   REGISTER WEBHOOK
========================================= */

export const createWebhookSchema = z.object({
  name: z
    .string()
    .min(2)
    .max(255),

  provider: webhookProviderEnum,

  event: webhookEventEnum,

  url: z.string().url(),

  method: webhookMethodEnum.default("POST"),

  secretKey: z
    .string()
    .min(8),

  active: z
    .boolean()
    .default(true),

  headers: z
    .record(
      z.string(),
      z.string()
    )
    .optional(),
});

/* =========================================
   UPDATE WEBHOOK
========================================= */

export const updateWebhookSchema = z.object({
  webhookId: z
    .string()
    .cuid(),

  name: z
    .string()
    .max(255)
    .optional(),

  url: z
    .string()
    .url()
    .optional(),

  active: z
    .boolean()
    .optional(),

  headers: z
    .record(
      z.string(),
      z.string()
    )
    .optional(),
});

/* =========================================
   TEST WEBHOOK
========================================= */

export const testWebhookSchema = z.object({
  webhookId: z
    .string()
    .cuid(),

  payload: z
    .record(
      z.string(),
      z.any()
    )
    .optional(),
});

/* =========================================
   RETRY WEBHOOK
========================================= */

export const retryWebhookSchema = z.object({
  webhookLogId: z
    .string()
    .cuid(),
});

/* =========================================
   WEBHOOK DELIVERY
========================================= */

export const webhookDeliverySchema = z.object({
  webhookId: z
    .string()
    .cuid(),

  event: webhookEventEnum,

  payload: z.record(
    z.string(),
    z.any()
  ),
});

/* =========================================
   WEBHOOK FILTER
========================================= */

export const webhookFilterSchema = z.object({
  provider: webhookProviderEnum
    .optional(),

  event: webhookEventEnum
    .optional(),

  status: webhookStatusEnum
    .optional(),

  active: z
    .boolean()
    .optional(),

  startDate: z
    .string()
    .optional(),

  endDate: z
    .string()
    .optional(),

  page: z.coerce
    .number()
    .int()
    .min(1)
    .default(1),

  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .default(20),
});

/* =========================================
   WEBHOOK ANALYTICS
========================================= */

export const webhookAnalyticsSchema = z.object({
  startDate: z.string(),

  endDate: z.string(),

  provider: webhookProviderEnum
    .optional(),
});

/* =========================================
   WEBHOOK SECURITY
========================================= */

export const webhookSecuritySchema = z.object({
  webhookId: z
    .string()
    .cuid(),

  secretKey: z
    .string()
    .min(8),

  verifySignature: z
    .boolean()
    .default(true),
});

/* =========================================
   TYPES
========================================= */

export type CreateWebhookDto =
  z.infer<typeof createWebhookSchema>;

export type UpdateWebhookDto =
  z.infer<typeof updateWebhookSchema>;

export type TestWebhookDto =
  z.infer<typeof testWebhookSchema>;

export type RetryWebhookDto =
  z.infer<typeof retryWebhookSchema>;

export type WebhookDeliveryDto =
  z.infer<typeof webhookDeliverySchema>;

export type WebhookFilterDto =
  z.infer<typeof webhookFilterSchema>;

export type WebhookAnalyticsDto =
  z.infer<typeof webhookAnalyticsSchema>;

export type WebhookSecurityDto =
  z.infer<typeof webhookSecuritySchema>;