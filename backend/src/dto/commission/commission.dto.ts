import { z } from "zod";

/* =========================================
   COMMISSION STATUS
========================================= */

export const commissionStatusEnum = z.enum([
  "PENDING",
  "APPROVED",
  "PAID",
  "REJECTED",
]);

/* =========================================
   CREATE COMMISSION
========================================= */

export const createCommissionSchema = z.object({
  userId: z.string().cuid(),

  loanId: z.string().cuid().optional(),

  partnerId: z.string().cuid().optional(),

  source: z.string().max(100).optional(),

  amount: z.number().positive(),

  loanAmount: z.number().min(0),

  commissionAmount: z.number().min(0),

  status: commissionStatusEnum.default("PENDING"),
});

/* =========================================
   UPDATE COMMISSION
========================================= */

export const updateCommissionSchema = z.object({
  amount: z.number().positive().optional(),

  loanAmount: z.number().min(0).optional(),

  commissionAmount: z.number().min(0).optional(),

  partnerId: z.string().cuid().optional(),

  source: z.string().max(100).optional(),

  status: commissionStatusEnum.optional(),

  rejectionReason: z.string().max(500).optional(),
});

/* =========================================
   APPROVE COMMISSION
========================================= */

export const approveCommissionSchema = z.object({
  commissionId: z.string().cuid(),
});

/* =========================================
   REJECT COMMISSION
========================================= */

export const rejectCommissionSchema = z.object({
  commissionId: z.string().cuid(),

  rejectionReason: z.string().min(5).max(500),
});

/* =========================================
   PAY COMMISSION
========================================= */

export const payCommissionSchema = z.object({
  commissionId: z.string().cuid(),
});

/* =========================================
   COMMISSION FILTER
========================================= */

export const commissionFilterSchema = z.object({
  search: z.string().optional(),

  userId: z.string().cuid().optional(),

  partnerId: z.string().cuid().optional(),

  status: commissionStatusEnum.optional(),

  source: z.string().optional(),

  startDate: z.string().optional(),

  endDate: z.string().optional(),

  page: z.coerce.number().min(1).default(1),

  limit: z.coerce.number().min(1).max(100).default(10),
});

/* =========================================
   COMMISSION REPORT
========================================= */

export const commissionReportSchema = z.object({
  startDate: z.string(),

  endDate: z.string(),

  status: commissionStatusEnum.optional(),
});

/* =========================================
   TYPES
========================================= */

export type CreateCommissionDto = z.infer<typeof createCommissionSchema>;

export type UpdateCommissionDto = z.infer<typeof updateCommissionSchema>;

export type ApproveCommissionDto = z.infer<typeof approveCommissionSchema>;

export type RejectCommissionDto = z.infer<typeof rejectCommissionSchema>;

export type PayCommissionDto = z.infer<typeof payCommissionSchema>;

export type CommissionFilterDto = z.infer<typeof commissionFilterSchema>;

export type CommissionReportDto = z.infer<typeof commissionReportSchema>;