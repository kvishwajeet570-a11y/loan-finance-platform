"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportDashboardReportSchema = exports.dashboardChartSchema = exports.leaderboardSchema = exports.partnerDashboardSchema = exports.dsaDashboardSchema = exports.revenueDashboardSchema = exports.loanDashboardFilterSchema = exports.dashboardFilterSchema = exports.dashboardPeriodEnum = void 0;
const zod_1 = require("zod");
/* =========================================
   DASHBOARD PERIOD
========================================= */
exports.dashboardPeriodEnum = zod_1.z.enum([
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
exports.dashboardFilterSchema = zod_1.z.object({
    period: exports.dashboardPeriodEnum.default("MONTH"),
    startDate: zod_1.z.string().optional(),
    endDate: zod_1.z.string().optional(),
});
/* =========================================
   LOAN DASHBOARD FILTER
========================================= */
exports.loanDashboardFilterSchema = zod_1.z.object({
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
   REVENUE DASHBOARD
========================================= */
exports.revenueDashboardSchema = zod_1.z.object({
    period: exports.dashboardPeriodEnum.default("MONTH"),
    groupBy: zod_1.z.enum([
        "DAY",
        "WEEK",
        "MONTH",
        "YEAR",
    ]).default("MONTH"),
});
/* =========================================
   DSA DASHBOARD
========================================= */
exports.dsaDashboardSchema = zod_1.z.object({
    dsaId: zod_1.z.string().cuid(),
    period: exports.dashboardPeriodEnum.default("MONTH"),
});
/* =========================================
   PARTNER DASHBOARD
========================================= */
exports.partnerDashboardSchema = zod_1.z.object({
    partnerId: zod_1.z.string().cuid(),
    period: exports.dashboardPeriodEnum.default("MONTH"),
});
/* =========================================
   LEADERBOARD FILTER
========================================= */
exports.leaderboardSchema = zod_1.z.object({
    type: zod_1.z.enum([
        "DSA",
        "PARTNER",
        "EMPLOYEE",
        "REFERRAL",
    ]),
    period: exports.dashboardPeriodEnum.default("MONTH"),
});
/* =========================================
   CHART FILTER
========================================= */
exports.dashboardChartSchema = zod_1.z.object({
    chartType: zod_1.z.enum([
        "LOAN",
        "REVENUE",
        "COMMISSION",
        "CUSTOMER",
        "KYC",
        "PAYMENT",
    ]),
    period: exports.dashboardPeriodEnum.default("MONTH"),
});
/* =========================================
   EXPORT DASHBOARD REPORT
========================================= */
exports.exportDashboardReportSchema = zod_1.z.object({
    format: zod_1.z.enum([
        "PDF",
        "EXCEL",
        "CSV",
    ]),
    startDate: zod_1.z.string(),
    endDate: zod_1.z.string(),
});
