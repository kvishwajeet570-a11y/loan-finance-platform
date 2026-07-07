import { z } from "zod";

/* =========================================
   LEADERBOARD TYPE
========================================= */

export const leaderboardTypeEnum =
  z.enum([
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

export const leaderboardPeriodEnum =
  z.enum([
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

export const rankingMetricEnum =
  z.enum([
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

export const leaderboardFilterSchema =
  z.object({
    leaderboardType:
      leaderboardTypeEnum,

    period:
      leaderboardPeriodEnum
      .default("MONTH"),

    metric:
      rankingMetricEnum,

    page:
      z.coerce.number()
      .default(1),

    limit:
      z.coerce.number()
      .min(1)
      .max(100)
      .default(20),
  });

/* =========================================
   TOP PERFORMERS
========================================= */

export const topPerformersSchema =
  z.object({
    leaderboardType:
      leaderboardTypeEnum,

    period:
      leaderboardPeriodEnum
      .default("MONTH"),

    top:
      z.coerce.number()
      .min(1)
      .max(100)
      .default(10),
  });

/* =========================================
   USER RANK
========================================= */

export const userRankSchema =
  z.object({
    userId:
      z.string().cuid(),

    leaderboardType:
      leaderboardTypeEnum,

    period:
      leaderboardPeriodEnum,
  });

/* =========================================
   PERFORMANCE COMPARISON
========================================= */

export const performanceComparisonSchema =
  z.object({
    userIds:
      z.array(
        z.string().cuid()
      )
      .min(2)
      .max(10),

    leaderboardType:
      leaderboardTypeEnum,

    period:
      leaderboardPeriodEnum,
  });

/* =========================================
   REWARD CRITERIA
========================================= */

export const rewardCriteriaSchema =
  z.object({
    leaderboardType:
      leaderboardTypeEnum,

    period:
      leaderboardPeriodEnum,

    minimumRank:
      z.number().min(1),

    rewardAmount:
      z.number().positive(),

    rewardTitle:
      z.string()
      .min(3)
      .max(100),
  });

/* =========================================
   LEADERBOARD ANALYTICS
========================================= */

export const leaderboardAnalyticsSchema =
  z.object({
    leaderboardType:
      leaderboardTypeEnum,

    startDate:
      z.string().optional(),

    endDate:
      z.string().optional(),
  });

/* =========================================
   EXPORT TYPES
========================================= */

export type LeaderboardFilterDto =
  z.infer<
    typeof leaderboardFilterSchema
  >;

export type TopPerformersDto =
  z.infer<
    typeof topPerformersSchema
  >;

export type UserRankDto =
  z.infer<
    typeof userRankSchema
  >;

export type PerformanceComparisonDto =
  z.infer<
    typeof performanceComparisonSchema
  >;

export type RewardCriteriaDto =
  z.infer<
    typeof rewardCriteriaSchema
  >;

export type LeaderboardAnalyticsDto =
  z.infer<
    typeof leaderboardAnalyticsSchema
  >;