"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.profitAnalyticsSchema = exports.revenueAnalyticsSchema = exports.revenueReportSchema = exports.revenueFilterSchema = exports.revenueSettlementSchema = exports.updateRevenueStatusSchema = exports.createRevenueSchema = exports.revenueTypeEnum = exports.revenueStatusEnum = exports.revenueSourceEnum = void 0;
const zod_1 = require("zod");
/* =========================================
   REVENUE SOURCE
========================================= */
exports.revenueSourceEnum = zod_1.z.enum([
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
exports.revenueStatusEnum = zod_1.z.enum([
    "PENDING",
    "RECEIVED",
    "SETTLED",
    "CANCELLED",
    "REFUNDED",
]);
/* =========================================
   REVENUE TYPE
========================================= */
exports.revenueTypeEnum = zod_1.z.enum([
    "DIRECT",
    "INDIRECT",
    "RECURRING",
    "ONE_TIME",
]);
/* =========================================
   CREATE REVENUE
========================================= */
exports.createRevenueSchema = zod_1.z.object({
    source: exports.revenueSourceEnum,
    revenueType: exports.revenueTypeEnum,
    amount: zod_1.z.number()
        .positive(),
    userId: zod_1.z.string()
        .cuid()
        .optional(),
    loanId: zod_1.z.string()
        .cuid()
        .optional(),
    partnerId: zod_1.z.string()
        .cuid()
        .optional(),
    paymentId: zod_1.z.string()
        .cuid()
        .optional(),
    transactionReference: zod_1.z.string()
        .optional(),
    description: zod_1.z.string()
        .max(1000)
        .optional(),
    revenueDate: zod_1.z.string(),
});
/* =========================================
   UPDATE REVENUE STATUS
========================================= */
exports.updateRevenueStatusSchema = zod_1.z.object({
    revenueId: zod_1.z.string().cuid(),
    status: exports.revenueStatusEnum,
    remarks: zod_1.z.string()
        .optional(),
});
/* =========================================
   REVENUE SETTLEMENT
========================================= */
exports.revenueSettlementSchema = zod_1.z.object({
    revenueId: zod_1.z.string().cuid(),
    settlementDate: zod_1.z.string(),
    settlementReference: zod_1.z.string(),
    remarks: zod_1.z.string()
        .optional(),
});
/* =========================================
   REVENUE FILTER
========================================= */
exports.revenueFilterSchema = zod_1.z.object({
    source: exports.revenueSourceEnum.optional(),
    revenueType: exports.revenueTypeEnum.optional(),
    status: exports.revenueStatusEnum.optional(),
    startDate: zod_1.z.string().optional(),
    endDate: zod_1.z.string().optional(),
    minAmount: zod_1.z.number().optional(),
    maxAmount: zod_1.z.number().optional(),
    page: zod_1.z.coerce.number()
        .default(1),
    limit: zod_1.z.coerce.number()
        .min(1)
        .max(100)
        .default(20),
});
/* =========================================
   REVENUE REPORT
========================================= */
exports.revenueReportSchema = zod_1.z.object({
    startDate: zod_1.z.string(),
    endDate: zod_1.z.string(),
    source: exports.revenueSourceEnum.optional(),
    exportFormat: zod_1.z.enum([
        "PDF",
        "EXCEL",
        "CSV",
    ]).optional(),
});
/* =========================================
   REVENUE ANALYTICS
========================================= */
exports.revenueAnalyticsSchema = zod_1.z.object({
    startDate: zod_1.z.string().optional(),
    endDate: zod_1.z.string().optional(),
    source: exports.revenueSourceEnum.optional(),
    revenueType: exports.revenueTypeEnum.optional(),
});
/* =========================================
   PROFIT ANALYTICS
========================================= */
exports.profitAnalyticsSchema = zod_1.z.object({
    startDate: zod_1.z.string(),
    endDate: zod_1.z.string(),
});
