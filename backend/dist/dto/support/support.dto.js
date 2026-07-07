"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supportAnalyticsSchema = exports.supportFilterSchema = exports.supportFeedbackSchema = exports.supportSlaSchema = exports.supportCommentSchema = exports.updateSupportStatusSchema = exports.escalateTicketSchema = exports.assignSupportTicketSchema = exports.updateSupportTicketSchema = exports.createSupportTicketSchema = exports.supportSourceEnum = exports.supportStatusEnum = exports.supportPriorityEnum = exports.supportTicketTypeEnum = void 0;
const zod_1 = require("zod");
/* =========================================
   TICKET TYPE
========================================= */
exports.supportTicketTypeEnum = zod_1.z.enum([
    "GENERAL",
    "LOAN",
    "KYC",
    "PAYMENT",
    "INSURANCE",
    "FASTAG",
    "RECHARGE",
    "INVESTMENT",
    "PARTNER",
    "DSA",
    "COMMISSION",
    "TECHNICAL",
    "ACCOUNT",
    "COMPLAINT",
]);
/* =========================================
   PRIORITY
========================================= */
exports.supportPriorityEnum = zod_1.z.enum([
    "LOW",
    "MEDIUM",
    "HIGH",
    "URGENT",
    "CRITICAL",
]);
/* =========================================
   STATUS
========================================= */
exports.supportStatusEnum = zod_1.z.enum([
    "OPEN",
    "ASSIGNED",
    "IN_PROGRESS",
    "ON_HOLD",
    "ESCALATED",
    "RESOLVED",
    "CLOSED",
    "REJECTED",
]);
/* =========================================
   SOURCE
========================================= */
exports.supportSourceEnum = zod_1.z.enum([
    "WEB",
    "MOBILE_APP",
    "EMAIL",
    "PHONE",
    "WHATSAPP",
    "ADMIN_PANEL",
]);
/* =========================================
   CREATE TICKET
========================================= */
exports.createSupportTicketSchema = zod_1.z.object({
    userId: zod_1.z.string()
        .cuid()
        .optional(),
    ticketType: exports.supportTicketTypeEnum,
    subject: zod_1.z.string()
        .min(5)
        .max(255),
    description: zod_1.z.string()
        .min(10)
        .max(5000),
    priority: exports.supportPriorityEnum
        .default("MEDIUM"),
    source: exports.supportSourceEnum,
    attachmentUrls: zod_1.z.array(zod_1.z.string())
        .optional(),
});
/* =========================================
   UPDATE TICKET
========================================= */
exports.updateSupportTicketSchema = zod_1.z.object({
    ticketId: zod_1.z.string().cuid(),
    subject: zod_1.z.string()
        .min(5)
        .max(255)
        .optional(),
    description: zod_1.z.string()
        .min(10)
        .max(5000)
        .optional(),
    priority: exports.supportPriorityEnum
        .optional(),
});
/* =========================================
   ASSIGN TICKET
========================================= */
exports.assignSupportTicketSchema = zod_1.z.object({
    ticketId: zod_1.z.string().cuid(),
    assignedTo: zod_1.z.string().cuid(),
});
/* =========================================
   ESCALATE TICKET
========================================= */
exports.escalateTicketSchema = zod_1.z.object({
    ticketId: zod_1.z.string().cuid(),
    escalatedTo: zod_1.z.string().cuid(),
    reason: zod_1.z.string()
        .min(5)
        .max(1000),
});
/* =========================================
   UPDATE STATUS
========================================= */
exports.updateSupportStatusSchema = zod_1.z.object({
    ticketId: zod_1.z.string().cuid(),
    status: exports.supportStatusEnum,
    remarks: zod_1.z.string()
        .max(2000)
        .optional(),
});
/* =========================================
   ADD COMMENT
========================================= */
exports.supportCommentSchema = zod_1.z.object({
    ticketId: zod_1.z.string().cuid(),
    comment: zod_1.z.string()
        .min(2)
        .max(3000),
    internal: zod_1.z.boolean()
        .default(false),
});
/* =========================================
   SLA CONFIG
========================================= */
exports.supportSlaSchema = zod_1.z.object({
    ticketType: exports.supportTicketTypeEnum,
    priority: exports.supportPriorityEnum,
    responseTimeHours: zod_1.z.number().positive(),
    resolutionTimeHours: zod_1.z.number().positive(),
});
/* =========================================
   CUSTOMER FEEDBACK
========================================= */
exports.supportFeedbackSchema = zod_1.z.object({
    ticketId: zod_1.z.string().cuid(),
    rating: zod_1.z.number()
        .min(1)
        .max(5),
    feedback: zod_1.z.string()
        .max(1000)
        .optional(),
});
/* =========================================
   FILTER
========================================= */
exports.supportFilterSchema = zod_1.z.object({
    ticketType: exports.supportTicketTypeEnum
        .optional(),
    priority: exports.supportPriorityEnum
        .optional(),
    status: exports.supportStatusEnum
        .optional(),
    assignedTo: zod_1.z.string()
        .cuid()
        .optional(),
    userId: zod_1.z.string()
        .cuid()
        .optional(),
    startDate: zod_1.z.string()
        .optional(),
    endDate: zod_1.z.string()
        .optional(),
    page: zod_1.z.coerce.number()
        .default(1),
    limit: zod_1.z.coerce.number()
        .min(1)
        .max(100)
        .default(20),
});
/* =========================================
   ANALYTICS
========================================= */
exports.supportAnalyticsSchema = zod_1.z.object({
    startDate: zod_1.z.string(),
    endDate: zod_1.z.string(),
    ticketType: exports.supportTicketTypeEnum
        .optional(),
});
