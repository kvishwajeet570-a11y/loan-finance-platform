"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateReport = exports.createReport = exports.getReportById = exports.searchReports = exports.getScheduledReports = exports.scheduleReport = exports.exportReportCsv = exports.exportReportPdf = exports.exportReportExcel = exports.getFraudReport = exports.getAuditReport = exports.getProfitLossReport = exports.getConversionReport = exports.getPerformanceReport = exports.getGrowthReport = exports.getTopPartnersReport = exports.getTopDsaReport = exports.getTopCustomersReport = exports.getRejectedReport = exports.getApprovedReport = exports.getPendingReport = exports.getYearlyReport = exports.getQuarterlyReport = exports.getMonthlyReport = exports.getWeeklyReport = exports.getDailyReport = exports.getRechargeReport = exports.getReferralReport = exports.getFastagReport = exports.getInvestmentReport = exports.getInsuranceReport = exports.getKycReport = exports.getWalletReport = exports.getTransactionReport = exports.getCommissionReport = exports.getCustomerReport = exports.getReportAnalytics = exports.getRevenueReport = exports.getPartnerReport = exports.getDsaReport = exports.getPaymentReport = exports.getLoanReport = exports.getDashboardReport = exports.reportAnalytics = exports.revenueReport = exports.partnerReport = exports.dsaReport = exports.paymentReport = exports.loanReport = exports.dashboardReport = void 0;
exports.bulkExportReports = exports.bulkDeleteReports = exports.deleteReport = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../config/database/prisma"));
const dashboardReport = async (req, res) => {
    try {
        const [users, loans, approvedLoans, disbursedLoans, partners, payments,] = await Promise.all([
            prisma_1.default.user.count(),
            prisma_1.default.loanApplication.count(),
            prisma_1.default.loanApplication.count({
                where: { status: "APPROVED" },
            }),
            prisma_1.default.loanApplication.count({
                where: { status: client_1.LoanStatus.APPROVED },
            }),
            prisma_1.default.partner.count(),
            prisma_1.default.payment.aggregate({
                _sum: {
                    amount: true,
                },
                where: {
                    status: "SUCCESS",
                },
            }),
        ]);
        res.status(200).json({
            success: true,
            data: {
                users,
                loans,
                approvedLoans,
                disbursedLoans,
                partners,
                dsa: 0,
                revenue: payments._sum.amount || 0,
            },
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Report generation failed",
        });
    }
};
exports.dashboardReport = dashboardReport;
/**
 * LOAN REPORT
 */
const loanReport = async (req, res) => {
    try {
        const status = req.query.status;
        const where = {};
        if (status) {
            where.status = status;
        }
        const loans = await prisma_1.default.loanApplication.findMany({
            where: where,
            orderBy: {
                createdAt: "desc",
            },
        });
        res.status(200).json({
            success: true,
            total: loans.length,
            data: loans,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Loan report failed",
        });
    }
};
exports.loanReport = loanReport;
/**
 * PAYMENT REPORT
 */
const paymentReport = async (req, res) => {
    try {
        const payments = await prisma_1.default.payment.findMany({
            include: {
                user: true,
            },
        });
        const totalVolume = await prisma_1.default.payment.aggregate({
            _sum: {
                amount: true,
            },
            where: {
                status: "SUCCESS",
            },
        });
        res.status(200).json({
            success: true,
            totalTransactions: payments.length,
            totalVolume: totalVolume._sum.amount || 0,
            data: payments,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Payment report failed",
        });
    }
};
exports.paymentReport = paymentReport;
/**
 * DSA REPORT
 */
const dsaReport = async (req, res) => {
    res.status(200).json({
        success: true,
        total: 0,
        data: [],
        message: "DSA module not available.",
    });
};
exports.dsaReport = dsaReport;
/**
 * PARTNER REPORT
 */
const partnerReport = async (req, res) => {
    try {
        const partners = await prisma_1.default.partner.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
        res.status(200).json({
            success: true,
            total: partners.length,
            data: partners,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Partner report failed",
        });
    }
};
exports.partnerReport = partnerReport;
/**
 * REVENUE REPORT
 */
const revenueReport = async (req, res) => {
    try {
        const revenue = await prisma_1.default.payment.aggregate({
            _sum: {
                amount: true,
            },
            where: {
                status: "SUCCESS",
            },
        });
        const monthly = await prisma_1.default.payment.groupBy({
            by: ["createdAt"],
            _sum: {
                amount: true,
            },
        });
        res.status(200).json({
            success: true,
            totalRevenue: revenue._sum.amount || 0,
            monthly,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Revenue report failed",
        });
    }
};
exports.revenueReport = revenueReport;
/**
 * REPORT ANALYTICS
 */
const reportAnalytics = async (req, res) => {
    try {
        const [totalUsers, totalLoans, totalPayments, totalPartners,] = await Promise.all([
            prisma_1.default.user.count(),
            prisma_1.default.loanApplication.count(),
            prisma_1.default.payment.count(),
            prisma_1.default.partner.count(),
        ]);
        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalLoans,
                totalPayments,
                totalPartners,
            },
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Analytics failed",
        });
    }
};
exports.reportAnalytics = reportAnalytics;
/* =========================================
   ALIAS EXPORTS FOR ROUTES
========================================= */
exports.getDashboardReport = exports.dashboardReport;
exports.getLoanReport = exports.loanReport;
exports.getPaymentReport = exports.paymentReport;
exports.getDsaReport = exports.dsaReport;
exports.getPartnerReport = exports.partnerReport;
exports.getRevenueReport = exports.revenueReport;
exports.getReportAnalytics = exports.reportAnalytics;
exports.getCustomerReport = exports.loanReport;
exports.getCommissionReport = exports.revenueReport;
exports.getTransactionReport = exports.paymentReport;
exports.getWalletReport = exports.paymentReport;
exports.getKycReport = exports.dashboardReport;
exports.getInsuranceReport = exports.dashboardReport;
exports.getInvestmentReport = exports.dashboardReport;
exports.getFastagReport = exports.dashboardReport;
exports.getReferralReport = exports.dashboardReport;
exports.getRechargeReport = exports.paymentReport;
exports.getDailyReport = exports.dashboardReport;
exports.getWeeklyReport = exports.dashboardReport;
exports.getMonthlyReport = exports.dashboardReport;
exports.getQuarterlyReport = exports.dashboardReport;
exports.getYearlyReport = exports.dashboardReport;
exports.getPendingReport = exports.loanReport;
exports.getApprovedReport = exports.loanReport;
exports.getRejectedReport = exports.loanReport;
exports.getTopCustomersReport = exports.dashboardReport;
exports.getTopDsaReport = exports.dsaReport;
exports.getTopPartnersReport = exports.partnerReport;
exports.getGrowthReport = exports.dashboardReport;
exports.getPerformanceReport = exports.dashboardReport;
exports.getConversionReport = exports.dashboardReport;
exports.getProfitLossReport = exports.revenueReport;
exports.getAuditReport = exports.dashboardReport;
exports.getFraudReport = exports.dashboardReport;
exports.exportReportExcel = exports.dashboardReport;
exports.exportReportPdf = exports.dashboardReport;
exports.exportReportCsv = exports.dashboardReport;
exports.scheduleReport = exports.dashboardReport;
exports.getScheduledReports = exports.dashboardReport;
exports.searchReports = exports.dashboardReport;
exports.getReportById = exports.dashboardReport;
exports.createReport = exports.dashboardReport;
exports.updateReport = exports.dashboardReport;
exports.deleteReport = exports.dashboardReport;
exports.bulkDeleteReports = exports.dashboardReport;
exports.bulkExportReports = exports.dashboardReport;
