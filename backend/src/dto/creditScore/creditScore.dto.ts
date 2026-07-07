import { z } from "zod";

/* =========================================
   CREDIT BUREAU
========================================= */

export const creditBureauEnum = z.enum([
  "CIBIL",
  "EXPERIAN",
  "CRIF",
  "EQUIFAX",
]);

/* =========================================
   RISK CATEGORY
========================================= */

export const riskCategoryEnum = z.enum([
  "LOW",
  "MEDIUM",
  "HIGH",
]);

/* =========================================
   CREDIT STATUS
========================================= */

export const creditStatusEnum = z.enum([
  "ACTIVE",
  "REVIEW",
  "REJECTED",
]);

/* =========================================
   CREATE CREDIT SCORE
========================================= */

export const createCreditScoreSchema = z.object({
  userId: z.string().cuid(),

  score: z
    .number()
    .min(300)
    .max(900),

  bureau: creditBureauEnum,

  riskCategory: riskCategoryEnum,

  eligibleAmount: z
    .number()
    .nonnegative(),

  remarks: z
    .string()
    .max(1000)
    .optional(),

  status: creditStatusEnum
    .default("ACTIVE"),
});

/* =========================================
   UPDATE CREDIT SCORE
========================================= */

export const updateCreditScoreSchema =
  createCreditScoreSchema.partial();

/* =========================================
   CHECK CREDIT SCORE
========================================= */

export const checkCreditScoreSchema =
  z.object({
    userId: z.string().cuid(),

    bureau: creditBureauEnum,
  });

/* =========================================
   CREDIT FILTER
========================================= */

export const creditScoreFilterSchema =
  z.object({
    search: z.string().optional(),

    bureau: creditBureauEnum.optional(),

    riskCategory:
      riskCategoryEnum.optional(),

    status:
      creditStatusEnum.optional(),

    minScore: z.number().optional(),

    maxScore: z.number().optional(),

    startDate: z.string().optional(),

    endDate: z.string().optional(),

    page: z.coerce.number().default(1),

    limit: z.coerce.number()
      .min(1)
      .max(100)
      .default(10),
  });

/* =========================================
   CREDIT ANALYTICS
========================================= */

export const creditAnalyticsSchema =
  z.object({
    startDate: z.string().optional(),

    endDate: z.string().optional(),

    bureau: creditBureauEnum.optional(),
  });

/* =========================================
   TYPES
========================================= */

export type CreateCreditScoreDto =
  z.infer<typeof createCreditScoreSchema>;

export type UpdateCreditScoreDto =
  z.infer<typeof updateCreditScoreSchema>;

export type CheckCreditScoreDto =
  z.infer<typeof checkCreditScoreSchema>;

export type CreditScoreFilterDto =
  z.infer<typeof creditScoreFilterSchema>;

export type CreditAnalyticsDto =
  z.infer<typeof creditAnalyticsSchema>;