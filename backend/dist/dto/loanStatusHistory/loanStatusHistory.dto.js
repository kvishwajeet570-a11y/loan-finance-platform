"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loanAuditReportSchema = exports.loanTimelineSchema = exports.loanStatusHistoryFilterSchema = exports.loanAssignmentHistorySchema = exports.loanCommentSchema = exports.createLoanStatusHistorySchema = exports.actionTypeEnum = exports.loanStatusEnum = void 0;
const zod_1 = require("zod");
/* =========================================
   LOAN STATUS
========================================= */
exports.loanStatusEnum = zod_1.z.enum([
    "DRAFT",
    "SUBMITTED",
    "DOCUMENT_PENDING",
    "KYC_PENDING",
    "UNDER_REVIEW",
    "APPROVED",
    "REJECTED",
    "DISBURSED",
    "CLOSED",
    "CANCELLED",
]);
/* =========================================
   ACTION TYPE
========================================= */
exports.actionTypeEnum = zod_1.z.enum([
    "CREATE",
    "STATUS_CHANGE",
    "ASSIGN",
    "REASSIGN",
    "APPROVE",
    "REJECT",
    "DISBURSE",
    "CLOSE",
    "CANCEL",
    "COMMENT",
]);
/* =========================================
   CREATE STATUS HISTORY
========================================= */
exports.createLoanStatusHistorySchema = zod_1.z.object({
    loanId: zod_1.z.string().cuid(),
    previousStatus: exports.loanStatusEnum.optional(),
    currentStatus: exports.loanStatusEnum,
    actionType: exports.actionTypeEnum,
    remarks: zod_1.z.string()
        .max(1000)
        .optional(),
    changedBy: zod_1.z.string().cuid(),
    changedByRole: zod_1.z.enum([
        "SUPER_ADMIN",
        "ADMIN",
        "MANAGER",
        "EMPLOYEE",
        "DSA",
        "PARTNER",
        "SYSTEM",
    ]),
});
/* =========================================
   LOAN COMMENT
========================================= */
exports.loanCommentSchema = zod_1.z.object({
    loanId: zod_1.z.string().cuid(),
    comment: zod_1.z.string()
        .min(3)
        .max(2000),
    createdBy: zod_1.z.string().cuid(),
});
/* =========================================
   ASSIGNMENT HISTORY
========================================= */
exports.loanAssignmentHistorySchema = zod_1.z.object({
    loanId: zod_1.z.string().cuid(),
    assignedTo: zod_1.z.string().cuid(),
    assignedRole: zod_1.z.enum([
        "DSA",
        "PARTNER",
        "EMPLOYEE",
        "MANAGER",
    ]),
    assignedBy: zod_1.z.string().cuid(),
    remarks: zod_1.z.string().optional(),
});
/* =========================================
   STATUS HISTORY FILTER
========================================= */
exports.loanStatusHistoryFilterSchema = zod_1.z.object({
    loanId: zod_1.z.string().cuid().optional(),
    status: exports.loanStatusEnum.optional(),
    actionType: exports.actionTypeEnum.optional(),
    changedBy: zod_1.z.string().cuid().optional(),
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
   TIMELINE FILTER
========================================= */
exports.loanTimelineSchema = zod_1.z.object({
    loanId: zod_1.z.string().cuid(),
});
/* =========================================
   AUDIT REPORT
========================================= */
exports.loanAuditReportSchema = zod_1.z.object({
    startDate: zod_1.z.string().optional(),
    endDate: zod_1.z.string().optional(),
    status: exports.loanStatusEnum.optional(),
});
