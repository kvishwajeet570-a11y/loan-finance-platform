"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTopUsers = exports.getMonthlyRevenue = exports.getRevenueAnalytics = void 0;
const prisma_1 = __importDefault(require("../prisma/prisma"));
/* ========================================
   GET REVENUE ANALYTICS
======================================== */
const getRevenueAnalytics = async (req, res) => {
    try {
        /* TOTAL USERS */
        const totalUsers = await prisma_1.default.user.count();
        /* TOTAL LOANS */
        const totalLoans = await prisma_1.default.loanApplication.count();
        /* APPROVED LOANS */
        const approvedLoans = await prisma_1.default.loanApplication.count({
            where: {
                status: "approved",
            },
        });
        /* PENDING LOANS */
        const pendingLoans = await prisma_1.default.loanApplication.count({
            where: {
                status: "pending",
            },
        });
        /* TOTAL RECHARGES */
        const totalRecharges = await prisma_1.default.recharge.count();
        /* TOTAL TRANSACTIONS */
        const totalTransactions = await prisma_1.default.transaction.count();
        /* TOTAL REVENUE */
        const revenue = await prisma_1.default.transaction.aggregate({
            _sum: {
                amount: true,
            },
        });
        /* TOTAL COMMISSION */
        const commission = await prisma_1.default.commission.aggregate({
            _sum: {
                amount: true,
            },
        });
        /* TOTAL WALLET BALANCE */
        const walletBalance = await prisma_1.default.wallet.aggregate({
            _sum: {
                balance: true,
            },
        });
        /* MONTHLY REVENUE */
        const monthlyRevenue = await prisma_1.default.transaction.findMany({
            select: {
                amount: true,
                createdAt: true,
            },
            orderBy: {
                createdAt: "asc",
            },
        });
        /* RECENT TRANSACTIONS */
        const recentTransactions = await prisma_1.default.transaction.findMany({
            take: 10,
            orderBy: {
                createdAt: "desc",
            },
        });
        /* SAFE VALUES */
        const totalRevenue = revenue?._sum?.amount ?? 0;
        const totalCommission = commission?._sum?.amount ?? 0;
        const totalWalletBalance = walletBalance?._sum?.balance ?? 0;
        /* RESPONSE */
        return res.status(200).json({
            success: true,
            analytics: {
                totalUsers,
                totalLoans,
                approvedLoans,
                pendingLoans,
                totalRecharges,
                totalTransactions,
                totalRevenue,
                totalCommission,
                totalWalletBalance,
            },
            monthlyRevenue,
            recentTransactions,
        });
    }
    catch (error) {
        console.log("REVENUE ERROR =>", error);
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Failed to fetch analytics",
        });
    }
};
exports.getRevenueAnalytics = getRevenueAnalytics;
/* ========================================
   MONTHLY REVENUE
======================================== */
const getMonthlyRevenue = async (req, res) => {
    try {
        const monthlyRevenue = await prisma_1.default.transaction.findMany({
            orderBy: {
                createdAt: "asc",
            },
            select: {
                amount: true,
                createdAt: true,
                type: true,
                status: true,
            },
        });
        return res.status(200).json({
            success: true,
            total: monthlyRevenue.length,
            monthlyRevenue,
        });
    }
    catch (error) {
        console.log("MONTHLY REVENUE ERROR =>", error);
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Failed to fetch monthly revenue",
        });
    }
};
exports.getMonthlyRevenue = getMonthlyRevenue;
/* ========================================
   TOP USERS ANALYTICS
======================================== */
const getTopUsers = async (req, res) => {
    try {
        const users = await prisma_1.default.user.findMany({
            include: {
                wallet: true,
                referral: true,
            },
            take: 10,
            orderBy: {
                createdAt: "desc",
            },
        });
        return res.status(200).json({
            success: true,
            users,
        });
    }
    catch (error) {
        console.log("TOP USERS ERROR =>", error);
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Failed to fetch top users",
        });
    }
};
exports.getTopUsers = getTopUsers;
