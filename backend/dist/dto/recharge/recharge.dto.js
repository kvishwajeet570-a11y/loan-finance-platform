"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rechargeAnalyticsSchema = exports.rechargeCommissionSchema = exports.rechargeFilterSchema = exports.refundRechargeSchema = exports.failedRechargeSchema = exports.processRechargeSchema = exports.createRechargeSchema = exports.rechargePaymentModeEnum = exports.rechargeStatusEnum = exports.operatorEnum = exports.rechargeTypeEnum = void 0;
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
   OPERATOR TYPE
========================================= */
exports.operatorEnum = zod_1.z.enum([
    "AIRTEL",
    "JIO",
    "VI",
    "BSNL",
    "TATA_PLAY",
    "DISH_TV",
    "SUN_DIRECT",
    "AIRTEL_DTH",
    "OTHER",
]);
/* =========================================
   RECHARGE STATUS
========================================= */
exports.rechargeStatusEnum = zod_1.z.enum([
    "PENDING",
    "PROCESSING",
    "SUCCESS",
    "FAILED",
    "REFUNDED",
    "CANCELLED",
]);
/* =========================================
   PAYMENT MODE
========================================= */
exports.rechargePaymentModeEnum = zod_1.z.enum([
    "WALLET",
    "UPI",
    "NET_BANKING",
    "CREDIT_CARD",
    "DEBIT_CARD",
    "BANK_TRANSFER",
]);
/* =========================================
   CREATE RECHARGE
========================================= */
exports.createRechargeSchema = zod_1.z.object({
    userId: zod_1.z.string().cuid(),
    rechargeType: exports.rechargeTypeEnum,
    operator: exports.operatorEnum,
    mobileNumber: zod_1.z.string()
        .regex(/^[6-9]\d{9}$/)
        .optional(),
    consumerNumber: zod_1.z.string()
        .optional(),
    vehicleNumber: zod_1.z.string()
        .optional(),
    amount: zod_1.z.number()
        .positive(),
    paymentMode: exports.rechargePaymentModeEnum,
    remarks: zod_1.z.string()
        .max(500)
        .optional(),
});
/* =========================================
   PROCESS RECHARGE
========================================= */
exports.processRechargeSchema = zod_1.z.object({
    rechargeId: zod_1.z.string().cuid(),
    providerReference: zod_1.z.string(),
    transactionId: zod_1.z.string(),
});
/* =========================================
   FAILED RECHARGE
========================================= */
exports.failedRechargeSchema = zod_1.z.object({
    rechargeId: zod_1.z.string().cuid(),
    reason: zod_1.z.string()
        .min(3)
        .max(500),
});
/* =========================================
   REFUND RECHARGE
========================================= */
exports.refundRechargeSchema = zod_1.z.object({
    rechargeId: zod_1.z.string().cuid(),
    refundAmount: zod_1.z.number()
        .positive(),
    refundReason: zod_1.z.string()
        .min(3)
        .max(500),
});
/* =========================================
   RECHARGE FILTER
========================================= */
exports.rechargeFilterSchema = zod_1.z.object({
    userId: zod_1.z.string()
        .cuid()
        .optional(),
    rechargeType: exports.rechargeTypeEnum.optional(),
    operator: exports.operatorEnum.optional(),
    status: exports.rechargeStatusEnum.optional(),
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
   RECHARGE COMMISSION
========================================= */
exports.rechargeCommissionSchema = zod_1.z.object({
    rechargeId: zod_1.z.string().cuid(),
    commissionAmount: zod_1.z.number()
        .positive(),
    commissionPercentage: zod_1.z.number()
        .min(0)
        .max(100),
});
/* =========================================
   RECHARGE ANALYTICS
========================================= */
exports.rechargeAnalyticsSchema = zod_1.z.object({
    rechargeType: exports.rechargeTypeEnum.optional(),
    operator: exports.operatorEnum.optional(),
    startDate: zod_1.z.string().optional(),
    endDate: zod_1.z.string().optional(),
});
