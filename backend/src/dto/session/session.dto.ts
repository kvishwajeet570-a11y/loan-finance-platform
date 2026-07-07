import { z } from "zod";

/* =========================================
   SESSION STATUS
========================================= */

export const sessionStatusEnum = z.enum([
  "ACTIVE",
  "EXPIRED",
  "REVOKED",
  "LOGGED_OUT",
]);

/* =========================================
   DEVICE TYPE
========================================= */

export const deviceTypeEnum = z.enum([
  "WEB",
  "ANDROID",
  "IOS",
  "TABLET",
  "DESKTOP",
]);

/* =========================================
   CREATE SESSION
========================================= */

export const createSessionSchema = z.object({
  userId: z.string().cuid(),

  refreshTokenId:
    z.string().cuid().optional(),

  deviceType:
    deviceTypeEnum,

  deviceName:
    z.string().max(255).optional(),

  browser:
    z.string().max(100).optional(),

  operatingSystem:
    z.string().max(100).optional(),

  ipAddress:
    z.string().max(100),

  location:
    z.string().max(255).optional(),

  userAgent:
    z.string().max(1000).optional(),
});

/* =========================================
   UPDATE SESSION
========================================= */

export const updateSessionSchema = z.object({
  sessionId:
    z.string().cuid(),

  lastActivityAt:
    z.coerce.date().optional(),

  ipAddress:
    z.string().optional(),

  location:
    z.string().optional(),
});

/* =========================================
   TERMINATE SESSION
========================================= */

export const terminateSessionSchema =
  z.object({
    sessionId:
      z.string().cuid(),

    reason:
      z.string()
        .min(3)
        .max(500)
        .optional(),
  });

/* =========================================
   TERMINATE ALL SESSIONS
========================================= */

export const terminateAllSessionsSchema =
  z.object({
    userId:
      z.string().cuid(),

    exceptCurrent:
      z.boolean().default(true),
  });

/* =========================================
   REVOKE SESSION
========================================= */

export const revokeSessionSchema =
  z.object({
    sessionId:
      z.string().cuid(),

    remarks:
      z.string()
        .max(500)
        .optional(),
  });

/* =========================================
   SESSION FILTER
========================================= */

export const sessionFilterSchema =
  z.object({
    userId:
      z.string()
      .cuid()
      .optional(),

    deviceType:
      deviceTypeEnum
      .optional(),

    status:
      sessionStatusEnum
      .optional(),

    startDate:
      z.string()
      .optional(),

    endDate:
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
   SESSION ANALYTICS
========================================= */

export const sessionAnalyticsSchema =
  z.object({
    startDate:
      z.string(),

    endDate:
      z.string(),

    userId:
      z.string()
      .cuid()
      .optional(),
  });

/* =========================================
   ACTIVE SESSION CHECK
========================================= */

export const activeSessionSchema =
  z.object({
    userId:
      z.string().cuid(),
  });

/* =========================================
   TYPES
========================================= */

export type CreateSessionDto =
  z.infer<
    typeof createSessionSchema
  >;

export type UpdateSessionDto =
  z.infer<
    typeof updateSessionSchema
  >;

export type TerminateSessionDto =
  z.infer<
    typeof terminateSessionSchema
  >;

export type TerminateAllSessionsDto =
  z.infer<
    typeof terminateAllSessionsSchema
  >;

export type RevokeSessionDto =
  z.infer<
    typeof revokeSessionSchema
  >;

export type SessionFilterDto =
  z.infer<
    typeof sessionFilterSchema
  >;

export type SessionAnalyticsDto =
  z.infer<
    typeof sessionAnalyticsSchema
  >;

export type ActiveSessionDto =
  z.infer<
    typeof activeSessionSchema
  >;