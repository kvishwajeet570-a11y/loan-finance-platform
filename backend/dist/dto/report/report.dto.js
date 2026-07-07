"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportAnalyticsSchema = exports.reportFilterSchema = exports.scheduleReportSchema = exports.deleteReportSchema = exports.downloadReportSchema = exports.generateReportSchema = exports.reportPeriodEnum = exports.reportStatusEnum = exports.reportFormatEnum = exports.reportTypeEnum = void 0;
const zod_1 = require("zod");
/* =========================================
   REPORT TYPE
========================================= */
exports.reportTypeEnum = zod_1.z.enum([
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
exports.reportFormatEnum = zod_1.z.enum([
    "PDF",
    "EXCEL",
    "CSV",
    "JSON",
]);
/* =========================================
   REPORT STATUS
========================================= */
exports.reportStatusEnum = zod_1.z.enum([
    "PENDING",
    "PROCESSING",
    "COMPLETED",
    "FAILED",
]);
/* =========================================
   REPORT PERIOD
========================================= */
exports.reportPeriodEnum = zod_1.z.enum([
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
exports.generateReportSchema = zod_1.z.object({
    reportName: zod_1.z.string()
        .min(3)
        .max(200),
    reportType: exports.reportTypeEnum,
    format: exports.reportFormatEnum,
    period: exports.reportPeriodEnum,
    startDate: zod_1.z.string().optional(),
    endDate: zod_1.z.string().optional(),
    generatedBy: zod_1.z.string().cuid(),
    filters: zod_1.z.record(zod_1.z.any())
        .optional(),
    emailReport: zod_1.z.boolean()
        .default(false),
});
/* =========================================
   DOWNLOAD REPORT
========================================= */
exports.downloadReportSchema = zod_1.z.object({
    reportId: zod_1.z.string().cuid(),
});
/* =========================================
   DELETE REPORT
========================================= */
exports.deleteReportSchema = zod_1.z.object({
    reportId: zod_1.z.string().cuid(),
});
/* =========================================
   SCHEDULE REPORT
========================================= */
exports.scheduleReportSchema = zod_1.z.object({
    reportName: zod_1.z.string()
        .min(3),
    reportType: exports.reportTypeEnum,
    format: exports.reportFormatEnum,
    frequency: zod_1.z.enum([
        "DAILY",
        "WEEKLY",
        "MONTHLY",
        "QUARTERLY",
    ]),
    emailRecipients: zod_1.z.array(zod_1.z.string().email()),
    startDate: zod_1.z.string(),
});
/* =========================================
   REPORT FILTER
========================================= */
exports.reportFilterSchema = zod_1.z.object({
    reportType: exports.reportTypeEnum.optional(),
    status: exports.reportStatusEnum.optional(),
    generatedBy: zod_1.z.string()
        .cuid()
        .optional(),
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
   REPORT ANALYTICS
========================================= */
exports.reportAnalyticsSchema = zod_1.z.object({
    reportType: exports.reportTypeEnum.optional(),
    startDate: zod_1.z.string().optional(),
    endDate: zod_1.z.string().optional(),
});
