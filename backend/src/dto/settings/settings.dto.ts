import { z } from "zod";

/* =========================================
   SETTING CATEGORY
========================================= */

export const settingCategoryEnum = z.enum([
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

export const settingTypeEnum = z.enum([
  "STRING",
  "NUMBER",
  "BOOLEAN",
  "JSON",
  "ARRAY",
]);

/* =========================================
   CREATE SETTING
========================================= */

export const createSettingSchema = z.object({
  category: settingCategoryEnum,

  key: z
    .string()
    .min(2)
    .max(100),

  value: z.any(),

  type: settingTypeEnum,

  description: z
    .string()
    .max(1000)
    .optional(),

  isPublic:
    z.boolean().default(false),

  isEditable:
    z.boolean().default(true),
});

/* =========================================
   UPDATE SETTING
========================================= */

export const updateSettingSchema = z.object({
  settingId:
    z.string().cuid(),

  value: z.any(),

  description:
    z.string()
    .max(1000)
    .optional(),
});

/* =========================================
   BULK UPDATE SETTINGS
========================================= */

export const bulkUpdateSettingsSchema =
  z.object({
    settings: z.array(
      z.object({
        settingId:
          z.string().cuid(),

        value:
          z.any(),
      })
    ),
  });

/* =========================================
   FEATURE FLAG
========================================= */

export const featureFlagSchema =
  z.object({
    featureKey:
      z.string()
      .min(2)
      .max(100),

    enabled:
      z.boolean(),
  });

/* =========================================
   LOAN CONFIGURATION
========================================= */

export const loanConfigurationSchema =
  z.object({
    minLoanAmount:
      z.number().positive(),

    maxLoanAmount:
      z.number().positive(),

    minTenureMonths:
      z.number().positive(),

    maxTenureMonths:
      z.number().positive(),

    minInterestRate:
      z.number(),

    maxInterestRate:
      z.number(),
  });

/* =========================================
   COMMISSION CONFIGURATION
========================================= */

export const commissionConfigurationSchema =
  z.object({
    loanCommission:
      z.number(),

    insuranceCommission:
      z.number(),

    creditCardCommission:
      z.number(),

    fastagCommission:
      z.number(),

    referralCommission:
      z.number(),
  });

/* =========================================
   SECURITY CONFIGURATION
========================================= */

export const securityConfigurationSchema =
  z.object({
    otpExpiryMinutes:
      z.number().positive(),

    maxLoginAttempts:
      z.number().positive(),

    passwordMinLength:
      z.number().positive(),

    sessionTimeoutMinutes:
      z.number().positive(),

    twoFactorAuth:
      z.boolean(),
  });

/* =========================================
   NOTIFICATION CONFIGURATION
========================================= */

export const notificationConfigurationSchema =
  z.object({
    emailEnabled:
      z.boolean(),

    smsEnabled:
      z.boolean(),

    whatsappEnabled:
      z.boolean(),

    pushEnabled:
      z.boolean(),
  });

/* =========================================
   PAYMENT CONFIGURATION
========================================= */

export const paymentConfigurationSchema =
  z.object({
    paymentGateway:
      z.string(),

    autoSettlement:
      z.boolean(),

    settlementDays:
      z.number().positive(),
  });

/* =========================================
   SETTINGS FILTER
========================================= */

export const settingFilterSchema =
  z.object({
    category:
      settingCategoryEnum
      .optional(),

    key:
      z.string()
      .optional(),

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
   TYPES
========================================= */

export type CreateSettingDto =
  z.infer<typeof createSettingSchema>;

export type UpdateSettingDto =
  z.infer<typeof updateSettingSchema>;

export type BulkUpdateSettingsDto =
  z.infer<typeof bulkUpdateSettingsSchema>;

export type FeatureFlagDto =
  z.infer<typeof featureFlagSchema>;

export type LoanConfigurationDto =
  z.infer<typeof loanConfigurationSchema>;

export type CommissionConfigurationDto =
  z.infer<
    typeof commissionConfigurationSchema
  >;

export type SecurityConfigurationDto =
  z.infer<
    typeof securityConfigurationSchema
  >;

export type NotificationConfigurationDto =
  z.infer<
    typeof notificationConfigurationSchema
  >;

export type PaymentConfigurationDto =
  z.infer<
    typeof paymentConfigurationSchema
  >;

export type SettingFilterDto =
  z.infer<typeof settingFilterSchema>;