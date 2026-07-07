import { z } from "zod";

/* =========================================
   TEMPLATE TYPE
========================================= */

export const emailTemplateTypeEnum =
  z.enum([
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

export const emailTemplateStatusEnum =
  z.enum([
    "ACTIVE",
    "INACTIVE",
    "DRAFT",
  ]);

/* =========================================
   CREATE EMAIL TEMPLATE
========================================= */

export const createEmailTemplateSchema =
  z.object({
    name: z.string()
      .min(3)
      .max(100),

    templateCode: z.string()
      .min(3)
      .max(50),

    templateType:
      emailTemplateTypeEnum,

    subject: z.string()
      .min(3)
      .max(255),

    body: z.string()
      .min(10),

    status:
      emailTemplateStatusEnum
      .default("ACTIVE"),

    variables:
      z.array(z.string())
      .optional(),
  });

/* =========================================
   UPDATE EMAIL TEMPLATE
========================================= */

export const updateEmailTemplateSchema =
  createEmailTemplateSchema.partial();

/* =========================================
   SEND TEST EMAIL
========================================= */

export const sendTestEmailSchema =
  z.object({
    templateId:
      z.string().cuid(),

    email: z.email(),
  });

/* =========================================
   DUPLICATE TEMPLATE
========================================= */

export const duplicateTemplateSchema =
  z.object({
    templateId:
      z.string().cuid(),

    newTemplateName:
      z.string()
      .min(3)
      .max(100),
  });

/* =========================================
   EMAIL TEMPLATE FILTER
========================================= */

export const emailTemplateFilterSchema =
  z.object({
    search: z.string().optional(),

    templateType:
      emailTemplateTypeEnum
      .optional(),

    status:
      emailTemplateStatusEnum
      .optional(),

    page:
      z.coerce.number()
      .default(1),

    limit:
      z.coerce.number()
      .min(1)
      .max(100)
      .default(10),
  });

/* =========================================
   TEMPLATE STATUS UPDATE
========================================= */

export const updateTemplateStatusSchema =
  z.object({
    templateId:
      z.string().cuid(),

    status:
      emailTemplateStatusEnum,
  });

/* =========================================
   TEMPLATE PREVIEW
========================================= */

export const templatePreviewSchema =
  z.object({
    templateId:
      z.string().cuid(),

    variables:
      z.record(
        z.string(),
        z.any()
      ).optional(),
  });

/* =========================================
   EXPORT TYPES
========================================= */

export type CreateEmailTemplateDto =
  z.infer<
    typeof createEmailTemplateSchema
  >;

export type UpdateEmailTemplateDto =
  z.infer<
    typeof updateEmailTemplateSchema
  >;

export type SendTestEmailDto =
  z.infer<
    typeof sendTestEmailSchema
  >;

export type DuplicateTemplateDto =
  z.infer<
    typeof duplicateTemplateSchema
  >;

export type EmailTemplateFilterDto =
  z.infer<
    typeof emailTemplateFilterSchema
  >;

export type UpdateTemplateStatusDto =
  z.infer<
    typeof updateTemplateStatusSchema
  >;

export type TemplatePreviewDto =
  z.infer<
    typeof templatePreviewSchema
  >;