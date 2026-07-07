"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.achievementFilterSchema = exports.assignAchievementSchema = exports.updateAchievementSchema = exports.createAchievementSchema = void 0;
const zod_1 = require("zod");
/* =========================================
   CREATE ACHIEVEMENT
========================================= */
exports.createAchievementSchema = zod_1.z.object({
    title: zod_1.z
        .string()
        .min(3, "Title must be at least 3 characters")
        .max(100),
    description: zod_1.z
        .string()
        .min(10, "Description is required")
        .max(500),
    badgeIcon: zod_1.z.string().optional(),
    category: zod_1.z.enum([
        "LOAN",
        "DSA",
        "SALES",
        "REFERRAL",
        "KYC",
        "REVENUE",
        "PERFORMANCE",
        "SPECIAL",
    ]),
    points: zod_1.z
        .number()
        .int()
        .positive("Points must be greater than 0"),
    targetValue: zod_1.z
        .number()
        .positive("Target value must be greater than 0"),
    rewardAmount: zod_1.z
        .number()
        .nonnegative()
        .optional(),
    level: zod_1.z.enum([
        "BRONZE",
        "SILVER",
        "GOLD",
        "PLATINUM",
        "DIAMOND",
    ]),
    isActive: zod_1.z.boolean().default(true),
});
/* =========================================
   UPDATE ACHIEVEMENT
========================================= */
exports.updateAchievementSchema = exports.createAchievementSchema.partial();
/* =========================================
   ASSIGN ACHIEVEMENT
========================================= */
exports.assignAchievementSchema = zod_1.z.object({
    userId: zod_1.z.string().cuid(),
    achievementId: zod_1.z.string().cuid(),
    remarks: zod_1.z.string().optional(),
});
/* =========================================
   ACHIEVEMENT FILTER
========================================= */
exports.achievementFilterSchema = zod_1.z.object({
    search: zod_1.z.string().optional(),
    category: zod_1.z.enum([
        "LOAN",
        "DSA",
        "SALES",
        "REFERRAL",
        "KYC",
        "REVENUE",
        "PERFORMANCE",
        "SPECIAL",
    ]).optional(),
    level: zod_1.z.enum([
        "BRONZE",
        "SILVER",
        "GOLD",
        "PLATINUM",
        "DIAMOND",
    ]).optional(),
    isActive: zod_1.z.boolean().optional(),
    page: zod_1.z.coerce.number().default(1),
    limit: zod_1.z.coerce.number().default(10),
});
