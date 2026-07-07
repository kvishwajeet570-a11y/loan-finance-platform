import { z } from "zod";

/* =========================================
   REFERRAL TYPE
========================================= */

export const referralTypeEnum = z.enum([
  "CUSTOMER",
  "DSA",
  "PARTNER",
  "EMPLOYEE",
  "CAMPAIGN",
]);

/* =========================================
   REFERRAL STATUS
========================================= */

export const referralStatusEnum = z.enum([
  "INVITED",
  "REGISTERED",
  "KYC_COMPLETED",
  "LOAN_APPLIED",
  "LOAN_APPROVED",
  "LOAN_DISBURSED",
  "REWARDED",
  "REJECTED",
  "EXPIRED",
]);

/* =========================================
   REWARD TYPE
========================================= */

export const rewardTypeEnum = z.enum([
  "CASH",
  "COMMISSION",
  "CASHBACK",
  "BONUS",
  "POINTS",
]);

/* =========================================
   CREATE REFERRAL
========================================= */

export const createReferralSchema =
  z.object({
    referrerId: z.string().cuid(),

    referralType:
      referralTypeEnum,

    referredName:
      z.string()
      .min(2)
      .max(100),

    referredPhone:
      z.string()
      .regex(/^[6-9]\d{9}$/),

    referredEmail:
      z.string()
      .email()
      .optional(),

    remarks:
      z.string()
      .max(500)
      .optional(),
  });

/* =========================================
   APPLY REFERRAL CODE
========================================= */

export const applyReferralCodeSchema =
  z.object({
    referralCode:
      z.string()
      .min(4)
      .max(20),

    userId:
      z.string().cuid(),
  });

/* =========================================
   REWARD REFERRAL
========================================= */

export const rewardReferralSchema =
  z.object({
    referralId:
      z.string().cuid(),

    rewardType:
      rewardTypeEnum,

    rewardAmount:
      z.number()
      .positive(),

    remarks:
      z.string()
      .optional(),
  });

/* =========================================
   UPDATE REFERRAL STATUS
========================================= */

export const updateReferralStatusSchema =
  z.object({
    referralId:
      z.string().cuid(),

    status:
      referralStatusEnum,

    remarks:
      z.string()
      .optional(),
  });

/* =========================================
   REFERRAL FILTER
========================================= */

export const referralFilterSchema =
  z.object({
    referrerId:
      z.string()
      .cuid()
      .optional(),

    referralType:
      referralTypeEnum.optional(),

    status:
      referralStatusEnum.optional(),

    startDate:
      z.string().optional(),

    endDate:
      z.string().optional(),

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
   REFERRAL ANALYTICS
========================================= */

export const referralAnalyticsSchema =
  z.object({
    referralType:
      referralTypeEnum.optional(),

    startDate:
      z.string().optional(),

    endDate:
      z.string().optional(),
  });

/* =========================================
   REFERRAL LEADERBOARD
========================================= */

export const referralLeaderboardSchema =
  z.object({
    startDate:
      z.string().optional(),

    endDate:
      z.string().optional(),

    limit:
      z.coerce.number()
      .default(10),
  });

/* =========================================
   TYPES
========================================= */

export type CreateReferralDto =
  z.infer<typeof createReferralSchema>;

export type ApplyReferralCodeDto =
  z.infer<
    typeof applyReferralCodeSchema
  >;

export type RewardReferralDto =
  z.infer<
    typeof rewardReferralSchema
  >;

export type UpdateReferralStatusDto =
  z.infer<
    typeof updateReferralStatusSchema
  >;

export type ReferralFilterDto =
  z.infer<
    typeof referralFilterSchema
  >;

export type ReferralAnalyticsDto =
  z.infer<
    typeof referralAnalyticsSchema
  >;

export type ReferralLeaderboardDto =
  z.infer<
    typeof referralLeaderboardSchema
  >;