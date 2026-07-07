import { z } from "zod";

/* =========================================
   CREATE ACHIEVEMENT
========================================= */

export const createAchievementSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100),

  description: z
    .string()
    .min(10, "Description is required")
    .max(500),

  badgeIcon: z.string().optional(),

  category: z.enum([
    "LOAN",
    "DSA",
    "SALES",
    "REFERRAL",
    "KYC",
    "REVENUE",
    "PERFORMANCE",
    "SPECIAL",
  ]),

  points: z
    .number()
    .int()
    .positive("Points must be greater than 0"),

  targetValue: z
    .number()
    .positive("Target value must be greater than 0"),

  rewardAmount: z
    .number()
    .nonnegative()
    .optional(),

  level: z.enum([
    "BRONZE",
    "SILVER",
    "GOLD",
    "PLATINUM",
    "DIAMOND",
  ]),

  isActive: z.boolean().default(true),
});

/* =========================================
   UPDATE ACHIEVEMENT
========================================= */

export const updateAchievementSchema =
  createAchievementSchema.partial();

/* =========================================
   ASSIGN ACHIEVEMENT
========================================= */

export const assignAchievementSchema = z.object({
  userId: z.string().cuid(),

  achievementId: z.string().cuid(),

  remarks: z.string().optional(),
});

/* =========================================
   ACHIEVEMENT FILTER
========================================= */

export const achievementFilterSchema = z.object({
  search: z.string().optional(),

  category: z.enum([
    "LOAN",
    "DSA",
    "SALES",
    "REFERRAL",
    "KYC",
    "REVENUE",
    "PERFORMANCE",
    "SPECIAL",
  ]).optional(),

  level: z.enum([
    "BRONZE",
    "SILVER",
    "GOLD",
    "PLATINUM",
    "DIAMOND",
  ]).optional(),

  isActive: z.boolean().optional(),

  page: z.coerce.number().default(1),

  limit: z.coerce.number().default(10),
});

/* =========================================
   TYPES
========================================= */

export type CreateAchievementDto =
  z.infer<typeof createAchievementSchema>;

export type UpdateAchievementDto =
  z.infer<typeof updateAchievementSchema>;

export type AssignAchievementDto =
  z.infer<typeof assignAchievementSchema>;

export type AchievementFilterDto =
  z.infer<typeof achievementFilterSchema>;