import { z } from "zod";

/* =========================================
   SYSTEM SETTING CATEGORY
========================================= */

export const systemSettingCategoryEnum =
  z.enum([
    "SYSTEM",
    "APPLICATION",
    "SECURITY",
    "AUTH",
    "DATABASE",
    "API",
    "LOAN_ENGINE",
    "COMMISSION_ENGINE",
    "PAYMENT",
    "NOTIFICATION",
    "AUDIT",
    "FEATURE_FLAG",
    "ENVIRONMENT",
  ]);

/* =========================================
   VALUE TYPE
========================================= */

export const systemSettingTypeEnum =
  z.enum([
    "STRING",
    "NUMBER",
    "BOOLEAN",
    "JSON",
    "ARRAY",
  ]);

/* =========================================
   CREATE SYSTEM SETTING
========================================= */

export const createSystemSettingSchema =
  z.object({
    category:
      systemSettingCategoryEnum,

    key:
      z.string()
      .min(2)
      .max(100),

    value:
      z.any(),

    valueType:
      systemSettingTypeEnum,

    description:
      z.string()
      .max(1000)
      .optional(),

    isEditable:
      z.boolean()
      .default(true),

    isEncrypted:
      z.boolean()
      .default(false),

    requiresRestart:
      z.boolean()
      .default(false),
  });

/* =========================================
   UPDATE SYSTEM SETTING
========================================= */

export const updateSystemSettingSchema =
  z.object({
    settingId:
      z.string().cuid(),

    value:
      z.any(),

    description:
      z.string()
      .max(1000)
      .optional(),
  });

/* =========================================
   BULK UPDATE
========================================= */

export const bulkUpdateSystemSettingSchema =
  z.object({
    settings:
      z.array(
        z.object({
          settingId:
            z.string().cuid(),

          value:
            z.any(),
        })
      )
      .min(1),
  });

/* =========================================
   FEATURE FLAG
========================================= */

export const systemFeatureFlagSchema =
  z.object({
    key:
      z.string(),

    enabled:
      z.boolean(),

    rolloutPercentage:
      z.number()
      .min(0)
      .max(100)
      .default(100),
  });

/* =========================================
   MAINTENANCE MODE
========================================= */

export const maintenanceConfigurationSchema =
  z.object({
    enabled:
      z.boolean(),

    title:
      z.string()
      .optional(),

    message:
      z.string()
      .optional(),

    expectedRestoreTime:
      z.string()
      .optional(),
  });

/* =========================================
   AUTH CONFIG
========================================= */

export const authConfigurationSchema =
  z.object({
    jwtExpiryMinutes:
      z.number().positive(),

    refreshTokenDays:
      z.number().positive(),

    otpExpiryMinutes:
      z.number().positive(),

    maxLoginAttempts:
      z.number().positive(),

    lockoutMinutes:
      z.number().positive(),

    enableTwoFactor:
      z.boolean(),
  });

/* =========================================
   SECURITY CONFIG
========================================= */

export const securityConfigurationSchema =
  z.object({
    passwordMinLength:
      z.number().positive(),

    passwordRequireUppercase:
      z.boolean(),

    passwordRequireLowercase:
      z.boolean(),

    passwordRequireNumber:
      z.boolean(),

    passwordRequireSpecialChar:
      z.boolean(),

    sessionTimeoutMinutes:
      z.number().positive(),
  });

/* =========================================
   LOAN ENGINE CONFIG
========================================= */

export const loanEngineConfigurationSchema =
  z.object({
    minLoanAmount:
      z.number().positive(),

    maxLoanAmount:
      z.number().positive(),

    minimumCibilScore:
      z.number(),

    autoApproveLoans:
      z.boolean(),

    autoAssignLeads:
      z.boolean(),
  });

/* =========================================
   COMMISSION ENGINE CONFIG
========================================= */

export const commissionEngineConfigurationSchema =
  z.object({
    autoCommissionApproval:
      z.boolean(),

    payoutCycleDays:
      z.number().positive(),

    minimumPayoutAmount:
      z.number().positive(),
  });

/* =========================================
   API RATE LIMIT CONFIG
========================================= */

export const apiRateLimitSchema =
  z.object({
    requestsPerMinute:
      z.number().positive(),

    requestsPerHour:
      z.number().positive(),

    requestsPerDay:
      z.number().positive(),
  });

/* =========================================
   FILTER
========================================= */

export const systemSettingFilterSchema =
  z.object({
    category:
      systemSettingCategoryEnum
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
   ANALYTICS
========================================= */

export const systemSettingAnalyticsSchema =
  z.object({
    startDate:
      z.string(),

    endDate:
      z.string(),
  });

/* =========================================
   TYPES
========================================= */

export type CreateSystemSettingDto =
  z.infer<
    typeof createSystemSettingSchema
  >;

export type UpdateSystemSettingDto =
  z.infer<
    typeof updateSystemSettingSchema
  >;

export type BulkUpdateSystemSettingDto =
  z.infer<
    typeof bulkUpdateSystemSettingSchema
  >;

export type SystemFeatureFlagDto =
  z.infer<
    typeof systemFeatureFlagSchema
  >;

export type MaintenanceConfigurationDto =
  z.infer<
    typeof maintenanceConfigurationSchema
  >;

export type AuthConfigurationDto =
  z.infer<
    typeof authConfigurationSchema
  >;

export type SecurityConfigurationDto =
  z.infer<
    typeof securityConfigurationSchema
  >;

export type LoanEngineConfigurationDto =
  z.infer<
    typeof loanEngineConfigurationSchema
  >;

export type CommissionEngineConfigurationDto =
  z.infer<
    typeof commissionEngineConfigurationSchema
  >;

export type ApiRateLimitDto =
  z.infer<
    typeof apiRateLimitSchema
  >;

export type SystemSettingFilterDto =
  z.infer<
    typeof systemSettingFilterSchema
  >;

export type SystemSettingAnalyticsDto =
  z.infer<
    typeof systemSettingAnalyticsSchema
  >;