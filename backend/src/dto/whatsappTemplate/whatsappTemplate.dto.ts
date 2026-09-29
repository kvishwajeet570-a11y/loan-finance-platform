import { z } from "zod";

/* =========================================
   TEMPLATE CATEGORY
========================================= */

export const whatsappTemplateCategoryEnum = z.enum([
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

export const whatsappTemplateTypeEnum = z.enum([
  "TEXT",
  "MEDIA",
  "INTERACTIVE",
  "BUTTON",
  "CAROUSEL",
]);

/* =========================================
   TEMPLATE STATUS
========================================= */

export const whatsappTemplateStatusEnum = z.enum([
  "DRAFT",
  "PENDING_APPROVAL",
  "APPROVED",
  "REJECTED",
  "DISABLED",
]);

/* =========================================
   LANGUAGE
========================================= */

export const whatsappLanguageEnum = z.enum([
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

export const createWhatsappTemplateSchema = z.object({
  name: z
    .string()
    .min(2)
    .max(100),

  category: whatsappTemplateCategoryEnum,

  type: whatsappTemplateTypeEnum,

  language: whatsappLanguageEnum,

  templateBody: z
    .string()
    .min(5)
    .max(5000),

  variables: z
    .array(z.string())
    .optional(),

  mediaUrl: z
    .string()
    .url()
    .optional(),

  active: z
    .boolean()
    .default(true),
});

/* =========================================
   UPDATE TEMPLATE
========================================= */

export const updateWhatsappTemplateSchema = z.object({
  templateId: z
    .string()
    .cuid(),

  name: z
    .string()
    .max(100)
    .optional(),

  templateBody: z
    .string()
    .max(5000)
    .optional(),

  mediaUrl: z
    .string()
    .url()
    .optional(),

  active: z
    .boolean()
    .optional(),
});

/* =========================================
   APPROVE TEMPLATE
========================================= */

export const approveWhatsappTemplateSchema = z.object({
  templateId: z
    .string()
    .cuid(),

  approvedBy: z
    .string()
    .cuid(),
});

/* =========================================
   REJECT TEMPLATE
========================================= */

export const rejectWhatsappTemplateSchema = z.object({
  templateId: z
    .string()
    .cuid(),

  reason: z
    .string()
    .min(3)
    .max(1000),
});

/* =========================================
   SEND TEST MESSAGE
========================================= */

export const sendTestWhatsappSchema = z.object({
  templateId: z
    .string()
    .cuid(),

  mobileNumber: z
    .string()
    .min(10)
    .max(15),

  variables: z
    .record(
      z.string(),
      z.any()
    )
    .optional(),
});

/* =========================================
   BULK CAMPAIGN
========================================= */

export const bulkWhatsappCampaignSchema = z.object({
  templateId: z
    .string()
    .cuid(),

  recipients: z
    .array(
      z.string()
        .min(10)
        .max(15)
    )
    .min(1),

  scheduledAt: z
    .string()
    .optional(),
});

/* =========================================
   TEMPLATE FILTER
========================================= */

export const whatsappTemplateFilterSchema = z.object({
  category: whatsappTemplateCategoryEnum
    .optional(),

  type: whatsappTemplateTypeEnum
    .optional(),

  status: whatsappTemplateStatusEnum
    .optional(),

  language: whatsappLanguageEnum
    .optional(),

  active: z
    .boolean()
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
   ANALYTICS
========================================= */

export const whatsappTemplateAnalyticsSchema = z.object({
  startDate: z.string(),

  endDate: z.string(),

  category: whatsappTemplateCategoryEnum
    .optional(),
});

/* =========================================
   TYPES
========================================= */

export type CreateWhatsappTemplateDto = z.infer<
  typeof createWhatsappTemplateSchema
>;

export type UpdateWhatsappTemplateDto = z.infer<
  typeof updateWhatsappTemplateSchema
>;

export type ApproveWhatsappTemplateDto = z.infer<
  typeof approveWhatsappTemplateSchema
>;

export type RejectWhatsappTemplateDto = z.infer<
  typeof rejectWhatsappTemplateSchema
>;

export type SendTestWhatsappDto = z.infer<
  typeof sendTestWhatsappSchema
>;

export type BulkWhatsappCampaignDto = z.infer<
  typeof bulkWhatsappCampaignSchema
>;

export type WhatsappTemplateFilterDto = z.infer<
  typeof whatsappTemplateFilterSchema
>;

export type WhatsappTemplateAnalyticsDto = z.infer<
  typeof whatsappTemplateAnalyticsSchema
>;