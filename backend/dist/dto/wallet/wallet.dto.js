"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.walletAnalyticsSchema = exports.walletFilterSchema = exports.updateWalletStatusSchema = exports.rejectWithdrawalSchema = exports.approveWithdrawalSchema = exports.withdrawalRequestSchema = exports.walletTransferSchema = exports.debitWalletSchema = exports.creditWalletSchema = exports.createWalletSchema = exports.withdrawalStatusEnum = exports.walletTransactionTypeEnum = exports.walletStatusEnum = exports.walletTypeEnum = void 0;
const zod_1 = require("zod");
/* =========================================
   WALLET TYPE
========================================= */
exports.walletTypeEnum = zod_1.z.enum([
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
exports.walletStatusEnum = zod_1.z.enum([
    "ACTIVE",
    "INACTIVE",
    "BLOCKED",
    "SUSPENDED",
]);
/* =========================================
   TRANSACTION TYPE
========================================= */
exports.walletTransactionTypeEnum = zod_1.z.enum([
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
exports.withdrawalStatusEnum = zod_1.z.enum([
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
exports.createWalletSchema = zod_1.z.object({
    userId: zod_1.z.string().cuid(),
    walletType: exports.walletTypeEnum,
    openingBalance: zod_1.z.number()
        .min(0)
        .default(0),
});
/* =========================================
   CREDIT WALLET
========================================= */
exports.creditWalletSchema = zod_1.z.object({
    walletId: zod_1.z.string().cuid(),
    amount: zod_1.z.number().positive(),
    transactionType: exports.walletTransactionTypeEnum,
    remarks: zod_1.z.string()
        .max(1000)
        .optional(),
    referenceId: zod_1.z.string()
        .optional(),
});
/* =========================================
   DEBIT WALLET
========================================= */
exports.debitWalletSchema = zod_1.z.object({
    walletId: zod_1.z.string().cuid(),
    amount: zod_1.z.number().positive(),
    transactionType: exports.walletTransactionTypeEnum,
    remarks: zod_1.z.string()
        .max(1000)
        .optional(),
    referenceId: zod_1.z.string()
        .optional(),
});
/* =========================================
   WALLET TRANSFER
========================================= */
exports.walletTransferSchema = zod_1.z.object({
    fromWalletId: zod_1.z.string().cuid(),
    toWalletId: zod_1.z.string().cuid(),
    amount: zod_1.z.number().positive(),
    remarks: zod_1.z.string()
        .optional(),
});
/* =========================================
   WITHDRAWAL REQUEST
========================================= */
exports.withdrawalRequestSchema = zod_1.z.object({
    walletId: zod_1.z.string().cuid(),
    amount: zod_1.z.number().positive(),
    bankAccountId: zod_1.z.string().cuid(),
    remarks: zod_1.z.string()
        .optional(),
});
/* =========================================
   APPROVE WITHDRAWAL
========================================= */
exports.approveWithdrawalSchema = zod_1.z.object({
    withdrawalId: zod_1.z.string().cuid(),
    remarks: zod_1.z.string()
        .optional(),
});
/* =========================================
   REJECT WITHDRAWAL
========================================= */
exports.rejectWithdrawalSchema = zod_1.z.object({
    withdrawalId: zod_1.z.string().cuid(),
    reason: zod_1.z.string()
        .min(3)
        .max(1000),
});
/* =========================================
   UPDATE WALLET STATUS
========================================= */
exports.updateWalletStatusSchema = zod_1.z.object({
    walletId: zod_1.z.string().cuid(),
    status: exports.walletStatusEnum,
    reason: zod_1.z.string()
        .optional(),
});
/* =========================================
   WALLET FILTER
========================================= */
exports.walletFilterSchema = zod_1.z.object({
    userId: zod_1.z.string()
        .cuid()
        .optional(),
    walletType: exports.walletTypeEnum
        .optional(),
    status: exports.walletStatusEnum
        .optional(),
    page: zod_1.z.coerce.number()
        .default(1),
    limit: zod_1.z.coerce.number()
        .min(1)
        .max(100)
        .default(20),
});
/* =========================================
   WALLET ANALYTICS
========================================= */
exports.walletAnalyticsSchema = zod_1.z.object({
    startDate: zod_1.z.string(),
    endDate: zod_1.z.string(),
    walletType: exports.walletTypeEnum
        .optional(),
});
