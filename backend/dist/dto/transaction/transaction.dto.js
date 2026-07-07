"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionAnalyticsSchema = exports.transactionReconciliationSchema = exports.transactionFilterSchema = exports.settlementRequestSchema = exports.refundTransactionSchema = exports.updateTransactionStatusSchema = exports.createTransactionSchema = exports.transactionCategoryEnum = exports.paymentModeEnum = exports.transactionStatusEnum = exports.transactionTypeEnum = void 0;
const zod_1 = require("zod");
/* =========================================
   TRANSACTION TYPE
========================================= */
exports.transactionTypeEnum = zod_1.z.enum([
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
exports.transactionStatusEnum = zod_1.z.enum([
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
exports.paymentModeEnum = zod_1.z.enum([
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
exports.transactionCategoryEnum = zod_1.z.enum([
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
exports.createTransactionSchema = zod_1.z.object({
    userId: zod_1.z.string().cuid().optional(),
    transactionType: exports.transactionTypeEnum,
    category: exports.transactionCategoryEnum,
    amount: zod_1.z.number().positive(),
    paymentMode: exports.paymentModeEnum,
    referenceId: zod_1.z.string()
        .max(255)
        .optional(),
    gatewayTransactionId: zod_1.z.string()
        .max(255)
        .optional(),
    description: zod_1.z.string()
        .min(2)
        .max(1000),
    metadata: zod_1.z.record(zod_1.z.any())
        .optional(),
});
/* =========================================
   UPDATE STATUS
========================================= */
exports.updateTransactionStatusSchema = zod_1.z.object({
    transactionId: zod_1.z.string().cuid(),
    status: exports.transactionStatusEnum,
    remarks: zod_1.z.string()
        .max(1000)
        .optional(),
});
/* =========================================
   REFUND TRANSACTION
========================================= */
exports.refundTransactionSchema = zod_1.z.object({
    transactionId: zod_1.z.string().cuid(),
    refundAmount: zod_1.z.number().positive(),
    reason: zod_1.z.string()
        .min(5)
        .max(1000),
});
/* =========================================
   SETTLEMENT REQUEST
========================================= */
exports.settlementRequestSchema = zod_1.z.object({
    userId: zod_1.z.string().cuid(),
    amount: zod_1.z.number().positive(),
    bankAccountId: zod_1.z.string().cuid(),
    remarks: zod_1.z.string()
        .optional(),
});
/* =========================================
   TRANSACTION FILTER
========================================= */
exports.transactionFilterSchema = zod_1.z.object({
    userId: zod_1.z.string()
        .cuid()
        .optional(),
    transactionType: exports.transactionTypeEnum
        .optional(),
    category: exports.transactionCategoryEnum
        .optional(),
    status: exports.transactionStatusEnum
        .optional(),
    paymentMode: exports.paymentModeEnum
        .optional(),
    startDate: zod_1.z.string()
        .optional(),
    endDate: zod_1.z.string()
        .optional(),
    minAmount: zod_1.z.number()
        .optional(),
    maxAmount: zod_1.z.number()
        .optional(),
    page: zod_1.z.coerce.number()
        .default(1),
    limit: zod_1.z.coerce.number()
        .min(1)
        .max(100)
        .default(20),
});
/* =========================================
   RECONCILIATION
========================================= */
exports.transactionReconciliationSchema = zod_1.z.object({
    startDate: zod_1.z.string(),
    endDate: zod_1.z.string(),
    paymentMode: exports.paymentModeEnum
        .optional(),
});
/* =========================================
   ANALYTICS
========================================= */
exports.transactionAnalyticsSchema = zod_1.z.object({
    startDate: zod_1.z.string(),
    endDate: zod_1.z.string(),
    category: exports.transactionCategoryEnum
        .optional(),
});
