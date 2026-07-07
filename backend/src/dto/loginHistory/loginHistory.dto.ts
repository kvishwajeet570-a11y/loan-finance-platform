import { z } from "zod";

/* =========================================
   LOGIN STATUS
========================================= */

export const loginStatusEnum = z.enum([
  "SUCCESS",
  "FAILED",
  "BLOCKED",
  "OTP_REQUIRED",
  "OTP_VERIFIED",
  "LOGOUT",
]);

/* =========================================
   LOGIN METHOD
========================================= */

export const loginMethodEnum = z.enum([
  "EMAIL",
  "PHONE",
  "GOOGLE",
  "OTP",
  "ADMIN_LOGIN",
]);

/* =========================================
   DEVICE TYPE
========================================= */

export const deviceTypeEnum = z.enum([
  "WEB",
  "ANDROID",
  "IOS",
  "WINDOWS",
  "MAC",
  "LINUX",
]);

/* =========================================
   CREATE LOGIN HISTORY
========================================= */

export const createLoginHistorySchema =
  z.object({
    userId: z.string().cuid(),

    loginMethod:
      loginMethodEnum,

    status:
      loginStatusEnum,

    ipAddress:
      z.string(),

    userAgent:
      z.string(),

    deviceType:
      deviceTypeEnum,

    deviceName:
      z.string().optional(),

    browser:
      z.string().optional(),

    operatingSystem:
      z.string().optional(),

    country:
      z.string().optional(),

    state:
      z.string().optional(),

    city:
      z.string().optional(),

    latitude:
      z.number().optional(),

    longitude:
      z.number().optional(),
  });

/* =========================================
   LOGOUT EVENT
========================================= */

export const logoutHistorySchema =
  z.object({
    userId: z.string().cuid(),

    sessionId:
      z.string().optional(),

    logoutReason:
      z.string().optional(),
  });

/* =========================================
   FAILED LOGIN TRACKING
========================================= */

export const failedLoginSchema =
  z.object({
    email:
      z.string().email(),

    ipAddress:
      z.string(),

    reason:
      z.string()
      .min(3)
      .max(500),
  });

/* =========================================
   SUSPICIOUS LOGIN
========================================= */

export const suspiciousLoginSchema =
  z.object({
    userId: z.string().cuid(),

    ipAddress:
      z.string(),

    riskScore:
      z.number()
      .min(0)
      .max(100),

    reason:
      z.string(),
  });

/* =========================================
   LOGIN HISTORY FILTER
========================================= */

export const loginHistoryFilterSchema =
  z.object({
    userId:
      z.string().cuid().optional(),

    status:
      loginStatusEnum.optional(),

    loginMethod:
      loginMethodEnum.optional(),

    deviceType:
      deviceTypeEnum.optional(),

    startDate:
      z.string().optional(),

    endDate:
      z.string().optional(),

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
   ACTIVE SESSION FILTER
========================================= */

export const activeSessionSchema =
  z.object({
    userId:
      z.string().cuid().optional(),
  });

/* =========================================
   LOGIN ANALYTICS
========================================= */

export const loginAnalyticsSchema =
  z.object({
    startDate:
      z.string().optional(),

    endDate:
      z.string().optional(),

    deviceType:
      deviceTypeEnum.optional(),
  });

/* =========================================
   EXPORT TYPES
========================================= */

export type CreateLoginHistoryDto =
  z.infer<
    typeof createLoginHistorySchema
  >;

export type LogoutHistoryDto =
  z.infer<
    typeof logoutHistorySchema
  >;

export type FailedLoginDto =
  z.infer<
    typeof failedLoginSchema
  >;

export type SuspiciousLoginDto =
  z.infer<
    typeof suspiciousLoginSchema
  >;

export type LoginHistoryFilterDto =
  z.infer<
    typeof loginHistoryFilterSchema
  >;

export type ActiveSessionDto =
  z.infer<
    typeof activeSessionSchema
  >;

export type LoginAnalyticsDto =
  z.infer<
    typeof loginAnalyticsSchema
  >;