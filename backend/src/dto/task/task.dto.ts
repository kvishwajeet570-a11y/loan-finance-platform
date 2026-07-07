import { z } from "zod";

/* =========================================
   TASK TYPE
========================================= */

export const taskTypeEnum = z.enum([
  "GENERAL",
  "LEAD_FOLLOWUP",
  "LOAN_PROCESSING",
  "LOAN_VERIFICATION",
  "KYC_VERIFICATION",
  "DOCUMENT_REVIEW",
  "CUSTOMER_CALLBACK",
  "SUPPORT",
  "PAYMENT_VERIFICATION",
  "COMMISSION_APPROVAL",
  "PARTNER_ONBOARDING",
  "DSA_ONBOARDING",
  "REPORT_GENERATION",
  "AUDIT",
  "SYSTEM_TASK",
]);

/* =========================================
   TASK PRIORITY
========================================= */

export const taskPriorityEnum = z.enum([
  "LOW",
  "MEDIUM",
  "HIGH",
  "URGENT",
  "CRITICAL",
]);

/* =========================================
   TASK STATUS
========================================= */

export const taskStatusEnum = z.enum([
  "PENDING",
  "ASSIGNED",
  "IN_PROGRESS",
  "ON_HOLD",
  "COMPLETED",
  "CANCELLED",
  "OVERDUE",
]);

/* =========================================
   TASK REPEAT TYPE
========================================= */

export const taskRepeatTypeEnum = z.enum([
  "NONE",
  "DAILY",
  "WEEKLY",
  "MONTHLY",
  "QUARTERLY",
  "YEARLY",
]);

/* =========================================
   CREATE TASK
========================================= */

export const createTaskSchema = z.object({
  title: z.string()
    .min(3)
    .max(255),

  description: z.string()
    .min(5)
    .max(5000),

  taskType: taskTypeEnum,

  priority: taskPriorityEnum
    .default("MEDIUM"),

  assignedTo:
    z.string()
    .cuid(),

  assignedBy:
    z.string()
    .cuid(),

  dueDate:
    z.coerce.date(),

  repeatType:
    taskRepeatTypeEnum
    .default("NONE"),

  relatedLeadId:
    z.string()
    .cuid()
    .optional(),

  relatedLoanId:
    z.string()
    .cuid()
    .optional(),

  relatedCustomerId:
    z.string()
    .cuid()
    .optional(),
});

/* =========================================
   UPDATE TASK
========================================= */

export const updateTaskSchema = z.object({
  taskId:
    z.string().cuid(),

  title:
    z.string()
    .min(3)
    .max(255)
    .optional(),

  description:
    z.string()
    .min(5)
    .max(5000)
    .optional(),

  priority:
    taskPriorityEnum.optional(),

  dueDate:
    z.coerce.date().optional(),
});

/* =========================================
   ASSIGN TASK
========================================= */

export const assignTaskSchema = z.object({
  taskId:
    z.string().cuid(),

  assignedTo:
    z.string().cuid(),
});

/* =========================================
   UPDATE STATUS
========================================= */

export const updateTaskStatusSchema =
  z.object({
    taskId:
      z.string().cuid(),

    status:
      taskStatusEnum,

    remarks:
      z.string()
      .max(1000)
      .optional(),
  });

/* =========================================
   TASK COMMENT
========================================= */

export const taskCommentSchema =
  z.object({
    taskId:
      z.string().cuid(),

    comment:
      z.string()
      .min(2)
      .max(3000),
  });

/* =========================================
   TASK CHECKLIST
========================================= */

export const taskChecklistSchema =
  z.object({
    taskId:
      z.string().cuid(),

    title:
      z.string()
      .min(2)
      .max(255),
  });

/* =========================================
   TASK FILTER
========================================= */

export const taskFilterSchema =
  z.object({
    assignedTo:
      z.string()
      .cuid()
      .optional(),

    assignedBy:
      z.string()
      .cuid()
      .optional(),

    taskType:
      taskTypeEnum.optional(),

    priority:
      taskPriorityEnum.optional(),

    status:
      taskStatusEnum.optional(),

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
   TASK SLA
========================================= */

export const taskSlaSchema =
  z.object({
    taskType:
      taskTypeEnum,

    responseHours:
      z.number().positive(),

    completionHours:
      z.number().positive(),
  });

/* =========================================
   TASK ANALYTICS
========================================= */

export const taskAnalyticsSchema =
  z.object({
    startDate:
      z.string(),

    endDate:
      z.string(),

    assignedTo:
      z.string()
      .cuid()
      .optional(),
  });

/* =========================================
   TYPES
========================================= */

export type CreateTaskDto =
  z.infer<typeof createTaskSchema>;

export type UpdateTaskDto =
  z.infer<typeof updateTaskSchema>;

export type AssignTaskDto =
  z.infer<typeof assignTaskSchema>;

export type UpdateTaskStatusDto =
  z.infer<typeof updateTaskStatusSchema>;

export type TaskCommentDto =
  z.infer<typeof taskCommentSchema>;

export type TaskChecklistDto =
  z.infer<typeof taskChecklistSchema>;

export type TaskFilterDto =
  z.infer<typeof taskFilterSchema>;

export type TaskSlaDto =
  z.infer<typeof taskSlaSchema>;

export type TaskAnalyticsDto =
  z.infer<typeof taskAnalyticsSchema>;