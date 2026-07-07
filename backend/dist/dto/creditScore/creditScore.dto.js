"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.creditAnalyticsSchema = exports.creditScoreFilterSchema = exports.checkCreditScoreSchema = exports.updateCreditScoreSchema = exports.createCreditScoreSchema = exports.creditStatusEnum = exports.riskCategoryEnum = exports.creditBureauEnum = void 0;
const zod_1 = require("zod");
/* =========================================
   CREDIT BUREAU
========================================= */
exports.creditBureauEnum = zod_1.z.enum([
    "CIBIL",
    "EXPERIAN",
    "CRIF",
    "EQUIFAX",
]);
/* =========================================
   RISK CATEGORY
========================================= */
exports.riskCategoryEnum = zod_1.z.enum([
    "LOW",
    "MEDIUM",
    "HIGH",
]);
/* =========================================
   CREDIT STATUS
========================================= */
exports.creditStatusEnum = zod_1.z.enum([
    "ACTIVE",
    "REVIEW",
    "REJECTED",
]);
/* =========================================
   CREATE CREDIT SCORE
========================================= */
exports.createCreditScoreSchema = zod_1.z.object({
    userId: zod_1.z.string().cuid(),
    score: zod_1.z
        .number()
        .min(300)
        .max(900),
    bureau: exports.creditBureauEnum,
    riskCategory: exports.riskCategoryEnum,
    eligibleAmount: zod_1.z
        .number()
        .nonnegative(),
    remarks: zod_1.z
        .string()
        .max(1000)
        .optional(),
    status: exports.creditStatusEnum
        .default("ACTIVE"),
});
/* =========================================
   UPDATE CREDIT SCORE
========================================= */
exports.updateCreditScoreSchema = exports.createCreditScoreSchema.partial();
/* =========================================
   CHECK CREDIT SCORE
========================================= */
exports.checkCreditScoreSchema = zod_1.z.object({
    userId: zod_1.z.string().cuid(),
    bureau: exports.creditBureauEnum,
});
/* =========================================
   CREDIT FILTER
========================================= */
exports.creditScoreFilterSchema = zod_1.z.object({
    search: zod_1.z.string().optional(),
    bureau: exports.creditBureauEnum.optional(),
    riskCategory: exports.riskCategoryEnum.optional(),
    status: exports.creditStatusEnum.optional(),
    minScore: zod_1.z.number().optional(),
    maxScore: zod_1.z.number().optional(),
    startDate: zod_1.z.string().optional(),
    endDate: zod_1.z.string().optional(),
    page: zod_1.z.coerce.number().default(1),
    limit: zod_1.z.coerce.number()
        .min(1)
        .max(100)
        .default(10),
});
/* =========================================
   CREDIT ANALYTICS
========================================= */
exports.creditAnalyticsSchema = zod_1.z.object({
    startDate: zod_1.z.string().optional(),
    endDate: zod_1.z.string().optional(),
    bureau: exports.creditBureauEnum.optional(),
});
