"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leaderboardAnalyticsSchema = exports.rewardCriteriaSchema = exports.performanceComparisonSchema = exports.userRankSchema = exports.topPerformersSchema = exports.leaderboardFilterSchema = exports.rankingMetricEnum = exports.leaderboardPeriodEnum = exports.leaderboardTypeEnum = void 0;
const zod_1 = require("zod");
/* =========================================
   LEADERBOARD TYPE
========================================= */
exports.leaderboardTypeEnum = zod_1.z.enum([
    "DSA",
    "PARTNER",
    "EMPLOYEE",
    "BRANCH",
    "REFERRAL",
    "LOAN",
    "INSURANCE",
    "INVESTMENT",
]);
/* =========================================
   LEADERBOARD PERIOD
========================================= */
exports.leaderboardPeriodEnum = zod_1.z.enum([
    "TODAY",
    "WEEK",
    "MONTH",
    "QUARTER",
    "YEAR",
    "ALL_TIME",
]);
/* =========================================
   RANKING METRIC
========================================= */
exports.rankingMetricEnum = zod_1.z.enum([
    "TOTAL_LEADS",
    "APPROVED_LEADS",
    "DISBURSED_LOANS",
    "LOAN_VOLUME",
    "INSURANCE_PREMIUM",
    "INVESTMENT_VOLUME",
    "TOTAL_REVENUE",
    "TOTAL_COMMISSION",
    "REFERRALS",
    "CONVERSION_RATE",
]);
/* =========================================
   LEADERBOARD FILTER
========================================= */
exports.leaderboardFilterSchema = zod_1.z.object({
    leaderboardType: exports.leaderboardTypeEnum,
    period: exports.leaderboardPeriodEnum
        .default("MONTH"),
    metric: exports.rankingMetricEnum,
    page: zod_1.z.coerce.number()
        .default(1),
    limit: zod_1.z.coerce.number()
        .min(1)
        .max(100)
        .default(20),
});
/* =========================================
   TOP PERFORMERS
========================================= */
exports.topPerformersSchema = zod_1.z.object({
    leaderboardType: exports.leaderboardTypeEnum,
    period: exports.leaderboardPeriodEnum
        .default("MONTH"),
    top: zod_1.z.coerce.number()
        .min(1)
        .max(100)
        .default(10),
});
/* =========================================
   USER RANK
========================================= */
exports.userRankSchema = zod_1.z.object({
    userId: zod_1.z.string().cuid(),
    leaderboardType: exports.leaderboardTypeEnum,
    period: exports.leaderboardPeriodEnum,
});
/* =========================================
   PERFORMANCE COMPARISON
========================================= */
exports.performanceComparisonSchema = zod_1.z.object({
    userIds: zod_1.z.array(zod_1.z.string().cuid())
        .min(2)
        .max(10),
    leaderboardType: exports.leaderboardTypeEnum,
    period: exports.leaderboardPeriodEnum,
});
/* =========================================
   REWARD CRITERIA
========================================= */
exports.rewardCriteriaSchema = zod_1.z.object({
    leaderboardType: exports.leaderboardTypeEnum,
    period: exports.leaderboardPeriodEnum,
    minimumRank: zod_1.z.number().min(1),
    rewardAmount: zod_1.z.number().positive(),
    rewardTitle: zod_1.z.string()
        .min(3)
        .max(100),
});
/* =========================================
   LEADERBOARD ANALYTICS
========================================= */
exports.leaderboardAnalyticsSchema = zod_1.z.object({
    leaderboardType: exports.leaderboardTypeEnum,
    startDate: zod_1.z.string().optional(),
    endDate: zod_1.z.string().optional(),
});
