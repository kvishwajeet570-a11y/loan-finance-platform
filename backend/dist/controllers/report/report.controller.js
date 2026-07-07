"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportAnalytics = exports.revenueReport = exports.partnerReport = exports.dsaReport = exports.paymentReport = exports.loanReport = exports.dashboardReport = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
/**
 * DASHBOARD REPORT
 */
const dashboardReport = async (req, res) => {
    try {
        const [users, loans, approvedLoans, disbursedLoans, partners, dsa, payments,] = await Promise.all([
            prisma_1.default.user.count(),
            prisma_1.default.loanApplication.count(),
            prisma_1.default.loanApplication.count({
                where: { status: "APPROVED" },
            }),
            prisma_1.default.loanApplication.count({
                where: { status: "DISBURSED" },
            }),
            prisma_1.default.partner.count(),
            prisma_1.default.dSA.count(),
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
                dsa,
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
        const loans = await prisma_1.default.loanApplication.findMany({
            where: status
                ? { status }
                : {},
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
    try {
        const dsa = await prisma_1.default.dSA.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
        res.status(200).json({
            success: true,
            total: dsa.length,
            data: dsa,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "DSA report failed",
        });
    }
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
