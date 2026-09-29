import { z } from "zod";

/* =========================================
   NOTIFICATION TYPE
========================================= */

export const notificationTypeEnum = z.enum([
  "SYSTEM",
  "LOAN",
  "KYC",
  "PAYMENT",
  "COMMISSION",
  "REFERRAL",
  "SECURITY",
  "MARKETING",
  "INSURANCE",
  "FASTAG",
  "INVESTMENT",
  "SUPPORT",
]);

/* =========================================
   NOTIFICATION CHANNEL
========================================= */

export const notificationChannelEnum = z.enum([
  "IN_APP",
  "EMAIL",
  "SMS",
  "WHATSAPP",
  "PUSH",
]);

/* =========================================
   NOTIFICATION PRIORITY
========================================= */

export const notificationPriorityEnum = z.enum([
  "LOW",
  "MEDIUM",
  "HIGH",
  "URGENT",
]);

/* =========================================
   NOTIFICATION STATUS
========================================= */

export const notificationStatusEnum = z.enum([
  "PENDING",
  "SENT",
  "DELIVERED",
  "READ",
  "FAILED",
  "CANCELLED",
]);

/* =========================================
   CREATE NOTIFICATION
========================================= */

export const createNotificationSchema =
  z.object({
    userId: z.string().cuid(),

    title: z.string()
      .min(3)
      .max(200),

    message: z.string()
      .min(5)
      .max(5000),

    type:
      notificationTypeEnum,

    channel:
      notificationChannelEnum,

    priority:
      notificationPriorityEnum
      .default("MEDIUM"),

    actionUrl:
      z.string()
      .optional(),

    imageUrl:
      z.string()
      .optional(),

    metadata:
  z.record(
    z.string(),
    z.any()
  ).optional(),

    scheduledAt:
      z.string()
      .optional(),
  });

/* =========================================
   BULK NOTIFICATION
========================================= */

export const bulkNotificationSchema =
  z.object({
    userIds:
      z.array(
        z.string().cuid()
      ).min(1),

    title:
      z.string()
      .min(3)
      .max(200),

    message:
      z.string()
      .min(5)
      .max(5000),

    type:
      notificationTypeEnum,

    channel:
      notificationChannelEnum,

    priority:
      notificationPriorityEnum
      .default("MEDIUM"),
  });

/* =========================================
   MARK AS READ
========================================= */

export const markNotificationReadSchema =
  z.object({
    notificationId:
      z.string().cuid(),
  });

/* =========================================
   UPDATE STATUS
========================================= */

export const updateNotificationStatusSchema =
  z.object({
    notificationId:
      z.string().cuid(),

    status:
      notificationStatusEnum,
  });

/* =========================================
   SEND TEST NOTIFICATION
========================================= */

export const sendTestNotificationSchema =
  z.object({
    userId:
      z.string().cuid(),

    channel:
      notificationChannelEnum,

    title:
      z.string()
      .min(3)
      .max(200),

    message:
      z.string()
      .min(5)
      .max(5000),
  });

/* =========================================
   NOTIFICATION FILTER
========================================= */

export const notificationFilterSchema =
  z.object({
    userId:
      z.string()
      .cuid()
      .optional(),

    type:
      notificationTypeEnum.optional(),

    channel:
      notificationChannelEnum.optional(),

    status:
      notificationStatusEnum.optional(),

    priority:
      notificationPriorityEnum.optional(),

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
   SCHEDULE NOTIFICATION
========================================= */

export const scheduleNotificationSchema =
  z.object({
    title:
      z.string()
      .min(3)
      .max(200),

    message:
      z.string()
      .min(5)
      .max(5000),

    type:
      notificationTypeEnum,

    channel:
      notificationChannelEnum,

    scheduledAt:
      z.string(),

    userIds:
      z.array(
        z.string().cuid()
      ).min(1),
  });

/* =========================================
   NOTIFICATION ANALYTICS
========================================= */

export const notificationAnalyticsSchema =
  z.object({
    type:
      notificationTypeEnum.optional(),

    channel:
      notificationChannelEnum.optional(),

    startDate:
      z.string().optional(),

    endDate:
      z.string().optional(),
  });

/* =========================================
   TYPES
========================================= */

export type CreateNotificationDto =
  z.infer<
    typeof createNotificationSchema
  >;

export type BulkNotificationDto =
  z.infer<
    typeof bulkNotificationSchema
  >;

export type MarkNotificationReadDto =
  z.infer<
    typeof markNotificationReadSchema
  >;

export type UpdateNotificationStatusDto =
  z.infer<
    typeof updateNotificationStatusSchema
  >;

export type SendTestNotificationDto =
  z.infer<
    typeof sendTestNotificationSchema
  >;

export type NotificationFilterDto =
  z.infer<
    typeof notificationFilterSchema
  >;

export type ScheduleNotificationDto =
  z.infer<
    typeof scheduleNotificationSchema
  >;

export type NotificationAnalyticsDto =
  z.infer<
    typeof notificationAnalyticsSchema
  >;