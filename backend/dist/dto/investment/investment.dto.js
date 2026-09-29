"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.investmentReturnCalculatorSchema = exports.investmentAnalyticsSchema = exports.investmentFilterSchema = exports.updateInvestmentSchema = exports.createInvestmentSchema = exports.investmentStatusEnum = exports.riskLevelEnum = exports.investmentTypeEnum = void 0;
const zod_1 = require("zod");
/* =====================================================
   INVESTMENT TYPE ENUM
===================================================== */
exports.investmentTypeEnum = zod_1.z.enum([
    "MUTUAL_FUND",
    "SIP",
    "FIXED_DEPOSIT",
    "RECURRING_DEPOSIT",
    "BONDS",
    "NPS",
    "ETF",
    "STOCKS",
    "GOLD",
    "CRYPTO",
    "OTHER",
]);
/* =====================================================
   RISK LEVEL ENUM
===================================================== */
exports.riskLevelEnum = zod_1.z.enum([
    "LOW",
    "MODERATE",
    "HIGH",
]);
/* =====================================================
   STATUS ENUM
===================================================== */
exports.investmentStatusEnum = zod_1.z.enum([
    "ACTIVE",
    "INACTIVE",
    "CLOSED",
]);
/* =====================================================
   CREATE DTO
===================================================== */
exports.createInvestmentSchema = zod_1.z.object({
    title: zod_1.z
        .string()
        .min(2)
        .max(200),
    description: zod_1.z
        .string()
        .max(2000)
        .optional(),
    type: exports.investmentTypeEnum,
    category: zod_1.z
        .string()
        .max(100)
        .optional(),
    providerName: zod_1.z
        .string()
        .max(150)
        .optional(),
    riskLevel: exports.riskLevelEnum
        .default("LOW"),
    minAmount: zod_1.z
        .number()
        .positive(),
    minimumAmount: zod_1.z
        .number()
        .min(0)
        .default(0),
    maxAmount: zod_1.z
        .number()
        .optional(),
    interestRate: zod_1.z
        .number()
        .min(0),
    expectedReturn: zod_1.z
        .number()
        .min(0)
        .optional(),
    tenureMonths: zod_1.z
        .number()
        .min(1)
        .optional(),
    lockInPeriod: zod_1.z
        .number()
        .min(0)
        .optional(),
    featured: zod_1.z
        .boolean()
        .default(false),
    status: exports.investmentStatusEnum
        .default("ACTIVE"),
});
/* =====================================================
   UPDATE DTO
===================================================== */
exports.updateInvestmentSchema = exports.createInvestmentSchema.partial();
/* =====================================================
   FILTER DTO
===================================================== */
exports.investmentFilterSchema = zod_1.z.object({
    search: zod_1.z.string().optional(),
    type: exports.investmentTypeEnum.optional(),
    category: zod_1.z.string().optional(),
    riskLevel: exports.riskLevelEnum.optional(),
    status: exports.investmentStatusEnum.optional(),
    featured: zod_1.z.coerce
        .boolean()
        .optional(),
    page: zod_1.z.coerce
        .number()
        .min(1)
        .default(1),
    limit: zod_1.z.coerce
        .number()
        .min(1)
        .max(100)
        .default(10),
    sortBy: zod_1.z
        .enum([
        "title",
        "type",
        "minAmount",
        "interestRate",
        "expectedReturn",
        "createdAt",
    ])
        .default("createdAt"),
    sortOrder: zod_1.z
        .enum([
        "asc",
        "desc",
    ])
        .default("desc"),
});
/* =====================================================
   ANALYTICS DTO
===================================================== */
exports.investmentAnalyticsSchema = zod_1.z.object({
    startDate: zod_1.z.string().optional(),
    endDate: zod_1.z.string().optional(),
    type: exports.investmentTypeEnum.optional(),
    status: exports.investmentStatusEnum.optional(),
});
/* =====================================================
   ROI CALCULATOR DTO
===================================================== */
exports.investmentReturnCalculatorSchema = zod_1.z.object({
    principal: zod_1.z
        .number()
        .positive(),
    annualRate: zod_1.z
        .number()
        .positive(),
    years: zod_1.z
        .number()
        .positive(),
    compoundFrequency: zod_1.z.coerce
        .number()
        .min(1)
        .default(1),
});
/* =====================================================
   EXPORTS
===================================================== */
exports.default = {
    createInvestmentSchema: exports.createInvestmentSchema,
    updateInvestmentSchema: exports.updateInvestmentSchema,
    investmentFilterSchema: exports.investmentFilterSchema,
    investmentAnalyticsSchema: exports.investmentAnalyticsSchema,
    investmentReturnCalculatorSchema: exports.investmentReturnCalculatorSchema,
};
