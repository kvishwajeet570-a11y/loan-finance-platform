"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanupAuditLogsSchema = exports.exportAuditReportSchema = exports.userAuditFilterSchema = exports.auditFilterSchema = exports.createAuditLogSchema = exports.auditModuleEnum = exports.auditActionEnum = void 0;
const zod_1 = require("zod");
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
    userId: zod_1.z.string().cuid(),
    action: exports.auditActionEnum,
    module: exports.auditModuleEnum,
    recordId: zod_1.z.string().optional(),
    oldData: zod_1.z.record(zod_1.z.string(), zod_1.z.any()).optional(),
    newData: zod_1.z.record(zod_1.z.string(), zod_1.z.any()).optional(),
    ipAddress: zod_1.z.string().optional(),
    userAgent: zod_1.z.string().optional(),
    remarks: zod_1.z.string().max(500).optional(),
});
/* =========================================
   AUDIT FILTER
========================================= */
exports.auditFilterSchema = zod_1.z.object({
    search: zod_1.z.string().optional(),
    userId: zod_1.z.string().cuid().optional(),
    module: exports.auditModuleEnum.optional(),
    action: exports.auditActionEnum.optional(),
    startDate: zod_1.z.string().optional(),
    endDate: zod_1.z.string().optional(),
    page: zod_1.z.coerce.number().min(1).default(1),
    limit: zod_1.z.coerce.number().min(1).max(100).default(20),
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
});
/* =========================================
   CLEANUP AUDIT LOGS
========================================= */
exports.cleanupAuditLogsSchema = zod_1.z.object({
    olderThanDays: zod_1.z.coerce
        .number()
        .min(30)
        .max(3650),
});
