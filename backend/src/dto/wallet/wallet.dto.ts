import { z } from "zod";

/* =========================================
   WALLET TYPE
========================================= */

export const walletTypeEnum = z.enum([
  "CUSTOMER",
  "DSA",
  "PARTNER",
  "COMMISSION",
  "REFERRAL",
  "SYSTEM",
]);

/* =========================================
   WALLET STATUS
========================================= */

export const walletStatusEnum = z.enum([
  "ACTIVE",
  "INACTIVE",
  "BLOCKED",
  "SUSPENDED",
]);

/* =========================================
   TRANSACTION TYPE
========================================= */

export const walletTransactionTypeEnum =
  z.enum([
    "CREDIT",
    "DEBIT",
    "WITHDRAWAL",
    "COMMISSION",
    "REFERRAL_BONUS",
    "CASHBACK",
    "ADJUSTMENT",
    "REFUND",
    "SETTLEMENT",
  ]);

/* =========================================
   WITHDRAWAL STATUS
========================================= */

export const withdrawalStatusEnum =
  z.enum([
    "PENDING",
    "APPROVED",
    "PROCESSING",
    "COMPLETED",
    "REJECTED",
    "FAILED",
  ]);

/* =========================================
   CREATE WALLET
========================================= */

export const createWalletSchema =
  z.object({
    userId:
      z.string().cuid(),

    walletType:
      walletTypeEnum,

    openingBalance:
      z.number()
      .min(0)
      .default(0),
  });

/* =========================================
   CREDIT WALLET
========================================= */

export const creditWalletSchema =
  z.object({
    walletId:
      z.string().cuid(),

    amount:
      z.number().positive(),

    transactionType:
      walletTransactionTypeEnum,

    remarks:
      z.string()
      .max(1000)
      .optional(),

    referenceId:
      z.string()
      .optional(),
  });

/* =========================================
   DEBIT WALLET
========================================= */

export const debitWalletSchema =
  z.object({
    walletId:
      z.string().cuid(),

    amount:
      z.number().positive(),

    transactionType:
      walletTransactionTypeEnum,

    remarks:
      z.string()
      .max(1000)
      .optional(),

    referenceId:
      z.string()
      .optional(),
  });

/* =========================================
   WALLET TRANSFER
========================================= */

export const walletTransferSchema =
  z.object({
    fromWalletId:
      z.string().cuid(),

    toWalletId:
      z.string().cuid(),

    amount:
      z.number().positive(),

    remarks:
      z.string()
      .optional(),
  });

/* =========================================
   WITHDRAWAL REQUEST
========================================= */

export const withdrawalRequestSchema =
  z.object({
    walletId:
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
   APPROVE WITHDRAWAL
========================================= */

export const approveWithdrawalSchema =
  z.object({
    withdrawalId:
      z.string().cuid(),

    remarks:
      z.string()
      .optional(),
  });

/* =========================================
   REJECT WITHDRAWAL
========================================= */

export const rejectWithdrawalSchema =
  z.object({
    withdrawalId:
      z.string().cuid(),

    reason:
      z.string()
      .min(3)
      .max(1000),
  });

/* =========================================
   UPDATE WALLET STATUS
========================================= */

export const updateWalletStatusSchema =
  z.object({
    walletId:
      z.string().cuid(),

    status:
      walletStatusEnum,

    reason:
      z.string()
      .optional(),
  });

/* =========================================
   WALLET FILTER
========================================= */

export const walletFilterSchema =
  z.object({
    userId:
      z.string()
      .cuid()
      .optional(),

    walletType:
      walletTypeEnum
      .optional(),

    status:
      walletStatusEnum
      .optional(),

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
   WALLET ANALYTICS
========================================= */

export const walletAnalyticsSchema =
  z.object({
    startDate:
      z.string(),

    endDate:
      z.string(),

    walletType:
      walletTypeEnum
      .optional(),
  });

/* =========================================
   TYPES
========================================= */

export type CreateWalletDto =
  z.infer<typeof createWalletSchema>;

export type CreditWalletDto =
  z.infer<typeof creditWalletSchema>;

export type DebitWalletDto =
  z.infer<typeof debitWalletSchema>;

export type WalletTransferDto =
  z.infer<typeof walletTransferSchema>;

export type WithdrawalRequestDto =
  z.infer<
    typeof withdrawalRequestSchema
  >;

export type ApproveWithdrawalDto =
  z.infer<
    typeof approveWithdrawalSchema
  >;

export type RejectWithdrawalDto =
  z.infer<
    typeof rejectWithdrawalSchema
  >;

export type UpdateWalletStatusDto =
  z.infer<
    typeof updateWalletStatusSchema
  >;

export type WalletFilterDto =
  z.infer<
    typeof walletFilterSchema
  >;

export type WalletAnalyticsDto =
  z.infer<
    typeof walletAnalyticsSchema
  >;