import { z } from "zod";

/* =========================================
   SECURITY EVENT TYPES
========================================= */

export const securityEventTypeEnum = z.enum([
  "LOGIN_SUCCESS",
  "LOGIN_FAILED",
  "LOGOUT",
  "PASSWORD_CHANGED",
  "PASSWORD_RESET",
  "OTP_SENT",
  "OTP_VERIFIED",
  "ACCOUNT_LOCKED",
  "ACCOUNT_UNLOCKED",
  "UNAUTHORIZED_ACCESS",
  "PERMISSION_DENIED",
  "ROLE_CHANGED",
  "USER_BLOCKED",
  "USER_UNBLOCKED",
  "SUSPICIOUS_ACTIVITY",
  "DEVICE_REGISTERED",
  "DEVICE_REMOVED",
  "TOKEN_REVOKED",
  "MULTIPLE_LOGIN_ATTEMPT",
  "API_ABUSE",
  "SQL_INJECTION_ATTEMPT",
  "XSS_ATTEMPT",
  "BRUTE_FORCE_ATTACK",
  "DATA_EXPORT",
  "FILE_DOWNLOAD",
  "FILE_UPLOAD",
  "LOAN_APPROVAL",
  "LOAN_REJECTION",
  "PAYMENT_PROCESSED",
  "COMMISSION_APPROVED",
  "SYSTEM_SETTING_CHANGED",
]);

/* =========================================
   RISK LEVEL
========================================= */

export const securityRiskLevelEnum = z.enum([
  "LOW",
  "MEDIUM",
  "HIGH",
  "CRITICAL",
]);

/* =========================================
   SECURITY STATUS
========================================= */

export const securityStatusEnum = z.enum([
  "OPEN",
  "INVESTIGATING",
  "RESOLVED",
  "FALSE_POSITIVE",
]);

/* =========================================
   CREATE SECURITY LOG
========================================= */

export const createSecurityLogSchema = z.object({
  userId: z.string().cuid().optional(),

  eventType: securityEventTypeEnum,

  riskLevel: securityRiskLevelEnum,

  ipAddress: z.string().max(100),

  deviceInfo: z.string().max(500).optional(),

  browser: z.string().max(100).optional(),

  operatingSystem: z.string().max(100).optional(),

  location: z.string().max(255).optional(),

  endpoint: z.string().max(255).optional(),

  description: z.string().min(5).max(1000),

  metadata: z.record(z.string(), z.unknown()).optional(),
});

/* =========================================
   UPDATE SECURITY STATUS
========================================= */

export const updateSecurityStatusSchema = z.object({
  securityLogId: z.string().cuid(),

  status: securityStatusEnum,

  remarks: z.string().max(1000).optional(),
});

/* =========================================
   INVESTIGATION
========================================= */

export const investigateSecurityLogSchema =
  z.object({
    securityLogId: z.string().cuid(),

    assignedTo: z.string().cuid(),

    notes: z.string().min(5).max(2000),
  });

/* =========================================
   SECURITY FILTER
========================================= */

export const securityLogFilterSchema = z.object({
  userId: z.string().cuid().optional(),

  eventType:
    securityEventTypeEnum.optional(),

  riskLevel:
    securityRiskLevelEnum.optional(),

  status:
    securityStatusEnum.optional(),

  startDate:
    z.string().optional(),

  endDate:
    z.string().optional(),

  page:
    z.coerce.number().default(1),

  limit:
    z.coerce.number()
      .min(1)
      .max(100)
      .default(20),
});

/* =========================================
   SUSPICIOUS ACTIVITY
========================================= */

export const suspiciousActivitySchema =
  z.object({
    userId: z.string().cuid(),

    activityType:
      securityEventTypeEnum,

    description:
      z.string().min(5),

    riskLevel:
      securityRiskLevelEnum,
  });

/* =========================================
   SECURITY ANALYTICS
========================================= */

export const securityAnalyticsSchema =
  z.object({
    startDate:
      z.string(),

    endDate:
      z.string(),

    riskLevel:
      securityRiskLevelEnum
        .optional(),
  });

/* =========================================
   EXPORT TYPES
========================================= */

export type CreateSecurityLogDto =
  z.infer<
    typeof createSecurityLogSchema
  >;

export type UpdateSecurityStatusDto =
  z.infer<
    typeof updateSecurityStatusSchema
  >;

export type InvestigateSecurityLogDto =
  z.infer<
    typeof investigateSecurityLogSchema
  >;

export type SecurityLogFilterDto =
  z.infer<
    typeof securityLogFilterSchema
  >;

export type SuspiciousActivityDto =
  z.infer<
    typeof suspiciousActivitySchema
  >;

export type SecurityAnalyticsDto =
  z.infer<
    typeof securityAnalyticsSchema
  >;