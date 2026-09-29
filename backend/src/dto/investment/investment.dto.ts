import { z } from "zod";

/* =====================================================
   INVESTMENT TYPE ENUM
===================================================== */

export const investmentTypeEnum = z.enum([
  "MUTUAL_FUND",
  "SIP",
  "FIXED_DEPOSIT",
  "RECURRING_DEPOSIT",
  "BONDS",
  "NPS",
  "ETF",
  "STOCKS",
  "GOLD",
  "CRYPTO",
  "OTHER",
]);

/* =====================================================
   RISK LEVEL ENUM
===================================================== */

export const riskLevelEnum = z.enum([
  "LOW",
  "MODERATE",
  "HIGH",
]);

/* =====================================================
   STATUS ENUM
===================================================== */

export const investmentStatusEnum =
  z.enum([
    "ACTIVE",
    "INACTIVE",
    "CLOSED",
  ]);

/* =====================================================
   CREATE DTO
===================================================== */

export const createInvestmentSchema =
  z.object({
    title: z
      .string()
      .min(2)
      .max(200),

    description: z
      .string()
      .max(2000)
      .optional(),

    type:
      investmentTypeEnum,

    category: z
      .string()
      .max(100)
      .optional(),

    providerName: z
      .string()
      .max(150)
      .optional(),

    riskLevel:
      riskLevelEnum
        .default("LOW"),

    minAmount: z
      .number()
      .positive(),

    minimumAmount: z
      .number()
      .min(0)
      .default(0),

    maxAmount: z
      .number()
      .optional(),

    interestRate: z
      .number()
      .min(0),

    expectedReturn: z
      .number()
      .min(0)
      .optional(),

    tenureMonths: z
      .number()
      .min(1)
      .optional(),

    lockInPeriod: z
      .number()
      .min(0)
      .optional(),

    featured: z
      .boolean()
      .default(false),

    status:
      investmentStatusEnum
        .default("ACTIVE"),
  });

/* =====================================================
   UPDATE DTO
===================================================== */

export const updateInvestmentSchema =
  createInvestmentSchema.partial();

/* =====================================================
   FILTER DTO
===================================================== */

export const investmentFilterSchema =
  z.object({
    search:
      z.string().optional(),

    type:
      investmentTypeEnum.optional(),

    category:
      z.string().optional(),

    riskLevel:
      riskLevelEnum.optional(),

    status:
      investmentStatusEnum.optional(),

    featured:
      z.coerce
        .boolean()
        .optional(),

    page: z.coerce
      .number()
      .min(1)
      .default(1),

    limit: z.coerce
      .number()
      .min(1)
      .max(100)
      .default(10),

    sortBy: z
      .enum([
        "title",
        "type",
        "minAmount",
        "interestRate",
        "expectedReturn",
        "createdAt",
      ])
      .default(
        "createdAt"
      ),

    sortOrder: z
      .enum([
        "asc",
        "desc",
      ])
      .default("desc"),
  });

/* =====================================================
   ANALYTICS DTO
===================================================== */

export const investmentAnalyticsSchema =
  z.object({
    startDate:
      z.string().optional(),

    endDate:
      z.string().optional(),

    type:
      investmentTypeEnum.optional(),

    status:
      investmentStatusEnum.optional(),
  });

/* =====================================================
   ROI CALCULATOR DTO
===================================================== */

export const investmentReturnCalculatorSchema =
  z.object({
    principal: z
      .number()
      .positive(),

    annualRate: z
      .number()
      .positive(),

    years: z
      .number()
      .positive(),

    compoundFrequency:
      z.coerce
        .number()
        .min(1)
        .default(1),
  });

/* =====================================================
   TYPES
===================================================== */

export type CreateInvestmentDto =
  z.infer<
    typeof createInvestmentSchema
  >;

export type UpdateInvestmentDto =
  z.infer<
    typeof updateInvestmentSchema
  >;

export type InvestmentFilterDto =
  z.infer<
    typeof investmentFilterSchema
  >;

export type InvestmentAnalyticsDto =
  z.infer<
    typeof investmentAnalyticsSchema
  >;

export type InvestmentReturnCalculatorDto =
  z.infer<
    typeof investmentReturnCalculatorSchema
  >;

/* =====================================================
   EXPORTS
===================================================== */

export default {
  createInvestmentSchema,
  updateInvestmentSchema,
  investmentFilterSchema,
  investmentAnalyticsSchema,
  investmentReturnCalculatorSchema,
};