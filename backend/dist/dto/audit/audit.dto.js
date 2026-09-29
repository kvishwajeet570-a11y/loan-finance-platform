"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanupAuditLogsSchema = exports.exportAuditReportSchema = exports.actionAuditFilterSchema = exports.moduleAuditFilterSchema = exports.userAuditFilterSchema = exports.auditFilterSchema = exports.updateAuditLogSchema = exports.createAuditLogSchema = exports.auditModuleEnum = exports.auditActionEnum = exports.auditSeverityEnum = void 0;
const zod_1 = require("zod");
/* =========================================
   AUDIT SEVERITY
========================================= */
exports.auditSeverityEnum = zod_1.z.enum([
    "INFO",
    "WARNING",
    "ERROR",
    "CRITICAL",
]);
/* =========================================
   AUDIT ACTION TYPES
========================================= */
exports.auditActionEnum = zod_1.z.enum([
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
exports.auditModuleEnum = zod_1.z.enum([
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
exports.createAuditLogSchema = zod_1.z.object({
    userId: zod_1.z.string().cuid().optional(),
    action: exports.auditActionEnum,
    module: exports.auditModuleEnum,
    entityId: zod_1.z.string().optional(),
    severity: exports.auditSeverityEnum.default("INFO"),
    role: zod_1.z.string().optional(),
    requestId: zod_1.z.string().optional(),
    ipAddress: zod_1.z.string().optional(),
    userAgent: zod_1.z.string().optional(),
    metadata: zod_1.z.record(zod_1.z.string(), zod_1.z.any()).optional(),
    oldData: zod_1.z.record(zod_1.z.string(), zod_1.z.any()).optional(),
    newData: zod_1.z.record(zod_1.z.string(), zod_1.z.any()).optional(),
});
/* =========================================
   UPDATE AUDIT LOG
========================================= */
exports.updateAuditLogSchema = exports.createAuditLogSchema.partial();
/* =========================================
   AUDIT FILTER
========================================= */
exports.auditFilterSchema = zod_1.z.object({
    search: zod_1.z.string().optional(),
    userId: zod_1.z.string().cuid().optional(),
    module: exports.auditModuleEnum.optional(),
    action: exports.auditActionEnum.optional(),
    severity: exports.auditSeverityEnum.optional(),
    role: zod_1.z.string().optional(),
    startDate: zod_1.z.string().optional(),
    endDate: zod_1.z.string().optional(),
    page: zod_1.z.coerce.number().min(1).default(1),
    limit: zod_1.z.coerce
        .number()
        .min(1)
        .max(100)
        .default(20),
});
/* =========================================
   USER AUDIT FILTER
========================================= */
exports.userAuditFilterSchema = zod_1.z.object({
    userId: zod_1.z.string().cuid(),
    page: zod_1.z.coerce.number().default(1),
    limit: zod_1.z.coerce.number().default(20),
});
/* =========================================
   MODULE FILTER
========================================= */
exports.moduleAuditFilterSchema = zod_1.z.object({
    module: exports.auditModuleEnum,
    page: zod_1.z.coerce.number().default(1),
    limit: zod_1.z.coerce.number().default(20),
});
/* =========================================
   ACTION FILTER
========================================= */
exports.actionAuditFilterSchema = zod_1.z.object({
    action: exports.auditActionEnum,
    page: zod_1.z.coerce.number().default(1),
    limit: zod_1.z.coerce.number().default(20),
});
/* =========================================
   EXPORT AUDIT REPORT
========================================= */
exports.exportAuditReportSchema = zod_1.z.object({
    format: zod_1.z.enum([
        "PDF",
        "CSV",
        "EXCEL",
    ]),
    startDate: zod_1.z.string(),
    endDate: zod_1.z.string(),
    module: exports.auditModuleEnum.optional(),
    severity: exports.auditSeverityEnum.optional(),
});
/* =========================================
   CLEANUP AUDIT LOGS
========================================= */
exports.cleanupAuditLogsSchema = zod_1.z.object({
    olderThanDays: zod_1.z.coerce
        .number()
        .min(1)
        .max(3650),
});
