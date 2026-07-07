import { z } from "zod";

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
   TOKEN STATUS
========================================= */

export const refreshTokenStatusEnum = z.enum([
  "ACTIVE",
  "EXPIRED",
  "REVOKED",
  "BLACKLISTED",
]);

/* =========================================
   CREATE REFRESH TOKEN
========================================= */

export const createRefreshTokenSchema =
  z.object({
    userId: z.string().cuid(),

    refreshToken:
      z.string().min(20),

    accessToken:
      z.string().min(20),

    deviceId:
      z.string(),

    deviceType:
      deviceTypeEnum,

    deviceName:
      z.string().optional(),

    ipAddress:
      z.string(),

    userAgent:
      z.string(),

    expiresAt:
      z.string(),
  });

/* =========================================
   ROTATE REFRESH TOKEN
========================================= */

export const rotateRefreshTokenSchema =
  z.object({
    refreshToken:
      z.string().min(20),
  });

/* =========================================
   REVOKE TOKEN
========================================= */

export const revokeRefreshTokenSchema =
  z.object({
    tokenId:
      z.string().cuid(),

    reason:
      z.string()
      .min(3)
      .max(500)
      .optional(),
  });

/* =========================================
   LOGOUT DEVICE
========================================= */

export const logoutDeviceSchema =
  z.object({
    deviceId:
      z.string(),

    userId:
      z.string().cuid(),
  });

/* =========================================
   LOGOUT ALL DEVICES
========================================= */

export const logoutAllDevicesSchema =
  z.object({
    userId:
      z.string().cuid(),
  });

/* =========================================
   VERIFY REFRESH TOKEN
========================================= */

export const verifyRefreshTokenSchema =
  z.object({
    refreshToken:
      z.string().min(20),
  });

/* =========================================
   REFRESH TOKEN FILTER
========================================= */

export const refreshTokenFilterSchema =
  z.object({
    userId:
      z.string()
      .cuid()
      .optional(),

    deviceType:
      deviceTypeEnum.optional(),

    status:
      refreshTokenStatusEnum.optional(),

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
   TOKEN ANALYTICS
========================================= */

export const refreshTokenAnalyticsSchema =
  z.object({
    startDate:
      z.string().optional(),

    endDate:
      z.string().optional(),

    deviceType:
      deviceTypeEnum.optional(),
  });

/* =========================================
   TYPES
========================================= */

export type CreateRefreshTokenDto =
  z.infer<
    typeof createRefreshTokenSchema
  >;

export type RotateRefreshTokenDto =
  z.infer<
    typeof rotateRefreshTokenSchema
  >;

export type RevokeRefreshTokenDto =
  z.infer<
    typeof revokeRefreshTokenSchema
  >;

export type LogoutDeviceDto =
  z.infer<
    typeof logoutDeviceSchema
  >;

export type LogoutAllDevicesDto =
  z.infer<
    typeof logoutAllDevicesSchema
  >;

export type VerifyRefreshTokenDto =
  z.infer<
    typeof verifyRefreshTokenSchema
  >;

export type RefreshTokenFilterDto =
  z.infer<
    typeof refreshTokenFilterSchema
  >;

export type RefreshTokenAnalyticsDto =
  z.infer<
    typeof refreshTokenAnalyticsSchema
  >;