import { z } from "zod";

/* =========================================
   AUDIT SEVERITY
========================================= */

export const auditSeverityEnum = z.enum([
  "INFO",
  "WARNING",
  "ERROR",
  "CRITICAL",
]);

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
  userId: z.string().cuid().optional(),

  action: auditActionEnum,

  module: auditModuleEnum,

  entityId: z.string().optional(),

  severity: auditSeverityEnum.default("INFO"),

  role: z.string().optional(),

  requestId: z.string().optional(),

  ipAddress: z.string().optional(),

  userAgent: z.string().optional(),

  metadata: z.record(z.string(), z.any()).optional(),

  oldData: z.record(z.string(), z.any()).optional(),

  newData: z.record(z.string(), z.any()).optional(),
});

/* =========================================
   UPDATE AUDIT LOG
========================================= */

export const updateAuditLogSchema =
  createAuditLogSchema.partial();

/* =========================================
   AUDIT FILTER
========================================= */

export const auditFilterSchema = z.object({
  search: z.string().optional(),

  userId: z.string().cuid().optional(),

  module: auditModuleEnum.optional(),

  action: auditActionEnum.optional(),

  severity: auditSeverityEnum.optional(),

  role: z.string().optional(),

  startDate: z.string().optional(),

  endDate: z.string().optional(),

  page: z.coerce.number().min(1).default(1),

  limit: z.coerce
    .number()
    .min(1)
    .max(100)
    .default(20),
});

/* =========================================
   USER AUDIT FILTER
========================================= */

export const userAuditFilterSchema =
  z.object({
    userId: z.string().cuid(),

    page: z.coerce.number().default(1),

    limit: z.coerce.number().default(20),
  });

/* =========================================
   MODULE FILTER
========================================= */

export const moduleAuditFilterSchema =
  z.object({
    module: auditModuleEnum,

    page: z.coerce.number().default(1),

    limit: z.coerce.number().default(20),
  });

/* =========================================
   ACTION FILTER
========================================= */

export const actionAuditFilterSchema =
  z.object({
    action: auditActionEnum,

    page: z.coerce.number().default(1),

    limit: z.coerce.number().default(20),
  });

/* =========================================
   EXPORT AUDIT REPORT
========================================= */

export const exportAuditReportSchema =
  z.object({
    format: z.enum([
      "PDF",
      "CSV",
      "EXCEL",
    ]),

    startDate: z.string(),

    endDate: z.string(),

    module: auditModuleEnum.optional(),

    severity: auditSeverityEnum.optional(),
  });

/* =========================================
   CLEANUP AUDIT LOGS
========================================= */

export const cleanupAuditLogsSchema =
  z.object({
    olderThanDays: z.coerce
      .number()
      .min(1)
      .max(3650),
  });

/* =========================================
   TYPES
========================================= */

export type AuditSeverity =
  z.infer<typeof auditSeverityEnum>;

export type AuditAction =
  z.infer<typeof auditActionEnum>;

export type AuditModule =
  z.infer<typeof auditModuleEnum>;

export type CreateAuditLogDto =
  z.infer<typeof createAuditLogSchema>;

export type UpdateAuditLogDto =
  z.infer<typeof updateAuditLogSchema>;

export type AuditFilterDto =
  z.infer<typeof auditFilterSchema>;

export type UserAuditFilterDto =
  z.infer<typeof userAuditFilterSchema>;

export type ModuleAuditFilterDto =
  z.infer<typeof moduleAuditFilterSchema>;

export type ActionAuditFilterDto =
  z.infer<typeof actionAuditFilterSchema>;

export type ExportAuditReportDto =
  z.infer<typeof exportAuditReportSchema>;

export type CleanupAuditLogsDto =
  z.infer<typeof cleanupAuditLogsSchema>;