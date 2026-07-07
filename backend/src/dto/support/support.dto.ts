import { z } from "zod";

/* =========================================
   TICKET TYPE
========================================= */

export const supportTicketTypeEnum =
  z.enum([
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

export const supportPriorityEnum =
  z.enum([
    "LOW",
    "MEDIUM",
    "HIGH",
    "URGENT",
    "CRITICAL",
  ]);

/* =========================================
   STATUS
========================================= */

export const supportStatusEnum =
  z.enum([
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

export const supportSourceEnum =
  z.enum([
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

export const createSupportTicketSchema =
  z.object({
    userId:
      z.string()
      .cuid()
      .optional(),

    ticketType:
      supportTicketTypeEnum,

    subject:
      z.string()
      .min(5)
      .max(255),

    description:
      z.string()
      .min(10)
      .max(5000),

    priority:
      supportPriorityEnum
      .default("MEDIUM"),

    source:
      supportSourceEnum,

    attachmentUrls:
      z.array(z.string())
      .optional(),
  });

/* =========================================
   UPDATE TICKET
========================================= */

export const updateSupportTicketSchema =
  z.object({
    ticketId:
      z.string().cuid(),

    subject:
      z.string()
      .min(5)
      .max(255)
      .optional(),

    description:
      z.string()
      .min(10)
      .max(5000)
      .optional(),

    priority:
      supportPriorityEnum
      .optional(),
  });

/* =========================================
   ASSIGN TICKET
========================================= */

export const assignSupportTicketSchema =
  z.object({
    ticketId:
      z.string().cuid(),

    assignedTo:
      z.string().cuid(),
  });

/* =========================================
   ESCALATE TICKET
========================================= */

export const escalateTicketSchema =
  z.object({
    ticketId:
      z.string().cuid(),

    escalatedTo:
      z.string().cuid(),

    reason:
      z.string()
      .min(5)
      .max(1000),
  });

/* =========================================
   UPDATE STATUS
========================================= */

export const updateSupportStatusSchema =
  z.object({
    ticketId:
      z.string().cuid(),

    status:
      supportStatusEnum,

    remarks:
      z.string()
      .max(2000)
      .optional(),
  });

/* =========================================
   ADD COMMENT
========================================= */

export const supportCommentSchema =
  z.object({
    ticketId:
      z.string().cuid(),

    comment:
      z.string()
      .min(2)
      .max(3000),

    internal:
      z.boolean()
      .default(false),
  });

/* =========================================
   SLA CONFIG
========================================= */

export const supportSlaSchema =
  z.object({
    ticketType:
      supportTicketTypeEnum,

    priority:
      supportPriorityEnum,

    responseTimeHours:
      z.number().positive(),

    resolutionTimeHours:
      z.number().positive(),
  });

/* =========================================
   CUSTOMER FEEDBACK
========================================= */

export const supportFeedbackSchema =
  z.object({
    ticketId:
      z.string().cuid(),

    rating:
      z.number()
      .min(1)
      .max(5),

    feedback:
      z.string()
      .max(1000)
      .optional(),
  });

/* =========================================
   FILTER
========================================= */

export const supportFilterSchema =
  z.object({
    ticketType:
      supportTicketTypeEnum
      .optional(),

    priority:
      supportPriorityEnum
      .optional(),

    status:
      supportStatusEnum
      .optional(),

    assignedTo:
      z.string()
      .cuid()
      .optional(),

    userId:
      z.string()
      .cuid()
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
   ANALYTICS
========================================= */

export const supportAnalyticsSchema =
  z.object({
    startDate:
      z.string(),

    endDate:
      z.string(),

    ticketType:
      supportTicketTypeEnum
      .optional(),
  });

/* =========================================
   TYPES
========================================= */

export type CreateSupportTicketDto =
  z.infer<
    typeof createSupportTicketSchema
  >;

export type UpdateSupportTicketDto =
  z.infer<
    typeof updateSupportTicketSchema
  >;

export type AssignSupportTicketDto =
  z.infer<
    typeof assignSupportTicketSchema
  >;

export type EscalateTicketDto =
  z.infer<
    typeof escalateTicketSchema
  >;

export type UpdateSupportStatusDto =
  z.infer<
    typeof updateSupportStatusSchema
  >;

export type SupportCommentDto =
  z.infer<
    typeof supportCommentSchema
  >;

export type SupportSlaDto =
  z.infer<
    typeof supportSlaSchema
  >;

export type SupportFeedbackDto =
  z.infer<
    typeof supportFeedbackSchema
  >;

export type SupportFilterDto =
  z.infer<
    typeof supportFilterSchema
  >;

export type SupportAnalyticsDto =
  z.infer<
    typeof supportAnalyticsSchema
  >;