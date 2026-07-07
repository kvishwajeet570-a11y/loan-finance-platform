import { z } from "zod";

/* =========================================
   INVESTMENT TYPE
========================================= */

export const investmentTypeEnum = z.enum([
  "MUTUAL_FUND",
  "SIP",
  "FIXED_DEPOSIT",
  "RECURRING_DEPOSIT",
  "BONDS",
  "NPS",
  "GOLD",
  "DEMAT",
  "STOCKS",
  "ETF",
]);

/* =========================================
   INVESTMENT STATUS
========================================= */

export const investmentStatusEnum = z.enum([
  "PENDING",
  "ACTIVE",
  "MATURED",
  "CLOSED",
  "CANCELLED",
]);

/* =========================================
   RISK PROFILE
========================================= */

export const riskProfileEnum = z.enum([
  "LOW",
  "MODERATE",
  "HIGH",
]);

/* =========================================
   CREATE INVESTMENT
========================================= */

export const createInvestmentSchema =
  z.object({
    userId: z.string().cuid(),

    investmentType:
      investmentTypeEnum,

    investmentName:
      z.string()
      .min(2)
      .max(200),

    amount:
      z.number()
      .positive(),

    expectedReturn:
      z.number()
      .min(0)
      .max(100)
      .optional(),

    tenureMonths:
      z.number()
      .positive(),

    riskProfile:
      riskProfileEnum,

    providerName:
      z.string()
      .min(2)
      .max(150),
  });

/* =========================================
   UPDATE INVESTMENT
========================================= */

export const updateInvestmentSchema =
  createInvestmentSchema.partial();

/* =========================================
   INVESTMENT STATUS
========================================= */

export const updateInvestmentStatusSchema =
  z.object({
    investmentId:
      z.string().cuid(),

    status:
      investmentStatusEnum,

    remarks:
      z.string().optional(),
  });

/* =========================================
   SIP CREATION
========================================= */

export const createSipSchema =
  z.object({
    userId: z.string().cuid(),

    fundName:
      z.string()
      .min(2)
      .max(200),

    monthlyAmount:
      z.number()
      .positive(),

    sipDate:
      z.number()
      .min(1)
      .max(31),

    tenureMonths:
      z.number()
      .positive(),
  });

/* =========================================
   FD CREATION
========================================= */

export const createFdSchema =
  z.object({
    userId: z.string().cuid(),

    bankName:
      z.string()
      .min(2)
      .max(150),

    depositAmount:
      z.number()
      .positive(),

    interestRate:
      z.number()
      .positive(),

    tenureMonths:
      z.number()
      .positive(),
  });

/* =========================================
   DEMAT ACCOUNT REQUEST
========================================= */

export const createDematSchema =
  z.object({
    userId: z.string().cuid(),

    brokerName:
      z.string()
      .min(2)
      .max(150),

    panNo: z.string()
      .regex(
        /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
      ),

    mobileNumber:
      z.string()
      .regex(/^[6-9]\d{9}$/),
  });

/* =========================================
   INVESTMENT FILTER
========================================= */

export const investmentFilterSchema =
  z.object({
    search: z.string().optional(),

    investmentType:
      investmentTypeEnum.optional(),

    status:
      investmentStatusEnum.optional(),

    riskProfile:
      riskProfileEnum.optional(),

    userId:
      z.string().cuid().optional(),

    page:
      z.coerce.number()
      .default(1),

    limit:
      z.coerce.number()
      .min(1)
      .max(100)
      .default(10),
  });

/* =========================================
   INVESTMENT ANALYTICS
========================================= */

export const investmentAnalyticsSchema =
  z.object({
    startDate:
      z.string().optional(),

    endDate:
      z.string().optional(),

    investmentType:
      investmentTypeEnum.optional(),
  });

/* =========================================
   TYPES
========================================= */

export type CreateInvestmentDto =
  z.infer<typeof createInvestmentSchema>;

export type UpdateInvestmentDto =
  z.infer<typeof updateInvestmentSchema>;

export type UpdateInvestmentStatusDto =
  z.infer<
    typeof updateInvestmentStatusSchema
  >;

export type CreateSipDto =
  z.infer<typeof createSipSchema>;

export type CreateFdDto =
  z.infer<typeof createFdSchema>;

export type CreateDematDto =
  z.infer<typeof createDematSchema>;

export type InvestmentFilterDto =
  z.infer<
    typeof investmentFilterSchema
  >;

export type InvestmentAnalyticsDto =
  z.infer<
    typeof investmentAnalyticsSchema
  >;