import { z } from "zod";

/* =========================================
   REVENUE SOURCE
========================================= */

export const revenueSourceEnum = z.enum([
  "LOAN_PROCESSING_FEE",
  "LOAN_INTEREST",
  "INSURANCE_COMMISSION",
  "CREDIT_CARD_COMMISSION",
  "FASTAG_COMMISSION",
  "INVESTMENT_COMMISSION",
  "RECHARGE_COMMISSION",
  "REFERRAL_INCOME",
  "PARTNER_COMMISSION",
  "SERVICE_CHARGE",
  "OTHER",
]);

/* =========================================
   REVENUE STATUS
========================================= */

export const revenueStatusEnum = z.enum([
  "PENDING",
  "RECEIVED",
  "SETTLED",
  "CANCELLED",
  "REFUNDED",
]);

/* =========================================
   REVENUE TYPE
========================================= */

export const revenueTypeEnum = z.enum([
  "DIRECT",
  "INDIRECT",
  "RECURRING",
  "ONE_TIME",
]);

/* =========================================
   CREATE REVENUE
========================================= */

export const createRevenueSchema = z.object({
  source: revenueSourceEnum,
  revenueType: revenueTypeEnum,

  amount: z.number().positive(),

  userId: z.string().cuid().optional(),
  loanId: z.string().cuid().optional(),
  partnerId: z.string().cuid().optional(),
  paymentId: z.string().cuid().optional(),

  transactionReference: z.string().optional(),

  description: z.string().max(1000).optional(),

  revenueDate: z.string(),
});

/* =========================================
   UPDATE REVENUE STATUS
========================================= */

export const updateRevenueStatusSchema = z.object({
  revenueId: z.string().cuid(),

  status: revenueStatusEnum,

  remarks: z.string().optional(),
});

/* =========================================
   REVENUE SETTLEMENT
========================================= */

export const revenueSettlementSchema = z.object({
  revenueId: z.string().cuid(),

  settlementDate: z.string(),

  settlementReference: z.string(),

  remarks: z.string().optional(),
});

/* =========================================
   REVENUE FILTER
========================================= */

export const revenueFilterSchema = z.object({
  source: revenueSourceEnum.optional(),

  revenueType: revenueTypeEnum.optional(),

  status: revenueStatusEnum.optional(),

  startDate: z.string().optional(),

  endDate: z.string().optional(),

  minAmount: z.number().optional(),

  maxAmount: z.number().optional(),

  page: z.coerce.number().default(1),

  limit: z.coerce.number().min(1).max(100).default(20),
});

/* =========================================
   REVENUE REPORT
========================================= */

export const revenueReportSchema = z.object({
  startDate: z.string(),

  endDate: z.string(),

  source: revenueSourceEnum.optional(),

  exportFormat: z
    .enum(["PDF", "EXCEL", "CSV"])
    .optional(),
});

/* =========================================
   TYPES
========================================= */

export type CreateRevenueDto =
  z.infer<typeof createRevenueSchema>;

export type UpdateRevenueStatusDto =
  z.infer<typeof updateRevenueStatusSchema>;

export type RevenueSettlementDto =
  z.infer<typeof revenueSettlementSchema>;

export type RevenueFilterDto =
  z.infer<typeof revenueFilterSchema>;

export type RevenueReportDto =
  z.infer<typeof revenueReportSchema>;