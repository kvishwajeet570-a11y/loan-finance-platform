import { z } from "zod";

/* =========================================
   DASHBOARD PERIOD
========================================= */

export const dashboardPeriodEnum = z.enum([
  "TODAY",
  "YESTERDAY",
  "WEEK",
  "MONTH",
  "QUARTER",
  "YEAR",
  "CUSTOM",
]);

/* =========================================
   DASHBOARD FILTER
========================================= */

export const dashboardFilterSchema = z.object({
  period: dashboardPeriodEnum.default("MONTH"),

  startDate: z.string().optional(),

  endDate: z.string().optional(),
});

/* =========================================
   LOAN DASHBOARD FILTER
========================================= */

export const loanDashboardFilterSchema =
  z.object({
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
   REVENUE DASHBOARD
========================================= */

export const revenueDashboardSchema =
  z.object({
    period: dashboardPeriodEnum.default("MONTH"),

    groupBy: z.enum([
      "DAY",
      "WEEK",
      "MONTH",
      "YEAR",
    ]).default("MONTH"),
  });

/* =========================================
   DSA DASHBOARD
========================================= */

export const dsaDashboardSchema =
  z.object({
    dsaId: z.string().cuid(),

    period: dashboardPeriodEnum.default("MONTH"),
  });

/* =========================================
   PARTNER DASHBOARD
========================================= */

export const partnerDashboardSchema =
  z.object({
    partnerId: z.string().cuid(),

    period: dashboardPeriodEnum.default("MONTH"),
  });

/* =========================================
   LEADERBOARD FILTER
========================================= */

export const leaderboardSchema =
  z.object({
    type: z.enum([
      "DSA",
      "PARTNER",
      "EMPLOYEE",
      "REFERRAL",
    ]),

    period: dashboardPeriodEnum.default("MONTH"),
  });

/* =========================================
   CHART FILTER
========================================= */

export const dashboardChartSchema =
  z.object({
    chartType: z.enum([
      "LOAN",
      "REVENUE",
      "COMMISSION",
      "CUSTOMER",
      "KYC",
      "PAYMENT",
    ]),

    period: dashboardPeriodEnum.default("MONTH"),
  });

/* =========================================
   EXPORT DASHBOARD REPORT
========================================= */

export const exportDashboardReportSchema =
  z.object({
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

export type DashboardFilterDto =
  z.infer<typeof dashboardFilterSchema>;

export type LoanDashboardFilterDto =
  z.infer<typeof loanDashboardFilterSchema>;

export type RevenueDashboardDto =
  z.infer<typeof revenueDashboardSchema>;

export type DsaDashboardDto =
  z.infer<typeof dsaDashboardSchema>;

export type PartnerDashboardDto =
  z.infer<typeof partnerDashboardSchema>;

export type LeaderboardDto =
  z.infer<typeof leaderboardSchema>;

export type DashboardChartDto =
  z.infer<typeof dashboardChartSchema>;

export type ExportDashboardReportDto =
  z.infer<typeof exportDashboardReportSchema>;