"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportAnalyticsSchema = exports.analyticsPaginationSchema = exports.userAnalyticsSchema = exports.partnerAnalyticsSchema = exports.dsaAnalyticsSchema = exports.revenueAnalyticsSchema = exports.loanAnalyticsSchema = exports.dashboardAnalyticsSchema = exports.dateRangeSchema = void 0;
const zod_1 = require("zod");
/* =========================================
   DATE RANGE FILTER
========================================= */
exports.dateRangeSchema = zod_1.z.object({
    startDate: zod_1.z.coerce.date(),
    endDate: zod_1.z.coerce.date(),
});
/* =========================================
   DASHBOARD ANALYTICS
========================================= */
exports.dashboardAnalyticsSchema = zod_1.z.object({
    startDate: zod_1.z.string().optional(),
    endDate: zod_1.z.string().optional(),
    period: zod_1.z.enum([
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
exports.loanAnalyticsSchema = zod_1.z.object({
    loanType: zod_1.z.enum([
        "PERSONAL_LOAN",
        "BUSINESS_LOAN",
        "HOME_LOAN",
        "LAP",
        "CAR_LOAN",
        "CREDIT_CARD",
    ]).optional(),
    status: zod_1.z.enum([
        "PENDING",
        "UNDER_REVIEW",
        "APPROVED",
        "REJECTED",
        "DISBURSED",
        "CLOSED",
    ]).optional(),
    startDate: zod_1.z.string().optional(),
    endDate: zod_1.z.string().optional(),
});
/* =========================================
   REVENUE ANALYTICS
========================================= */
exports.revenueAnalyticsSchema = zod_1.z.object({
    startDate: zod_1.z.string().optional(),
    endDate: zod_1.z.string().optional(),
    groupBy: zod_1.z.enum([
        "DAY",
        "WEEK",
        "MONTH",
        "YEAR",
    ]).default("MONTH"),
});
/* =========================================
   DSA ANALYTICS
========================================= */
exports.dsaAnalyticsSchema = zod_1.z.object({
    dsaId: zod_1.z.string().cuid().optional(),
    startDate: zod_1.z.string().optional(),
    endDate: zod_1.z.string().optional(),
});
/* =========================================
   PARTNER ANALYTICS
========================================= */
exports.partnerAnalyticsSchema = zod_1.z.object({
    partnerId: zod_1.z.string().cuid().optional(),
    startDate: zod_1.z.string().optional(),
    endDate: zod_1.z.string().optional(),
});
/* =========================================
   USER ANALYTICS
========================================= */
exports.userAnalyticsSchema = zod_1.z.object({
    role: zod_1.z.string().optional(),
    isVerified: zod_1.z.boolean().optional(),
    isBlocked: zod_1.z.boolean().optional(),
    startDate: zod_1.z.string().optional(),
    endDate: zod_1.z.string().optional(),
});
/* =========================================
   PAGINATION
========================================= */
exports.analyticsPaginationSchema = zod_1.z.object({
    page: zod_1.z.coerce.number().min(1).default(1),
    limit: zod_1.z.coerce.number()
        .min(1)
        .max(100)
        .default(10),
});
/* =========================================
   EXPORT REPORT
========================================= */
exports.exportAnalyticsSchema = zod_1.z.object({
    reportType: zod_1.z.enum([
        "LOAN",
        "REVENUE",
        "DSA",
        "PARTNER",
        "USER",
        "PAYMENT",
    ]),
    format: zod_1.z.enum([
        "PDF",
        "EXCEL",
        "CSV",
    ]),
    startDate: zod_1.z.string(),
    endDate: zod_1.z.string(),
});
