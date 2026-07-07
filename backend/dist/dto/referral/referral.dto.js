"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.referralLeaderboardSchema = exports.referralAnalyticsSchema = exports.referralFilterSchema = exports.updateReferralStatusSchema = exports.rewardReferralSchema = exports.applyReferralCodeSchema = exports.createReferralSchema = exports.rewardTypeEnum = exports.referralStatusEnum = exports.referralTypeEnum = void 0;
const zod_1 = require("zod");
/* =========================================
   REFERRAL TYPE
========================================= */
exports.referralTypeEnum = zod_1.z.enum([
    "CUSTOMER",
    "DSA",
    "PARTNER",
    "EMPLOYEE",
    "CAMPAIGN",
]);
/* =========================================
   REFERRAL STATUS
========================================= */
exports.referralStatusEnum = zod_1.z.enum([
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
exports.rewardTypeEnum = zod_1.z.enum([
    "CASH",
    "COMMISSION",
    "CASHBACK",
    "BONUS",
    "POINTS",
]);
/* =========================================
   CREATE REFERRAL
========================================= */
exports.createReferralSchema = zod_1.z.object({
    referrerId: zod_1.z.string().cuid(),
    referralType: exports.referralTypeEnum,
    referredName: zod_1.z.string()
        .min(2)
        .max(100),
    referredPhone: zod_1.z.string()
        .regex(/^[6-9]\d{9}$/),
    referredEmail: zod_1.z.string()
        .email()
        .optional(),
    remarks: zod_1.z.string()
        .max(500)
        .optional(),
});
/* =========================================
   APPLY REFERRAL CODE
========================================= */
exports.applyReferralCodeSchema = zod_1.z.object({
    referralCode: zod_1.z.string()
        .min(4)
        .max(20),
    userId: zod_1.z.string().cuid(),
});
/* =========================================
   REWARD REFERRAL
========================================= */
exports.rewardReferralSchema = zod_1.z.object({
    referralId: zod_1.z.string().cuid(),
    rewardType: exports.rewardTypeEnum,
    rewardAmount: zod_1.z.number()
        .positive(),
    remarks: zod_1.z.string()
        .optional(),
});
/* =========================================
   UPDATE REFERRAL STATUS
========================================= */
exports.updateReferralStatusSchema = zod_1.z.object({
    referralId: zod_1.z.string().cuid(),
    status: exports.referralStatusEnum,
    remarks: zod_1.z.string()
        .optional(),
});
/* =========================================
   REFERRAL FILTER
========================================= */
exports.referralFilterSchema = zod_1.z.object({
    referrerId: zod_1.z.string()
        .cuid()
        .optional(),
    referralType: exports.referralTypeEnum.optional(),
    status: exports.referralStatusEnum.optional(),
    startDate: zod_1.z.string().optional(),
    endDate: zod_1.z.string().optional(),
    page: zod_1.z.coerce.number()
        .default(1),
    limit: zod_1.z.coerce.number()
        .min(1)
        .max(100)
        .default(20),
});
/* =========================================
   REFERRAL ANALYTICS
========================================= */
exports.referralAnalyticsSchema = zod_1.z.object({
    referralType: exports.referralTypeEnum.optional(),
    startDate: zod_1.z.string().optional(),
    endDate: zod_1.z.string().optional(),
});
/* =========================================
   REFERRAL LEADERBOARD
========================================= */
exports.referralLeaderboardSchema = zod_1.z.object({
    startDate: zod_1.z.string().optional(),
    endDate: zod_1.z.string().optional(),
    limit: zod_1.z.coerce.number()
        .default(10),
});
