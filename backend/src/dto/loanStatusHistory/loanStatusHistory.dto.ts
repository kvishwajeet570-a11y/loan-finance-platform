import { z } from "zod";

/* =========================================
   LOAN STATUS
========================================= */

export const loanStatusEnum = z.enum([
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

export const actionTypeEnum = z.enum([
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

export const createLoanStatusHistorySchema =
  z.object({
    loanId: z.string().cuid(),

    previousStatus:
      loanStatusEnum.optional(),

    currentStatus:
      loanStatusEnum,

    actionType:
      actionTypeEnum,

    remarks: z.string()
      .max(1000)
      .optional(),

    changedBy:
      z.string().cuid(),

    changedByRole:
      z.enum([
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

export const loanCommentSchema =
  z.object({
    loanId: z.string().cuid(),

    comment: z.string()
      .min(3)
      .max(2000),

    createdBy:
      z.string().cuid(),
  });

/* =========================================
   ASSIGNMENT HISTORY
========================================= */

export const loanAssignmentHistorySchema =
  z.object({
    loanId: z.string().cuid(),

    assignedTo:
      z.string().cuid(),

    assignedRole:
      z.enum([
        "DSA",
        "PARTNER",
        "EMPLOYEE",
        "MANAGER",
      ]),

    assignedBy:
      z.string().cuid(),

    remarks:
      z.string().optional(),
  });

/* =========================================
   STATUS HISTORY FILTER
========================================= */

export const loanStatusHistoryFilterSchema =
  z.object({
    loanId:
      z.string().cuid().optional(),

    status:
      loanStatusEnum.optional(),

    actionType:
      actionTypeEnum.optional(),

    changedBy:
      z.string().cuid().optional(),

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
   TIMELINE FILTER
========================================= */

export const loanTimelineSchema =
  z.object({
    loanId: z.string().cuid(),
  });

/* =========================================
   AUDIT REPORT
========================================= */

export const loanAuditReportSchema =
  z.object({
    startDate:
      z.string().optional(),

    endDate:
      z.string().optional(),

    status:
      loanStatusEnum.optional(),
  });

/* =========================================
   TYPES
========================================= */

export type CreateLoanStatusHistoryDto =
  z.infer<
    typeof createLoanStatusHistorySchema
  >;

export type LoanCommentDto =
  z.infer<typeof loanCommentSchema>;

export type LoanAssignmentHistoryDto =
  z.infer<
    typeof loanAssignmentHistorySchema
  >;

export type LoanStatusHistoryFilterDto =
  z.infer<
    typeof loanStatusHistoryFilterSchema
  >;

export type LoanTimelineDto =
  z.infer<typeof loanTimelineSchema>;

export type LoanAuditReportDto =
  z.infer<
    typeof loanAuditReportSchema
  >;