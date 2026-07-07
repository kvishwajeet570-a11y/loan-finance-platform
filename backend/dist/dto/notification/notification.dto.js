"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationAnalyticsSchema = exports.scheduleNotificationSchema = exports.notificationFilterSchema = exports.sendTestNotificationSchema = exports.updateNotificationStatusSchema = exports.markNotificationReadSchema = exports.bulkNotificationSchema = exports.createNotificationSchema = exports.notificationStatusEnum = exports.notificationPriorityEnum = exports.notificationChannelEnum = exports.notificationTypeEnum = void 0;
const zod_1 = require("zod");
/* =========================================
   NOTIFICATION TYPE
========================================= */
exports.notificationTypeEnum = zod_1.z.enum([
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
exports.notificationChannelEnum = zod_1.z.enum([
    "IN_APP",
    "EMAIL",
    "SMS",
    "WHATSAPP",
    "PUSH",
]);
/* =========================================
   NOTIFICATION PRIORITY
========================================= */
exports.notificationPriorityEnum = zod_1.z.enum([
    "LOW",
    "MEDIUM",
    "HIGH",
    "URGENT",
]);
/* =========================================
   NOTIFICATION STATUS
========================================= */
exports.notificationStatusEnum = zod_1.z.enum([
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
exports.createNotificationSchema = zod_1.z.object({
    userId: zod_1.z.string().cuid(),
    title: zod_1.z.string()
        .min(3)
        .max(200),
    message: zod_1.z.string()
        .min(5)
        .max(5000),
    type: exports.notificationTypeEnum,
    channel: exports.notificationChannelEnum,
    priority: exports.notificationPriorityEnum
        .default("MEDIUM"),
    actionUrl: zod_1.z.string()
        .optional(),
    imageUrl: zod_1.z.string()
        .optional(),
    metadata: zod_1.z.record(zod_1.z.any())
        .optional(),
    scheduledAt: zod_1.z.string()
        .optional(),
});
/* =========================================
   BULK NOTIFICATION
========================================= */
exports.bulkNotificationSchema = zod_1.z.object({
    userIds: zod_1.z.array(zod_1.z.string().cuid()).min(1),
    title: zod_1.z.string()
        .min(3)
        .max(200),
    message: zod_1.z.string()
        .min(5)
        .max(5000),
    type: exports.notificationTypeEnum,
    channel: exports.notificationChannelEnum,
    priority: exports.notificationPriorityEnum
        .default("MEDIUM"),
});
/* =========================================
   MARK AS READ
========================================= */
exports.markNotificationReadSchema = zod_1.z.object({
    notificationId: zod_1.z.string().cuid(),
});
/* =========================================
   UPDATE STATUS
========================================= */
exports.updateNotificationStatusSchema = zod_1.z.object({
    notificationId: zod_1.z.string().cuid(),
    status: exports.notificationStatusEnum,
});
/* =========================================
   SEND TEST NOTIFICATION
========================================= */
exports.sendTestNotificationSchema = zod_1.z.object({
    userId: zod_1.z.string().cuid(),
    channel: exports.notificationChannelEnum,
    title: zod_1.z.string(),
    message: zod_1.z.string(),
});
/* =========================================
   NOTIFICATION FILTER
========================================= */
exports.notificationFilterSchema = zod_1.z.object({
    userId: zod_1.z.string()
        .cuid()
        .optional(),
    type: exports.notificationTypeEnum.optional(),
    channel: exports.notificationChannelEnum.optional(),
    status: exports.notificationStatusEnum.optional(),
    priority: exports.notificationPriorityEnum.optional(),
    startDate: zod_1.z.string().optional(),
    endDate: zod_1.z.string().optional(),
    page: zod_1.z.coerce.number()
        .default(1),
    limit: zod_1.z.coerce.number()
        .min(1)
        .max(100)
        .default(20),
});
/* =========================================
   SCHEDULE NOTIFICATION
========================================= */
exports.scheduleNotificationSchema = zod_1.z.object({
    title: zod_1.z.string()
        .min(3),
    message: zod_1.z.string()
        .min(5),
    type: exports.notificationTypeEnum,
    channel: exports.notificationChannelEnum,
    scheduledAt: zod_1.z.string(),
    userIds: zod_1.z.array(zod_1.z.string().cuid()).min(1),
});
/* =========================================
   NOTIFICATION ANALYTICS
========================================= */
exports.notificationAnalyticsSchema = zod_1.z.object({
    type: exports.notificationTypeEnum.optional(),
    channel: exports.notificationChannelEnum.optional(),
    startDate: zod_1.z.string().optional(),
    endDate: zod_1.z.string().optional(),
});
