"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.investmentAnalyticsSchema = exports.investmentFilterSchema = exports.createDematSchema = exports.createFdSchema = exports.createSipSchema = exports.updateInvestmentStatusSchema = exports.updateInvestmentSchema = exports.createInvestmentSchema = exports.riskProfileEnum = exports.investmentStatusEnum = exports.investmentTypeEnum = void 0;
const zod_1 = require("zod");
/* =========================================
   INVESTMENT TYPE
========================================= */
exports.investmentTypeEnum = zod_1.z.enum([
    "MUTUAL_FUND",
    "SIP",
    "FIXED_DEPOSIT",
    "RECURRING_DEPOSIT",
    "BONDS",
    "NPS",
    "GOLD",
    "DEMAT",
    "STOCKS",
    "ETF",
]);
/* =========================================
   INVESTMENT STATUS
========================================= */
exports.investmentStatusEnum = zod_1.z.enum([
    "PENDING",
    "ACTIVE",
    "MATURED",
    "CLOSED",
    "CANCELLED",
]);
/* =========================================
   RISK PROFILE
========================================= */
exports.riskProfileEnum = zod_1.z.enum([
    "LOW",
    "MODERATE",
    "HIGH",
]);
/* =========================================
   CREATE INVESTMENT
========================================= */
exports.createInvestmentSchema = zod_1.z.object({
    userId: zod_1.z.string().cuid(),
    investmentType: exports.investmentTypeEnum,
    investmentName: zod_1.z.string()
        .min(2)
        .max(200),
    amount: zod_1.z.number()
        .positive(),
    expectedReturn: zod_1.z.number()
        .min(0)
        .max(100)
        .optional(),
    tenureMonths: zod_1.z.number()
        .positive(),
    riskProfile: exports.riskProfileEnum,
    providerName: zod_1.z.string()
        .min(2)
        .max(150),
});
/* =========================================
   UPDATE INVESTMENT
========================================= */
exports.updateInvestmentSchema = exports.createInvestmentSchema.partial();
/* =========================================
   INVESTMENT STATUS
========================================= */
exports.updateInvestmentStatusSchema = zod_1.z.object({
    investmentId: zod_1.z.string().cuid(),
    status: exports.investmentStatusEnum,
    remarks: zod_1.z.string().optional(),
});
/* =========================================
   SIP CREATION
========================================= */
exports.createSipSchema = zod_1.z.object({
    userId: zod_1.z.string().cuid(),
    fundName: zod_1.z.string()
        .min(2)
        .max(200),
    monthlyAmount: zod_1.z.number()
        .positive(),
    sipDate: zod_1.z.number()
        .min(1)
        .max(31),
    tenureMonths: zod_1.z.number()
        .positive(),
});
/* =========================================
   FD CREATION
========================================= */
exports.createFdSchema = zod_1.z.object({
    userId: zod_1.z.string().cuid(),
    bankName: zod_1.z.string()
        .min(2)
        .max(150),
    depositAmount: zod_1.z.number()
        .positive(),
    interestRate: zod_1.z.number()
        .positive(),
    tenureMonths: zod_1.z.number()
        .positive(),
});
/* =========================================
   DEMAT ACCOUNT REQUEST
========================================= */
exports.createDematSchema = zod_1.z.object({
    userId: zod_1.z.string().cuid(),
    brokerName: zod_1.z.string()
        .min(2)
        .max(150),
    panNo: zod_1.z.string()
        .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/),
    mobileNumber: zod_1.z.string()
        .regex(/^[6-9]\d{9}$/),
});
/* =========================================
   INVESTMENT FILTER
========================================= */
exports.investmentFilterSchema = zod_1.z.object({
    search: zod_1.z.string().optional(),
    investmentType: exports.investmentTypeEnum.optional(),
    status: exports.investmentStatusEnum.optional(),
    riskProfile: exports.riskProfileEnum.optional(),
    userId: zod_1.z.string().cuid().optional(),
    page: zod_1.z.coerce.number()
        .default(1),
    limit: zod_1.z.coerce.number()
        .min(1)
        .max(100)
        .default(10),
});
/* =========================================
   INVESTMENT ANALYTICS
========================================= */
exports.investmentAnalyticsSchema = zod_1.z.object({
    startDate: zod_1.z.string().optional(),
    endDate: zod_1.z.string().optional(),
    investmentType: exports.investmentTypeEnum.optional(),
});
