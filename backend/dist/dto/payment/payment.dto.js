"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentAnalyticsSchema = exports.paymentFilterSchema = exports.verifyPaymentSchema = exports.refundPaymentSchema = exports.paymentFailureSchema = exports.paymentSuccessSchema = exports.createPaymentSchema = exports.paymentGatewayEnum = exports.paymentStatusEnum = exports.paymentMethodEnum = exports.paymentTypeEnum = void 0;
const zod_1 = require("zod");
/* =========================================
   PAYMENT TYPE
========================================= */
exports.paymentTypeEnum = zod_1.z.enum([
    "LOAN_PROCESSING_FEE",
    "EMI_PAYMENT",
    "INSURANCE_PREMIUM",
    "FASTAG_RECHARGE",
    "INVESTMENT",
    "COMMISSION_PAYOUT",
    "REFERRAL_PAYOUT",
    "SERVICE_CHARGE",
    "MEMBERSHIP",
    "OTHER",
]);
/* =========================================
   PAYMENT METHOD
========================================= */
exports.paymentMethodEnum = zod_1.z.enum([
    "UPI",
    "BANK_TRANSFER",
    "NET_BANKING",
    "DEBIT_CARD",
    "CREDIT_CARD",
    "WALLET",
    "CASH",
    "CHEQUE",
]);
/* =========================================
   PAYMENT STATUS
========================================= */
exports.paymentStatusEnum = zod_1.z.enum([
    "PENDING",
    "PROCESSING",
    "SUCCESS",
    "FAILED",
    "CANCELLED",
    "REFUNDED",
    "PARTIAL_REFUND",
]);
/* =========================================
   PAYMENT GATEWAY
========================================= */
exports.paymentGatewayEnum = zod_1.z.enum([
    "RAZORPAY",
    "PHONEPE",
    "PAYTM",
    "CASHFREE",
    "STRIPE",
    "MANUAL",
]);
/* =========================================
   CREATE PAYMENT
========================================= */
exports.createPaymentSchema = zod_1.z.object({
    userId: zod_1.z.string().cuid(),
    paymentType: exports.paymentTypeEnum,
    amount: zod_1.z.number().positive(),
    paymentMethod: exports.paymentMethodEnum,
    paymentGateway: exports.paymentGatewayEnum,
    loanId: zod_1.z.string().cuid().optional(),
    partnerId: zod_1.z.string().cuid().optional(),
    referenceId: zod_1.z.string().optional(),
    remarks: zod_1.z.string().max(500).optional(),
});
/* =========================================
   PAYMENT SUCCESS
========================================= */
exports.paymentSuccessSchema = zod_1.z.object({
    paymentId: zod_1.z.string().cuid(),
    transactionId: zod_1.z.string(),
    gatewayPaymentId: zod_1.z.string().optional(),
    gatewayResponse: zod_1.z
        .record(zod_1.z.string(), zod_1.z.unknown())
        .optional(),
});
/* =========================================
   PAYMENT FAILURE
========================================= */
exports.paymentFailureSchema = zod_1.z.object({
    paymentId: zod_1.z.string().cuid(),
    failureReason: zod_1.z
        .string()
        .min(3)
        .max(500),
});
/* =========================================
   REFUND PAYMENT
========================================= */
exports.refundPaymentSchema = zod_1.z.object({
    paymentId: zod_1.z.string().cuid(),
    refundAmount: zod_1.z
        .number()
        .positive(),
    refundReason: zod_1.z
        .string()
        .min(3)
        .max(500),
});
/* =========================================
   VERIFY PAYMENT
========================================= */
exports.verifyPaymentSchema = zod_1.z.object({
    paymentId: zod_1.z.string().cuid(),
    transactionId: zod_1.z.string(),
});
/* =========================================
   PAYMENT FILTER
========================================= */
exports.paymentFilterSchema = zod_1.z.object({
    userId: zod_1.z.string().cuid().optional(),
    paymentType: exports.paymentTypeEnum.optional(),
    status: exports.paymentStatusEnum.optional(),
    paymentMethod: exports.paymentMethodEnum.optional(),
    paymentGateway: exports.paymentGatewayEnum.optional(),
    startDate: zod_1.z.string().optional(),
    endDate: zod_1.z.string().optional(),
    minAmount: zod_1.z.number().optional(),
    maxAmount: zod_1.z.number().optional(),
    page: zod_1.z.coerce.number().default(1),
    limit: zod_1.z.coerce.number().min(1).max(100).default(20),
});
/* =========================================
   PAYMENT ANALYTICS
========================================= */
exports.paymentAnalyticsSchema = zod_1.z.object({
    startDate: zod_1.z.string().optional(),
    endDate: zod_1.z.string().optional(),
    paymentType: exports.paymentTypeEnum.optional(),
    paymentGateway: exports.paymentGatewayEnum.optional(),
});
