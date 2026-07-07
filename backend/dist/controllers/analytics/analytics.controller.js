"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAnalytics = void 0;
const prisma_1 = __importDefault(require("../prisma/prisma"));
/* ========================================
   GET DASHBOARD ANALYTICS
======================================== */
const getAnalytics = async (req, res) => {
    try {
        /* ========================================
           FETCH ALL ANALYTICS
        ======================================== */
        const [totalUsers, totalLoans, approvedLoans, pendingLoans, rejectedLoans, totalTransactions, totalRecharges, totalWalletBalance, totalRevenue, totalReferrals, recentUsers, recentTransactions, recentLoans, topUsers,] = await Promise.all([
            /* TOTAL USERS */
            prisma_1.default.user.count(),
            /* TOTAL LOANS */
            prisma_1.default.loanApplication.count(),
            /* APPROVED LOANS */
            prisma_1.default.loanApplication.count({
                where: {
                    status: "approved",
                },
            }),
            /* PENDING LOANS */
            prisma_1.default.loanApplication.count({
                where: {
                    status: "pending",
                },
            }),
            /* REJECTED LOANS */
            prisma_1.default.loanApplication.count({
                where: {
                    status: "rejected",
                },
            }),
            /* TOTAL TRANSACTIONS */
            prisma_1.default.transaction.count(),
            /* TOTAL RECHARGES */
            prisma_1.default.recharge.aggregate({
                _sum: {
                    amount: true,
                },
            }),
            /* TOTAL WALLET BALANCE */
            prisma_1.default.wallet.aggregate({
                _sum: {
                    balance: true,
                },
            }),
            /* TOTAL REVENUE */
            prisma_1.default.transaction.aggregate({
                _sum: {
                    amount: true,
                },
            }),
            /* TOTAL REFERRALS */
            prisma_1.default.referral.aggregate({
                _sum: {
                    totalReferrals: true,
                },
            }),
            /* RECENT USERS */
            prisma_1.default.user.findMany({
                take: 5,
                orderBy: {
                    createdAt: "desc",
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phoneNo: true,
                    createdAt: true,
                },
            }),
            /* RECENT TRANSACTIONS */
            prisma_1.default.transaction.findMany({
                take: 5,
                orderBy: {
                    createdAt: "desc",
                },
            }),
            /* RECENT LOANS */
            prisma_1.default.loanApplication.findMany({
                take: 5,
                orderBy: {
                    createdAt: "desc",
                },
            }),
            /* TOP USERS */
            prisma_1.default.user.findMany({
                take: 5,
                orderBy: {
                    createdAt: "desc",
                },
                include: {
                    wallet: true,
                    referral: true,
                },
            }),
        ]);
        /* ========================================
           PERFORMANCE %
        ======================================== */
        const performance = totalLoans > 0
            ? Math.round((approvedLoans /
                totalLoans) * 100)
            : 0;
        /* ========================================
           MONTHLY REVENUE
        ======================================== */
        const monthlyRevenue = await prisma_1.default.transaction.findMany({
            where: {
                createdAt: {
                    gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                },
            },
            select: {
                amount: true,
                createdAt: true,
            },
        });
        /* ========================================
           MONTHLY USERS
        ======================================== */
        const monthlyUsers = await prisma_1.default.user.count({
            where: {
                createdAt: {
                    gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                },
            },
        });
        /* ========================================
           MONTHLY LOANS
        ======================================== */
        const monthlyLoans = await prisma_1.default.loanApplication.count({
            where: {
                createdAt: {
                    gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                },
            },
        });
        /* ========================================
           RECENT RECHARGES
        ======================================== */
        const recentRecharges = await prisma_1.default.recharge.findMany({
            take: 5,
            orderBy: {
                createdAt: "desc",
            },
        });
        /* ========================================
           RECENT NOTIFICATIONS
        ======================================== */
        const recentNotifications = await prisma_1.default.notification.findMany({
            take: 5,
            orderBy: {
                createdAt: "desc",
            },
        });
        /* ========================================
           DASHBOARD RESPONSE
        ======================================== */
        return res.status(200).json({
            success: true,
            analytics: {
                totalUsers,
                totalLoans,
                approvedLoans,
                pendingLoans,
                rejectedLoans,
                totalTransactions,
                performance,
                monthlyUsers,
                monthlyLoans,
                totalRecharge: totalRecharges._sum.amount || 0,
                totalWalletBalance: totalWalletBalance._sum.balance || 0,
                totalRevenue: totalRevenue._sum.amount || 0,
                totalReferrals: totalReferrals._sum.totalReferrals || 0,
            },
            charts: {
                monthlyRevenue,
            },
            recentData: {
                recentUsers,
                recentTransactions,
                recentLoans,
                recentRecharges,
                recentNotifications,
            },
            leaderboard: {
                topUsers,
            },
        });
    }
    catch (error) {
        console.log("ANALYTICS ERROR => ", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch analytics",
        });
    }
};
exports.getAnalytics = getAnalytics;
