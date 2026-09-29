import { z } from "zod";

/* =========================================
   ENUMS
========================================= */

export const referralStatusEnum = z.enum([
  "PENDING",
  "APPROVED",
  "REJECTED",
  "REWARDED",
  "PAID",
  "EXPIRED",
  "FRAUD",
  "CANCELLED",
]);

export const sortOrderEnum = z.enum([
  "asc",
  "desc",
]);

export const rewardActionEnum = z.enum([
  "CREATE",
  "APPLY",
  "APPROVE",
  "REJECT",
  "REWARD",
  "PAY",
  "EXPIRE",
  "FRAUD",
]);

/* =========================================
   COMMON VALIDATORS
========================================= */

export const cuidSchema = z.string().cuid({
  message: "Invalid CUID",
});

export const referralCodeSchema = z
  .string()
  .trim()
  .min(4, "Referral code is too short")
  .max(30, "Referral code is too long")
  .regex(
    /^[A-Z0-9_-]+$/,
    "Referral code format is invalid"
  );

export const rewardAmountSchema = z
  .number()
  .min(0, {
    message: "Reward amount must be greater than or equal to 0",
  });

export const positiveIntegerSchema = z
  .number()
  .int()
  .min(0);

export const optionalStringSchema = z
  .string()
  .trim()
  .max(255)
  .optional();

export const optionalLongStringSchema = z
  .string()
  .trim()
  .max(1000)
  .optional();

export const ipAddressSchema = z
  .string()
  .max(100)
  .optional();

export const deviceInfoSchema = z
  .string()
  .max(500)
  .optional();

export const paginationSchema = z.object({
  page: z.coerce
    .number()
    .int()
    .min(1)
    .default(1),

  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .default(20),

  sortBy: z
    .string()
    .default("createdAt"),

  sortOrder:
    sortOrderEnum.default("desc"),
});

/* =========================================
   DATE RANGE
========================================= */

export const dateRangeSchema = z.object({
  startDate: z
    .string()
    .datetime()
    .optional(),

  endDate: z
    .string()
    .datetime()
    .optional(),
});

/* =========================================
   PART 2 STARTS FROM CREATE SCHEMAS
========================================= */

/* =========================================
   CREATE REFERRAL
========================================= */

export const createReferralSchema = z.object({
  userId: cuidSchema,

  source: optionalStringSchema,

  campaign: optionalStringSchema,
});

/* =========================================
   APPLY REFERRAL CODE
========================================= */

export const applyReferralCodeSchema = z.object({
  userId: cuidSchema,

  referralCode: referralCodeSchema,
});

/* =========================================
   UPDATE REFERRAL
========================================= */

export const updateReferralSchema = z.object({
  referralId: cuidSchema,

  status: referralStatusEnum.optional(),

  rewardAmount: rewardAmountSchema.optional(),

  rewardPaidAmount: rewardAmountSchema.optional(),

  totalReferrals: positiveIntegerSchema.optional(),

  successfulReferrals:
    positiveIntegerSchema.optional(),

  rejectedReferrals:
    positiveIntegerSchema.optional(),

  pendingReferrals:
    positiveIntegerSchema.optional(),

  totalEarnings:
    rewardAmountSchema.optional(),

  rewardTransactionId:
    optionalStringSchema,

  approvedBy:
    cuidSchema.optional(),

  approvedAt:
    z.coerce.date().optional(),

  rejectedBy:
    cuidSchema.optional(),

  rejectedAt:
    z.coerce.date().optional(),

  rejectionReason:
    optionalLongStringSchema,

  paidAt:
    z.coerce.date().optional(),

  expiresAt:
    z.coerce.date().optional(),

  isFraud:
    z.boolean().optional(),

  fraudReason:
    optionalLongStringSchema,

  source:
    optionalStringSchema,

  campaign:
    optionalStringSchema,

  ipAddress:
    ipAddressSchema,

  deviceInfo:
    deviceInfoSchema,

  updatedBy:
    cuidSchema.optional(),
});

/* =========================================
   APPROVE REFERRAL
========================================= */

export const approveReferralSchema = z.object({
  referralId: cuidSchema,

  approvedBy: cuidSchema,

  rewardAmount: rewardAmountSchema,

  rewardTransactionId:
    optionalStringSchema,
});

/* =========================================
   REJECT REFERRAL
========================================= */

export const rejectReferralSchema = z.object({
  referralId: cuidSchema,

  rejectedBy: cuidSchema,

  rejectionReason: z
    .string()
    .trim()
    .min(3)
    .max(500),
});

/* =========================================
   MARK FRAUD
========================================= */

export const markFraudSchema = z.object({
  referralId: cuidSchema,

  fraudReason: z
    .string()
    .trim()
    .min(5)
    .max(500),

  updatedBy: cuidSchema,
});

/* =========================================
   PART 3 STARTS FROM FILTERS & TYPES
========================================= */

/* =========================================
   FILTERS
========================================= */

export const referralFilterSchema = paginationSchema.extend({
  userId: cuidSchema.optional(),

  referrerId: cuidSchema.optional(),

  referredUserId: cuidSchema.optional(),

  referralCode: referralCodeSchema.optional(),

  status: referralStatusEnum.optional(),

  source: optionalStringSchema,

  campaign: optionalStringSchema,

  isFraud: z.boolean().optional(),

  ...dateRangeSchema.shape,
});

/* =========================================
   ANALYTICS
========================================= */

export const referralAnalyticsSchema = z.object({
  userId: cuidSchema.optional(),

  status: referralStatusEnum.optional(),

  source: optionalStringSchema,

  campaign: optionalStringSchema,

  ...dateRangeSchema.shape,
});

/* =========================================
   LEADERBOARD
========================================= */

export const referralLeaderboardSchema = z.object({
  limit: z.coerce
    .number()
    .min(1)
    .max(100)
    .default(10),

  ...dateRangeSchema.shape,
});

/* =========================================
   SEARCH
========================================= */

export const searchReferralSchema = z.object({
  keyword: z.string().trim().min(1),

  page: z.coerce.number().default(1),

  limit: z.coerce
    .number()
    .min(1)
    .max(100)
    .default(20),
});

/* =========================================
   GET BY ID
========================================= */

export const referralIdSchema = z.object({
  referralId: cuidSchema,
});

/* =========================================
   GET BY USER
========================================= */

export const referralUserSchema = z.object({
  userId: cuidSchema,
});

/* =========================================
   TYPES
========================================= */

export type ReferralStatus =
  z.infer<typeof referralStatusEnum>;

export type CreateReferralDto =
  z.infer<typeof createReferralSchema>;

export type ApplyReferralCodeDto =
  z.infer<typeof applyReferralCodeSchema>;

export type UpdateReferralDto =
  z.infer<typeof updateReferralSchema>;

export type ApproveReferralDto =
  z.infer<typeof approveReferralSchema>;

export type RejectReferralDto =
  z.infer<typeof rejectReferralSchema>;

export type MarkFraudDto =
  z.infer<typeof markFraudSchema>;

export type ReferralFilterDto =
  z.infer<typeof referralFilterSchema>;

export type ReferralAnalyticsDto =
  z.infer<typeof referralAnalyticsSchema>;

export type ReferralLeaderboardDto =
  z.infer<typeof referralLeaderboardSchema>;

export type SearchReferralDto =
  z.infer<typeof searchReferralSchema>;

export type ReferralIdDto =
  z.infer<typeof referralIdSchema>;

export type ReferralUserDto =
  z.infer<typeof referralUserSchema>;

