"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskAnalyticsSchema = exports.taskSlaSchema = exports.taskFilterSchema = exports.taskChecklistSchema = exports.taskCommentSchema = exports.updateTaskStatusSchema = exports.assignTaskSchema = exports.updateTaskSchema = exports.createTaskSchema = exports.taskRepeatTypeEnum = exports.taskStatusEnum = exports.taskPriorityEnum = exports.taskTypeEnum = void 0;
const zod_1 = require("zod");
/* =========================================
   TASK TYPE
========================================= */
exports.taskTypeEnum = zod_1.z.enum([
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
exports.taskPriorityEnum = zod_1.z.enum([
    "LOW",
    "MEDIUM",
    "HIGH",
    "URGENT",
    "CRITICAL",
]);
/* =========================================
   TASK STATUS
========================================= */
exports.taskStatusEnum = zod_1.z.enum([
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
exports.taskRepeatTypeEnum = zod_1.z.enum([
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
exports.createTaskSchema = zod_1.z.object({
    title: zod_1.z.string()
        .min(3)
        .max(255),
    description: zod_1.z.string()
        .min(5)
        .max(5000),
    taskType: exports.taskTypeEnum,
    priority: exports.taskPriorityEnum
        .default("MEDIUM"),
    assignedTo: zod_1.z.string()
        .cuid(),
    assignedBy: zod_1.z.string()
        .cuid(),
    dueDate: zod_1.z.coerce.date(),
    repeatType: exports.taskRepeatTypeEnum
        .default("NONE"),
    relatedLeadId: zod_1.z.string()
        .cuid()
        .optional(),
    relatedLoanId: zod_1.z.string()
        .cuid()
        .optional(),
    relatedCustomerId: zod_1.z.string()
        .cuid()
        .optional(),
});
/* =========================================
   UPDATE TASK
========================================= */
exports.updateTaskSchema = zod_1.z.object({
    taskId: zod_1.z.string().cuid(),
    title: zod_1.z.string()
        .min(3)
        .max(255)
        .optional(),
    description: zod_1.z.string()
        .min(5)
        .max(5000)
        .optional(),
    priority: exports.taskPriorityEnum.optional(),
    dueDate: zod_1.z.coerce.date().optional(),
});
/* =========================================
   ASSIGN TASK
========================================= */
exports.assignTaskSchema = zod_1.z.object({
    taskId: zod_1.z.string().cuid(),
    assignedTo: zod_1.z.string().cuid(),
});
/* =========================================
   UPDATE STATUS
========================================= */
exports.updateTaskStatusSchema = zod_1.z.object({
    taskId: zod_1.z.string().cuid(),
    status: exports.taskStatusEnum,
    remarks: zod_1.z.string()
        .max(1000)
        .optional(),
});
/* =========================================
   TASK COMMENT
========================================= */
exports.taskCommentSchema = zod_1.z.object({
    taskId: zod_1.z.string().cuid(),
    comment: zod_1.z.string()
        .min(2)
        .max(3000),
});
/* =========================================
   TASK CHECKLIST
========================================= */
exports.taskChecklistSchema = zod_1.z.object({
    taskId: zod_1.z.string().cuid(),
    title: zod_1.z.string()
        .min(2)
        .max(255),
});
/* =========================================
   TASK FILTER
========================================= */
exports.taskFilterSchema = zod_1.z.object({
    assignedTo: zod_1.z.string()
        .cuid()
        .optional(),
    assignedBy: zod_1.z.string()
        .cuid()
        .optional(),
    taskType: exports.taskTypeEnum.optional(),
    priority: exports.taskPriorityEnum.optional(),
    status: exports.taskStatusEnum.optional(),
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
   TASK SLA
========================================= */
exports.taskSlaSchema = zod_1.z.object({
    taskType: exports.taskTypeEnum,
    responseHours: zod_1.z.number().positive(),
    completionHours: zod_1.z.number().positive(),
});
/* =========================================
   TASK ANALYTICS
========================================= */
exports.taskAnalyticsSchema = zod_1.z.object({
    startDate: zod_1.z.string(),
    endDate: zod_1.z.string(),
    assignedTo: zod_1.z.string()
        .cuid()
        .optional(),
});
