"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.referralUserSchema = exports.referralIdSchema = exports.searchReferralSchema = exports.referralLeaderboardSchema = exports.referralAnalyticsSchema = exports.referralFilterSchema = exports.markFraudSchema = exports.rejectReferralSchema = exports.approveReferralSchema = exports.updateReferralSchema = exports.applyReferralCodeSchema = exports.createReferralSchema = exports.dateRangeSchema = exports.paginationSchema = exports.deviceInfoSchema = exports.ipAddressSchema = exports.optionalLongStringSchema = exports.optionalStringSchema = exports.positiveIntegerSchema = exports.rewardAmountSchema = exports.referralCodeSchema = exports.cuidSchema = exports.rewardActionEnum = exports.sortOrderEnum = exports.referralStatusEnum = void 0;
const zod_1 = require("zod");
/* =========================================
   ENUMS
========================================= */
exports.referralStatusEnum = zod_1.z.enum([
    "PENDING",
    "APPROVED",
    "REJECTED",
    "REWARDED",
    "PAID",
    "EXPIRED",
    "FRAUD",
    "CANCELLED",
]);
exports.sortOrderEnum = zod_1.z.enum([
    "asc",
    "desc",
]);
exports.rewardActionEnum = zod_1.z.enum([
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
exports.cuidSchema = zod_1.z.string().cuid({
    message: "Invalid CUID",
});
exports.referralCodeSchema = zod_1.z
    .string()
    .trim()
    .min(4, "Referral code is too short")
    .max(30, "Referral code is too long")
    .regex(/^[A-Z0-9_-]+$/, "Referral code format is invalid");
exports.rewardAmountSchema = zod_1.z
    .number()
    .min(0, {
    message: "Reward amount must be greater than or equal to 0",
});
exports.positiveIntegerSchema = zod_1.z
    .number()
    .int()
    .min(0);
exports.optionalStringSchema = zod_1.z
    .string()
    .trim()
    .max(255)
    .optional();
exports.optionalLongStringSchema = zod_1.z
    .string()
    .trim()
    .max(1000)
    .optional();
exports.ipAddressSchema = zod_1.z
    .string()
    .max(100)
    .optional();
exports.deviceInfoSchema = zod_1.z
    .string()
    .max(500)
    .optional();
exports.paginationSchema = zod_1.z.object({
    page: zod_1.z.coerce
        .number()
        .int()
        .min(1)
        .default(1),
    limit: zod_1.z.coerce
        .number()
        .int()
        .min(1)
        .max(100)
        .default(20),
    sortBy: zod_1.z
        .string()
        .default("createdAt"),
    sortOrder: exports.sortOrderEnum.default("desc"),
});
/* =========================================
   DATE RANGE
========================================= */
exports.dateRangeSchema = zod_1.z.object({
    startDate: zod_1.z
        .string()
        .datetime()
        .optional(),
    endDate: zod_1.z
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
exports.createReferralSchema = zod_1.z.object({
    userId: exports.cuidSchema,
    source: exports.optionalStringSchema,
    campaign: exports.optionalStringSchema,
});
/* =========================================
   APPLY REFERRAL CODE
========================================= */
exports.applyReferralCodeSchema = zod_1.z.object({
    userId: exports.cuidSchema,
    referralCode: exports.referralCodeSchema,
});
/* =========================================
   UPDATE REFERRAL
========================================= */
exports.updateReferralSchema = zod_1.z.object({
    referralId: exports.cuidSchema,
    status: exports.referralStatusEnum.optional(),
    rewardAmount: exports.rewardAmountSchema.optional(),
    rewardPaidAmount: exports.rewardAmountSchema.optional(),
    totalReferrals: exports.positiveIntegerSchema.optional(),
    successfulReferrals: exports.positiveIntegerSchema.optional(),
    rejectedReferrals: exports.positiveIntegerSchema.optional(),
    pendingReferrals: exports.positiveIntegerSchema.optional(),
    totalEarnings: exports.rewardAmountSchema.optional(),
    rewardTransactionId: exports.optionalStringSchema,
    approvedBy: exports.cuidSchema.optional(),
    approvedAt: zod_1.z.coerce.date().optional(),
    rejectedBy: exports.cuidSchema.optional(),
    rejectedAt: zod_1.z.coerce.date().optional(),
    rejectionReason: exports.optionalLongStringSchema,
    paidAt: zod_1.z.coerce.date().optional(),
    expiresAt: zod_1.z.coerce.date().optional(),
    isFraud: zod_1.z.boolean().optional(),
    fraudReason: exports.optionalLongStringSchema,
    source: exports.optionalStringSchema,
    campaign: exports.optionalStringSchema,
    ipAddress: exports.ipAddressSchema,
    deviceInfo: exports.deviceInfoSchema,
    updatedBy: exports.cuidSchema.optional(),
});
/* =========================================
   APPROVE REFERRAL
========================================= */
exports.approveReferralSchema = zod_1.z.object({
    referralId: exports.cuidSchema,
    approvedBy: exports.cuidSchema,
    rewardAmount: exports.rewardAmountSchema,
    rewardTransactionId: exports.optionalStringSchema,
});
/* =========================================
   REJECT REFERRAL
========================================= */
exports.rejectReferralSchema = zod_1.z.object({
    referralId: exports.cuidSchema,
    rejectedBy: exports.cuidSchema,
    rejectionReason: zod_1.z
        .string()
        .trim()
        .min(3)
        .max(500),
});
/* =========================================
   MARK FRAUD
========================================= */
exports.markFraudSchema = zod_1.z.object({
    referralId: exports.cuidSchema,
    fraudReason: zod_1.z
        .string()
        .trim()
        .min(5)
        .max(500),
    updatedBy: exports.cuidSchema,
});
/* =========================================
   PART 3 STARTS FROM FILTERS & TYPES
========================================= */
/* =========================================
   FILTERS
========================================= */
exports.referralFilterSchema = exports.paginationSchema.extend({
    userId: exports.cuidSchema.optional(),
    referrerId: exports.cuidSchema.optional(),
    referredUserId: exports.cuidSchema.optional(),
    referralCode: exports.referralCodeSchema.optional(),
    status: exports.referralStatusEnum.optional(),
    source: exports.optionalStringSchema,
    campaign: exports.optionalStringSchema,
    isFraud: zod_1.z.boolean().optional(),
    ...exports.dateRangeSchema.shape,
});
/* =========================================
   ANALYTICS
========================================= */
exports.referralAnalyticsSchema = zod_1.z.object({
    userId: exports.cuidSchema.optional(),
    status: exports.referralStatusEnum.optional(),
    source: exports.optionalStringSchema,
    campaign: exports.optionalStringSchema,
    ...exports.dateRangeSchema.shape,
});
/* =========================================
   LEADERBOARD
========================================= */
exports.referralLeaderboardSchema = zod_1.z.object({
    limit: zod_1.z.coerce
        .number()
        .min(1)
        .max(100)
        .default(10),
    ...exports.dateRangeSchema.shape,
});
/* =========================================
   SEARCH
========================================= */
exports.searchReferralSchema = zod_1.z.object({
    keyword: zod_1.z.string().trim().min(1),
    page: zod_1.z.coerce.number().default(1),
    limit: zod_1.z.coerce
        .number()
        .min(1)
        .max(100)
        .default(20),
});
/* =========================================
   GET BY ID
========================================= */
exports.referralIdSchema = zod_1.z.object({
    referralId: exports.cuidSchema,
});
/* =========================================
   GET BY USER
========================================= */
exports.referralUserSchema = zod_1.z.object({
    userId: exports.cuidSchema,
});
