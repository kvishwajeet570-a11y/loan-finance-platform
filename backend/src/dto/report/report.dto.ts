import { z } from "zod";

/* =========================================
   REPORT TYPE
========================================= */

export const reportTypeEnum = z.enum([
  "LOAN",
  "CUSTOMER",
  "DSA",
  "PARTNER",
  "COMMISSION",
  "PAYMENT",
  "REVENUE",
  "REFERRAL",
  "KYC",
  "INSURANCE",
  "FASTAG",
  "RECHARGE",
  "COLLECTION",
  "AUDIT",
  "LOGIN_HISTORY",
]);

/* =========================================
   REPORT FORMAT
========================================= */

export const reportFormatEnum = z.enum([
  "PDF",
  "EXCEL",
  "CSV",
  "JSON",
]);

/* =========================================
   REPORT STATUS
========================================= */

export const reportStatusEnum = z.enum([
  "PENDING",
  "PROCESSING",
  "COMPLETED",
  "FAILED",
]);

/* =========================================
   REPORT PERIOD
========================================= */

export const reportPeriodEnum = z.enum([
  "TODAY",
  "YESTERDAY",
  "THIS_WEEK",
  "LAST_WEEK",
  "THIS_MONTH",
  "LAST_MONTH",
  "THIS_QUARTER",
  "LAST_QUARTER",
  "THIS_YEAR",
  "CUSTOM",
]);

/* =========================================
   GENERATE REPORT
========================================= */

export const generateReportSchema =
  z.object({
    reportName: z.string()
      .min(3)
      .max(200),

    reportType:
      reportTypeEnum,

    format:
      reportFormatEnum,

    period:
      reportPeriodEnum,

    startDate:
      z.string().optional(),

    endDate:
      z.string().optional(),

    generatedBy:
      z.string().cuid(),

    filters:
      z.record(z.any())
      .optional(),

    emailReport:
      z.boolean()
      .default(false),
  });

/* =========================================
   DOWNLOAD REPORT
========================================= */

export const downloadReportSchema =
  z.object({
    reportId:
      z.string().cuid(),
  });

/* =========================================
   DELETE REPORT
========================================= */

export const deleteReportSchema =
  z.object({
    reportId:
      z.string().cuid(),
  });

/* =========================================
   SCHEDULE REPORT
========================================= */

export const scheduleReportSchema =
  z.object({
    reportName:
      z.string()
      .min(3),

    reportType:
      reportTypeEnum,

    format:
      reportFormatEnum,

    frequency:
      z.enum([
        "DAILY",
        "WEEKLY",
        "MONTHLY",
        "QUARTERLY",
      ]),

    emailRecipients:
      z.array(
        z.string().email()
      ),

    startDate:
      z.string(),
  });

/* =========================================
   REPORT FILTER
========================================= */

export const reportFilterSchema =
  z.object({
    reportType:
      reportTypeEnum.optional(),

    status:
      reportStatusEnum.optional(),

    generatedBy:
      z.string()
      .cuid()
      .optional(),

    startDate:
      z.string().optional(),

    endDate:
      z.string().optional(),

    page:
      z.coerce.number()
      .default(1),

    limit:
      z.coerce.number()
      .min(1)
      .max(100)
      .default(20),
  });

/* =========================================
   REPORT ANALYTICS
========================================= */

export const reportAnalyticsSchema =
  z.object({
    reportType:
      reportTypeEnum.optional(),

    startDate:
      z.string().optional(),

    endDate:
      z.string().optional(),
  });

/* =========================================
   TYPES
========================================= */

export type GenerateReportDto =
  z.infer<typeof generateReportSchema>;

export type DownloadReportDto =
  z.infer<typeof downloadReportSchema>;

export type DeleteReportDto =
  z.infer<typeof deleteReportSchema>;

export type ScheduleReportDto =
  z.infer<typeof scheduleReportSchema>;

export type ReportFilterDto =
  z.infer<typeof reportFilterSchema>;

export type ReportAnalyticsDto =
  z.infer<typeof reportAnalyticsSchema>;