import { z } from "zod";

/* =========================================
   TEMPLATE CHANNEL
========================================= */

export const templateChannelEnum = z.enum([
  "EMAIL",
  "SMS",
  "WHATSAPP",
  "PUSH",
  "IN_APP",
]);

/* =========================================
   TEMPLATE TYPE
========================================= */

export const templateTypeEnum = z.enum([
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

export const templateStatusEnum = z.enum([
  "ACTIVE",
  "INACTIVE",
  "DRAFT",
  "ARCHIVED",
]);

/* =========================================
   CREATE TEMPLATE
========================================= */

export const createNotificationTemplateSchema =
  z.object({
    name: z.string()
      .min(3)
      .max(100),

    code: z.string()
      .min(2)
      .max(50)
      .toUpperCase(),

    type:
      templateTypeEnum,

    channel:
      templateChannelEnum,

    subject:
      z.string()
      .max(255)
      .optional(),

    title:
      z.string()
      .max(255)
      .optional(),

    content:
      z.string()
      .min(5),

    variables:
      z.array(z.string())
      .optional(),

    status:
      templateStatusEnum
      .default("ACTIVE"),
  });

/* =========================================
   UPDATE TEMPLATE
========================================= */

export const updateNotificationTemplateSchema =
  z.object({
    name:
      z.string().optional(),

    type:
      templateTypeEnum.optional(),

    channel:
      templateChannelEnum.optional(),

    subject:
      z.string().optional(),

    title:
      z.string().optional(),

    content:
      z.string().optional(),

    variables:
      z.array(z.string())
      .optional(),

    status:
      templateStatusEnum.optional(),
  });

/* =========================================
   DUPLICATE TEMPLATE
========================================= */

export const duplicateTemplateSchema =
  z.object({
    templateId:
      z.string().cuid(),

    newName:
      z.string()
      .min(3)
      .max(100),
  });

/* =========================================
   TEST TEMPLATE
========================================= */

export const testTemplateSchema =
  z.object({
    templateId:
      z.string().cuid(),

    recipient:
      z.string()
      .min(3),

    sampleData:
      z.record(z.any())
      .optional(),
  });

/* =========================================
   TEMPLATE PREVIEW
========================================= */

export const previewTemplateSchema =
  z.object({
    templateId:
      z.string().cuid(),

    variables:
      z.record(z.any())
      .optional(),
  });

/* =========================================
   TEMPLATE FILTER
========================================= */

export const notificationTemplateFilterSchema =
  z.object({
    search:
      z.string().optional(),

    type:
      templateTypeEnum.optional(),

    channel:
      templateChannelEnum.optional(),

    status:
      templateStatusEnum.optional(),

    page:
      z.coerce.number()
      .default(1),

    limit:
      z.coerce.number()
      .min(1)
      .max(100)
      .default(20),
  });

/* =========================================
   TEMPLATE STATUS UPDATE
========================================= */

export const updateTemplateStatusSchema =
  z.object({
    templateId:
      z.string().cuid(),

    status:
      templateStatusEnum,
  });

/* =========================================
   TEMPLATE ANALYTICS
========================================= */

export const notificationTemplateAnalyticsSchema =
  z.object({
    type:
      templateTypeEnum.optional(),

    channel:
      templateChannelEnum.optional(),

    startDate:
      z.string().optional(),

    endDate:
      z.string().optional(),
  });

/* =========================================
   TYPES
========================================= */

export type CreateNotificationTemplateDto =
  z.infer<
    typeof createNotificationTemplateSchema
  >;

export type UpdateNotificationTemplateDto =
  z.infer<
    typeof updateNotificationTemplateSchema
  >;

export type DuplicateTemplateDto =
  z.infer<
    typeof duplicateTemplateSchema
  >;

export type TestTemplateDto =
  z.infer<
    typeof testTemplateSchema
  >;

export type PreviewTemplateDto =
  z.infer<
    typeof previewTemplateSchema
  >;

export type NotificationTemplateFilterDto =
  z.infer<
    typeof notificationTemplateFilterSchema
  >;

export type UpdateTemplateStatusDto =
  z.infer<
    typeof updateTemplateStatusSchema
  >;

export type NotificationTemplateAnalyticsDto =
  z.infer<
    typeof notificationTemplateAnalyticsSchema
  >;