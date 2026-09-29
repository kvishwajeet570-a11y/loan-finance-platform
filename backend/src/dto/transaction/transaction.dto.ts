import { z } from "zod";

/* =========================================
   TRANSACTION TYPE
========================================= */

export const transactionTypeEnum = z.enum([
  "CREDIT",
  "DEBIT",
  "REFUND",
  "COMMISSION",
  "LOAN_DISBURSEMENT",
  "LOAN_REPAYMENT",
  "WALLET_TOPUP",
  "WITHDRAWAL",
  "RECHARGE",
  "FASTAG",
  "INSURANCE",
  "INVESTMENT",
  "REFERRAL_BONUS",
  "SETTLEMENT",
  "ADJUSTMENT",
]);

/* =========================================
   TRANSACTION STATUS
========================================= */

export const transactionStatusEnum = z.enum([
  "PENDING",
  "PROCESSING",
  "SUCCESS",
  "FAILED",
  "CANCELLED",
  "REFUNDED",
  "REVERSED",
]);

/* =========================================
   PAYMENT MODE
========================================= */

export const paymentModeEnum = z.enum([
  "UPI",
  "BANK_TRANSFER",
  "NEFT",
  "RTGS",
  "IMPS",
  "CARD",
  "NET_BANKING",
  "WALLET",
  "CASH",
]);

/* =========================================
   TRANSACTION CATEGORY
========================================= */

export const transactionCategoryEnum =
  z.enum([
    "LOAN",
    "COMMISSION",
    "REFERRAL",
    "PAYMENT",
    "RECHARGE",
    "FASTAG",
    "INSURANCE",
    "INVESTMENT",
    "WALLET",
    "SETTLEMENT",
    "SYSTEM",
  ]);

/* =========================================
   CREATE TRANSACTION
========================================= */

export const createTransactionSchema =
  z.object({
    userId:
      z.string().cuid().optional(),

    transactionType:
      transactionTypeEnum,

    category:
      transactionCategoryEnum,

    amount:
      z.number().positive(),

    paymentMode:
      paymentModeEnum,

    referenceId:
      z.string()
      .max(255)
      .optional(),

    gatewayTransactionId:
      z.string()
      .max(255)
      .optional(),

    description:
      z.string()
      .min(2)
      .max(1000),

    metadata: z.record(z.string(), z.any()).optional(),
  });

/* =========================================
   UPDATE STATUS
========================================= */

export const updateTransactionStatusSchema =
  z.object({
    transactionId:
      z.string().cuid(),

    status:
      transactionStatusEnum,

    remarks:
      z.string()
      .max(1000)
      .optional(),
  });

/* =========================================
   REFUND TRANSACTION
========================================= */

export const refundTransactionSchema =
  z.object({
    transactionId: z.string().cuid(),

    refundAmount: z.number().positive(),

    reason: z.string().min(5).max(1000),

    refundedBy:
      z.string()
      .optional(),
  });

/* =========================================
   SETTLEMENT REQUEST
========================================= */

export const settlementRequestSchema =
  z.object({
    userId:
      z.string().cuid(),

    amount:
      z.number().positive(),

    bankAccountId:
      z.string().cuid(),

    remarks:
      z.string()
      .optional(),
  });

/* =========================================
   TRANSACTION FILTER
========================================= */

export const transactionFilterSchema =
  z.object({
    userId: z.string().cuid().optional(),

    type:
      transactionTypeEnum.optional(),

    category:
      transactionCategoryEnum.optional(),

    status:
      transactionStatusEnum.optional(),

    paymentMethod:
      paymentModeEnum.optional(),

    startDate:
      z.string().optional(),

    endDate:
      z.string().optional(),

    minAmount:
      z.number().optional(),

    maxAmount:
      z.number().optional(),

    page:
      z.coerce.number().default(1),

    limit:
      z.coerce.number().min(1).max(100).default(20),
  });

/* =========================================
   RECONCILIATION
========================================= */

export const transactionReconciliationSchema =
  z.object({
    startDate:
      z.string(),

    endDate:
      z.string(),

    paymentMode:
      paymentModeEnum
      .optional(),
  });

/* =========================================
   ANALYTICS
========================================= */

export const transactionAnalyticsSchema =
  z.object({
    startDate:
      z.string(),

    endDate:
      z.string(),

    category:
      transactionCategoryEnum
      .optional(),
  });

/* =========================================
   TYPES
========================================= */

export type CreateTransactionDto =
  z.infer<
    typeof createTransactionSchema
  >;

export type UpdateTransactionStatusDto =
  z.infer<
    typeof updateTransactionStatusSchema
  >;

export type RefundTransactionDto =
  z.infer<
    typeof refundTransactionSchema
  >;

export type SettlementRequestDto =
  z.infer<
    typeof settlementRequestSchema
  >;

export type TransactionFilterDto =
  z.infer<
    typeof transactionFilterSchema
  >;

export type TransactionReconciliationDto =
  z.infer<
    typeof transactionReconciliationSchema
  >;

export type TransactionAnalyticsDto =
  z.infer<
    typeof transactionAnalyticsSchema
  >;

  /* =========================================
   EXTRA DTO TYPES
========================================= */

export type UpdateTransactionDto = Partial<CreateTransactionDto>;

export type SearchTransactionDto = TransactionFilterDto;

export interface ApproveTransactionDto {
  approvedBy: string;
}

export interface VerifyTransactionDto {
  verifiedBy: string;
}

export interface RejectTransactionDto {
  rejectedBy: string;
  rejectReason: string;
}

export interface BulkApproveTransactionDto {
  ids: string[];
  approvedBy: string;
}

export interface BulkRejectTransactionDto {
  ids: string[];
  rejectedBy: string;
  rejectReason: string;
}

export interface BulkRefundTransactionDto {
  ids: string[];
  refundedBy: string;
  refundAmount?: number;
  refundReason?: string;
}

export interface BulkDeleteTransactionDto {
  ids: string[];
}