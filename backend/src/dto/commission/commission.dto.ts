import { z } from "zod";

/* =========================================
   COMMISSION TYPE
========================================= */

export const commissionTypeEnum = z.enum([
  "LOAN",
  "INSURANCE",
  "CREDIT_CARD",
  "SAVINGS_ACCOUNT",
  "DEMAT_ACCOUNT",
  "REFERRAL",
]);

/* =========================================
   COMMISSION STATUS
========================================= */

export const commissionStatusEnum = z.enum([
  "PENDING",
  "APPROVED",
  "PAID",
  "REJECTED",
  "HOLD",
]);

/* =========================================
   CREATE COMMISSION
========================================= */

export const createCommissionSchema = z.object({
  userId: z.string().cuid(),

  loanApplicationId: z.string().cuid().optional(),

  commissionType: commissionTypeEnum,

  amount: z
    .number()
    .positive(),

  percentage: z
    .number()
    .min(0)
    .max(100),

  remarks: z
    .string()
    .max(500)
    .optional(),

  status: commissionStatusEnum
    .default("PENDING"),
});

/* =========================================
   UPDATE COMMISSION
========================================= */

export const updateCommissionSchema =
  createCommissionSchema.partial();

/* =========================================
   APPROVE COMMISSION
========================================= */

export const approveCommissionSchema =
  z.object({
    commissionId: z.string().cuid(),

    remarks: z.string().optional(),
  });

/* =========================================
   REJECT COMMISSION
========================================= */

export const rejectCommissionSchema =
  z.object({
    commissionId: z.string().cuid(),

    reason: z
      .string()
      .min(5)
      .max(500),
  });

/* =========================================
   PAY COMMISSION
========================================= */

export const payCommissionSchema =
  z.object({
    commissionId: z.string().cuid(),

    transactionId: z.string(),

    paidAmount: z.number().positive(),
  });

/* =========================================
   COMMISSION FILTER
========================================= */

export const commissionFilterSchema =
  z.object({
    search: z.string().optional(),

    userId: z.string().cuid().optional(),

    commissionType:
      commissionTypeEnum.optional(),

    status:
      commissionStatusEnum.optional(),

    startDate: z.string().optional(),

    endDate: z.string().optional(),

    page: z.coerce.number().default(1),

    limit: z.coerce.number()
      .min(1)
      .max(100)
      .default(10),
  });

/* =========================================
   COMMISSION REPORT
========================================= */

export const commissionReportSchema =
  z.object({
    startDate: z.string(),

    endDate: z.string(),

    status:
      commissionStatusEnum.optional(),
  });

/* =========================================
   TYPES
========================================= */

export type CreateCommissionDto =
  z.infer<typeof createCommissionSchema>;

export type UpdateCommissionDto =
  z.infer<typeof updateCommissionSchema>;

export type ApproveCommissionDto =
  z.infer<typeof approveCommissionSchema>;

export type RejectCommissionDto =
  z.infer<typeof rejectCommissionSchema>;

export type PayCommissionDto =
  z.infer<typeof payCommissionSchema>;

export type CommissionFilterDto =
  z.infer<typeof commissionFilterSchema>;

export type CommissionReportDto =
  z.infer<typeof commissionReportSchema>;