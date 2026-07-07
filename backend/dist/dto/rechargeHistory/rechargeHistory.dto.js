"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rechargeHistoryAnalyticsSchema = exports.rechargeReconciliationSchema = exports.rechargeCommissionHistorySchema = exports.rechargeHistoryFilterSchema = exports.rechargeRefundHistorySchema = exports.updateRechargeHistoryStatusSchema = exports.createRechargeHistorySchema = exports.rechargeSourceEnum = exports.rechargeHistoryStatusEnum = exports.rechargeTypeEnum = void 0;
const zod_1 = require("zod");
/* =========================================
   RECHARGE TYPE
========================================= */
exports.rechargeTypeEnum = zod_1.z.enum([
    "MOBILE_PREPAID",
    "MOBILE_POSTPAID",
    "DTH",
    "FASTAG",
    "ELECTRICITY",
    "GAS",
    "WATER",
    "BROADBAND",
    "LANDLINE",
    "CABLE_TV",
]);
/* =========================================
   TRANSACTION STATUS
========================================= */
exports.rechargeHistoryStatusEnum = zod_1.z.enum([
    "SUCCESS",
    "FAILED",
    "PENDING",
    "REFUNDED",
    "CANCELLED",
]);
/* =========================================
   TRANSACTION SOURCE
========================================= */
exports.rechargeSourceEnum = zod_1.z.enum([
    "WEB",
    "ANDROID",
    "IOS",
    "ADMIN_PANEL",
    "PARTNER_PANEL",
    "DSA_PANEL",
    "API",
]);
/* =========================================
   CREATE HISTORY
========================================= */
exports.createRechargeHistorySchema = zod_1.z.object({
    rechargeId: zod_1.z.string().cuid(),
    userId: zod_1.z.string().cuid(),
    transactionId: zod_1.z.string(),
    providerReference: zod_1.z.string()
        .optional(),
    rechargeType: exports.rechargeTypeEnum,
    amount: zod_1.z.number()
        .positive(),
    commissionAmount: zod_1.z.number()
        .min(0)
        .default(0),
    status: exports.rechargeHistoryStatusEnum,
    source: exports.rechargeSourceEnum,
    remarks: zod_1.z.string()
        .max(500)
        .optional(),
});
/* =========================================
   UPDATE HISTORY STATUS
========================================= */
exports.updateRechargeHistoryStatusSchema = zod_1.z.object({
    historyId: zod_1.z.string().cuid(),
    status: exports.rechargeHistoryStatusEnum,
    remarks: zod_1.z.string()
        .optional(),
});
/* =========================================
   REFUND HISTORY
========================================= */
exports.rechargeRefundHistorySchema = zod_1.z.object({
    rechargeId: zod_1.z.string().cuid(),
    refundAmount: zod_1.z.number()
        .positive(),
    refundReason: zod_1.z.string()
        .min(3)
        .max(500),
    refundReference: zod_1.z.string()
        .optional(),
});
/* =========================================
   HISTORY FILTER
========================================= */
exports.rechargeHistoryFilterSchema = zod_1.z.object({
    userId: zod_1.z.string()
        .cuid()
        .optional(),
    rechargeId: zod_1.z.string()
        .cuid()
        .optional(),
    transactionId: zod_1.z.string()
        .optional(),
    rechargeType: exports.rechargeTypeEnum.optional(),
    status: exports.rechargeHistoryStatusEnum.optional(),
    source: exports.rechargeSourceEnum.optional(),
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
   COMMISSION HISTORY
========================================= */
exports.rechargeCommissionHistorySchema = zod_1.z.object({
    rechargeId: zod_1.z.string().cuid(),
    userId: zod_1.z.string().cuid(),
    commissionAmount: zod_1.z.number()
        .positive(),
    commissionPercentage: zod_1.z.number()
        .min(0)
        .max(100),
});
/* =========================================
   RECONCILIATION REPORT
========================================= */
exports.rechargeReconciliationSchema = zod_1.z.object({
    startDate: zod_1.z.string(),
    endDate: zod_1.z.string(),
    operator: zod_1.z.string()
        .optional(),
});
/* =========================================
   ANALYTICS
========================================= */
exports.rechargeHistoryAnalyticsSchema = zod_1.z.object({
    startDate: zod_1.z.string().optional(),
    endDate: zod_1.z.string().optional(),
    rechargeType: exports.rechargeTypeEnum.optional(),
});
