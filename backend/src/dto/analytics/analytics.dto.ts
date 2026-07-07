import { z } from "zod";

/* =========================================
   DATE RANGE FILTER
========================================= */

export const dateRangeSchema = z.object({
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
});

/* =========================================
   DASHBOARD ANALYTICS
========================================= */

export const dashboardAnalyticsSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),

  period: z.enum([
    "TODAY",
    "WEEK",
    "MONTH",
    "QUARTER",
    "YEAR",
    "CUSTOM",
  ]).default("MONTH"),
});

/* =========================================
   LOAN ANALYTICS
========================================= */

export const loanAnalyticsSchema = z.object({
  loanType: z.enum([
    "PERSONAL_LOAN",
    "BUSINESS_LOAN",
    "HOME_LOAN",
    "LAP",
    "CAR_LOAN",
    "CREDIT_CARD",
  ]).optional(),

  status: z.enum([
    "PENDING",
    "UNDER_REVIEW",
    "APPROVED",
    "REJECTED",
    "DISBURSED",
    "CLOSED",
  ]).optional(),

  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

/* =========================================
   REVENUE ANALYTICS
========================================= */

export const revenueAnalyticsSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),

  groupBy: z.enum([
    "DAY",
    "WEEK",
    "MONTH",
    "YEAR",
  ]).default("MONTH"),
});

/* =========================================
   DSA ANALYTICS
========================================= */

export const dsaAnalyticsSchema = z.object({
  dsaId: z.string().cuid().optional(),

  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

/* =========================================
   PARTNER ANALYTICS
========================================= */

export const partnerAnalyticsSchema = z.object({
  partnerId: z.string().cuid().optional(),

  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

/* =========================================
   USER ANALYTICS
========================================= */

export const userAnalyticsSchema = z.object({
  role: z.string().optional(),

  isVerified: z.boolean().optional(),

  isBlocked: z.boolean().optional(),

  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

/* =========================================
   PAGINATION
========================================= */

export const analyticsPaginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),

  limit: z.coerce.number()
    .min(1)
    .max(100)
    .default(10),
});

/* =========================================
   EXPORT REPORT
========================================= */

export const exportAnalyticsSchema = z.object({
  reportType: z.enum([
    "LOAN",
    "REVENUE",
    "DSA",
    "PARTNER",
    "USER",
    "PAYMENT",
  ]),

  format: z.enum([
    "PDF",
    "EXCEL",
    "CSV",
  ]),

  startDate: z.string(),
  endDate: z.string(),
});

/* =========================================
   TYPES
========================================= */

export type DateRangeDto =
  z.infer<typeof dateRangeSchema>;

export type DashboardAnalyticsDto =
  z.infer<typeof dashboardAnalyticsSchema>;

export type LoanAnalyticsDto =
  z.infer<typeof loanAnalyticsSchema>;

export type RevenueAnalyticsDto =
  z.infer<typeof revenueAnalyticsSchema>;

export type DsaAnalyticsDto =
  z.infer<typeof dsaAnalyticsSchema>;

export type PartnerAnalyticsDto =
  z.infer<typeof partnerAnalyticsSchema>;

export type UserAnalyticsDto =
  z.infer<typeof userAnalyticsSchema>;

export type AnalyticsPaginationDto =
  z.infer<typeof analyticsPaginationSchema>;

export type ExportAnalyticsDto =
  z.infer<typeof exportAnalyticsSchema>;