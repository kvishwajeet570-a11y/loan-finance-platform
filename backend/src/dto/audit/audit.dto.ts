import { z } from "zod";

/* =========================================
   AUDIT ACTION TYPES
========================================= */

export const auditActionEnum = z.enum([
  "CREATE",
  "UPDATE",
  "DELETE",
  "VIEW",
  "LOGIN",
  "LOGOUT",
  "APPROVE",
  "REJECT",
  "BLOCK",
  "UNBLOCK",
  "DISBURSE",
  "ASSIGN_ROLE",
  "REMOVE_ROLE",
  "EXPORT",
]);

/* =========================================
   AUDIT MODULE TYPES
========================================= */

export const auditModuleEnum = z.enum([
  "USER",
  "ADMIN",
  "LOAN",
  "KYC",
  "PAYMENT",
  "PARTNER",
  "DSA",
  "ROLE",
  "PERMISSION",
  "COMMISSION",
  "REFERRAL",
  "SETTINGS",
  "DOCUMENT",
  "SUPPORT",
  "SYSTEM",
]);

/* =========================================
   CREATE AUDIT LOG
========================================= */

export const createAuditLogSchema = z.object({
  userId: z.string().cuid(),

  action: auditActionEnum,

  module: auditModuleEnum,

  recordId: z.string().optional(),

  oldData: z.record(z.string(), z.any()).optional(),

  newData: z.record(z.string(), z.any()).optional(),

  ipAddress: z.string().optional(),

  userAgent: z.string().optional(),

  remarks: z.string().max(500).optional(),
});

/* =========================================
   AUDIT FILTER
========================================= */

export const auditFilterSchema = z.object({
  search: z.string().optional(),

  userId: z.string().cuid().optional(),

  module: auditModuleEnum.optional(),

  action: auditActionEnum.optional(),

  startDate: z.string().optional(),

  endDate: z.string().optional(),

  page: z.coerce.number().min(1).default(1),

  limit: z.coerce.number().min(1).max(100).default(20),
});

/* =========================================
   USER AUDIT FILTER
========================================= */

export const userAuditFilterSchema = z.object({
  userId: z.string().cuid(),

  page: z.coerce.number().default(1),

  limit: z.coerce.number().default(20),
});

/* =========================================
   EXPORT AUDIT REPORT
========================================= */

export const exportAuditReportSchema = z.object({
  format: z.enum([
    "PDF",
    "CSV",
    "EXCEL",
  ]),

  startDate: z.string(),

  endDate: z.string(),

  module: auditModuleEnum.optional(),
});

/* =========================================
   CLEANUP AUDIT LOGS
========================================= */

export const cleanupAuditLogsSchema = z.object({
  olderThanDays: z.coerce
    .number()
    .min(30)
    .max(3650),
});

/* =========================================
   TYPES
========================================= */

export type AuditAction =
  z.infer<typeof auditActionEnum>;

export type AuditModule =
  z.infer<typeof auditModuleEnum>;

export type CreateAuditLogDto =
  z.infer<typeof createAuditLogSchema>;

export type AuditFilterDto =
  z.infer<typeof auditFilterSchema>;

export type UserAuditFilterDto =
  z.infer<typeof userAuditFilterSchema>;

export type ExportAuditReportDto =
  z.infer<typeof exportAuditReportSchema>;

export type CleanupAuditLogsDto =
  z.infer<typeof cleanupAuditLogsSchema>;